from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from database import get_db
from models import CalendarEvent, Case, Meeting, Task
from schemas import (
    CalendarEventCreate, 
    CalendarEventUpdate, 
    CalendarEventResponse,
    TaskCreate,
    TaskUpdate,
    TaskResponse
)
from datetime import datetime, timedelta
from typing import List, Optional

router = APIRouter(prefix="/api/calendar", tags=["calendar"])


@router.get("/events", response_model=List[CalendarEventResponse])
async def get_calendar_events(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    case_id: Optional[int] = None,
    event_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get calendar events with optional filters"""
    query = db.query(CalendarEvent)
    
    # Apply filters
    if start_date:
        start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
        query = query.filter(CalendarEvent.start_time >= start_dt)
    
    if end_date:
        end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        query = query.filter(CalendarEvent.end_time <= end_dt)
    
    if case_id:
        query = query.filter(CalendarEvent.case_id == case_id)
    
    if event_type:
        query = query.filter(CalendarEvent.event_type == event_type)
    
    events = query.order_by(CalendarEvent.start_time).all()
    return events


@router.get("/events/{event_id}", response_model=CalendarEventResponse)
async def get_calendar_event(event_id: int, db: Session = Depends(get_db)):
    """Get a specific calendar event"""
    event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.post("/events", response_model=CalendarEventResponse)
async def create_calendar_event(event: CalendarEventCreate, db: Session = Depends(get_db)):
    """Create a new calendar event"""
    # Validate case_id if provided
    if event.case_id:
        case = db.query(Case).filter(Case.id == event.case_id).first()
        if not case:
            raise HTTPException(status_code=404, detail="Case not found")
    
    # Validate meeting_id if provided
    if event.meeting_id:
        meeting = db.query(Meeting).filter(Meeting.id == event.meeting_id).first()
        if not meeting:
            raise HTTPException(status_code=404, detail="Meeting not found")
    
    db_event = CalendarEvent(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event


@router.put("/events/{event_id}", response_model=CalendarEventResponse)
async def update_calendar_event(
    event_id: int, 
    event: CalendarEventUpdate, 
    db: Session = Depends(get_db)
):
    """Update a calendar event"""
    db_event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Update only provided fields
    update_data = event.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_event, field, value)
    
    db.commit()
    db.refresh(db_event)
    return db_event


@router.delete("/events/{event_id}")
async def delete_calendar_event(event_id: int, db: Session = Depends(get_db)):
    """Delete a calendar event and all its associated tasks"""
    db_event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    
    # Count associated tasks before deletion (for info)
    task_count = db.query(Task).filter(Task.calendar_event_id == event_id).count()
    
    # Delete the event (cascade will handle tasks automatically due to relationship in models.py)
    db.delete(db_event)
    db.commit()
    
    return {
        "message": "Event deleted successfully",
        "event_id": event_id,
        "deleted_tasks": task_count
    }


@router.get("/upcoming", response_model=List[CalendarEventResponse])
async def get_upcoming_events(
    days: int = 7,
    db: Session = Depends(get_db)
):
    """Get upcoming events for the next N days"""
    now = datetime.utcnow()
    end_date = now + timedelta(days=days)
    
    events = db.query(CalendarEvent).filter(
        and_(
            CalendarEvent.start_time >= now,
            CalendarEvent.start_time <= end_date,
            CalendarEvent.status != "cancelled"
        )
    ).order_by(CalendarEvent.start_time).all()
    
    return events


# Task Management Endpoints
@router.get("/tasks", response_model=List[TaskResponse])
async def get_tasks(
    case_id: Optional[int] = None,
    calendar_event_id: Optional[int] = None,
    status: Optional[str] = None,
    assigned_to: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get tasks with optional filters"""
    query = db.query(Task)
    
    if case_id:
        query = query.filter(Task.case_id == case_id)
    
    if calendar_event_id:
        query = query.filter(Task.calendar_event_id == calendar_event_id)
    
    if status:
        query = query.filter(Task.status == status)
    
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)
    
    if priority:
        query = query.filter(Task.priority == priority)
    
    tasks = query.order_by(Task.due_date.asc().nullslast()).all()
    return tasks


@router.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: int, db: Session = Depends(get_db)):
    """Get a specific task"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/tasks", response_model=TaskResponse)
async def create_task(task: TaskCreate, db: Session = Depends(get_db)):
    """Create a new task"""
    db_task = Task(**task.dict())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.put("/tasks/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):
    """Update a task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    # Update only provided fields
    update_data = task.dict(exclude_unset=True)
    
    # If status is being changed to 'done', set completed_at
    if 'status' in update_data and update_data['status'] == 'done' and db_task.status != 'done':
        update_data['completed_at'] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_task, field, value)
    
    db.commit()
    db.refresh(db_task)
    return db_task


@router.delete("/tasks/{task_id}")
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    """Delete a task"""
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db.delete(db_task)
    db.commit()
    return {"message": "Task deleted successfully"}


@router.get("/events/{event_id}/tasks", response_model=List[TaskResponse])
async def get_event_tasks(event_id: int, db: Session = Depends(get_db)):
    """Get all tasks for a specific calendar event"""
    tasks = db.query(Task).filter(Task.calendar_event_id == event_id).all()
    return tasks


@router.post("/tasks/{task_id}/comment")
async def add_task_comment(
    task_id: int,
    comment: str,
    author: str,
    db: Session = Depends(get_db)
):
    """Add a comment to a task"""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    comments = task.comments or []
    comments.append({
        "author": author,
        "comment": comment,
        "timestamp": datetime.utcnow().isoformat()
    })
    task.comments = comments
    
    db.commit()
    db.refresh(task)
    return {"message": "Comment added successfully", "task": task}
