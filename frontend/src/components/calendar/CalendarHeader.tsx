import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ChevronLeft, ChevronRight, CalendarIcon, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CalendarEvent, Case } from '@/types';

type ViewMode = 'month' | 'week' | 'day' | 'list';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  filterEventType?: string;
  dateHeader: string;
  cases: Case[];
  events: CalendarEvent[];
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onFilterChange: (filter: string | undefined) => void;
  onCreateEvent: () => void;
  onCreateTask: () => void;
  EventFormComponent: React.ReactNode;
  TaskFormComponent: React.ReactNode;
}

export function CalendarHeader({
  dateHeader,
  viewMode,
  filterEventType,
  onNavigate,
  onToday,
  onViewModeChange,
  onFilterChange,
  onCreateEvent,
  onCreateTask,
  EventFormComponent,
  TaskFormComponent,
}: CalendarHeaderProps) {
  return (
    <div className="shrink-0 border-b border-zinc-800/50 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/50 backdrop-blur-xl relative">
      {/* Gradient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-purple-600/10 rounded-full blur-3xl" />
      
      <div className="px-6 py-6 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="text-zinc-100">
                Calendar & Tasks
              </span>
            </h1>
            <p className="text-sm text-zinc-400 mt-2 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Manage hearings, meetings, and deadlines with AI precision
            </p>
          </div>
          <div className="flex items-center gap-3">
            {EventFormComponent}
            {TaskFormComponent}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-zinc-900/80 backdrop-blur-sm rounded-lg p-1 border border-zinc-800/50 shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('prev')}
                className="hover:bg-zinc-800/50 h-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToday}
                className="hover:bg-zinc-800/50 px-6 h-9 font-semibold"
              >
                Today
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('next')}
                className="hover:bg-zinc-800/50 h-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-base font-bold text-white px-4 py-2 bg-zinc-900/50 backdrop-blur-sm rounded-lg border border-zinc-800/50">
              {dateHeader}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Select value={filterEventType} onValueChange={(value) => onFilterChange(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[180px] border-zinc-700/50 bg-zinc-900/50 backdrop-blur-sm h-9">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">✨ All Events</SelectItem>
                <SelectItem value="hearing">⚖️ Hearings</SelectItem>
                <SelectItem value="meeting">🤝 Meetings</SelectItem>
                <SelectItem value="deadline">⏰ Deadlines</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-zinc-900/80 backdrop-blur-sm rounded-lg p-1 border border-zinc-800/50 shadow-lg">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange('month')}
                className={cn(
                  "h-9 transition-all",
                  viewMode === 'month' 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                    : "hover:bg-zinc-800/50"
                )}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange('list')}
                className={cn(
                  "h-9 transition-all",
                  viewMode === 'list' 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
                    : "hover:bg-zinc-800/50"
                )}
              >
                <List className="h-4 w-4 mr-2" />
                List
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
