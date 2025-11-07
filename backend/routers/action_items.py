from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import ActionItem, Case
from schemas import ActionItemCreate, ActionItemResponse, ActionItemUpdate
from datetime import datetime

router = APIRouter(prefix="/api/action-items", tags=["action-items"])


@router.post("/", response_model=ActionItemResponse, status_code=status.HTTP_201_CREATED)
async def create_action_item(action_item: ActionItemCreate, db: Session = Depends(get_db)):
    """Create a new action item"""
    # Verify case exists
    case = db.query(Case).filter(Case.id == action_item.case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    
    db_action_item = ActionItem(**action_item.dict())
    db.add(db_action_item)
    db.commit()
    db.refresh(db_action_item)
    return db_action_item


@router.get("/", response_model=List[ActionItemResponse])
async def get_action_items(
    skip: int = 0,
    limit: int = 100,
    status: str = None,
    db: Session = Depends(get_db)
):
    """Get all action items with optional status filter"""
    query = db.query(ActionItem)
    
    if status:
        query = query.filter(ActionItem.status == status)
    
    action_items = query.order_by(ActionItem.created_at.desc()).offset(skip).limit(limit).all()
    return action_items


@router.get("/{action_item_id}", response_model=ActionItemResponse)
async def get_action_item(action_item_id: int, db: Session = Depends(get_db)):
    """Get a specific action item"""
    action_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not action_item:
        raise HTTPException(status_code=404, detail="Action item not found")
    return action_item


@router.put("/{action_item_id}", response_model=ActionItemResponse)
async def update_action_item(
    action_item_id: int,
    action_item_update: ActionItemUpdate,
    db: Session = Depends(get_db)
):
    """Update an action item"""
    db_action_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not db_action_item:
        raise HTTPException(status_code=404, detail="Action item not found")
    
    update_data = action_item_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_action_item, field, value)
    
    db_action_item.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_action_item)
    return db_action_item


@router.delete("/{action_item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_action_item(action_item_id: int, db: Session = Depends(get_db)):
    """Delete an action item"""
    db_action_item = db.query(ActionItem).filter(ActionItem.id == action_item_id).first()
    if not db_action_item:
        raise HTTPException(status_code=404, detail="Action item not found")
    
    db.delete(db_action_item)
    db.commit()
    return None
