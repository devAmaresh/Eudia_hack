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
    status = Column(String, default="active")  # active, closed, pending
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    meetings = relationship("Meeting", back_populates="case", cascade="all, delete-orphan")
    action_items = relationship("ActionItem", back_populates="case", cascade="all, delete-orphan")


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
