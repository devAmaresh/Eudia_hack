import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trash2, CheckCircle2, CalendarIcon as CalendarIconLucide } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { CalendarEvent, Task } from '@/types';

interface ListViewProps {
  events: CalendarEvent[];
  tasks: Task[];
  onEventClick: (event: CalendarEvent) => void;
  onTaskClick: (task: Task) => void;
  onTaskDelete: (taskId: number) => void;
}

export function ListView({ events, tasks, onEventClick, onTaskClick, onTaskDelete }: ListViewProps) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const getDayLabel = (date: Date) => {
    const eventDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysDiff = Math.floor((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) return 'Today';
    if (daysDiff === 1) return 'Tomorrow';
    if (daysDiff === -1) return 'Yesterday';
    if (daysDiff < -1 && daysDiff > -7) return `${Math.abs(daysDiff)} days ago`;
    if (daysDiff > 1 && daysDiff < 7) return format(eventDate, 'EEEE');
    if (daysDiff >= 7 && daysDiff < 14) return 'Next Week';
    if (daysDiff < -7) return 'Past';
    return format(eventDate, 'MMM d, yyyy');
  };

  // Group events by date
  const groupedItems = events.reduce((groups: any, event) => {
    const eventDate = new Date(event.start_time);
    const dateKey = format(eventDate, 'yyyy-MM-dd');
    const label = getDayLabel(eventDate);

    if (!groups[dateKey]) {
      groups[dateKey] = {
        label,
        date: eventDate,
        events: [],
        tasks: []
      };
    }
    groups[dateKey].events.push(event);
    return groups;
  }, {});

  // Add tasks to their respective dates
  tasks.forEach((task: Task) => {
    if (task.due_date) {
      const taskDate = new Date(task.due_date);
      const dateKey = format(taskDate, 'yyyy-MM-dd');
      const label = getDayLabel(taskDate);

      if (!groupedItems[dateKey]) {
        groupedItems[dateKey] = {
          label,
          date: taskDate,
          events: [],
          tasks: []
        };
      }
      groupedItems[dateKey].tasks.push(task);
    }
  });

  // Sort groups by date
  const sortedGroups = Object.entries(groupedItems).sort((a: any, b: any) =>
    a[1].date.getTime() - b[1].date.getTime()
  );

  return (
    <ScrollArea className="h-[600px]">
      <div className="space-y-6 p-4">
        {sortedGroups.map(([dateKey, group]: any) => (
          <div key={dateKey} className="space-y-3">
            {/* Date Header */}
            <div className="sticky top-0 backdrop-blur-sm z-10 py-2 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {group.label}
                </h3>
                <span className="text-xs text-zinc-500">{format(group.date, 'MMM d, yyyy')}</span>
                <div className="flex-1 h-px bg-zinc-800" />
                <span className="text-xs text-zinc-600">{group.events.length + group.tasks.length} items</span>
              </div>
            </div>

            {/* Events for this day */}
            {group.events.map((event: CalendarEvent) => (
              <Card
                key={`event-${event.id}`}
                className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-1 h-full rounded-full shrink-0"
                      style={{ backgroundColor: event.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-white">{event.title}</h4>
                          <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {event.location && (
                              <span className="truncate">📍 {event.location}</span>
                            )}
                          </div>
                        </div>
                        <Badge
                          className="shrink-0 text-xs"
                          style={{ backgroundColor: `${event.color}20`, color: event.color, borderColor: `${event.color}40` }}
                        >
                          {event.event_type}
                        </Badge>
                      </div>
                      {event.description && (
                        <p className="text-sm text-zinc-500 mt-2 line-clamp-2">{event.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Tasks for this day */}
            {group.tasks.map((task: Task) => (
              <Card
                key={`task-${task.id}`}
                className="border-zinc-800 border-l-4 bg-zinc-900/30 hover:bg-zinc-900/50 transition-colors group"
                style={{
                  borderLeftColor:
                    task.priority === 'critical' ? '#ef4444' :
                      task.priority === 'high' ? '#f97316' :
                        task.priority === 'medium' ? '#3b82f6' : '#71717a'
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => onTaskClick(task)}
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className={cn(
                          "h-4 w-4 mt-0.5 shrink-0",
                          task.status === 'done' ? "text-green-400" : "text-zinc-600"
                        )} />
                        <div className="flex-1">
                          <h5 className={cn(
                            "text-sm font-medium",
                            task.status === 'done' ? "text-zinc-500 line-through" : "text-white"
                          )}>
                            {task.title}
                          </h5>
                          {task.description && (
                            <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{task.description}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <Badge className={cn(
                              "text-xs font-semibold rounded-md px-2 py-0.5",
                              task.priority === 'critical' && "bg-red-500/10 text-red-400 border border-red-500/20",
                              task.priority === 'high' && "bg-orange-500/10 text-orange-400 border border-orange-500/20",
                              task.priority === 'medium' && "bg-blue-500/10 text-blue-400 border border-blue-500/20",
                              task.priority === 'low' && "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                            )}>
                              {task.priority.toUpperCase()}
                            </Badge>
                            {task.due_date && (
                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(task.due_date), 'MMM d, h:mm a')}
                              </span>
                            )}
                            {task.assigned_to && (
                              <span className="text-xs text-zinc-500 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {task.assigned_to}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this task?')) {
                          onTaskDelete(task.id);
                        }
                      }}
                      className="shrink-0 p-2 rounded-md text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}

        {sortedGroups.length === 0 && (
          <div className="text-center py-12">
            <CalendarIconLucide className="h-12 w-12 text-zinc-600 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-zinc-500">No events or tasks scheduled</p>
            <p className="text-zinc-600 text-sm mt-2">Click "Add Event" or "Add Task" to get started</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
