import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { FileText, MoreVertical, Trash2, Plus } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { CaseDocument } from '@/types';

interface DocumentsListProps {
  documents: CaseDocument[];
  onDelete: (documentId: number, documentTitle: string) => void;
  onAddDocument: () => void;
}

export function DocumentsList({ documents, onDelete, onAddDocument }: DocumentsListProps) {
  if (!documents || documents.length === 0) {
    return (
      <Card className="border-zinc-800/80 bg-zinc-950">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="p-4 rounded-2xl bg-zinc-900/50 inline-block mb-4">
            <FileText className="h-12 w-12 text-zinc-600" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No documents yet</h3>
          <p className="text-sm text-zinc-500 mb-4">Upload case documents to provide context for AI analysis</p>
          <Button onClick={onAddDocument} className="bg-zinc-800 hover:bg-zinc-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add First Document
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {documents.map((doc: CaseDocument) => (
        <Card key={doc.id} className="border-zinc-800/80 bg-zinc-950 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2.5 rounded-xl bg-blue-600/10 shadow-lg">
                  <FileText className="h-5 w-5 text-blue-400" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white truncate">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                    <span className="uppercase font-semibold">{doc.file_type}</span>
                    <span>•</span>
                    <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span>{formatDate(doc.uploaded_at)}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4 text-zinc-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                  <DropdownMenuLabel className="text-zinc-400">Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete "${doc.title}"?`)) {
                        onDelete(doc.id, doc.title);
                      }
                    }}
                    className="text-red-400 focus:text-red-400 focus:bg-red-400/10"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
