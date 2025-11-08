import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Trash2, Edit, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { Task } from '@/types';

interface TaskDetailDialogProps {
  task: Task;
  isEditing: boolean;
  onEdit: () => void;
  onClose: () => void;
  onDelete: () => void;
  EditFormComponent: React.ReactNode;
}

export function TaskDetailDialog({ task, isEditing, onEdit, onClose, onDelete, EditFormComponent }: TaskDetailDialogProps) {
  return (
    <Dialog open={!!task} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <DialogTitle className="text-xl text-white flex items-center gap-2">
              <CheckCircle2
                className={cn('h-5 w-5', task.status === 'done' ? 'text-green-400' : 'text-zinc-600')}
              />
              <span className={task.status === 'done' ? 'line-through text-zinc-500' : ''}>{task.title}</span>
            </DialogTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={onEdit} className="border-zinc-700">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </DialogHeader>

        {isEditing ? (
          EditFormComponent
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Badge
                className={cn(
                  'text-xs',
                  task.priority === 'critical' && 'bg-red-600/20 text-red-400 border-red-600/30',
                  task.priority === 'high' && 'bg-orange-600/20 text-orange-400 border-orange-600/30',
                  task.priority === 'medium' && 'bg-blue-600/20 text-blue-400 border-blue-600/30',
                  task.priority === 'low' && 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30'
                )}
              >
                {task.priority.toUpperCase()}
              </Badge>
              <Badge
                className={cn(
                  'text-xs',
                  task.status === 'done' && 'bg-green-600/20 text-green-400 border-green-600/30',
                  task.status === 'in_progress' && 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
                  task.status === 'review' && 'bg-orange-600/20 text-orange-400 border-orange-600/30',
                  task.status === 'todo' && 'bg-blue-600/20 text-blue-400 border-blue-600/30'
                )}
              >
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>

            {task.description && (
              <div>
                <Label className="text-zinc-400 text-xs">Description</Label>
                <p className="text-zinc-300 text-sm mt-1">{task.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              {task.assigned_to && (
                <div>
                  <Label className="text-zinc-400 text-xs">Assigned To</Label>
                  <p className="text-zinc-300 mt-1">{task.assigned_to}</p>
                </div>
              )}
              {task.due_date && (
                <div>
                  <Label className="text-zinc-400 text-xs">Due Date</Label>
                  <p className="text-zinc-300 mt-1">{format(new Date(task.due_date), 'MMM d, yyyy h:mm a')}</p>
                </div>
              )}
              {task.estimated_hours && (
                <div>
                  <Label className="text-zinc-400 text-xs">Estimated Hours</Label>
                  <p className="text-zinc-300 mt-1">{task.estimated_hours}h</p>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-zinc-800">
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    onDelete();
                  }
                }}
                className="border-red-600 text-red-500 hover:bg-red-600/10"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Task
              </Button>
              <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700">
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
