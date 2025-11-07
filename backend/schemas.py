from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any


class CaseBase(BaseModel):
    case_number: str
    title: str
    description: Optional[str] = None
    client_side: Optional[str] = None  # plaintiff, defendant, petitioner, respondent
    status: str = "active"


class CaseCreate(CaseBase):
    pass


class CaseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    client_side: Optional[str] = None
    status: Optional[str] = None


class CaseResponse(CaseBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MeetingBase(BaseModel):
    title: str
    meeting_date: Optional[datetime] = None


class MeetingCreate(MeetingBase):
    case_id: int


class MeetingResponse(MeetingBase):
    id: int
    case_id: int
    file_type: Optional[str] = None
    transcript: Optional[str] = None
    summary: Optional[str] = None
    minutes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class InsightBase(BaseModel):
    type: str
    title: str
    description: str
    severity: str = "medium"
    timestamp: Optional[str] = None
    extra_data: Optional[Dict[str, Any]] = None


class InsightCreate(InsightBase):
    meeting_id: int


class InsightResponse(InsightBase):
    id: int
    meeting_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ActionItemBase(BaseModel):
    title: str
    description: str
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    status: str = "pending"
    priority: str = "medium"


class ActionItemCreate(ActionItemBase):
    case_id: int
    meeting_id: Optional[int] = None


class ActionItemUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None


class ActionItemResponse(ActionItemBase):
    id: int
    case_id: int
    meeting_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ChatMessage(BaseModel):
    message: str
    case_id: Optional[int] = None
    session_id: Optional[str] = None
    web_search: Optional[bool] = False


class ChatResponse(BaseModel):
    response: str
    sources: Optional[List[str]] = None
    session_id: str


class CaseStatistics(BaseModel):
    total_cases: int
    active_cases: int
    total_meetings: int
    pending_action_items: int
    critical_insights: int


class DashboardData(BaseModel):
    statistics: CaseStatistics
    recent_cases: List[CaseResponse]
    upcoming_deadlines: List[ActionItemResponse]
    critical_insights: List[InsightResponse]
