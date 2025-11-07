from pinecone import Pinecone, ServerlessSpec
from config import get_settings
import hashlib
from typing import List, Dict, Any
from sentence_transformers import SentenceTransformer
from langchain_text_splitters import RecursiveCharacterTextSplitter


settings = get_settings()


class PineconeService:
    def __init__(self):
        self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        self.index_name = settings.PINECONE_INDEX_NAME
        # Use all-MiniLM-L6-v2: 384 dimensions, fast, free, runs locally
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.embedding_dimension = 384
        self.embedding_enabled = True
        
        # Initialize text splitter for chunking long transcripts
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,  # Max characters per chunk
            chunk_overlap=200,  # Overlap to maintain context
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]  # Try to split at natural boundaries
        )
        
        self._ensure_index()

    def _ensure_index(self):
        """Ensure the Pinecone index exists"""
        try:
            existing_indexes = [index.name for index in self.pc.list_indexes()]
            
            if self.index_name not in existing_indexes:
                self.pc.create_index(
                    name=self.index_name,
                    dimension=self.embedding_dimension,  # MiniLM dimension
                    metric='cosine',
                    spec=ServerlessSpec(
                        cloud='aws',
                        region='us-east-1'
                    )
                )
            
            self.index = self.pc.Index(self.index_name)
        except Exception as e:
            print(f"Error ensuring index: {e}")
            self.index = None

    def _generate_embedding(self, text: str) -> List[float]:
        """Generate embeddings using local sentence-transformers model"""
        if not self.embedding_enabled:
            return None
            
        try:
            # Generate embedding locally - no API calls, no quota limits!
            embedding = self.model.encode(text, convert_to_tensor=False)
            return embedding.tolist()
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return None

    async def store_meeting_content(
        self,
        meeting_id: int,
        case_id: int,
        transcript: str,
        insights: List[Dict[str, Any]],
        metadata: Dict[str, Any] = None
    ):
        """Store meeting content in Pinecone with chunking for long transcripts"""
        if not self.index:
            print("Pinecone index not available - skipping vector storage")
            return
        
        if not self.embedding_enabled:
            print("Embeddings disabled due to quota - skipping vector storage")
            return

        try:
            meeting_metadata = metadata or {}
            vectors_to_upsert = []
            
            # 1. Create metadata header for context
            metadata_header = []
            if meeting_metadata.get('title'):
                metadata_header.append(f"Meeting Title: {meeting_metadata['title']}")
            if meeting_metadata.get('case_number'):
                metadata_header.append(f"Case Number: {meeting_metadata['case_number']}")
            metadata_context = "\n".join(metadata_header)
            
            # 2. Chunk the transcript using RecursiveCharacterTextSplitter
            transcript_chunks = self.text_splitter.split_text(transcript)
            
            print(f"Split transcript into {len(transcript_chunks)} chunks for meeting {meeting_id}")
            
            # 3. Store each chunk as a separate vector
            for chunk_idx, chunk in enumerate(transcript_chunks):
                # Prepend metadata context to each chunk for better semantic understanding
                chunk_with_context = f"{metadata_context}\n\nTranscript Part {chunk_idx + 1}:\n{chunk}"
                
                # Generate embedding for this chunk
                embedding = self._generate_embedding(chunk_with_context)
                
                if embedding is None:
                    print(f"Failed to generate embedding for chunk {chunk_idx} of meeting {meeting_id}")
                    continue
                
                # Create vector with unique ID for each chunk
                vector = {
                    "id": f"meeting_{meeting_id}_chunk_{chunk_idx}",
                    "values": embedding,
                    "metadata": {
                        "meeting_id": meeting_id,
                        "case_id": case_id,
                        "type": "transcript_chunk",
                        "chunk_index": chunk_idx,
                        "total_chunks": len(transcript_chunks),
                        "content": chunk[:1000],  # Store first 1000 chars for preview
                        "chunk_length": len(chunk),
                        **(metadata or {})
                    }
                }
                vectors_to_upsert.append(vector)
            
            # 4. Create a summary vector with insights
            if insights:
                insights_summary = "Key Insights:\n"
                for insight in insights:
                    insight_type = insight.get('type', 'general')
                    title = insight.get('title', '')
                    description = insight.get('description', '')
                    severity = insight.get('severity', '')
                    insights_summary += f"- [{insight_type.upper()}] {title}: {description} (Severity: {severity})\n"
                
                # Combine metadata with insights for summary vector
                summary_content = f"{metadata_context}\n\n{insights_summary}"
                summary_embedding = self._generate_embedding(summary_content)
                
                if summary_embedding:
                    summary_vector = {
                        "id": f"meeting_{meeting_id}_summary",
                        "values": summary_embedding,
                        "metadata": {
                            "meeting_id": meeting_id,
                            "case_id": case_id,
                            "type": "insights_summary",
                            "content": insights_summary[:1000],
                            "insights_count": len(insights),
                            **(metadata or {})
                        }
                    }
                    vectors_to_upsert.append(summary_vector)
            
            # 5. Upsert all vectors in batch (Pinecone supports batch upsert)
            if vectors_to_upsert:
                # Upsert in batches of 100 (Pinecone best practice)
                batch_size = 100
                for i in range(0, len(vectors_to_upsert), batch_size):
                    batch = vectors_to_upsert[i:i + batch_size]
                    self.index.upsert(vectors=batch)
                
                print(f"Successfully stored meeting {meeting_id}: {len(transcript_chunks)} transcript chunks + {1 if insights else 0} summary vector = {len(vectors_to_upsert)} total vectors")
            else:
                print(f"No vectors created for meeting {meeting_id}")
                
        except Exception as e:
            print(f"Error storing meeting content: {e}")

    async def search_similar_content(
        self,
        query: str,
        case_id: int = None,
        top_k: int = 5
    ) -> List[Dict[str, Any]]:
        """Search for similar content in Pinecone across all chunks"""
        if not self.index:
            print("Pinecone index not available")
            return []
        
        if not self.embedding_enabled:
            print("Embeddings disabled due to quota - search unavailable")
            return []

        try:
            # Generate query embedding
            query_embedding = self._generate_embedding(query)
            
            if query_embedding is None:
                return []
            
            # Build filter
            filter_dict = {}
            if case_id:
                filter_dict["case_id"] = case_id
            
            # Search with higher top_k to get multiple relevant chunks
            # We'll return more results since content is now chunked
            search_top_k = top_k * 3  # Get 3x results to cover multiple chunks from same meeting
            
            results = self.index.query(
                vector=query_embedding,
                top_k=search_top_k,
                include_metadata=True,
                filter=filter_dict if filter_dict else None
            )
            
            # Group results by content type (document or meeting) and their IDs
            content_results = {}
            for match in results.matches:
                content_type = match.metadata.get("type", "transcript_chunk")
                
                if content_type == "case_document":
                    # Group by document_id for documents
                    document_id = match.metadata.get("document_id")
                    content_key = f"document_{document_id}"
                    
                    if content_key not in content_results:
                        content_results[content_key] = {
                            "id": content_key,
                            "document_id": document_id,
                            "score": match.score,
                            "chunks": [],
                            "metadata": {
                                "type": "case_document",
                                "case_id": match.metadata.get("case_id"),
                                "title": match.metadata.get("title"),
                                "document_id": document_id,
                            }
                        }
                else:
                    # Group by meeting_id for transcripts
                    meeting_id = match.metadata.get("meeting_id")
                    content_key = f"meeting_{meeting_id}"
                    
                    if content_key not in content_results:
                        content_results[content_key] = {
                            "id": content_key,
                            "meeting_id": meeting_id,
                            "score": match.score,
                            "chunks": [],
                            "metadata": {
                                "type": "transcript_chunk",
                                "case_id": match.metadata.get("case_id"),
                                "title": match.metadata.get("title"),
                                "case_number": match.metadata.get("case_number"),
                                "meeting_id": meeting_id,
                            }
                        }
                
                # Add this chunk to the content's chunks
                content_results[content_key]["chunks"].append({
                    "score": match.score,
                    "content": match.metadata.get("content", ""),
                    "type": match.metadata.get("type", ""),
                    "chunk_index": match.metadata.get("chunk_index"),
                })
                
                # Update score to be the maximum (most relevant chunk)
                content_results[content_key]["score"] = max(
                    content_results[content_key]["score"],
                    match.score
                )
            
            # Convert to list and sort by best score
            aggregated_results = sorted(
                content_results.values(),
                key=lambda x: x["score"],
                reverse=True
            )
            
            # Limit to original top_k items (documents + meetings combined)
            aggregated_results = aggregated_results[:top_k]
            
            # Format final results
            final_results = []
            for result in aggregated_results:
                # Combine content from all chunks
                all_content = "\n\n".join([
                    chunk["content"] 
                    for chunk in sorted(result["chunks"], key=lambda x: x["score"], reverse=True)
                ])
                
                final_results.append({
                    "id": result["id"],
                    "score": result["score"],
                    "content": all_content,  # Limit combined content
                    "metadata": {
                        **result["metadata"],
                        "chunks_found": len(result["chunks"]),
                        "chunk_scores": [chunk["score"] for chunk in result["chunks"]]
                    }
                })
            
            return final_results
            
        except Exception as e:
            print(f"Error searching content: {e}")
            return []

    async def delete_meeting_content(self, meeting_id: int):
        """Delete all vectors related to a meeting"""
        if not self.index:
            return

        try:
            # Delete by prefix - this will delete all chunks and summary for this meeting
            self.index.delete(filter={"meeting_id": meeting_id})
            print(f"Deleted all vectors for meeting {meeting_id}")
        except Exception as e:
            print(f"Error deleting meeting content: {e}")
    
    async def get_meeting_chunks_info(self, meeting_id: int) -> Dict[str, Any]:
        """Get information about how a meeting was chunked"""
        if not self.index:
            return {"error": "Index not available"}
        
        try:
            # Query for all vectors of this meeting
            results = self.index.query(
                vector=[0.0] * self.embedding_dimension,  # Dummy vector
                top_k=10000,  # Large number to get all chunks
                filter={"meeting_id": meeting_id},
                include_metadata=True
            )
            
            chunks_info = {
                "meeting_id": meeting_id,
                "total_vectors": len(results.matches),
                "chunks": [],
                "summary_vectors": []
            }
            
            for match in results.matches:
                metadata = match.metadata
                if metadata.get("type") == "transcript_chunk":
                    chunks_info["chunks"].append({
                        "id": match.id,
                        "chunk_index": metadata.get("chunk_index"),
                        "length": metadata.get("chunk_length"),
                        "preview": metadata.get("content", "")[:100]
                    })
                elif metadata.get("type") == "insights_summary":
                    chunks_info["summary_vectors"].append({
                        "id": match.id,
                        "insights_count": metadata.get("insights_count"),
                        "preview": metadata.get("content", "")[:100]
                    })
            
            return chunks_info
            
        except Exception as e:
            print(f"Error getting chunks info: {e}")
            return {"error": str(e)}
    
    async def store_case_document(
        self,
        document_id: int,
        case_id: int,
        content: str,
        metadata: Dict[str, Any] = None
    ):
        """Store case document content in Pinecone with chunking"""
        if not self.index:
            print("Pinecone index not available - skipping vector storage")
            return
        
        if not self.embedding_enabled:
            print("Embeddings disabled - skipping vector storage")
            return

        try:
            doc_metadata = metadata or {}
            vectors_to_upsert = []
            
            # Create metadata header for context
            metadata_header = []
            if doc_metadata.get('title'):
                metadata_header.append(f"Document: {doc_metadata['title']}")
            if doc_metadata.get('case_number'):
                metadata_header.append(f"Case: {doc_metadata['case_number']}")
            if doc_metadata.get('client_side'):
                metadata_header.append(f"Client Side: {doc_metadata['client_side']}")
            metadata_context = "\n".join(metadata_header)
            
            # Chunk the document content
            content_chunks = self.text_splitter.split_text(content)
            
            print(f"Split document into {len(content_chunks)} chunks for document {document_id}")
            
            # Store each chunk as a separate vector
            for chunk_idx, chunk in enumerate(content_chunks):
                chunk_with_context = f"{metadata_context}\n\nDocument Content Part {chunk_idx + 1}:\n{chunk}"
                
                embedding = self._generate_embedding(chunk_with_context)
                
                if embedding is None:
                    print(f"Failed to generate embedding for chunk {chunk_idx} of document {document_id}")
                    continue
                
                vector = {
                    "id": f"document_{document_id}_chunk_{chunk_idx}",
                    "values": embedding,
                    "metadata": {
                        "document_id": document_id,
                        "case_id": case_id,
                        "type": "case_document",
                        "chunk_index": chunk_idx,
                        "total_chunks": len(content_chunks),
                        "content": chunk[:1000],
                        "chunk_length": len(chunk),
                        **(metadata or {})
                    }
                }
                vectors_to_upsert.append(vector)
            
            # Upsert in batches
            if vectors_to_upsert:
                batch_size = 100
                for i in range(0, len(vectors_to_upsert), batch_size):
                    batch = vectors_to_upsert[i:i + batch_size]
                    self.index.upsert(vectors=batch)
                
                print(f"Successfully stored document {document_id}: {len(content_chunks)} chunks")
            else:
                print(f"No vectors created for document {document_id}")
                
        except Exception as e:
            print(f"Error storing case document: {e}")
    
    async def delete_case_document(self, document_id: int):
        """Delete all vectors related to a case document"""
        if not self.index:
            return

        try:
            self.index.delete(filter={"document_id": document_id})
            print(f"Deleted all vectors for document {document_id}")
        except Exception as e:
            print(f"Error deleting document content: {e}")
    
    async def delete_case_content(self, case_id: int):
        """Delete all vectors related to a case (documents and meetings)"""
        if not self.index:
            return

        try:
            self.index.delete(filter={"case_id": case_id})
            print(f"Deleted all vectors for case {case_id}")
        except Exception as e:
            print(f"Error deleting case content: {e}")


# Singleton instance
pinecone_service = PineconeService()

