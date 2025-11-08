import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

interface UploadDocumentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  documentTitle: string;
  setDocumentTitle: (title: string) => void;
  documentDescription: string;
  setDocumentDescription: (description: string) => void;
  documentFile: File | null;
  setDocumentFile: (file: File | null) => void;
  onUpload: () => void;
  isUploading: boolean;
}

export function UploadDocumentDialog({
  isOpen,
  onOpenChange,
  documentTitle,
  setDocumentTitle,
  documentDescription,
  setDocumentDescription,
  documentFile,
  setDocumentFile,
  onUpload,
  isUploading,
}: UploadDocumentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg font-semibold text-sm h-10 px-5">
          <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
          Add Document
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-zinc-950 border-zinc-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight text-white">
            Upload Case Document
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-zinc-400">
            Add documents (PDF, DOCX, TXT) to the case context for AI analysis
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">Document Title</Label>
            <Input
              value={documentTitle}
              onChange={(e) => setDocumentTitle(e.target.value)}
              placeholder="e.g., Complaint Document"
              className="border-zinc-800 focus:border-zinc-700 h-11"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">Description (Optional)</Label>
            <Textarea
              value={documentDescription}
              onChange={(e) => setDocumentDescription(e.target.value)}
              placeholder="Brief description of the document"
              className="border-zinc-800 focus:border-zinc-700"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-white">File</Label>
            <Input
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setDocumentFile(file);
                if (file && !documentTitle) {
                  setDocumentTitle(file.name.replace(/\.[^/.]+$/, ''));
                }
              }}
              className="border-zinc-800 focus:border-zinc-700 h-11"
            />
            <p className="text-xs text-zinc-500 font-medium">Supported: PDF, DOCX, TXT (max 50MB)</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <Button
            onClick={() => {
              onOpenChange(false);
              setDocumentFile(null);
              setDocumentTitle('');
              setDocumentDescription('');
            }}
            className="bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-900 h-11 px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={onUpload}
            disabled={!documentFile || !documentTitle || isUploading}
            className="bg-white text-black hover:bg-white/90 shadow-lg h-11 px-6"
          >
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
