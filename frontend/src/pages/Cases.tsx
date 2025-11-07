import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCases, createCase, deleteCase } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Trash2, ExternalLink } from 'lucide-react';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { Link } from 'react-router-dom';
import type { Case } from '@/types';

export default function Cases() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    case_number: '',
    title: '',
    description: '',
    status: 'active',
  });

  const queryClient = useQueryClient();

  const { data: cases, isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const response = await getCases();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: createCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
      setIsOpen(false);
      setFormData({ case_number: '', title: '', description: '', status: 'active' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cases'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-10">
        <div className="px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Cases</h1>
              <p className="mt-2 text-sm font-medium text-zinc-400">
                Centralized management for all legal matters
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="font-semibold text-black bg-zinc-200 hover:bg-zinc-200/90">
                  <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Case</DialogTitle>
                  <DialogDescription>
                    Add a new legal case to track meetings and insights
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="case_number">Case Number *</Label>
                    <Input
                      id="case_number"
                      value={formData.case_number}
                      onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                      placeholder="e.g., CV-2024-001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Case title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the case"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      {createMutation.isPending ? 'Creating...' : 'Create Case'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {cases && cases.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseItem: Case) => (
              <Card key={caseItem.id} className="border-zinc-800/50 bg-zinc-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-600/10 hover:border-blue-600/50 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-linear-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-shadow">
                          <FileText className="h-5 w-5 text-white" strokeWidth={2.5} />
                        </div>
                        <CardTitle className="text-lg font-bold tracking-tight text-white">{caseItem.title}</CardTitle>
                      </div>
                      <CardDescription className="mt-3 text-xs font-semibold tracking-wide uppercase text-zinc-500">
                        Case #{caseItem.case_number}
                      </CardDescription>
                    </div>
                    <Badge 
                    className={cn(getStatusColor(caseItem.status), "text-xs tracking-wide uppercase px-3 py-1.5 rounded-md bg-green-400/10 backdrop-blur-md border border-green-400/20 shadow-sm text-green-400")}>
                      {caseItem.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {caseItem.description && (
                    <p className="text-sm font-medium text-zinc-400 line-clamp-3 leading-relaxed">
                      {caseItem.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 pt-2 border-t border-zinc-800/50">
                    <span>Created {formatDate(caseItem.created_at)}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button asChild size="default" className="flex-1 bg-zinc-200 text-black hover:bg-zinc-200/90 font-semibold text-sm">
                      <Link to={`/cases/${caseItem.id}`}>
                        <ExternalLink className="h-4 w-4 mr-2" strokeWidth={2.5} />
                        View Details
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="link"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this case?')) {
                          deleteMutation.mutate(caseItem.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" strokeWidth={2.5} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 bg-zinc-900/50 border-zinc-800/50">
            <div className="text-center">
              <div className="p-4 rounded-2xl bg-zinc-800/50 inline-block mb-4">
                <FileText className="h-16 w-16 text-zinc-600" strokeWidth={1.5} />
              </div>
              <h3 className="mt-4 text-xl font-bold text-white">No cases yet</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Get started by creating your first case
              </p>
              <Button size="lg" onClick={() => setIsOpen(true)} className="mt-6 bg-zinc-200 text-black hover:bg-zinc-200/90">
                <Plus className="h-4 w-4 mr-2" />
                Create First Case
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

