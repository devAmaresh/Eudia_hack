# 🧪 Testing Script - Calendar & Task Management

## Pre-Test Setup

```powershell
# Terminal 1: Backend
cd d:\Eudia\backend
Remove-Item lexicase.db  # Delete old database
python main.py           # Will create new tables

# Terminal 2: Frontend  
cd d:\Eudia\frontend
npm run dev
```

Wait for both servers to start, then open http://localhost:5173

---

## Test 1: Calendar Navigation ✅

**Expected Result**: Calendar displays with current month

1. Navigate to `/calendar` in browser
2. ✅ See month name and year at top
3. ✅ See 7 columns (Sun-Sat)
4. ✅ See 6 rows of dates
5. ✅ Today's date highlighted with blue ring
6. ✅ Previous month dates in gray
7. ✅ Next month dates in gray

**Screenshot Location**: Calendar should look like this:
```
┌─────────────────────────────────────┐
│   June 2024                    <  > │
├─────────────────────────────────────┤
│ Sun Mon Tue Wed Thu Fri Sat        │
│  26  27  28  29  30  31   1        │
│   2   3   4   5   6   7   8        │
│   9  10  11  12  13  14  15        │
│  16  17  18  19  20  21  22        │
│  23  24  25  26  27  28  29        │
│  30   1   2   3   4   5   6        │
└─────────────────────────────────────┘
```

---

## Test 2: Date Hover Interaction ✅

**Expected Result**: Plus icon appears on hover

1. Hover mouse over any date in current month
2. ✅ Small "+" icon appears in top-right of date cell
3. ✅ Date cell background slightly highlights
4. Move mouse away
5. ✅ "+" icon disappears

---

## Test 3: Date Click Popover ✅

**Expected Result**: Popover with quick actions appears

1. Click on any date (e.g., tomorrow)
2. ✅ Popover appears near mouse cursor
3. ✅ Popover shows date name (e.g., "Saturday, June 15, 2024")
4. ✅ Shows "Add Event" button with calendar icon
5. ✅ Shows "Add Task" button with list icon
6. ✅ Shows "X" close button in top-right
7. Click "X" or outside popover
8. ✅ Popover closes

---

## Test 4: Quick Event Creation ✅

**Expected Result**: Event form pre-filled with selected date

1. Click on a future date (e.g., June 20)
2. Popover appears
3. Click "Add Event" button
4. ✅ Modal opens with "Create New Event" title
5. ✅ Start Date shows "2024-06-20T09:00" (9 AM)
6. ✅ End Date shows "2024-06-20T10:00" (10 AM)
7. ✅ All other fields empty/default

**Fill in form**:
- Title: "Test Court Hearing"
- Type: "Hearing"
- Status: "Scheduled"
- Color: Red (#ef4444)
- Click "Create Event"

8. ✅ Modal closes
9. ✅ Red dot appears on June 20
10. ✅ Event title visible under date

---

## Test 5: Event Details View ✅

**Expected Result**: Can view and edit event

1. Click on the event you just created (on June 20)
2. ✅ Event details modal opens
3. ✅ Shows all event information
4. ✅ "Edit" and "Delete" buttons visible
5. Click "Edit"
6. Change title to "Test Court Hearing - Updated"
7. Click "Update Event"
8. ✅ Title updates on calendar

---

## Test 6: Meeting Upload with Auto Calendar ✅

**Expected Result**: Meeting creates calendar event automatically

**Setup**: First create a case if you don't have one

1. Navigate to a case detail page
2. Click "Upload Meeting" button
3. ✅ Modal opens

**Fill in form**:
- Meeting Title: "Initial Client Consultation"
- Meeting Date & Time: Select last week (e.g., June 10, 9:00 AM)
- File: Upload a .txt file with some text

4. Click "Upload & Analyze"
5. ✅ Modal closes
6. ✅ Meeting appears in meetings list
7. Navigate to `/calendar`
8. ✅ Red "Hearing: Initial Client Consultation" event on June 10
9. ✅ Event marked as "Completed" (since it's in the past)
10. Click the event
11. ✅ Event details show it's linked to meeting

---

## Test 7: Quick Task Creation ✅

**Expected Result**: Task created and visible in sidebar

1. In calendar, click on a date
2. Popover appears
3. Click "Add Task"
4. ✅ Task creation modal opens

**Fill in form**:
- Title: "Prepare witness list"
- Description: "Contact and prepare witnesses for court"
- Priority: "High"
- Status: "Todo"
- Due Date: Tomorrow

5. Click "Create Task"
6. ✅ Modal closes
7. ✅ Task appears in right sidebar under "Todo" section
8. ✅ Shows title, priority badge, due date

---

## Test 8: Task Status Dropdown ✅

**Expected Result**: Status changes with dropdown

1. Find the task you just created in sidebar
2. ✅ See status dropdown showing "Todo" with circle icon
3. Click the dropdown
4. ✅ See 4 options:
   - 🔵 Todo (Circle icon)
   - 🟡 In Progress (Clock icon)
   - 🟠 Review (AlertCircle icon)
   - 🟢 Done (CheckCircle2 icon)
5. Select "In Progress"
6. ✅ Dropdown closes
7. ✅ Icon changes to clock
8. ✅ Color changes to yellow
9. ✅ Task moves to "In Progress" section in sidebar

**Continue testing**:
10. Change to "Review" → ✅ Orange color, alert icon
11. Change to "Done" → ✅ Green color, check icon
12. Change back to "Todo" → ✅ Blue color, circle icon

---

## Test 9: Month Navigation ✅

**Expected Result**: Can navigate between months

1. Click left arrow at top of calendar
2. ✅ Previous month displayed
3. ✅ Events from previous month visible
4. Click right arrow twice
5. ✅ Advances to next month
6. ✅ Can see events in next month
7. Click "Today" button
8. ✅ Returns to current month

---

## Test 10: Event Type Filtering ✅

**Expected Result**: Can filter events by type

1. Ensure you have multiple event types on calendar
2. Click "Event Type" dropdown at top
3. ✅ See options: All, Hearing, Meeting, Deadline, Consultation, Filing
4. Select "Hearing"
5. ✅ Only hearing events visible (red events)
6. ✅ Other event types hidden
7. Select "All"
8. ✅ All events visible again

---

## Test 11: Case Filtering ✅

**Expected Result**: Can filter events by case

1. Create events for different cases
2. Click "Case" dropdown at top
3. ✅ See "All Cases" and list of case names
4. Select specific case
5. ✅ Only events for that case visible
6. ✅ Events for other cases hidden
7. Select "All Cases"
8. ✅ All events visible again

---

## Test 12: List View ✅

**Expected Result**: Can switch to list view

1. Click "List View" button at top
2. ✅ Calendar switches to list mode
3. ✅ Events shown in chronological order
4. ✅ Each event shows:
   - Date and time
   - Title
   - Type badge
   - Status badge
   - Action buttons
5. Click "Month View"
6. ✅ Returns to calendar grid

---

## Test 13: Multiple Events on Same Day ✅

**Expected Result**: Multiple events display correctly

1. Click on a date
2. Create event: "Morning Meeting" (9 AM - 10 AM)
3. Click same date again
4. Create event: "Afternoon Hearing" (2 PM - 4 PM)
5. ✅ Both events visible on calendar
6. ✅ Both show as dots with colors
7. Click date again
8. ✅ Popover shows both events in list at bottom

---

## Test 14: Task Comments ✅

**Expected Result**: Can add comments to tasks

1. In task sidebar, click on a task
2. ✅ Task detail modal opens
3. Scroll to comments section
4. Type comment: "Started research on case law"
5. Click "Add Comment"
6. ✅ Comment appears in thread
7. ✅ Shows author and timestamp
8. Add another comment
9. ✅ Both comments visible

---

## Test 15: Task Checklist ✅

**Expected Result**: Can manage sub-tasks

1. Create or edit a task
2. Find "Checklist" section
3. Add item: "Review evidence"
4. Add item: "Contact witnesses"
5. Add item: "File motion"
6. ✅ All items appear in list
7. Check off "Review evidence"
8. ✅ Item marked complete with strikethrough
9. ✅ Progress indicator updates (e.g., "1/3 complete")

---

## Test 16: Event Deletion ✅

**Expected Result**: Can delete events

1. Click on an event
2. Event details modal opens
3. Click "Delete" button
4. ✅ Confirmation dialog appears
5. Click "Delete Event"
6. ✅ Event removed from calendar
7. ✅ Calendar updates immediately

---

## Test 17: Task Deletion ✅

**Expected Result**: Can delete tasks

1. In task sidebar, click on a task
2. Task details modal opens
3. Click "Delete" button
4. ✅ Confirmation dialog appears
5. Click "Delete Task"
6. ✅ Task removed from sidebar
7. ✅ Sidebar updates immediately

---

## Test 18: Calendar Refresh After Meeting Upload ✅

**Expected Result**: Calendar auto-refreshes

1. Open calendar in one browser tab
2. Open case detail in another tab
3. Upload a meeting with today's date
4. Switch back to calendar tab
5. ✅ New event appears automatically (or refresh page)
6. ✅ Event shows on correct date

---

## Test 19: Priority Indicators ✅

**Expected Result**: Task priorities visually distinct

1. Create tasks with different priorities:
   - "Low priority task" → Priority: Low
   - "Normal task" → Priority: Medium
   - "Urgent task" → Priority: High
   - "Critical issue" → Priority: Critical
2. ✅ Each shows different color badge
3. ✅ Low = Gray
4. ✅ Medium = Blue
5. ✅ High = Orange
6. ✅ Critical = Red

---

## Test 20: Edge Cases ✅

### Empty Calendar
1. Delete all events and tasks
2. ✅ Calendar still displays correctly
3. ✅ Shows "No events" message when clicking dates

### Past Dates
1. Try creating event in the past
2. ✅ Allows creation
3. ✅ Can mark as "Completed" or "Cancelled"

### All-Day Events
1. Create event with "All Day" checked
2. ✅ Event shows without specific time
3. ✅ Displays as banner across day

### Long Titles
1. Create event with very long title (100+ characters)
2. ✅ Title truncates with "..." in calendar view
3. ✅ Full title visible in details modal

### Multiple Cases
1. Create events for 5+ different cases
2. ✅ All display correctly
3. ✅ Filtering works with all cases

---

## Performance Tests 🚀

### Load Test
1. Create 50+ events across 3 months
2. ✅ Calendar loads quickly (< 2 seconds)
3. ✅ Month navigation smooth
4. ✅ No lag when clicking dates

### Task Load
1. Create 30+ tasks with various statuses
2. ✅ Sidebar displays all tasks
3. ✅ Grouped correctly by status
4. ✅ Dropdown changes instant

---

## Bug Checklist 🐛

Mark any issues you find:

- [ ] Calendar doesn't load
- [ ] Popover doesn't appear on date click
- [ ] Event form doesn't pre-fill date
- [ ] Meeting upload doesn't create calendar event
- [ ] Task status dropdown doesn't work
- [ ] Events don't show on correct dates
- [ ] Filters don't work
- [ ] Can't delete events/tasks
- [ ] Date navigation broken
- [ ] Colors incorrect
- [ ] Comments don't save
- [ ] Checklist doesn't work

---

## Success Criteria ✅

All tests passing means:

- ✅ Calendar displays correctly
- ✅ Date interaction works (hover, click, popover)
- ✅ Events can be created, edited, deleted
- ✅ Meeting uploads auto-create calendar events
- ✅ Tasks can be created and managed
- ✅ Status dropdown works with 4 states
- ✅ Filtering works (case, type)
- ✅ View switching works (month, list)
- ✅ Colors correct for all event types
- ✅ Priority indicators correct
- ✅ Comments and checklists work
- ✅ Navigation smooth (prev/next month, today)
- ✅ Performance acceptable (< 2s load)

---

## Report Format 📊

After testing, report using this format:

```
## Test Results

**Date**: [Date]
**Tester**: [Your Name]
**Environment**: 
- OS: Windows
- Browser: Chrome/Firefox/Edge
- Backend: Running
- Frontend: Running

### Passed Tests (X/20)
- Test 1: ✅ Calendar Navigation
- Test 2: ✅ Date Hover
- ...

### Failed Tests
- Test X: ❌ [Issue description]
  - Expected: [What should happen]
  - Actual: [What actually happened]
  - Screenshot: [If applicable]

### Bugs Found
1. [Bug description]
   - Severity: Critical/High/Medium/Low
   - Steps to reproduce: [Steps]
   - Expected: [Expected behavior]
   - Actual: [Actual behavior]

### Performance Notes
- Calendar load time: [X seconds]
- Event creation time: [X seconds]
- Overall responsiveness: [Fast/Medium/Slow]

### Additional Feedback
[Any other observations, suggestions, or notes]
```

---

## Next Steps After Testing

1. **All Pass**: System ready for production use
2. **Some Fail**: Fix issues and re-test
3. **Performance Issues**: Optimize queries and rendering
4. **UX Issues**: Refine interactions based on feedback

---

**Good luck testing! 🧪✨**
