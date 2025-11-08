from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    client_side = Column(String, nullable=True)  # plaintiff, defendant, petitioner, respondent
    status = Column(String, default="active")  # active, closed, pending
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    meetings = relationship("Meeting", back_populates="case", cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="case", cascade="all, delete-orphan")
    documents = relationship("CaseDocument", back_populates="case", cascade="all, delete-orphan")


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    title = Column(String)
    meeting_date = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String, nullable=True)
    file_type = Column(String, nullable=True)  # mp3, txt
    transcript = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    minutes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    case = relationship("Case", back_populates="meetings")
    insights = relationship("Insight", back_populates="meeting", cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="meeting", cascade="all, delete-orphan")
    calendar_event = relationship("CalendarEvent", back_populates="meeting", cascade="all, delete-orphan", uselist=False)


class Insight(Base):
    __tablename__ = "insights"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    type = Column(String)  # critical_point, motion, decision, deadline, risk_area
    title = Column(String)
    description = Column(Text)
    severity = Column(String, default="medium")  # low, medium, high, critical
    timestamp = Column(String, nullable=True)
    extra_data = Column(JSON, nullable=True)  # renamed from metadata to avoid conflict
    created_at = Column(DateTime, default=datetime.utcnow)
    
    meeting = relationship("Meeting", back_populates="insights")


class ActionItem(Base):
    __tablename__ = "action_items"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    title = Column(String)
    description = Column(Text)
    assigned_to = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=True)
    status = Column(String, default="pending")  # pending, in_progress, completed
    priority = Column(String, default="medium")  # low, medium, high
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    case = relationship("Case", back_populates="action_items")
    meeting = relationship("Meeting", back_populates="action_items")


class ChatHistory(Base):
    __tablename__ = "chat_history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    user_message = Column(Text)
    bot_response = Column(Text)
    context_used = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class EmailLog(Base):
    __tablename__ = "email_logs"

    id = Column(Integer, primary_key=True, index=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"))
    case_id = Column(Integer, ForeignKey("cases.id"))
    recipients = Column(JSON)  # List of email addresses
    subject = Column(String)
    status = Column(String, default="sent")  # sent, failed
    sent_at = Column(DateTime, default=datetime.utcnow)
    
    meeting = relationship("Meeting")
    case = relationship("Case")


class CaseDocument(Base):
    __tablename__ = "case_documents"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"))
    title = Column(String)
    file_path = Column(String)
    file_type = Column(String)  # pdf, docx, txt, etc.
    file_size = Column(Integer, nullable=True)  # in bytes
    description = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
    
    case = relationship("Case", back_populates="documents")


class CalendarEvent(Base):
    __tablename__ = "calendar_events"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    event_type = Column(String, default="hearing")  # hearing, meeting, deadline, consultation, filing
    location = Column(String, nullable=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    all_day = Column(Boolean, default=False)
    reminder_minutes = Column(Integer, default=30)  # minutes before event to remind
    status = Column(String, default="scheduled")  # scheduled, completed, cancelled, rescheduled
    color = Column(String, default="#3b82f6")  # hex color for calendar display
    participants = Column(JSON, nullable=True)  # List of participants with roles
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    case = relationship("Case")
    meeting = relationship("Meeting", back_populates="calendar_event")
    tasks = relationship("Task", back_populates="calendar_event", cascade="all, delete-orphan")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    calendar_event_id = Column(Integer, ForeignKey("calendar_events.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    assigned_to = Column(String, nullable=True)
    assignee_email = Column(String, nullable=True)
    due_date = Column(DateTime, nullable=True)
    status = Column(String, default="todo")  # todo, in_progress, review, done
    priority = Column(String, default="medium")  # low, medium, high, critical
    tags = Column(JSON, nullable=True)  # List of tags for categorization
    estimated_hours = Column(Integer, nullable=True)
    actual_hours = Column(Integer, nullable=True)
    dependencies = Column(JSON, nullable=True)  # List of task IDs this depends on
    attachments = Column(JSON, nullable=True)  # List of file paths
    checklist = Column(JSON, nullable=True)  # List of sub-items with completion status
    comments = Column(JSON, nullable=True)  # List of comments with timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    
    case = relationship("Case")
    calendar_event = relationship("CalendarEvent", back_populates="tasks")
