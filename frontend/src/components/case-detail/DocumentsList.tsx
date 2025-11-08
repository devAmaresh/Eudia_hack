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
      <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm shadow-2xl">
        <CardContent className="flex flex-col items-center justify-center p-16 text-center">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 inline-block mb-5 shadow-lg">
            <FileText className="h-14 w-14 text-white" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">No documents yet</h3>
          <p className="text-sm text-zinc-400 mb-6 max-w-md">Upload case documents to provide context for AI analysis and enhance insights</p>
          <Button onClick={onAddDocument} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            Add First Document
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {documents.map((doc: CaseDocument) => (
        <Card key={doc.id} className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-200 hover:border-zinc-700/50">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/50">
                  <FileText className="h-6 w-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white truncate">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-xs text-zinc-400 mt-2 line-clamp-2 font-medium">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-zinc-500">
                    <span className="uppercase font-bold bg-zinc-800/50 px-2 py-1 rounded-lg">{doc.file_type}</span>
                    <span>•</span>
                    <span className="font-semibold">{(doc.file_size / 1024).toFixed(1)} KB</span>
                    <span>•</span>
                    <span className="font-semibold">{formatDate(doc.uploaded_at)}</span>
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
