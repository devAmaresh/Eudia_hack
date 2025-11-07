from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, EmailStr
from database import get_db
from models import Meeting, Case, Insight, EmailLog
from services.email_service import EmailService
from datetime import datetime

router = APIRouter(prefix="/api/email", tags=["email"])


class EmailRecipient(BaseModel):
    email: EmailStr
    name: str = ""


class SendMeetingSummaryRequest(BaseModel):
    meeting_id: int
    recipients: List[EmailRecipient]


@router.post("/send-meeting-summary")
def send_meeting_summary(
    request: SendMeetingSummaryRequest,
    db: Session = Depends(get_db)
):
    """Send meeting summary and insights to specified email addresses"""
    
    # Get meeting with related data
    meeting = db.query(Meeting).filter(Meeting.id == request.meeting_id).first()
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Get case
    case = db.query(Case).filter(Case.id == meeting.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Get insights
    insights = db.query(Insight).filter(Insight.meeting_id == meeting.id).all()
    
    # Prepare insights data
    insights_data = [
        {
            "type": insight.type,
            "title": insight.title,
            "description": insight.description,
            "severity": insight.severity,
            "timestamp": insight.timestamp,
        }
        for insight in insights
    ]
    
    # Prepare recipient emails
    recipient_emails = [recipient.email for recipient in request.recipients]
    
    # Send email
    email_service = EmailService()
    email_subject = f"Meeting Summary: {meeting.title} - {case.title}"
    
    try:
        success = email_service.send_meeting_summary(
            recipients=recipient_emails,
            case_title=case.title,
            meeting_title=meeting.title,
            meeting_date=meeting.meeting_date,
            summary=meeting.summary or "No summary available",
            minutes=meeting.minutes or "No minutes available",
            insights=insights_data,
        )
        
        if not success:
            # Log failed email
            email_log = EmailLog(
                meeting_id=meeting.id,
                case_id=case.id,
                recipients=recipient_emails,
                subject=email_subject,
                status="failed",
                sent_at=datetime.utcnow()
            )
            db.add(email_log)
            db.commit()
            raise HTTPException(status_code=500, detail="Failed to send email")
        
        # Log successful email
        email_log = EmailLog(
            meeting_id=meeting.id,
            case_id=case.id,
            recipients=recipient_emails,
            subject=email_subject,
            status="sent",
            sent_at=datetime.utcnow()
        )
        db.add(email_log)
        db.commit()
        
        return {
            "success": True,
            "message": f"Meeting summary sent to {len(recipient_emails)} recipient(s)",
            "recipients": recipient_emails
        }
    except Exception as e:
        # Log failed email on exception
        email_log = EmailLog(
            meeting_id=meeting.id,
            case_id=case.id,
            recipients=recipient_emails,
            subject=email_subject,
            status="failed",
            sent_at=datetime.utcnow()
        )
        db.add(email_log)
        db.commit()
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


@router.get("/history")
def get_email_history(
    case_id: int = None,
    meeting_id: int = None,
    db: Session = Depends(get_db)
):
    """Get email history with optional filtering by case or meeting"""
    
    query = db.query(EmailLog)
    
    if case_id:
        query = query.filter(EmailLog.case_id == case_id)
    if meeting_id:
        query = query.filter(EmailLog.meeting_id == meeting_id)
    
    email_logs = query.order_by(EmailLog.sent_at.desc()).all()
    
    # Format response with related data
    result = []
    for log in email_logs:
        meeting = db.query(Meeting).filter(Meeting.id == log.meeting_id).first()
        case = db.query(Case).filter(Case.id == log.case_id).first()
        
        result.append({
            "id": log.id,
            "meeting_id": log.meeting_id,
            "meeting_title": meeting.title if meeting else "Unknown",
            "case_id": log.case_id,
            "case_title": case.title if case else "Unknown",
            "recipients": log.recipients,
            "subject": log.subject,
            "status": log.status,
            "sent_at": log.sent_at.isoformat() if log.sent_at else None
        })
    
    return result

