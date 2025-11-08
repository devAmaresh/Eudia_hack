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
          "min-h-[120px] border border-zinc-800/30 p-3 hover:bg-zinc-900/50 transition-all duration-200 cursor-pointer relative group backdrop-blur-sm",
          !isCurrentMonth && "bg-zinc-950/30 opacity-40",
          isCurrentMonth && "bg-zinc-900/20 hover:border-zinc-700/50",
          isToday && "ring-2 ring-blue-500/50 bg-blue-950/20 shadow-lg shadow-blue-900/20"
        )}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          onDateClick(clickedDate, { x: rect.left, y: rect.bottom });
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className={cn(
            "text-sm font-bold px-2 py-1 rounded-lg transition-all",
            isToday && "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg",
            !isCurrentMonth && "text-zinc-600",
            isCurrentMonth && !isToday && "text-zinc-300 group-hover:text-white"
          )}>
            {currentDay.getDate()}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddEventClick(clickedDate);
            }}
            className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-blue-600 rounded-lg bg-zinc-800/50 backdrop-blur-sm"
          >
            <Plus className="h-3.5 w-3.5 text-zinc-300" />
          </button>
        </div>
        <div className="space-y-1.5">
          {dayEvents.slice(0, 3).map(event => (
            <div
              key={event.id}
              onClick={(e) => {
                e.stopPropagation();
                onEventClick(event);
              }}
              className="text-xs px-2.5 py-1.5 rounded-md cursor-pointer hover:scale-105 transition-all duration-200 truncate font-medium shadow-sm backdrop-blur-sm border border-white/10"
              style={{ backgroundColor: event.color }}
            >
              {event.title}
            </div>
          ))}
          {dayEvents.length > 3 && (
            <div className="text-xs text-blue-400 px-2 font-semibold bg-blue-950/30 py-1 rounded-md border border-blue-800/30">
              +{dayEvents.length - 3} more events
            </div>
          )}
        </div>
      </div>
    );

    currentDay.setDate(currentDay.getDate() + 1);
  }

  return (
    <div className="grid grid-cols-7 gap-0 border border-zinc-800/50 rounded-xl overflow-hidden shadow-2xl">
      {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
        <div key={day} className="border-r border-b border-zinc-800/50 p-3 text-center font-bold text-sm text-zinc-300 bg-gradient-to-b from-zinc-900 to-zinc-900/50 backdrop-blur-sm">
          {day}
        </div>
      ))}
      {days}
    </div>
  );
}
