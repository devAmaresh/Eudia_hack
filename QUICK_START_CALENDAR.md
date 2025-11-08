# 🎯 Quick Start Guide - Calendar & Task Management

## ⚡ Setup (DO THIS FIRST!)

```powershell
# 1. Delete old database
cd d:\Eudia\backend
Remove-Item lexicase.db

# 2. Restart backend
python main.py
```

This creates the new `calendar_events` and `tasks` tables.

---

## 🚀 Feature Overview

### 📅 Calendar Features
- **Month View**: See all events at a glance
- **Click Any Date**: Get instant popover with quick actions
- **Pre-filled Forms**: Selected date auto-fills at 9 AM
- **Color-Coded Events**: Hearings (red), meetings (blue), deadlines (amber)
- **Hover +**: Hover any date to see quick add button

### ✅ Task Management
- **4 Status Workflow**: Todo → In Progress → Review → Done
- **Priority Levels**: Low, Medium, High, Critical
- **Dropdown Menu**: Professional status selector with icons
- **Comments**: Threaded discussions on tasks
- **Checklists**: Sub-tasks within main tasks

### 🔗 Auto-Linking
- Upload meeting → Automatic calendar event created
- Meeting date field in upload form
- Calendar refreshes automatically

---

## 📝 Common Use Cases

### 1. Upload Past Meeting
1. Go to case details
2. Click "Upload Meeting"
3. Enter title: "Initial Consultation"
4. **Set meeting date**: When it actually happened
5. Upload transcript
6. ✅ Auto-creates red "Hearing" event on calendar

### 2. Schedule Future Hearing
1. Go to Calendar (`/calendar`)
2. Click on future date (e.g., next Tuesday)
3. Popover appears → Click "Add Event"
4. Form already has Tuesday at 9 AM
5. Change title: "Court Appearance - Case #123"
6. Add participants, location
7. Save → Event appears on calendar

### 3. Manage Hearing Prep Tasks
1. Click hearing date in calendar
2. Click "Add Task"
3. Create tasks:
   - "Review evidence" (Priority: Critical)
   - "Prep witnesses" (Priority: High)
   - "File motions" (Priority: High)
4. Use dropdown to track progress:
   - Start work → Change to "In Progress" 🟡
   - Need review → Change to "Review" 🟠
   - Finished → Change to "Done" 🟢

### 4. Quick Event Creation
1. Hover over any date
2. Click the "+" button that appears
3. Or just click the date itself
4. Choose "Add Event" or "Add Task"
5. Form pre-filled with date
6. Enter details and save

---

## 🎨 Visual Guide

### Event Colors
- 🔴 **Hearing** - Important court dates
- 🔵 **Meeting** - Client meetings, internal meetings
- 🟡 **Deadline** - Filing deadlines, payment due dates
- 🟢 **Consultation** - Client consultations
- 🟣 **Filing** - Document submissions

### Task Status Icons
- 🔵 **Todo** (○) - Not started
- 🟡 **In Progress** (🕐) - Currently working
- 🟠 **Review** (⚠️) - Needs review
- 🟢 **Done** (✓) - Completed

---

## 🔍 Testing Checklist

After database migration, test these:

### Calendar
- [ ] Navigate to `/calendar`
- [ ] See month view with all dates
- [ ] Click on a date → Popover appears
- [ ] Popover shows "Add Event" and "Add Task" buttons
- [ ] Click "Add Event" → Form has pre-filled date at 9 AM
- [ ] Create an event and see it on calendar
- [ ] Hover over date → "+" button appears

### Meeting Upload
- [ ] Go to case detail page
- [ ] Click "Upload Meeting"
- [ ] See "Meeting Date & Time" field
- [ ] Default is today at 9 AM
- [ ] Change to past date (e.g., last week)
- [ ] Upload transcript
- [ ] Go to calendar
- [ ] See red "Hearing: {title}" event on that date
- [ ] Click event → Should show details

### Tasks
- [ ] In calendar, click "Add Task"
- [ ] Create task with title and priority
- [ ] See task in sidebar
- [ ] Click status dropdown
- [ ] See 4 options with icons
- [ ] Change status → Icon and color update
- [ ] Tasks grouped by status

### Filters
- [ ] Filter by case (dropdown at top)
- [ ] Filter by event type (All, Hearing, Meeting, etc.)
- [ ] Switch between Month and List view

---

## 🐛 Troubleshooting

### "No calendar events showing"
- Check if database was recreated
- Verify backend is running
- Check browser console for errors
- Try creating a new event manually

### "Meeting upload doesn't create calendar event"
- Check backend logs for errors
- Verify `meeting_date` is being sent
- Check if CalendarEvent table exists: `SELECT * FROM calendar_events;`

### "Date popover not appearing"
- Clear browser cache
- Check if click handler is working (check console)
- Try different date

### "Task status dropdown not working"
- Check network tab for PUT request
- Verify task ID is correct
- Check backend response

---

## 💡 Pro Tips

1. **Batch Create Events**: Click multiple dates quickly to schedule several events
2. **Use Filters**: Filter by case to see only relevant events
3. **Task Dependencies**: Link tasks that depend on each other
4. **Comments**: Use task comments for team communication
5. **Priority Coding**: Use color coding to identify urgent tasks
6. **Meeting Dates**: Always set accurate meeting dates for better timeline view
7. **List View**: Use list view for upcoming events overview

---

## 🎯 Keyboard Shortcuts (Planned)

Future enhancement ideas:
- `N` - New event
- `T` - New task
- `←/→` - Previous/next month
- `Esc` - Close popover/dialog
- `/` - Focus search/filter

---

## 📊 Data Flow

```
Meeting Upload
    ↓
Backend receives meeting_date
    ↓
Creates Meeting record
    ↓
Creates CalendarEvent (auto-linked)
    ↓
Frontend calendar refreshes
    ↓
Event appears on calendar grid
```

```
Click Calendar Date
    ↓
Popover appears
    ↓
Click "Add Event"
    ↓
Form pre-filled with date (9 AM - 10 AM)
    ↓
User enters details
    ↓
Save → Event created
    ↓
Calendar refreshes
```

---

## 🚀 Next Steps

1. **Database Migration** ✅ (Delete lexicase.db and restart)
2. **Test All Features** (Use checklist above)
3. **Upload Sample Meeting** (See auto-calendar creation)
4. **Create Some Tasks** (Test status dropdown)
5. **Try Quick Actions** (Click dates, use popover)
6. **Give Feedback** (What works? What needs improvement?)

---

**Need Help?**
- Check `CALENDAR_IMPLEMENTATION.md` for detailed technical docs
- Backend logs: Look at terminal running `python main.py`
- Frontend errors: Check browser console (F12)

**Happy scheduling! 📅✨**
