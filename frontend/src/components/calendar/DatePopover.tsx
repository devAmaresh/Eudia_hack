import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface DatePopoverProps {
  selectedDate: Date;
  position: { x: number; y: number };
  events: any[];
  onClose: () => void;
  onAddEvent: () => void;
  onAddTask: () => void;
  onEventClick: (event: any) => void;
}

export function DatePopover({
  selectedDate,
  position,
  events,
  onClose,
  onAddEvent,
  onAddTask,
  onEventClick,
}: DatePopoverProps) {
  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      <div
        className="fixed z-50 bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl p-3 min-w-[200px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y + 8}px`
        }}
      >
        <div className="text-sm font-semibold text-white mb-2">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm"
            onClick={() => {
              onClose();
              onAddEvent();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm"
            onClick={() => {
              onClose();
              onAddTask();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        {events.length > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <div className="text-xs text-zinc-500 mb-2">Events on this day:</div>
            {events.map(event => (
              <div
                key={event.id}
                onClick={() => {
                  onClose();
                  onEventClick(event);
                }}
                className="text-xs px-2 py-1.5 rounded cursor-pointer hover:bg-zinc-800 transition-colors mb-1"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: event.color }}
                  />
                  <span className="text-white">{event.title}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
