import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Upload } from 'lucide-react';

interface UploadMeetingDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  meetingTitle: string;
  setMeetingTitle: (title: string) => void;
  meetingDate: string;
  setMeetingDate: (date: string) => void;
  file: File | null;
  setFile: (file: File | null) => void;
  onUpload: () => void;
  isUploading: boolean;
}

export function UploadMeetingDialog({
  isOpen,
  onOpenChange,
  meetingTitle,
  setMeetingTitle,
  meetingDate,
  setMeetingDate,
  file,
  setFile,
  onUpload,
  isUploading,
}: UploadMeetingDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg shadow-zinc-900/25 font-semibold text-sm h-11 px-6 transition-all">
          <Upload className="h-4 w-4 mr-2" strokeWidth={2.5} />
          Upload Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            Upload Meeting Transcript
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-zinc-400">
            Upload an audio file (.mp3) or transcript (.txt) for AI analysis
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">Meeting Title</Label>
            <Input
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="e.g., Initial Consultation"
              className="border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">Meeting Date & Time</Label>
            <Input
              type="datetime-local"
              value={meetingDate}
              onChange={(e) => setMeetingDate(e.target.value)}
              className="border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900 h-11"
            />
            <p className="text-xs text-zinc-500 font-medium">
              When did/will this meeting occur? This will appear on your calendar.
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">File</Label>
            <Input
              type="file"
              accept=".mp3,.txt"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900 h-11"
            />
            <p className="text-xs text-zinc-500 font-medium">Supported: MP3, TXT (max 50MB)</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-900 h-11 px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={onUpload}
            disabled={!file || !meetingTitle || isUploading}
            className="bg-white text-black hover:bg-white/90 shadow-lg h-11 px-6"
          >
            {isUploading ? 'Uploading...' : 'Upload & Analyze'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
