import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText } from 'lucide-react';

interface MinutesViewDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  minutes: string;
}

export function MinutesViewDialog({ isOpen, onOpenChange, title, minutes }: MinutesViewDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-zinc-950 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-600/10">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            Meeting Minutes
          </DialogTitle>
          <DialogDescription className="text-zinc-400">{title}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-6">
          <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{minutes}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
