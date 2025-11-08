import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckSquare,
  Clock,
  Calendar,
  CheckCircle,
  ChevronUp,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { formatDate, getSeverityColor, getStatusColor, cn } from '@/lib/utils';
import type { ActionItem } from '@/types';

interface ActionItemsListProps {
  actionItems: ActionItem[];
  onUpdateStatus: (itemId: number, status: 'pending' | 'in_progress' | 'completed') => void;
  onUpdatePriority: (itemId: number, priority: 'low' | 'medium' | 'high') => void;
  onDelete: (itemId: number, itemTitle: string) => void;
}

export function ActionItemsList({
  actionItems,
  onUpdateStatus,
  onUpdatePriority,
  onDelete,
}: ActionItemsListProps) {
  if (!actionItems || actionItems.length === 0) {
    return (
      <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm shadow-2xl">
        <CardContent className="text-center py-16">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 inline-block mb-4 shadow-lg">
            <CheckSquare className="h-16 w-16 text-zinc-400 mx-auto" strokeWidth={2} />
          </div>
          <p className="text-base font-semibold text-zinc-400">No action items yet</p>
          <p className="text-sm text-zinc-500 mt-2">Action items will appear here when meetings are analyzed</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-h-[100vh] overflow-y-auto">
      {actionItems.map((item: ActionItem) => (
        <Card key={item.id} className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-200 hover:border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={cn(
                    'p-3 rounded-xl shadow-lg',
                    item.status === 'completed'
                      ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 shadow-emerald-900/50'
                      : item.status === 'in_progress'
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-900/50'
                      : 'bg-gradient-to-br from-zinc-700 to-zinc-800 shadow-zinc-900/50'
                  )}
                >
                  {item.status === 'completed' ? (
                    <CheckCircle className="h-5 w-5 text-white" strokeWidth={2.5} />
                  ) : (
                    <Clock className="h-5 w-5 text-white" strokeWidth={2.5} />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-base text-white tracking-tight mb-2">{item.description}</h3>
                  {item.due_date && (
                    <p className="text-xs font-semibold text-zinc-500 tracking-wide flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" />
                      Due: {formatDate(item.due_date)}
                    </p>
                  )}
                  {item.assigned_to && (
                    <p className="text-xs text-zinc-500 mt-1">Assigned to: {item.assigned_to}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <Badge
                    className={cn(
                      getSeverityColor(item.priority),
                      'text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md transition-all duration-300'
                    )}
                  >
                    {item.priority}
                  </Badge>
                  <Badge
                    className={cn(
                      getStatusColor(item.status),
                      'text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md transition-all duration-300'
                    )}
                  >
                    {item.status.replace('_', ' ')}
                  </Badge>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-zinc-400 hover:text-white hover:bg-zinc-800"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-zinc-900 border-zinc-800">
                    <DropdownMenuLabel className="text-zinc-400 text-xs">Change Status</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(item.id, 'pending')}
                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(item.id, 'in_progress')}
                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                    >
                      <ChevronUp className="h-4 w-4 mr-2" />
                      In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdateStatus(item.id, 'completed')}
                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completed
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-zinc-800" />

                    <DropdownMenuLabel className="text-zinc-400 text-xs">Change Priority</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => onUpdatePriority(item.id, 'low')}
                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                    >
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                      Low
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdatePriority(item.id, 'medium')}
                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                    >
                      <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                      Medium
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onUpdatePriority(item.id, 'high')}
                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                    >
                      <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                      High
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-zinc-800" />

                    <DropdownMenuItem
                      onClick={() => onDelete(item.id, item.description)}
                      className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
