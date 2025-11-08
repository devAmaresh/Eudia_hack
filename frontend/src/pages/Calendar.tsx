import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getCases,
} from '@/lib/api';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { CalendarEvent, Task, Case } from '@/types';
import {
  CalendarHeader,
  MonthView,
  ListView,
  DatePopover,
  TaskSidebar,
  EventForm,
  TaskForm,
  EventDetailDialog,
  TaskDetailDialog,
  TaskEditForm,
} from '@/components/calendar';

type ViewMode = 'month' | 'week' | 'day' | 'list';

export default function CalendarPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [showSidebar] = useState(true);
  const [filterCaseId] = useState<number | undefined>();
  const [filterEventType, setFilterEventType] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePopover, setShowDatePopover] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState({ x: 0, y: 0 });
  const [taskFilter, setTaskFilter] = useState<'all' | 'today' | 'due-date' | 'priority'>('today');
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>('all');
  const [isEditingTask, setIsEditingTask] = useState(false);

  const queryClient = useQueryClient();

  // Get date range for current view
  const getDateRange = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (viewMode === 'month') {
      start.setDate(1);
      end.setMonth(end.getMonth() + 1, 0);
    } else if (viewMode === 'week') {
      const day = start.getDay();
      start.setDate(start.getDate() - day);
      end.setDate(end.getDate() + (6 - day));
    }

    return {
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    };
  };

  const { data: events = [] } = useQuery({
    queryKey: ['calendar-events', viewMode, currentDate.toISOString(), filterCaseId, filterEventType],
    queryFn: async () => {
      const dateRange = getDateRange();
      const response = await getCalendarEvents({
        ...dateRange,
        case_id: filterCaseId,
        event_type: filterEventType,
      });
      return response.data as CalendarEvent[];
    },
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks', filterCaseId],
    queryFn: async () => {
      const response = await getTasks({ case_id: filterCaseId });
      return response.data as Task[];
    },
  });

  const { data: cases = [] } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const response = await getCases();
      return response.data as Case[];
    },
  });

  const createEventMutation = useMutation({
    mutationFn: createCalendarEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setIsEventDialogOpen(false);
    },
  });

  const updateEventMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateCalendarEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setSelectedEvent(null);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: deleteCalendarEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setSelectedEvent(null);
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setIsTaskDialogOpen(false);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      setSelectedTask(null);
    },
  });

  // Navigation
  const goToToday = () => setCurrentDate(new Date());

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  const formatDateHeader = () => {
    if (viewMode === 'month') {
      return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } else if (viewMode === 'week') {
      const start = new Date(currentDate);
      const end = new Date(currentDate);
      start.setDate(start.getDate() - start.getDay());
      end.setDate(end.getDate() + (6 - end.getDay()));
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })}`;
    }
    return currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = new Date(event.start_time);
      return (
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      <div className="flex h-screen relative z-10">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <CalendarHeader
            currentDate={currentDate}
            viewMode={viewMode}
            filterEventType={filterEventType}
            dateHeader={formatDateHeader()}
            cases={cases}
            events={events}
            onNavigate={navigateDate}
            onToday={goToToday}
            onViewModeChange={setViewMode}
            onFilterChange={setFilterEventType}
            onCreateEvent={() => setIsEventDialogOpen(true)}
            onCreateTask={() => setIsTaskDialogOpen(true)}
            EventFormComponent={
              <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-900/50">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800/50 max-w-2xl backdrop-blur-xl shadow-2xl">
                  <EventForm
                    cases={cases}
                    onSubmit={(data: any) => createEventMutation.mutate(data)}
                    onCancel={() => setIsEventDialogOpen(false)}
                    preSelectedDate={selectedDate}
                  />
                </DialogContent>
              </Dialog>
            }
            TaskFormComponent={
              <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-zinc-700/50 hover:bg-zinc-800/50 backdrop-blur-sm shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800/50 max-w-2xl backdrop-blur-xl shadow-2xl">
                  <TaskForm
                    cases={cases}
                    events={events}
                    onSubmit={(data: any) => createTaskMutation.mutate(data)}
                    onCancel={() => setIsTaskDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            }
          />

          {/* Calendar View */}
          <div className="flex-1 overflow-auto p-6 backdrop-blur-sm">
            {viewMode === 'month' ? (
              <MonthView
                currentDate={currentDate}
                events={events}
                onDateClick={(date, position) => {
                  setSelectedDate(date);
                  setPopoverPosition(position);
                  setShowDatePopover(true);
                }}
                onEventClick={setSelectedEvent}
                onAddEventClick={(date) => {
                  setSelectedDate(date);
                  setIsEventDialogOpen(true);
                }}
              />
            ) : (
              <ListView
                events={events}
                tasks={tasks}
                onEventClick={setSelectedEvent}
                onTaskClick={setSelectedTask}
                onTaskDelete={(id) => deleteTaskMutation.mutate(id)}
              />
            )}
          </div>
        </div>

        {/* Right Sidebar - Tasks */}
        {showSidebar && (
          <TaskSidebar
            tasks={tasks}
            taskFilter={taskFilter}
            taskStatusFilter={taskStatusFilter}
            onTaskFilterChange={setTaskFilter}
            onStatusFilterChange={setTaskStatusFilter}
            onUpdateTask={(id, data) => updateTaskMutation.mutate({ id, data })}
            onDeleteTask={(id) => deleteTaskMutation.mutate(id)}
            onTaskClick={setSelectedTask}
          />
        )}
      </div>

      {/* Date Quick Actions Popover */}
      {showDatePopover && selectedDate && (
        <DatePopover
          selectedDate={selectedDate}
          position={popoverPosition}
          events={getEventsForDate(selectedDate)}
          onClose={() => setShowDatePopover(false)}
          onAddEvent={() => setIsEventDialogOpen(true)}
          onAddTask={() => setIsTaskDialogOpen(true)}
          onEventClick={(event) => setSelectedEvent(event)}
        />
      )}

      {/* Event Detail Dialog */}
      {selectedEvent && (
        <EventDetailDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={(data: any) => updateEventMutation.mutate({ id: selectedEvent.id, data })}
          onDelete={() => deleteEventMutation.mutate(selectedEvent.id)}
          tasks={tasks.filter((t) => t.calendar_event_id === selectedEvent.id)}
        />
      )}

      {/* Task Detail Dialog */}
      {selectedTask && (
        <TaskDetailDialog
          task={selectedTask}
          isEditing={isEditingTask}
          onEdit={() => setIsEditingTask(true)}
          onClose={() => {
            setSelectedTask(null);
            setIsEditingTask(false);
          }}
          onDelete={() => {
            deleteTaskMutation.mutate(selectedTask.id);
            setSelectedTask(null);
          }}
          EditFormComponent={
            <TaskEditForm
              task={selectedTask}
              cases={cases}
              events={events}
              onSave={(data: any) => {
                updateTaskMutation.mutate({ id: selectedTask.id, data });
                setIsEditingTask(false);
              }}
              onCancel={() => setIsEditingTask(false)}
            />
          }
        />
      )}
    </div>
  );
}
