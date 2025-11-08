from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import ChatHistory, Case, Meeting, Insight, ActionItem
from schemas import ChatMessage, ChatResponse
from services.langchain_gemini_service import langchain_gemini_service  # New LangChain service
from services.pinecone_service import pinecone_service
import uuid
from datetime import datetime

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
async def chat(message: ChatMessage, db: Session = Depends(get_db)):
    """Chat with the AI assistant about cases and meetings"""
    
    # Generate or use existing session ID
    session_id = message.session_id or str(uuid.uuid4())
    
    # Build context from case if provided
    context = ""
    sources = []
    
    if message.case_id:
        case = db.query(Case).filter(Case.id == message.case_id).first()
        if case:
            # Get case details
            context += f"Case Number: {case.case_number}\n"
            context += f"Case Title: {case.title}\n"
            context += f"Status: {case.status}\n\n"
            
            # Get meetings
            meetings = db.query(Meeting).filter(Meeting.case_id == message.case_id).all()
            if meetings:
                context += "Recent Meetings:\n"
                for meeting in meetings[-3:]:  # Last 3 meetings
                    context += f"- {meeting.title} ({meeting.meeting_date})\n"
                    if meeting.summary:
                        context += f"  Summary: {meeting.summary[:200]}...\n"
                context += "\n"
            
            # Get critical insights
            critical_insights = db.query(Insight).join(Meeting).filter(
                Meeting.case_id == message.case_id,
                Insight.severity.in_(["high", "critical"])
            ).limit(5).all()
            
            if critical_insights:
                context += "Critical Insights:\n"
                for insight in critical_insights:
                    context += f"- {insight.title}: {insight.description}\n"
                context += "\n"
            
            # Get pending action items
            action_items = db.query(ActionItem).filter(
                ActionItem.case_id == message.case_id,
                ActionItem.status == "pending"
            ).limit(5).all()
            
            if action_items:
                context += "Pending Action Items:\n"
                for item in action_items:
                    context += f"- {item.title} (Priority: {item.priority})\n"
                context += "\n"
        
        # Search Pinecone for relevant content
        similar_content = await pinecone_service.search_similar_content(
            query=message.message,
            case_id=message.case_id,
            top_k=3
        )
        
        if similar_content:
            context += "Relevant Case Information:\n"
            for content in similar_content:
                context += f"- {content['content']}...\n"
                # Add source with proper identification
                metadata = content.get('metadata', {})
                content_type = metadata.get('type', 'unknown')
                if content_type == 'case_document':
                    doc_id = metadata.get('document_id')
                    doc_title = metadata.get('title', 'Document')  # Fixed: metadata uses 'title' not 'document_title'
                    if doc_id:
                        sources.append(f"Case Document: {doc_title} (ID: {doc_id})")
                elif content_type == 'transcript_chunk':
                    meeting_id = metadata.get('meeting_id')
                    if meeting_id:
                        sources.append(f"Meeting Transcript (ID: {meeting_id})")
                else:
                    # Fallback for older data
                    meeting_id = metadata.get('meeting_id')
                    if meeting_id:
                        sources.append(f"Meeting (ID: {meeting_id})")
    
    # Use LangChain Gemini service with tool calling
    print(f"[Chat] Context length: {len(context)} chars", flush=True)
    print(f"[Chat] Web search enabled: {message.web_search}", flush=True)
    
    result = await langchain_gemini_service.chat_with_tools(
        message=message.message,
        case_context=context,
        session_id=session_id,
        web_search_enabled=message.web_search
    )
    
    response_text = result["response"]
    web_sources = result.get("sources", [])
    
    # Ensure response_text is a string (not a list or dict)
    if not isinstance(response_text, str):
        response_text = str(response_text)
    
    # Combine sources from Pinecone and web search
    if web_sources:
        sources.extend(web_sources)
    
    # Save to chat history
    chat_record = ChatHistory(
        session_id=session_id,
        case_id=message.case_id,
        user_message=message.message,
        bot_response=response_text,  # Now guaranteed to be a string
        context_used={"sources": sources} if sources else None
    )
    db.add(chat_record)
    db.commit()
    
    return ChatResponse(
        response=response_text,
        sources=sources if sources else None,
        session_id=session_id
    )


@router.get("/history/{session_id}")
async def get_chat_history(session_id: str, db: Session = Depends(get_db)):
    """Get chat history for a session"""
    history = db.query(ChatHistory).filter(
        ChatHistory.session_id == session_id
    ).order_by(ChatHistory.created_at).all()
    
    return [
        {
            "user_message": h.user_message,
            "bot_response": h.bot_response,
            "created_at": h.created_at,
            "sources": h.context_used.get("sources") if h.context_used else None
        }
        for h in history
    ]


@router.get("/sessions")
async def get_chat_sessions(db: Session = Depends(get_db)):
    """Get all chat sessions with metadata"""
    # Get all unique sessions with their first and last messages
    sessions = db.query(
        ChatHistory.session_id,
        ChatHistory.case_id
    ).distinct(ChatHistory.session_id).all()
    
    result = []
    for session_id, case_id in sessions:
        # Get session details
        messages = db.query(ChatHistory).filter(
            ChatHistory.session_id == session_id
        ).order_by(ChatHistory.created_at).all()
        
        if messages:
            first_msg = messages[0]
            last_msg = messages[-1]
            
            # Get case info if available
            case_info = None
            if case_id:
                case = db.query(Case).filter(Case.id == case_id).first()
                if case:
                    case_info = {
                        "id": case.id,
                        "case_number": case.case_number,
                        "title": case.title
                    }
            
            result.append({
                "session_id": session_id,
                "case": case_info,
                "message_count": len(messages),
                "first_message": first_msg.user_message,
                "last_message": last_msg.user_message,
                "created_at": first_msg.created_at,
                "updated_at": last_msg.created_at
            })
    
    # Sort by most recent
    result.sort(key=lambda x: x["updated_at"], reverse=True)
    return result


@router.delete("/sessions/{session_id}")
async def delete_chat_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a chat session"""
    deleted = db.query(ChatHistory).filter(
        ChatHistory.session_id == session_id
    ).delete()
    
    if deleted == 0:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    db.commit()
    return {"message": f"Deleted chat session with {deleted} messages"}
