import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/types';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDateClick: (date: Date, position: { x: number; y: number }) => void;
  onEventClick: (event: CalendarEvent) => void;
  onAddEventClick: (date: Date) => void;
}

export function MonthView({
  currentDate,
  events,
  onDateClick,
  onEventClick,
  onAddEventClick,
}: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.start_time);
      return (
        eventStart.getDate() === date.getDate() &&
        eventStart.getMonth() === date.getMonth() &&
        eventStart.getFullYear() === date.getFullYear()
      );
    });
  };

  const days = [];
  const currentDay = new Date(startDate);

  for (let i = 0; i < 42; i++) {
    const dayEvents = getEventsForDate(currentDay);
    const isCurrentMonth = currentDay.getMonth() === month;
    const isToday =
      currentDay.getDate() === new Date().getDate() &&
      currentDay.getMonth() === new Date().getMonth() &&
      currentDay.getFullYear() === new Date().getFullYear();

    const clickedDate = new Date(currentDay);

    days.push(
      <div
        key={i}
        className={cn(
          "min-h-[120px] border border-zinc-800/50 p-2 hover:bg-zinc-900/50 transition-colors cursor-pointer relative group",
          !isCurrentMonth && "bg-zinc-950/50 opacity-50",
          isToday && "ring-2 ring-blue-500/50"
        )}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onDateClick(clickedDate, { x: rect.left, y: rect.bottom });
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className={cn(
            "text-sm font-medium",
            isToday && "text-blue-400",
            !isCurrentMonth && "text-zinc-600",
            isCurrentMonth && !isToday && "text-zinc-300"
          )}>
            {currentDay.getDate()}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddEventClick(clickedDate);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-zinc-800 rounded"
          >
            <Plus className="h-3 w-3 text-zinc-400" />
          </button>
        </div>
        <div className="space-y-1">
          {dayEvents.slice(0, 3).map(event => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
              }}
              className="text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 transition-opacity truncate"
              style={{ backgroundColor: event.color }}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-zinc-500 px-2">
              +{dayEvents.length - 3} more
            </div>
          )}
        </div>
      </div>
    );

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return (
    <div className="grid grid-cols-7 gap-0 border-l border-t border-zinc-800/50">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="border-r border-b border-zinc-800/50 p-2 text-center font-semibold text-sm text-zinc-400 bg-zinc-900/50">
          {day}
        </div>
      ))}
      {days}
    </div>
  );
}
