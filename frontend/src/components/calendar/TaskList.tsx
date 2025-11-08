import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Clock, Trash2, CheckCircle2, Circle, AlertCircle, Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types';

const TASK_STATUSES = [
  { value: 'todo', label: 'To Do', icon: Circle },
  { value: 'in_progress', label: 'In Progress', icon: Clock },
  { value: 'review', label: 'Review', icon: AlertCircle },
  { value: 'done', label: 'Done', icon: CheckCircle2 },
];

interface TaskListProps {
  tasks: Task[];
  onUpdateTask: (id: number, data: any) => void;
  onDeleteTask: (id: number) => void;
  onTaskClick?: (task: Task) => void;
  filter: 'all' | 'today' | 'due-date' | 'priority';
  statusFilter: string;
}

export function TaskList({
  tasks,
  onUpdateTask,
  onDeleteTask,
  onTaskClick,
  filter,
  statusFilter,
}: TaskListProps) {
  // Filter tasks based on selected filters
  const getFilteredTasks = () => {
    let filtered = [...tasks];

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((t: Task) => t.status === statusFilter);
    }

    // Apply view filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filter) {
      case 'today':
        // Show tasks due today that are not done
        filtered = filtered.filter((t: Task) => {
          if (!t.due_date || t.status === 'done') return false;
          const dueDate = new Date(t.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
        // Sort by priority
        filtered.sort((a: Task, b: Task) => {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return (
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 999) -
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 999)
          );
        });
        break;

      case 'due-date':
        // Sort by due date (earliest first)
        filtered = filtered.filter((t: Task) => t.due_date);
        filtered.sort((a: Task, b: Task) => {
          const dateA = new Date(a.due_date!).getTime();
          const dateB = new Date(b.due_date!).getTime();
          return dateA - dateB;
        });
        break;

      case 'priority':
        // Sort by priority (critical first)
        filtered.sort((a: Task, b: Task) => {
          const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return (
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 999) -
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 999)
          );
        });
        break;

      case 'all':
      default:
        // Group by status
        break;
    }

    return filtered;
  };

  const filteredTasks = getFilteredTasks();

  const groupedTasks = {
    todo: filteredTasks.filter((t: Task) => t.status === 'todo'),
    in_progress: filteredTasks.filter((t: Task) => t.status === 'in_progress'),
    review: filteredTasks.filter((t: Task) => t.status === 'review'),
    done: filteredTasks.filter((t: Task) => t.status === 'done'),
  };

  const renderTask = (task: Task) => {
    const currentStatusInfo = TASK_STATUSES.find((s) => s.value === task.status);

    return (
      <Card
        key={task.id}
        className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 transition-colors group cursor-pointer"
        onClick={() => onTaskClick && onTaskClick(task)}
      >
        <CardContent className="p-3">
          <div className="flex items-start gap-3">
            {/* Status Dropdown */}
            <Select value={task.status} onValueChange={(value) => onUpdateTask(task.id, { status: value })}>
              <SelectTrigger className="w-[140px] h-8 bg-zinc-800/50 border-zinc-700 text-xs">
                <div className="flex items-center gap-2">
                  {currentStatusInfo && <currentStatusInfo.icon className="h-3.5 w-3.5" />}
                  <span>{currentStatusInfo?.label}</span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                {TASK_STATUSES.map((status) => {
                  const Icon = status.icon;
                  return (
                    <SelectItem key={status.value} value={status.value} className="text-sm cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={cn(
                            'h-4 w-4',
                            status.value === 'done' && 'text-green-500',
                            status.value === 'in_progress' && 'text-blue-500',
                            status.value === 'review' && 'text-orange-500',
                            status.value === 'todo' && 'text-zinc-500'
                          )}
                        />
                        <span>{status.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white truncate">{task.title}</h4>
              {task.description && <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{task.description}</p>}
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge
                  className={cn(
                    'text-xs font-semibold rounded-md',
                    task.priority === 'critical' && 'bg-red-500/10 text-red-400 border border-red-500/20',
                    task.priority === 'high' && 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
                    task.priority === 'medium' && 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
                    task.priority === 'low' && 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                  )}
                >
                  {task.priority}
                </Badge>
                {task.due_date && (
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(task.due_date).toLocaleDateString()}
                  </span>
                )}
                {task.assigned_to && <span className="text-xs text-zinc-500">{task.assigned_to}</span>}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this task?')) {
                  onDeleteTask(task.id);
                }
              }}
              className="shrink-0 p-1.5 rounded-md text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render based on filter type
  const renderFilteredView = () => {
    if (filter === 'all') {
      // Group by status
      const groups = Object.entries(groupedTasks)
        .map(([status, statusTasks]) => {
          const statusInfo = TASK_STATUSES.find((s) => s.value === status);
          if ((statusTasks as Task[]).length === 0) return null;

          const getStatusColor = (statusValue: string) => {
            switch (statusValue) {
              case 'done':
                return 'text-green-400';
              case 'in_progress':
                return 'text-blue-400';
              case 'review':
                return 'text-orange-400';
              case 'todo':
                return 'text-zinc-400';
              default:
                return 'text-zinc-400';
            }
          };

          return (
            <div key={status} className="space-y-2">
              <h3 className={cn('text-xs font-semibold mb-2 flex items-center gap-2', getStatusColor(status))}>
                {statusInfo && <statusInfo.icon className="h-4 w-4" />}
                {statusInfo?.label} ({(statusTasks as Task[]).length})
              </h3>
              <div className="space-y-2">{(statusTasks as Task[]).map(renderTask)}</div>
            </div>
          );
        })
        .filter(Boolean);

      return <>{groups}</>;
    } else {
      // Flat list with optional headers
      if (filteredTasks.length === 0) return null;

      const getHeader = () => {
        if (filter === 'today') {
          return (
            <h3 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Due Today ({filteredTasks.length})
            </h3>
          );
        } else if (filter === 'due-date') {
          return (
            <h3 className="text-sm font-semibold text-blue-400 mb-3 flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Sorted by Due Date ({filteredTasks.length})
            </h3>
          );
        } else if (filter === 'priority') {
          return (
            <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Sorted by Priority ({filteredTasks.length})
            </h3>
          );
        }
      };

      return (
        <div className="space-y-2">
          {getHeader()}
          <div className="space-y-2">{filteredTasks.map(renderTask)}</div>
        </div>
      );
    }
  };

  if (filteredTasks.length === 0) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="h-12 w-12 text-zinc-600 mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-zinc-500 text-sm">{filter === 'today' ? 'No tasks due today' : 'No tasks match the filter'}</p>
        <p className="text-zinc-600 text-xs mt-1">
          {filter === 'today' && statusFilter === 'all' ? '(Excluding completed tasks)' : ''}
        </p>
      </div>
    );
  }

  return <div className="space-y-4">{renderFilteredView()}</div>;
}
