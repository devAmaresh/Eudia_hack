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
        className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20"
        onClick={onClose}
      />
      <div
        className="fixed z-50 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border border-zinc-800/50 rounded-xl shadow-2xl backdrop-blur-xl p-4 min-w-[240px]"
        style={{
          left: `${position.x}px`,
          top: `${position.y + 8}px`
        }}
      >
        <div className="text-sm font-bold text-white mb-3 pb-3 border-b border-zinc-800/50">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sm hover:bg-blue-600/10 hover:text-blue-400 transition-all"
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
            className="w-full justify-start text-sm hover:bg-purple-600/10 hover:text-purple-400 transition-all"
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
          <div className="mt-4 pt-4 border-t border-zinc-800/50">
            <div className="text-xs font-semibold text-zinc-400 mb-3 uppercase tracking-wider">Events Today</div>
            <div className="space-y-2">
              {events.map(event => (
                <div
                  key={event.id}
                  onClick={() => {
                    onClose();
                    onEventClick(event);
                  }}
                  className="text-xs px-3 py-2 rounded-lg cursor-pointer hover:bg-zinc-800/50 transition-all duration-200 border border-transparent hover:border-zinc-700/50"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-lg"
                      style={{ backgroundColor: event.color }}
                    />
                    <span className="text-white font-medium">{event.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
