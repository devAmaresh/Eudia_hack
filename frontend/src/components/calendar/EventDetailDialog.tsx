import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Clock, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { CalendarEvent, Task } from '@/types';

interface EventDetailDialogProps {
  event: CalendarEvent;
  onClose: () => void;
  onUpdate: (data: any) => void;
  onDelete: () => void;
  tasks: Task[];
}

export function EventDetailDialog({ event, onClose, onDelete, tasks }: EventDetailDialogProps) {
  return (
    <Dialog open={!!event} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-900 border-zinc-800 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: event.color }} />
            {event.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-zinc-300">
              <Clock className="h-4 w-4 text-zinc-500" />
              <span>
                {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleTimeString()}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-2 text-zinc-300">
                <MapPin className="h-4 w-4 text-zinc-500" />
                <span>{event.location}</span>
              </div>
            )}
            {event.case_id && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = `/cases/${event.case_id}`)}
                  className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View Case Details
                </Button>
              </div>
            )}
            {event.description && <p className="text-zinc-400 mt-2">{event.description}</p>}
          </div>

          {tasks.length > 0 && (
            <div className="border-t border-zinc-800 pt-4">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Related Tasks ({tasks.length})
              </h4>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <Card key={task.id} className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2
                          className={cn('h-4 w-4 mt-0.5 shrink-0', task.status === 'done' ? 'text-green-400' : 'text-zinc-600')}
                        />
                        <div className="flex-1 min-w-0">
                          <h5
                            className={cn(
                              'text-sm font-medium',
                              task.status === 'done' ? 'text-zinc-500 line-through' : 'text-white'
                            )}
                          >
                            {task.title}
                          </h5>
                          {task.description && <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{task.description}</p>}
                          <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                            <Badge
                              className={cn(
                                'text-xs px-2 py-0.5',
                                task.priority === 'critical' && 'bg-red-500/10 text-red-400 border border-red-500/20',
                                task.priority === 'high' && 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
                                task.priority === 'medium' && 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                                task.priority === 'low' && 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                              )}
                            >
                              {task.priority}
                            </Badge>
                            {task.due_date && (
                              <span className="text-zinc-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(task.due_date), 'MMM d, h:mm a')}
                              </span>
                            )}
                            {task.assigned_to && (
                              <span className="text-zinc-500 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {task.assigned_to}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t border-zinc-800">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Are you sure you want to delete this event?')) {
                  onDelete();
                }
              }}
              className="border-red-600 text-red-500 hover:bg-red-600/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </Button>
            <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
