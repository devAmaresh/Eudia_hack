import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2 } from 'lucide-react';
import { TaskList } from './TaskList';
import type { Task } from '@/types';

interface TaskSidebarProps {
  tasks: Task[];
  taskFilter: 'all' | 'today' | 'due-date' | 'priority';
  taskStatusFilter: string;
  onTaskFilterChange: (filter: 'all' | 'today' | 'due-date' | 'priority') => void;
  onStatusFilterChange: (status: string) => void;
  onUpdateTask: (id: number, data: any) => void;
  onDeleteTask: (id: number) => void;
  onTaskClick: (task: Task) => void;
}

export function TaskSidebar({
  tasks,
  taskFilter,
  taskStatusFilter,
  onTaskFilterChange,
  onStatusFilterChange,
  onUpdateTask,
  onDeleteTask,
  onTaskClick,
}: TaskSidebarProps) {
  return (
    <div className="w-96 border-l border-zinc-800 bg-zinc-950/50 flex flex-col">
      <div className="p-4 border-b border-zinc-800 space-y-3">
        <h2 className="font-semibold text-white flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Tasks
        </h2>

        {/* Task Filters */}
        <div className="space-y-2">
          <Label className="text-xs text-zinc-400">View</Label>
          <Select value={taskFilter} onValueChange={(value: any) => onTaskFilterChange(value)}>
            <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="today">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>Due Today</span>
                </div>
              </SelectItem>
              <SelectItem value="due-date">
                <div className="flex items-center gap-2">
                  <span>📆</span>
                  <span>Sort by Due Date</span>
                </div>
              </SelectItem>
              <SelectItem value="priority">
                <div className="flex items-center gap-2">
                  <span>🔥</span>
                  <span>Sort by Priority</span>
                </div>
              </SelectItem>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <span>📋</span>
                  <span>All Tasks</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Label className="text-xs text-zinc-400">Status</Label>
          <Select value={taskStatusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="h-9 bg-zinc-900 border-zinc-800 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <TaskList
          tasks={tasks}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onTaskClick={onTaskClick}
          filter={taskFilter}
          statusFilter={taskStatusFilter}
        />
      </ScrollArea>
    </div>
  );
}
