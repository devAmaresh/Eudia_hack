from langchain_community.tools import DuckDuckGoSearchResults
from typing import List, Dict, Any
import asyncio


class SearchService:
    def __init__(self):
        # Initialize LangChain's DuckDuckGo search tool with list output
        self.search_tool = DuckDuckGoSearchResults(output_format="list", max_results=5)

    async def search_legal_citations(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Search for legal citations and references using DuckDuckGo"""
        try:
            # Add legal context to query
            legal_query = f"{query} legal case law citation"
            
            def perform_search():
                try:
                    # Use LangChain's tool - returns list directly with output_format="list"
                    return self.search_tool.invoke(legal_query)
                except Exception as e:
                    print(f"Search error: {e}", flush=True)
                    return []
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            search_results = await loop.run_in_executor(None, perform_search)
            
            results = []
            for result in search_results:
                results.append({
                    "title": result.get("title", ""),
                    "url": result.get("link", ""),
                    "snippet": result.get("snippet", ""),
                    "source": "DuckDuckGo"
                })
            
            return results
            
        except Exception as e:
            print(f"Error searching for citations: {e}", flush=True)
            import traceback
            traceback.print_exc()
            return []

    async def search_case_law(self, keywords: List[str]) -> List[Dict[str, Any]]:
        """Search for relevant case law"""
        query = " ".join(keywords) + " case law precedent"
        return await self.search_legal_citations(query)

    async def search_web(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """General web search using DuckDuckGo"""
        try:
            def perform_search():
                try:
                    # Use LangChain's tool - returns list directly with output_format="list"
                    return self.search_tool.invoke(query)
                except Exception as e:
                    print(f"Search error: {e}", flush=True)
                    return []
            
            # Run in thread pool to avoid blocking
            loop = asyncio.get_event_loop()
            search_results = await loop.run_in_executor(None, perform_search)
            
            results = []
            for result in search_results:
                results.append({
                    "title": result.get("title", ""),
                    "url": result.get("link", ""),
                    "snippet": result.get("snippet", ""),
                    "source": "DuckDuckGo"
                })
            
            print(f"Web search returned {len(results)} results", flush=True)
            return results
            
        except Exception as e:
            print(f"Error performing web search: {e}", flush=True)
            import traceback
            traceback.print_exc()
            return []


# Singleton instance
search_service = SearchService()
