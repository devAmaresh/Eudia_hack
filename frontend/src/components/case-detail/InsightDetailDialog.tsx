import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Clock, Calendar } from 'lucide-react';
import { formatDate, getSeverityColor, cn } from '@/lib/utils';
import type { Insight } from '@/types';

interface InsightDetailDialogProps {
  insight: Insight | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InsightDetailDialog({ insight, isOpen, onOpenChange }: InsightDetailDialogProps) {
  if (!insight) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 shadow-2xl max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-2">
                {insight.title}
              </DialogTitle>
              <p className="text-sm font-medium text-zinc-400">Detailed insight information</p>
            </div>
            <Badge
              className={cn(
                getSeverityColor(insight.severity),
                'text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-lg shadow-xl'
              )}
            >
              {insight.severity}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Type</label>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
              <p className="text-base font-bold text-blue-400 tracking-tight">
                {insight.type
                  .replace(/_/g, ' ')
                  .split(' ')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                  .join(' ')}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Description</label>
            <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
              <p className="text-sm text-zinc-300 leading-relaxed">{insight.description}</p>
            </div>
          </div>

          {/* Timestamp if available */}
          {insight.timestamp && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Timestamp</label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-500" />
                <p className="text-sm text-zinc-400">{insight.timestamp}</p>
              </div>
            </div>
          )}

          {/* Created At */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Created</label>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-zinc-500" />
              <p className="text-sm text-zinc-400">{formatDate(insight.created_at)}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
