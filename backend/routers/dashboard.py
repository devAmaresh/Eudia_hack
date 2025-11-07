from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Case, Meeting, ActionItem, Insight
from schemas import DashboardData, CaseStatistics
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardData)
async def get_dashboard_data(db: Session = Depends(get_db)):
    """Get dashboard statistics and overview"""
    
    # Get statistics
    total_cases = db.query(func.count(Case.id)).scalar()
    active_cases = db.query(func.count(Case.id)).filter(Case.status == "active").scalar()
    total_meetings = db.query(func.count(Meeting.id)).scalar()
    pending_action_items = db.query(func.count(ActionItem.id)).filter(
        ActionItem.status == "pending"
    ).scalar()
    critical_insights = db.query(func.count(Insight.id)).filter(
        Insight.severity.in_(["high", "critical"])
    ).scalar()
    
    statistics = CaseStatistics(
        total_cases=total_cases or 0,
        active_cases=active_cases or 0,
        total_meetings=total_meetings or 0,
        pending_action_items=pending_action_items or 0,
        critical_insights=critical_insights or 0
    )
    
    # Get recent cases
    recent_cases = db.query(Case).order_by(Case.created_at.desc()).limit(5).all()
    
    # Get upcoming deadlines (action items with due dates)
    upcoming_deadlines = db.query(ActionItem).filter(
        ActionItem.due_date.isnot(None),
        ActionItem.status != "completed",
        ActionItem.due_date >= datetime.utcnow()
    ).order_by(ActionItem.due_date).limit(5).all()
    
    # Get critical insights
    critical_insights_list = db.query(Insight).filter(
        Insight.severity.in_(["high", "critical"])
    ).order_by(Insight.created_at.desc()).limit(10).all()
    
    return DashboardData(
        statistics=statistics,
        recent_cases=recent_cases,
        upcoming_deadlines=upcoming_deadlines,
        critical_insights=critical_insights_list
    )


@router.get("/insights/summary")
async def get_insights_summary(db: Session = Depends(get_db)):
    """Get summary of insights by type and severity"""
    
    insights_by_type = db.query(
        Insight.type,
        func.count(Insight.id).label('count')
    ).group_by(Insight.type).all()
    
    insights_by_severity = db.query(
        Insight.severity,
        func.count(Insight.id).label('count')
    ).group_by(Insight.severity).all()
    
    return {
        "by_type": [{"type": t, "count": c} for t, c in insights_by_type],
        "by_severity": [{"severity": s, "count": c} for s, c in insights_by_severity]
    }
