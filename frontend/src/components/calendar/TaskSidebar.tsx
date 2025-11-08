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
    <div className="w-96 border-l border-zinc-800/50 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col relative">
      {/* Gradient Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl" />
      
      <div className="p-6 border-b border-zinc-800/50 space-y-4 relative z-10 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          
          <div>
            <h2 className="font-bold text-xl text-white">Tasks</h2>
            <p className="text-xs text-zinc-400">Manage your workflow</p>
          </div>
        </div>

        {/* Task Filters */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">View By</Label>
            <Select value={taskFilter} onValueChange={(value: any) => onTaskFilterChange(value)}>
              <SelectTrigger className="h-10 bg-zinc-900/50 border-zinc-700/50 text-sm backdrop-blur-sm shadow-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="today">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span className="font-medium">Due Today</span>
                  </div>
                </SelectItem>
                <SelectItem value="due-date">
                  <div className="flex items-center gap-2">
                    <span>📆</span>
                    <span className="font-medium">Sort by Due Date</span>
                  </div>
                </SelectItem>
                <SelectItem value="priority">
                  <div className="flex items-center gap-2">
                    <span>🔥</span>
                    <span className="font-medium">Sort by Priority</span>
                  </div>
                </SelectItem>
                <SelectItem value="all">
                  <div className="flex items-center gap-2">
                    <span>📋</span>
                    <span className="font-medium">All Tasks</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Status Filter</Label>
            <Select value={taskStatusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger className="h-10 bg-zinc-900/50 border-zinc-700/50 text-sm backdrop-blur-sm shadow-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-zinc-900 border-zinc-800">
                <SelectItem value="all">✨ All Status</SelectItem>
                <SelectItem value="todo">📝 To Do</SelectItem>
                <SelectItem value="in_progress">⚡ In Progress</SelectItem>
                <SelectItem value="review">👀 Review</SelectItem>
                <SelectItem value="done">✅ Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 relative z-10">
        <TaskList
          tasks={tasks}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onTaskClick={onTaskClick}
          filter={taskFilter}
          statusFilter={taskStatusFilter}
        />
      </div>
    </div>
  );
}
