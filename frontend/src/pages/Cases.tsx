import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCases,
  createCase,
  deleteCase,
  uploadCaseDocument,
} from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Trash2, ExternalLink, X } from "lucide-react";
import { cn, formatDate, getStatusColor } from "@/lib/utils";
import { Link } from "react-router-dom";
import type { Case } from "@/types";

export default function Cases() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    case_number: "",
    title: "",
    description: "",
    client_side: "",
    status: "active",
  });
  const [caseFiles, setCaseFiles] = useState<File[]>([]);

  const queryClient = useQueryClient();

  const { data: cases, isLoading } = useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const response = await getCases();
      return response.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await createCase(data);
      return response.data;
    },
    onSuccess: async (newCase) => {
      // Upload case documents if any
      if (caseFiles.length > 0) {
        for (const file of caseFiles) {
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", file.name.replace(/\.[^/.]+$/, "")); // Remove extension
            formData.append(
              "description",
              `Initial case document: ${file.name}`
            );
            await uploadCaseDocument(newCase.id, formData);
          } catch (error) {
            console.error("Failed to upload document:", file.name, error);
          }
        }
      }

      queryClient.invalidateQueries({ queryKey: ["cases"] });
      setIsOpen(false);
      setFormData({
        case_number: "",
        title: "",
        description: "",
        client_side: "",
        status: "active",
      });
      setCaseFiles([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCase,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-b-3 border-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl shadow-blue-900/50"></div>
          <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-10">
        {/* Glowing Orbs behind header */}
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/3 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>

        <div className="px-8 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-3">
                Legal Cases
              </h1>
              <p className="text-base font-semibold text-zinc-300">
                Centralized management for all legal matters
              </p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-900/50 transition-all duration-200 px-6">
                  <Plus className="h-5 w-5 mr-2" strokeWidth={2.5} />
                  New Case
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-zinc-900/95 backdrop-blur-xl border-zinc-800/50">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Create New Case
                  </DialogTitle>
                  <DialogDescription className="text-base text-zinc-400 font-medium">
                    Add a new legal case with initial documents and context
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="case_number"
                      className="text-sm font-semibold text-zinc-300"
                    >
                      Case Number *
                    </Label>
                    <Input
                      id="case_number"
                      value={formData.case_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          case_number: e.target.value,
                        })
                      }
                      placeholder="e.g., CV-2024-001"
                      className="bg-zinc-950/50 border-zinc-800/50 focus:border-blue-600/50 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="title"
                      className="text-sm font-semibold text-zinc-300"
                    >
                      Title *
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Case title"
                      className="bg-zinc-950/50 border-zinc-800/50 focus:border-blue-600/50 font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="client_side"
                      className="text-sm font-semibold text-zinc-300"
                    >
                      Your Client's Side *
                    </Label>
                    <Select
                      value={formData.client_side}
                      onValueChange={(value) =>
                        setFormData({ ...formData, client_side: value })
                      }
                      required
                    >
                      <SelectTrigger
                        id="client_side"
                        className="bg-zinc-950/50 border-zinc-800/50 font-medium"
                      >
                        <SelectValue placeholder="Select which side you represent" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="plaintiff">Plaintiff</SelectItem>
                        <SelectItem value="defendant">Defendant</SelectItem>
                        <SelectItem value="petitioner">Petitioner</SelectItem>
                        <SelectItem value="respondent">Respondent</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs font-medium text-zinc-500">
                      This helps the AI understand your legal position
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="description"
                      className="text-sm font-semibold text-zinc-300"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of the case"
                      className="bg-zinc-950/50 border-zinc-800/50 focus:border-blue-600/50 font-medium"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="case_files"
                      className="text-sm font-semibold text-zinc-300"
                    >
                      Case Documents (Optional)
                    </Label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          id="case_files"
                          type="file"
                          multiple
                          accept=".pdf,.docx,.doc,.txt"
                          onChange={(e) => {
                            if (e.target.files) {
                              setCaseFiles(Array.from(e.target.files));
                            }
                          }}
                          className="bg-zinc-950/50 border-zinc-800/50 file:mr-4 file:px-5 file:py-2.5 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-blue-600 file:to-purple-600 file:text-white hover:file:from-blue-700 hover:file:to-purple-700 file:transition-all file:duration-200 file:shadow-lg file:shadow-blue-900/50"
                        />
                      </div>
                      {caseFiles.length > 0 && (
                        <div className="space-y-3">
                          <p className="text-xs font-semibold text-zinc-400">
                            Selected files:
                          </p>
                          <div className="space-y-2">
                            {caseFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-zinc-950/50 backdrop-blur-sm border border-zinc-800/50 rounded-lg px-4 py-3 hover:border-blue-600/30 transition-all duration-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
                                    <FileText className="h-4 w-4 text-white" />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-300">
                                      {file.name}
                                    </span>
                                    <span className="text-xs font-medium text-zinc-500">
                                      {(file.size / 1024).toFixed(1)} KB
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400"
                                  onClick={() => {
                                    setCaseFiles(
                                      caseFiles.filter((_, i) => i !== index)
                                    );
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className="text-xs font-medium text-zinc-500">
                        Upload initial case documents (PDF, DOCX, TXT). These
                        will be used for AI context.
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsOpen(false)}
                      className="font-semibold border-zinc-700/50 hover:bg-zinc-800/50 hover:border-zinc-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createMutation.isPending}
                      className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 px-6"
                    >
                      {createMutation.isPending ? "Creating..." : "Create Case"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 relative z-10">
        {cases && cases.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cases.map((caseItem: Case) => (
              <Card
                key={caseItem.id}
                className="border-zinc-800/50 bg-zinc-900/30 group overflow-hidden relative"
              >
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0"></div>

                <CardHeader className="pb-5 relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-white/10 backdrop-blur-sm">
                          <FileText
                            className="h-5 w-5 text-indigo-400"
                            strokeWidth={1.5}
                          />
                        </div>
                        <CardTitle className="text-lg font-semibold tracking-tight text-white  line-clamp-2">
                          {caseItem.title}
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs font-bold tracking-wider uppercase text-zinc-500 pl-14">
                        Case #{caseItem.case_number}
                      </CardDescription>
                    </div>
                    <Badge
                      className={cn(
                        getStatusColor(caseItem.status),
                        "text-xs font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg bg-green-400/10 backdrop-blur-md border border-green-400/30 shadow-lg shadow-green-900/30 text-green-400"
                      )}
                    >
                      {caseItem.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5 relative z-10">
                  {caseItem.description && (
                    <p className="text-sm font-medium text-zinc-400 line-clamp-3 leading-relaxed">
                      {caseItem.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 pt-3 border-t border-zinc-800/50">
                    <span>Created {formatDate(caseItem.created_at)}</span>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <Button
                      asChild
                      size="default"
                      className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-100 font-semibold text-sm border border-zinc-700 rounded-md shadow-md shadow-black/10 transition-all duration-200"
                    >
                      <Link to={`/cases/${caseItem.id}`}>
                        <ExternalLink
                          className="h-4 w-4 mr-2"
                          strokeWidth={2.5}
                        />
                        View Details
                      </Link>
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      className="border-red-400/30 hover:bg-red-500/10 hover:border-red-400/50 transition-all duration-200"
                      onClick={() => {
                        if (
                          confirm("Are you sure you want to delete this case?")
                        ) {
                          deleteMutation.mutate(caseItem.id);
                        }
                      }}
                    >
                      <Trash2
                        className="h-4 w-4 text-red-400"
                        strokeWidth={2.5}
                      />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-16 bg-zinc-900/30 backdrop-blur-sm border-zinc-800/50 relative overflow-hidden">
            {/* Gradient orb in empty state */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

            <div className="text-center relative z-10">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 inline-block mb-6 shadow-2xl shadow-blue-900/50 relative">
                <FileText className="h-20 w-20 text-white" strokeWidth={2} />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-xl animate-pulse"></div>
              </div>
              <h3 className="mt-6 text-2xl font-bold text-white">
                No cases yet
              </h3>
              <p className="mt-3 text-base font-medium text-zinc-400 max-w-md mx-auto">
                Get started by creating your first legal case and let AI assist
                you throughout the process
              </p>
              <Button
                size="lg"
                onClick={() => setIsOpen(true)}
                className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-2xl shadow-blue-900/50 hover:shadow-blue-900/70 transition-all duration-200 px-8"
              >
                <Plus className="h-5 w-5 mr-2" strokeWidth={2.5} />
                Create First Case
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
