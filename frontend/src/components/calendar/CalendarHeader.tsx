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
    <div className="shrink-0 border-b border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Calendar & Tasks</h1>
            <p className="text-sm text-zinc-400 mt-1">Manage hearings, meetings, and deadlines</p>
          </div>
          <div className="flex items-center gap-2">
            {EventFormComponent}
            {TaskFormComponent}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('prev')}
              className="border-zinc-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onToday}
              className="border-zinc-700"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigate('next')}
              className="border-zinc-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="text-lg font-semibold text-white ml-4">
              {dateHeader}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterEventType} onValueChange={(value) => onFilterChange(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[180px] border-zinc-700">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="hearing">Hearings</SelectItem>
                <SelectItem value="meeting">Meetings</SelectItem>
                <SelectItem value="deadline">Deadlines</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-1 bg-zinc-900 rounded-lg p-1 border border-zinc-800">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange('month')}
                className={cn(viewMode === 'month' && "bg-zinc-800")}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Month
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewModeChange('list')}
                className={cn(viewMode === 'list' && "bg-zinc-800")}
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
