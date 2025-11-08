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
      <DialogContent className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 border-zinc-800/50 max-w-2xl backdrop-blur-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-3 text-xl">
            <div className="w-4 h-4 rounded-full shadow-lg" style={{ backgroundColor: event.color }} />
            <span className="font-bold">{event.title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-3 text-sm bg-zinc-900/50 backdrop-blur-sm p-4 rounded-lg border border-zinc-800/50">
            <div className="flex items-center gap-3 text-zinc-200">
              <div className="p-2 rounded-lg bg-blue-600/10 border border-blue-600/20">
                <Clock className="h-4 w-4 text-blue-400" />
              </div>
              <span className="font-medium">
                {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleTimeString()}
              </span>
            </div>
            {event.location && (
              <div className="flex items-center gap-3 text-zinc-200">
                <div className="p-2 rounded-lg bg-purple-600/10 border border-purple-600/20">
                  <MapPin className="h-4 w-4 text-purple-400" />
                </div>
                <span className="font-medium">{event.location}</span>
              </div>
            )}
            {event.case_id && (
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => (window.location.href = `/cases/${event.case_id}`)}
                  className="border-blue-600/50 text-blue-400 hover:bg-blue-600/10 bg-blue-950/20 backdrop-blur-sm"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View Case Details
                </Button>
              </div>
            )}
            {event.description && (
              <div className="pt-3 border-t border-zinc-800/50">
                <p className="text-zinc-300 leading-relaxed">{event.description}</p>
              </div>
            )}
          </div>

          {tasks.length > 0 && (
            <div className="border-t border-zinc-800/50 pt-6">
              <h4 className="font-bold text-white mb-4 flex items-center gap-3 text-lg">
                <div className="p-2 rounded-lg bg-green-600/10 border border-green-600/20">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
                <span>Related Tasks ({tasks.length})</span>
              </h4>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <Card key={task.id} className="border-zinc-800/50 bg-zinc-900/30 hover:bg-zinc-900/60 transition-all duration-200 backdrop-blur-sm hover:border-zinc-700/50 hover:shadow-lg">
                    <CardContent className="p-4">
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

          <div className="flex justify-between pt-6 border-t border-zinc-800/50">
            <Button
              variant="outline"
              onClick={() => {
                if (confirm('Are you sure you want to delete this event?')) {
                  onDelete();
                }
              }}
              className="border-red-600/50 text-red-400 hover:bg-red-600/10 bg-red-950/20 backdrop-blur-sm shadow-lg"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Event
            </Button>
            <Button onClick={onClose} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
