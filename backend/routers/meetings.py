from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from models import Meeting, Case, Insight, ActionItem
from schemas import MeetingResponse, InsightResponse, ActionItemResponse
from services.gemini_service import gemini_service
from services.pinecone_service import pinecone_service
import os
import aiofiles
from datetime import datetime
from config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/meetings", tags=["meetings"])

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)


@router.post("/", response_model=MeetingResponse, status_code=status.HTTP_201_CREATED)
async def create_meeting(
    case_id: int = Form(...),
    title: str = Form(...),
    meeting_date: Optional[str] = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Upload and process a meeting file (MP3 or TXT)"""
    
    # Verify case exists
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Validate file type
    file_extension = file.filename.split(".")[-1].lower()
    if file_extension not in ["mp3", "txt"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only MP3 and TXT files are supported"
        )
    
    # Save file
    file_path = os.path.join(settings.UPLOAD_DIR, f"{datetime.utcnow().timestamp()}_{file.filename}")
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    
    # Create meeting record
    # Parse meeting_date if provided, otherwise use current time
    parsed_meeting_date = datetime.utcnow()
    if meeting_date:
        try:
            # Parse ISO format datetime string
            parsed_meeting_date = datetime.fromisoformat(meeting_date.replace('Z', '+00:00'))
        except (ValueError, AttributeError):
            # If parsing fails, use current time
            parsed_meeting_date = datetime.utcnow()
    
    db_meeting = Meeting(
        case_id=case_id,
        title=title,
        file_path=file_path,
        file_type=file_extension,
        meeting_date=parsed_meeting_date
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    
    # Process the file
    transcript = ""
    if file_extension == "txt":
        async with aiofiles.open(file_path, 'r', encoding='utf-8') as f:
            transcript = await f.read()
    else:
        # For MP3, we'll just use a placeholder for now
        # In production, you'd use speech recognition here
        transcript = "Audio transcription would be processed here using speech-to-text service."
    
    # Analyze transcript with Gemini
    analysis = await gemini_service.analyze_transcript(transcript)
    
    # Update meeting with analysis results
    db_meeting.transcript = transcript
    db_meeting.summary = analysis.get("summary", "")
    db_meeting.minutes = analysis.get("minutes", "")
    
    # Store insights
    all_insights = (
        analysis.get("critical_points", []) +
        analysis.get("decisions", []) +
        analysis.get("deadlines", []) +
        analysis.get("risk_areas", [])
    )
    
    for insight_data in all_insights:
        insight = Insight(
            meeting_id=db_meeting.id,
            type=insight_data.get("type", "general"),
            title=insight_data.get("title", ""),
            description=insight_data.get("description", ""),
            severity=insight_data.get("severity", "medium"),
            timestamp=insight_data.get("timestamp")
        )
        db.add(insight)
    
    # Store action items
    for action_data in analysis.get("action_items", []):
        action_item = ActionItem(
            case_id=case_id,
            meeting_id=db_meeting.id,
            title=action_data.get("title", ""),
            description=action_data.get("description", ""),
            assigned_to=action_data.get("assigned_to"),
            priority=action_data.get("priority", "medium"),
            status="pending"
        )
        db.add(action_item)
    
    db.commit()
    db.refresh(db_meeting)
    
    # Auto-create calendar event for this meeting/hearing
    from models import CalendarEvent
    calendar_event = CalendarEvent(
        case_id=case_id,
        meeting_id=db_meeting.id,
        title=f"Hearing: {title}",
        description=db_meeting.summary if db_meeting.summary else "Meeting/Hearing record",
        event_type="hearing",
        start_time=db_meeting.meeting_date,
        end_time=db_meeting.meeting_date,  # Can be updated later
        all_day=False,
        status="completed",  # Since it already happened
        color="#ef4444",  # Red for hearings
        notes=f"Auto-created from meeting upload. Transcript available."
    )
    db.add(calendar_event)
    db.commit()
    
    # Store in Pinecone for vector search
    await pinecone_service.store_meeting_content(
        meeting_id=db_meeting.id,
        case_id=case_id,
        transcript=transcript,
        insights=all_insights,
        metadata={"case_number": case.case_number, "title": title}
    )
    
    return db_meeting


@router.get("/{meeting_id}", response_model=MeetingResponse)
async def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Get a specific meeting"""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return meeting


@router.get("/{meeting_id}/insights")
async def get_meeting_insights(meeting_id: int, db: Session = Depends(get_db)):
    """Get all insights for a meeting"""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    insights = db.query(Insight).filter(Insight.meeting_id == meeting_id).all()
    return insights


@router.get("/{meeting_id}/action-items")
async def get_meeting_action_items(meeting_id: int, db: Session = Depends(get_db)):
    """Get all action items for a meeting"""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    action_items = db.query(ActionItem).filter(ActionItem.meeting_id == meeting_id).all()
    return action_items


@router.delete("/{meeting_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    """Delete a meeting and all associated data including insights, action items, and Pinecone vectors"""
    meeting = db.query(Meeting).filter(Meeting.id == meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Delete from Pinecone
    try:
        await pinecone_service.delete_meeting_content(meeting_id)
    except Exception as e:
        print(f"Error deleting meeting {meeting_id} from Pinecone: {e}")
    
    # Delete associated calendar event
    from models import CalendarEvent
    db.query(CalendarEvent).filter(CalendarEvent.meeting_id == meeting_id).delete()
    
    # Delete insights associated with this meeting
    db.query(Insight).filter(Insight.meeting_id == meeting_id).delete()
    
    # Delete action items associated with this meeting
    db.query(ActionItem).filter(ActionItem.meeting_id == meeting_id).delete()
    
    # Delete file
    if meeting.file_path and os.path.exists(meeting.file_path):
        try:
            os.remove(meeting.file_path)
        except Exception as e:
            print(f"Error deleting file {meeting.file_path}: {e}")
    
    # Delete the meeting
    db.delete(meeting)
    db.commit()
    return None
