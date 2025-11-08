# Calendar & Task Management System - Implementation Summary

## Overview
A comprehensive calendar and task management system has been integrated into the LexiCase application, providing Asana-style UX with Jira-style task workflows. The system automatically links uploaded meetings to calendar events and provides intuitive date selection.

---

## Features Implemented

### 1. Calendar System
- **Month View**: Full calendar grid with 42-day layout (previous/current/next month)
- **List View**: Upcoming events in chronological order
- **Event Types**: Hearing, Meeting, Deadline, Consultation, Filing (color-coded)
- **Event CRUD**: Create, read, update, delete calendar events
- **Date Selection**: Click on any date to see quick actions and existing events
- **Auto-fill Dates**: Selected date automatically populates event form (9 AM - 10 AM default)
- **Hover UI**: Plus icon appears when hovering over calendar dates

### 2. Task Management
- **Jira-style Workflow**: Todo → In Progress → Review → Done
- **Status Dropdown**: Professional dropdown menu with icons and colors
  - 🔵 Todo (Circle icon)
  - 🟡 In Progress (Clock icon)
  - 🟠 Review (AlertCircle icon)
  - 🟢 Done (CheckCircle2 icon)
- **Priority Levels**: Low, Medium, High, Critical
- **Task Checklist**: Sub-tasks within tasks
- **Comments**: Discussion thread on each task
- **Dependencies**: Link tasks to other tasks
- **Event Linking**: Tasks can be linked to calendar events

### 3. Meeting Auto-Linking
- **Auto Calendar Event**: When a meeting is uploaded, a calendar event is automatically created
- **Event Details**:
  - Title: "Hearing: {meeting_title}"
  - Type: Hearing
  - Status: Completed (since already occurred)
  - Date: User-specified meeting date
  - Color: Red (#ef4444)
  - Linked: meeting_id foreign key
- **Meeting Date Field**: New field in meeting upload form to specify when meeting occurred

### 4. Intuitive UX (Asana-style)
- **Click Date → Popover**: Shows existing events and quick actions
- **Quick Actions**:
  - Add Event (pre-fills selected date)
  - Add Task
- **Date Indicator**: Visual feedback on selected date
- **Smart Defaults**: 9 AM - 10 AM for new events
- **Calendar Invalidation**: Auto-refresh after meeting uploads

---

## Technical Implementation

### Backend Changes

#### 1. New Models (`backend/models.py`)

```python
class CalendarEvent(Base):
    __tablename__ = "calendar_events"
    
    id = Column(Integer, primary_key=True, index=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    meeting_id = Column(Integer, ForeignKey("meetings.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    event_type = Column(String)  # hearing, meeting, deadline, consultation, filing
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    all_day = Column(Boolean, default=False)
    status = Column(String, default="scheduled")  # scheduled, completed, cancelled
    color = Column(String, default="#3b82f6")
    participants = Column(JSON)
    location = Column(String)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    case = relationship("Case", back_populates="calendar_events")
    meeting = relationship("Meeting", back_populates="calendar_event")
    tasks = relationship("Task", back_populates="calendar_event", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    calendar_event_id = Column(Integer, ForeignKey("calendar_events.id"), nullable=True)
    case_id = Column(Integer, ForeignKey("cases.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(String, default="todo")  # todo, in_progress, review, done
    priority = Column(String, default="medium")  # low, medium, high, critical
    assigned_to = Column(String)
    due_date = Column(DateTime)
    estimated_hours = Column(Float)
    actual_hours = Column(Float)
    dependencies = Column(JSON)  # List of task IDs this depends on
    checklist = Column(JSON)  # List of subtasks
    comments = Column(JSON)  # Discussion thread
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    calendar_event = relationship("CalendarEvent", back_populates="tasks")
    case = relationship("Case", back_populates="tasks")
```

#### 2. New Router (`backend/routers/calendar.py`)

**Calendar Endpoints:**
- `GET /api/calendar/events` - Get all events (filter by date range, case, type)
- `POST /api/calendar/events` - Create new event
- `GET /api/calendar/events/{id}` - Get specific event
- `PUT /api/calendar/events/{id}` - Update event
- `DELETE /api/calendar/events/{id}` - Delete event
- `GET /api/calendar/upcoming` - Get upcoming events (next N days)

**Task Endpoints:**
- `GET /api/calendar/tasks` - Get all tasks (filter by case, status, event)
- `POST /api/calendar/tasks` - Create new task
- `GET /api/calendar/tasks/{id}` - Get specific task
- `PUT /api/calendar/tasks/{id}` - Update task
- `DELETE /api/calendar/tasks/{id}` - Delete task
- `POST /api/calendar/tasks/{id}/comment` - Add comment to task

#### 3. Meeting Upload Enhancement (`backend/routers/meetings.py`)

**Added Parameters:**
```python
@router.post("/")
async def create_meeting(
    case_id: int = Form(...),
    title: str = Form(...),
    meeting_date: Optional[str] = Form(None),  # NEW: User-specified date
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
```

**Date Parsing:**
```python
# Parse meeting_date if provided, otherwise use current time
parsed_meeting_date = datetime.utcnow()
if meeting_date:
    try:
        parsed_meeting_date = datetime.fromisoformat(meeting_date.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        parsed_meeting_date = datetime.utcnow()
```

**Auto Calendar Event Creation:**
```python
# Auto-create calendar event for this meeting/hearing
from models import CalendarEvent
calendar_event = CalendarEvent(
    case_id=case_id,
    meeting_id=db_meeting.id,
    title=f"Hearing: {title}",
    description=db_meeting.summary if db_meeting.summary else "Meeting/Hearing record",
    event_type="hearing",
    start_time=db_meeting.meeting_date,
    end_time=db_meeting.meeting_date,
    all_day=False,
    status="completed",  # Since it already happened
    color="#ef4444",  # Red for hearings
    notes=f"Auto-created from meeting upload. Transcript available."
)
db.add(calendar_event)
db.commit()
```

### Frontend Changes

#### 1. Calendar Page (`frontend/src/pages/Calendar.tsx` - 1143 lines)

**State Management:**
```typescript
const [viewMode, setViewMode] = useState<"month" | "list">("month");
const [currentDate, setCurrentDate] = useState(new Date());
const [selectedDate, setSelectedDate] = useState<Date | null>(null);
const [showDatePopover, setShowDatePopover] = useState(false);
const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
const [selectedCaseFilter, setSelectedCaseFilter] = useState<number | "all">("all");
const [selectedTypeFilter, setSelectedTypeFilter] = useState<string | "all">("all");
```

**Date Click Handler:**
```typescript
const handleDateClick = (date: Date, event: React.MouseEvent) => {
  event.stopPropagation();
  setSelectedDate(date);
  setPopoverPosition({ x: event.clientX, y: event.clientY });
  setShowDatePopover(true);
};
```

**Date Quick Actions Popover:**
```tsx
{showDatePopover && selectedDate && (
  <div
    className="fixed bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-4 z-50 w-80"
    style={{
      left: `${popoverPosition.x}px`,
      top: `${popoverPosition.y}px`,
    }}
  >
    <div className="flex items-center justify-between mb-3">
      <h3 className="font-semibold text-white">
        {format(selectedDate, "EEEE, MMMM d, yyyy")}
      </h3>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowDatePopover(false)}
        className="h-6 w-6 p-0"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
    
    {/* Quick Actions */}
    <div className="space-y-2 mb-3">
      <Button
        onClick={() => {
          setShowDatePopover(false);
          setShowEventDialog(true);
        }}
        className="w-full justify-start bg-blue-600 hover:bg-blue-700"
      >
        <CalendarPlus className="mr-2 h-4 w-4" />
        Add Event
      </Button>
      <Button
        onClick={() => {
          setShowDatePopover(false);
          setShowTaskDialog(true);
        }}
        className="w-full justify-start bg-purple-600 hover:bg-purple-700"
      >
        <ListTodo className="mr-2 h-4 w-4" />
        Add Task
      </Button>
    </div>
    
    {/* Show existing events */}
    {dayEvents.length > 0 && (
      <div className="border-t border-zinc-800 pt-3">
        <p className="text-xs text-zinc-400 mb-2">Events on this day:</p>
        {dayEvents.map((event) => (
          <div key={event.id} className="text-sm mb-1 flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <span className="text-zinc-300">{event.title}</span>
          </div>
        ))}
      </div>
    )}
  </div>
)}
```

**Event Form with Pre-selected Date:**
```typescript
const getInitialDates = (date: Date | null) => {
  if (!date) {
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    return {
      start: formatDateTimeLocal(now),
      end: formatDateTimeLocal(new Date(now.getTime() + 60 * 60 * 1000))
    };
  }
  
  const startDate = new Date(date);
  startDate.setHours(9, 0, 0, 0);
  const endDate = new Date(date);
  endDate.setHours(10, 0, 0, 0);
  
  return {
    start: formatDateTimeLocal(startDate),
    end: formatDateTimeLocal(endDate)
  };
};

// In EventForm
<EventForm
  preSelectedDate={selectedDate}
  // ... other props
/>
```

**Task Status Dropdown:**
```tsx
<Select value={task.status} onValueChange={(value) => handleUpdateTask(task.id, value)}>
  <SelectTrigger className="w-[160px] border-zinc-800">
    <SelectValue />
  </SelectTrigger>
  <SelectContent className="bg-zinc-900 border-zinc-800">
    <SelectItem value="todo" className="text-blue-400">
      <div className="flex items-center gap-2">
        <Circle className="h-4 w-4" />
        <span>Todo</span>
      </div>
    </SelectItem>
    <SelectItem value="in_progress" className="text-yellow-400">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>In Progress</span>
      </div>
    </SelectItem>
    <SelectItem value="review" className="text-orange-400">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        <span>Review</span>
      </div>
    </SelectItem>
    <SelectItem value="done" className="text-green-400">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        <span>Done</span>
      </div>
    </SelectItem>
  </SelectContent>
</Select>
```

#### 2. Meeting Upload Form (`frontend/src/pages/CaseDetail.tsx`)

**Added Meeting Date State:**
```typescript
const [meetingDate, setMeetingDate] = useState<string>(() => {
  // Default to today's date at 9 AM
  const now = new Date();
  now.setHours(9, 0, 0, 0);
  return now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:mm
});
```

**Updated Upload Handler:**
```typescript
const handleUpload = async () => {
  if (!file || !meetingTitle) return;
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", meetingTitle);
  formData.append("meeting_date", new Date(meetingDate).toISOString());
  uploadMutation.mutate(formData);
};
```

**Form Field:**
```tsx
<div className="space-y-2">
  <Label className="text-sm font-semibold text-white">
    Meeting Date & Time
  </Label>
  <Input
    type="datetime-local"
    value={meetingDate}
    onChange={(e) => setMeetingDate(e.target.value)}
    className="border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900 h-11"
  />
  <p className="text-xs text-zinc-500 font-medium">
    When did/will this meeting occur? This will appear on your calendar.
  </p>
</div>
```

**Success Callback:**
```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ["meetings", caseId] });
  queryClient.invalidateQueries({ queryKey: ["calendar-events"] }); // Refresh calendar
  setIsOpen(false);
  setFile(null);
  setMeetingTitle("");
  // Reset to today at 9 AM
  const now = new Date();
  now.setHours(9, 0, 0, 0);
  setMeetingDate(now.toISOString().slice(0, 16));
}
```

#### 3. API Integration (`frontend/src/lib/api.ts`)

```typescript
// Calendar Events
export const getCalendarEvents = (params?: {
  start_date?: string;
  end_date?: string;
  case_id?: number;
  event_type?: string;
}) => {
  return axios.get(`${API_BASE_URL}/calendar/events`, { params });
};

export const createCalendarEvent = (data: Partial<CalendarEvent>) => {
  return axios.post(`${API_BASE_URL}/calendar/events`, data);
};

export const updateCalendarEvent = (id: number, data: Partial<CalendarEvent>) => {
  return axios.put(`${API_BASE_URL}/calendar/events/${id}`, data);
};

export const deleteCalendarEvent = (id: number) => {
  return axios.delete(`${API_BASE_URL}/calendar/events/${id}`);
};

// Tasks
export const getTasks = (params?: {
  case_id?: number;
  status?: string;
  calendar_event_id?: number;
}) => {
  return axios.get(`${API_BASE_URL}/calendar/tasks`, { params });
};

export const createTask = (data: Partial<Task>) => {
  return axios.post(`${API_BASE_URL}/calendar/tasks`, data);
};

export const updateTask = (id: number, data: Partial<Task>) => {
  return axios.put(`${API_BASE_URL}/calendar/tasks/${id}`, data);
};

export const deleteTask = (id: number) => {
  return axios.delete(`${API_BASE_URL}/calendar/tasks/${id}`);
};

export const addTaskComment = (id: number, comment: { author: string; text: string }) => {
  return axios.post(`${API_BASE_URL}/calendar/tasks/${id}/comment`, comment);
};
```

#### 4. Type Definitions (`frontend/src/types/index.ts`)

```typescript
export interface CalendarEvent {
  id: number;
  case_id?: number;
  meeting_id?: number;
  title: string;
  description?: string;
  event_type: "hearing" | "meeting" | "deadline" | "consultation" | "filing";
  start_time: string;
  end_time: string;
  all_day: boolean;
  status: "scheduled" | "completed" | "cancelled";
  color: string;
  participants?: string[];
  location?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  calendar_event_id?: number;
  case_id?: number;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "critical";
  assigned_to?: string;
  due_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  dependencies?: number[];
  checklist?: Array<{ text: string; completed: boolean }>;
  comments?: Array<{ author: string; text: string; timestamp: string }>;
  created_at: string;
  updated_at: string;
}
```

---

## Setup Instructions

### 1. Database Migration

**IMPORTANT**: You must delete the existing database to create the new tables:

```powershell
# Navigate to backend directory
cd backend

# Delete old database
Remove-Item lexicase.db

# Restart backend (will create new tables)
python main.py
```

### 2. Test the Features

1. **Navigate to Calendar**: Go to `/calendar` in the app
2. **Click on a Date**: Click any date in the month view
   - Should show popover with quick actions
   - Shows existing events for that day
3. **Add Event**: Click "Add Event" button
   - Form should be pre-filled with selected date at 9 AM
4. **Upload Meeting**: Go to a case and upload a meeting
   - Specify the meeting date and time
   - Check calendar - should see a red "Hearing" event on that date
5. **Create Task**: Click "Add Task" in calendar
   - Set status, priority, due date
6. **Change Task Status**: Use dropdown to change task status
   - Should see icon and color change

---

## User Workflows

### Workflow 1: Upload Meeting and View in Calendar
1. Navigate to case detail page
2. Click "Upload Meeting"
3. Enter meeting title (e.g., "Initial Consultation")
4. Select meeting date (e.g., last week)
5. Upload transcript file
6. Go to Calendar page
7. See red "Hearing: Initial Consultation" event on selected date
8. Click event to view details and transcript link

### Workflow 2: Schedule Upcoming Hearing
1. Navigate to Calendar page
2. Click on future date (e.g., next week)
3. Popover appears with quick actions
4. Click "Add Event"
5. Form pre-filled with selected date at 9 AM
6. Change title to "Court Hearing - Smith vs Jones"
7. Change type to "Hearing"
8. Add participants
9. Save event
10. Event appears on calendar grid

### Workflow 3: Manage Hearing Preparation Tasks
1. In Calendar, click on upcoming hearing date
2. Click "Add Task"
3. Create task: "Prepare witness list"
   - Priority: High
   - Due date: 2 days before hearing
   - Status: Todo
4. Create another task: "Review case documents"
   - Priority: Critical
   - Due date: 1 day before hearing
5. As work progresses, use dropdown to change status:
   - Todo → In Progress → Review → Done
6. View all tasks grouped by status in sidebar

### Workflow 4: Quick Event Creation
1. Hover over any calendar date
2. See "+" button appear
3. Click "+" or click date
4. Quick actions popover appears
5. Click "Add Event"
6. Form already has correct date
7. Just enter title and details
8. Save in seconds

---

## Color Coding

### Event Types
- 🔴 **Hearing** - `#ef4444` (Red)
- 🔵 **Meeting** - `#3b82f6` (Blue)
- 🟡 **Deadline** - `#f59e0b` (Amber)
- 🟢 **Consultation** - `#10b981` (Green)
- 🟣 **Filing** - `#8b5cf6` (Purple)

### Task Status
- 🔵 **Todo** - Blue
- 🟡 **In Progress** - Yellow
- 🟠 **Review** - Orange
- 🟢 **Done** - Green

### Task Priority
- ⬇️ **Low** - Gray
- ➡️ **Medium** - Blue
- ⬆️ **High** - Orange
- ⚠️ **Critical** - Red

---

## API Reference

### Calendar Events

#### Get All Events
```
GET /api/calendar/events?start_date=2024-01-01&end_date=2024-12-31&case_id=1&event_type=hearing
```

#### Create Event
```
POST /api/calendar/events
Body: {
  "case_id": 1,
  "title": "Court Hearing",
  "event_type": "hearing",
  "start_time": "2024-06-15T09:00:00",
  "end_time": "2024-06-15T11:00:00",
  "status": "scheduled",
  "color": "#ef4444"
}
```

#### Update Event
```
PUT /api/calendar/events/{id}
Body: { "status": "completed" }
```

#### Delete Event
```
DELETE /api/calendar/events/{id}
```

### Tasks

#### Get All Tasks
```
GET /api/calendar/tasks?case_id=1&status=in_progress
```

#### Create Task
```
POST /api/calendar/tasks
Body: {
  "case_id": 1,
  "title": "Prepare witness list",
  "status": "todo",
  "priority": "high",
  "due_date": "2024-06-10T17:00:00"
}
```

#### Update Task
```
PUT /api/calendar/tasks/{id}
Body: { "status": "done" }
```

#### Add Comment
```
POST /api/calendar/tasks/{id}/comment
Body: {
  "author": "John Doe",
  "text": "Completed witness interviews"
}
```

---

## Future Enhancements

### Planned Features
1. **Event Recurrence**: Support for recurring events (daily, weekly, monthly)
2. **Calendar Export**: Export events to iCal format
3. **Reminders**: Email/push notifications for upcoming events
4. **Drag & Drop**: Drag events to reschedule
5. **Week/Day Views**: Additional calendar view modes
6. **Task Dependencies**: Visual dependency graph
7. **Gantt Chart**: Project timeline visualization
8. **Time Tracking**: Log actual hours on tasks
9. **Calendar Sharing**: Share calendars with team members
10. **Mobile App**: Native mobile calendar experience

### Possible Integrations
- Google Calendar sync
- Outlook Calendar sync
- Slack notifications
- Microsoft Teams integration
- Email reminders
- SMS notifications
- Court filing system integration

---

## Troubleshooting

### Calendar Events Not Showing
- Check database: `SELECT * FROM calendar_events;`
- Verify date range filters
- Check case_id filter
- Ensure backend is running

### Meeting Not Creating Calendar Event
- Check `backend/routers/meetings.py` lines 125-145
- Verify CalendarEvent import
- Check meeting_date parsing
- Look for errors in backend logs

### Task Status Not Updating
- Verify task ID
- Check network tab for API errors
- Ensure dropdown has correct value binding
- Check backend PUT endpoint

### Date Popover Not Showing
- Check selectedDate state
- Verify click handler on date cells
- Check popover position calculation
- Ensure z-index is correct

---

## Notes

- All dates are stored in UTC in the database
- Frontend displays dates in local timezone
- Meeting uploads always create "completed" events
- Calendar query invalidation ensures fresh data
- Task dependencies are stored as JSON array of IDs
- Comments are stored as JSON with author, text, timestamp

---

**Status**: ✅ Fully Implemented and Ready for Testing
**Last Updated**: Current Session
**Next Steps**: Database migration → Testing → User feedback
