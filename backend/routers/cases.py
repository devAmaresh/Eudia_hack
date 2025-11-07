from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Case, Meeting, ActionItem, Insight
from schemas import CaseCreate, CaseResponse, CaseUpdate
from services.pinecone_service import pinecone_service
from datetime import datetime

router = APIRouter(prefix="/api/cases", tags=["cases"])


@router.post("/", response_model=CaseResponse, status_code=status.HTTP_201_CREATED)
async def create_case(case: CaseCreate, db: Session = Depends(get_db)):
    """Create a new case"""
    # Check if case number already exists
    existing_case = db.query(Case).filter(Case.case_number == case.case_number).first()
    if existing_case:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Case number already exists"
        )
    
    db_case = Case(**case.dict())
    db.add(db_case)
    db.commit()
    db.refresh(db_case)
    return db_case


@router.get("/", response_model=List[CaseResponse])
async def get_cases(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all cases"""
    cases = db.query(Case).order_by(Case.created_at.desc()).offset(skip).limit(limit).all()
    return cases


@router.get("/{case_id}", response_model=CaseResponse)
async def get_case(case_id: int, db: Session = Depends(get_db)):
    """Get a specific case"""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case


@router.put("/{case_id}", response_model=CaseResponse)
async def update_case(case_id: int, case_update: CaseUpdate, db: Session = Depends(get_db)):
    """Update a case"""
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    update_data = case_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_case, field, value)
    
    db_case.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_case)
    return db_case


@router.delete("/{case_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_case(case_id: int, db: Session = Depends(get_db)):
    """Delete a case and all associated data including meetings, insights, action items, and Pinecone vectors"""
    db_case = db.query(Case).filter(Case.id == case_id).first()
    if not db_case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    # Get all meetings for this case
    meetings = db.query(Meeting).filter(Meeting.case_id == case_id).all()
    
    # Delete from Pinecone for each meeting
    for meeting in meetings:
        try:
            await pinecone_service.delete_meeting_content(meeting.id)
        except Exception as e:
            print(f"Error deleting meeting {meeting.id} from Pinecone: {e}")
    
    # Delete insights associated with meetings
    for meeting in meetings:
        db.query(Insight).filter(Insight.meeting_id == meeting.id).delete()
    
    # Delete action items associated with the case
    db.query(ActionItem).filter(ActionItem.case_id == case_id).delete()
    
    # Delete meetings
    db.query(Meeting).filter(Meeting.case_id == case_id).delete()
    
    # Finally delete the case
    db.delete(db_case)
    db.commit()
    
    return None


@router.get("/{case_id}/meetings")
async def get_case_meetings(case_id: int, db: Session = Depends(get_db)):
    """Get all meetings for a case"""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    meetings = db.query(Meeting).filter(Meeting.case_id == case_id).order_by(Meeting.meeting_date.desc()).all()
    return meetings


@router.get("/{case_id}/action-items")
async def get_case_action_items(case_id: int, db: Session = Depends(get_db)):
    """Get all action items for a case"""
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    action_items = db.query(ActionItem).filter(ActionItem.case_id == case_id).order_by(ActionItem.created_at.desc()).all()
    return action_items
