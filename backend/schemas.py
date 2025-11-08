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
    file_path: Optional[str] = None
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


# Calendar Event Schemas
class CalendarEventBase(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str = "hearing"  # hearing, meeting, deadline, consultation, filing
    location: Optional[str] = None
    start_time: datetime
    end_time: datetime
    all_day: bool = False
    reminder_minutes: int = 30
    color: str = "#3b82f6"
    participants: Optional[List[Dict[str, Any]]] = None
    notes: Optional[str] = None


class CalendarEventCreate(CalendarEventBase):
    case_id: Optional[int] = None
    meeting_id: Optional[int] = None


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    location: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    all_day: Optional[bool] = None
    reminder_minutes: Optional[int] = None
    status: Optional[str] = None
    color: Optional[str] = None
    participants: Optional[List[Dict[str, Any]]] = None
    notes: Optional[str] = None


class CalendarEventResponse(CalendarEventBase):
    id: int
    case_id: Optional[int] = None
    meeting_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    assignee_email: Optional[str] = None
    due_date: Optional[datetime] = None
    status: str = "todo"  # todo, in_progress, review, done
    priority: str = "medium"  # low, medium, high, critical
    tags: Optional[List[str]] = None
    estimated_hours: Optional[int] = None
    actual_hours: Optional[int] = None
    dependencies: Optional[List[int]] = None
    attachments: Optional[List[str]] = None
    checklist: Optional[List[Dict[str, Any]]] = None
    comments: Optional[List[Dict[str, Any]]] = None


class TaskCreate(TaskBase):
    case_id: Optional[int] = None
    calendar_event_id: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to: Optional[str] = None
    assignee_email: Optional[str] = None
    due_date: Optional[datetime] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    tags: Optional[List[str]] = None
    estimated_hours: Optional[int] = None
    actual_hours: Optional[int] = None
    dependencies: Optional[List[int]] = None
    attachments: Optional[List[str]] = None
    checklist: Optional[List[Dict[str, Any]]] = None
    comments: Optional[List[Dict[str, Any]]] = None


class TaskResponse(TaskBase):
    id: int
    case_id: Optional[int] = None
    calendar_event_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True
