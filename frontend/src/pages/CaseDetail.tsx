import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCase,
  getCaseMeetings,
  getCaseActionItems,
  uploadMeeting,
  getMeetingInsights,
  deleteMeeting,
  sendChatMessage,
  updateActionItem,
  deleteActionItem,
  uploadCaseDocument,
  getCaseDocuments,
  deleteCaseDocument,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatMessage } from "@/components/ChatMessage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Upload,
  FileText,
  Calendar,
  Clock,
  Lightbulb,
  CheckSquare,
  ArrowLeft,
  Trash2,
  Send,
  Bot,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  MoreVertical,
  Mail,
  Plus,
  Info,
  Globe,
  Scale,
} from "lucide-react";
import {
  formatDate,
  getSeverityColor,
  getStatusColor,
  cn,
} from "@/lib/utils";
import type { Meeting, Insight, ActionItem, CaseDocument } from "@/types";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  sources?: string[];
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const caseId = parseInt(id || "0");
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("");
  const [expandedMeetings, setExpandedMeetings] = useState<Set<number>>(
    new Set()
  );
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentDescription, setDocumentDescription] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  const { data: caseData } = useQuery({
    queryKey: ["case", caseId],
    queryFn: async () => {
      const response = await getCase(caseId);
      return response.data;
    },
  });

  const { data: meetings } = useQuery({
    queryKey: ["meetings", caseId],
    queryFn: async () => {
      const response = await getCaseMeetings(caseId);
      return response.data;
    },
  });

  const { data: actionItems } = useQuery({
    queryKey: ["actionItems", caseId],
    queryFn: async () => {
      const response = await getCaseActionItems(caseId);
      return response.data;
    },
  });

  const { data: caseDocuments } = useQuery({
    queryKey: ["caseDocuments", caseId],
    queryFn: async () => {
      const response = await getCaseDocuments(caseId);
      return response.data;
    },
  });

  // Fetch insights for all meetings
  const meetingIds = meetings?.map((m: Meeting) => m.id) || [];
  const insightsQueries = useQuery({
    queryKey: ["allInsights", meetingIds],
    queryFn: async () => {
      if (!meetingIds.length) return {};
      const results: Record<number, Insight[]> = {};
      for (const meetingId of meetingIds) {
        const response = await getMeetingInsights(meetingId);
        results[meetingId] = response.data;
      }
      return results;
    },
    enabled: meetingIds.length > 0,
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return uploadMeeting(caseId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings", caseId] });
      setIsOpen(false);
      setFile(null);
      setMeetingTitle("");
    },
  });



  const deleteMeetingMutation = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings", caseId] });
    },
  });

  const updateActionItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ActionItem> }) =>
      updateActionItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actionItems", caseId] });
    },
  });

  const deleteActionItemMutation = useMutation({
    mutationFn: deleteActionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actionItems", caseId] });
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async () => {
      if (!documentFile) throw new Error("No file selected");
      const formData = new FormData();
      formData.append("file", documentFile);
      formData.append("title", documentTitle);
      formData.append("description", documentDescription);
      return uploadCaseDocument(caseId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseDocuments", caseId] });
      setIsDocumentDialogOpen(false);
      setDocumentFile(null);
      setDocumentTitle("");
      setDocumentDescription("");
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteCaseDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caseDocuments", caseId] });
    },
  });

  const handleUpload = async () => {
    if (!file || !meetingTitle) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", meetingTitle);
    uploadMutation.mutate(formData);
  };


  const handleDeleteMeeting = (
    meetingId: number,
    meetingTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to delete "${meetingTitle}"? This will also delete all associated insights and action items.`
      )
    ) {
      deleteMeetingMutation.mutate(meetingId);
    }
  };

  const toggleMeeting = (meetingId: number) => {
    setExpandedMeetings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(meetingId)) {
        newSet.delete(meetingId);
      } else {
        newSet.add(meetingId);
      }
      return newSet;
    });
  };

  const handleUpdateActionItemStatus = (
    itemId: number,
    status: "pending" | "in_progress" | "completed"
  ) => {
    updateActionItemMutation.mutate({
      id: itemId,
      data: { status },
    });
  };

  const handleUpdateActionItemPriority = (
    itemId: number,
    priority: "low" | "medium" | "high"
  ) => {
    updateActionItemMutation.mutate({
      id: itemId,
      data: { priority },
    });
  };

  const handleDeleteActionItem = (itemId: number, itemTitle: string) => {
    if (confirm(`Are you sure you want to delete "${itemTitle}"?`)) {
      deleteActionItemMutation.mutate(itemId);
    }
  };

  const handleInsightClick = (insight: Insight) => {
    setSelectedInsight(insight);
    setIsInsightModalOpen(true);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    setIsChatLoading(true);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        case_id: caseId,
        session_id: chatSessionId || undefined, // Pass session_id or undefined to create new
        web_search: webSearchEnabled, // Include web search flag
      });

      // Store the session_id from response
      if (response.data.session_id) {
        setChatSessionId(response.data.session_id);
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
          timestamp: new Date(),
          sources: response.data.sources,
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleNewChat = () => {
    setChatMessages([]);
    setChatSessionId(null); // Clear session_id to start a new chat
    setChatInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-zinc-900 animate-pulse mx-auto mb-4"></div>
          <p className="text-sm font-semibold text-zinc-400">
            Loading case details...
          </p>
        </div>
      </div>
    );
  }

  const allInsights = insightsQueries.data || {};

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-800/80 sticky top-0 z-20 shadow-2xl">
        <div className="max-w-[1800px] mx-auto px-8 py-3">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="h-8 w-8 p-0">
              <Link to="/cases">
                <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold tracking-tight text-white">
                {caseData.title}
              </h1>
              <p className="mt-1 text-xs font-semibold text-zinc-500 tracking-wider uppercase">
                Case #{caseData.case_number}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  getStatusColor(caseData.status),
                  "text-xs tracking-wide uppercase px-3 py-1.5 rounded-md bg-green-400/10 backdrop-blur-md border border-green-400/20 shadow-sm text-green-400"
                )}
              >
                {caseData.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto p-8">
        <div className="flex gap-8">
          {/* Left Column - Tabs for Meetings & Action Items */}
          <div className="flex-1">
            <Tabs defaultValue="details" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 p-1 h-auto shadow-lg">
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-semibold text-sm tracking-tight px-6 py-2.5 rounded-lg text-zinc-400"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Case Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="meetings"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-semibold text-sm tracking-tight px-6 py-2.5 rounded-lg text-zinc-400"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Meeting Insights
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-semibold text-sm tracking-tight px-6 py-2.5 rounded-lg text-zinc-400"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Case Documents
                  </TabsTrigger>
                  <TabsTrigger
                    value="actions"
                    className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white font-semibold text-sm tracking-tight px-6 py-2.5 rounded-lg text-zinc-400"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Action Items
                  </TabsTrigger>
                </TabsList>

                <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                        Upload an audio file (.mp3) or transcript (.txt) for AI
                        analysis
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-5 py-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-white">
                          Meeting Title
                        </Label>
                        <Input
                          value={meetingTitle}
                          onChange={(e) => setMeetingTitle(e.target.value)}
                          placeholder="e.g., Initial Consultation"
                          className="border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-white">
                          File
                        </Label>
                        <Input
                          type="file"
                          accept=".mp3,.txt"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                          className="border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900 h-11"
                        />
                        <p className="text-xs text-zinc-500 font-medium">
                          Supported: MP3, TXT (max 50MB)
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button
                        onClick={() => setIsOpen(false)}
                        className="bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-900 h-11 px-6"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleUpload}
                        disabled={
                          !file || !meetingTitle || uploadMutation.isPending
                        }
                        className="bg-white text-black hover:bg-white/90 shadow-lg h-11 px-6"
                      >
                        {uploadMutation.isPending
                          ? "Uploading..."
                          : "Upload & Analyze"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Case Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Case Information
                  </h2>
                  
                  <Card className="border-zinc-800/80 bg-zinc-950 shadow-lg">
                    <CardContent className="p-6 space-y-6">
                      {/* Case Number and Status */}
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                            <FileText className="h-4 w-4" strokeWidth={2.5} />
                            Case Number
                          </div>
                          <p className="text-lg font-bold text-white">
                            {caseData.case_number}
                          </p>
                        </div>
                      </div>

                      {/* Client Side */}
                      {caseData.client_side && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                      
                            Client Side / Representation
                          </div>
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-base font-semibold text-white capitalize">
                                {caseData.client_side}
                              </p>
                              <p className="text-sm text-zinc-400 mt-0.5">
                                You are representing the {caseData.client_side} in this case
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 p-4 rounded-lg bg-blue-950/30 border border-blue-900/30">
                            <p className="text-sm text-blue-200 leading-relaxed">
                              <span className="font-semibold">AI Context:</span> The legal assistant will tailor responses considering your position as the {caseData.client_side}, providing strategic insights and recommendations aligned with your client's interests.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {caseData.description && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                            <FileText className="h-4 w-4" strokeWidth={2.5} />
                            Description
                          </div>
                          <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
                            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                              {caseData.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Timestamps */}
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-800/50">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                            <Calendar className="h-4 w-4" strokeWidth={2.5} />
                            Created
                          </div>
                          <p className="text-sm font-medium text-zinc-400">
                            {formatDate(caseData.created_at)}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                            <Clock className="h-4 w-4" strokeWidth={2.5} />
                            Last Updated
                          </div>
                          <p className="text-sm font-medium text-zinc-400">
                            {formatDate(caseData.updated_at)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="border-zinc-800/80 bg-zinc-950">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-purple-600/10">
                            <Lightbulb className="h-5 w-5 text-purple-400" strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">
                              {meetings?.length || 0}
                            </p>
                            <p className="text-xs font-semibold text-zinc-500 uppercase">
                              Meetings
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-zinc-800/80 bg-zinc-950">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-blue-600/10">
                            <FileText className="h-5 w-5 text-blue-400" strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">
                              {caseDocuments?.length || 0}
                            </p>
                            <p className="text-xs font-semibold text-zinc-500 uppercase">
                              Documents
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-zinc-800/80 bg-zinc-950">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-green-600/10">
                            <CheckSquare className="h-5 w-5 text-green-400" strokeWidth={2.5} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">
                              {actionItems?.length || 0}
                            </p>
                            <p className="text-xs font-semibold text-zinc-500 uppercase">
                              Action Items
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Tabs Content */}
              <TabsContent value="meetings" className="space-y-4 mt-6">
                {/* Meetings List */}
                <div className="space-y-4">
                  {meetings && meetings.length > 0 ? (
                    meetings.map((meeting: Meeting) => {
                      const isExpanded = expandedMeetings.has(meeting.id);
                      const meetingInsights = allInsights[meeting.id] || [];

                      return (
                        <Card
                          key={meeting.id}
                          className="border-zinc-800/80 bg-zinc-950 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
                        >
                          <CardHeader
                            className="cursor-pointer hover:bg-zinc-900/50 transition-colors"
                            onClick={() => toggleMeeting(meeting.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 flex-1">
                                <div className="p-3 rounded-xl bg-linear-to-br from-zinc-900 to-zinc-700 shadow-lg shadow-zinc-900/25">
                                  <Calendar
                                    className="h-5 w-5 text-white"
                                    strokeWidth={2.5}
                                  />
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-lg font-bold tracking-tight text-white">
                                    {meeting.title}
                                  </CardTitle>
                                  <CardDescription className="mt-1 text-xs font-semibold text-zinc-500 tracking-wide flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {formatDate(meeting.meeting_date)}
                                    {meetingInsights.length > 0 && (
                                      <span className="ml-3 inline-flex items-center gap-1.5">
                                        <Lightbulb className="h-3 w-3" />
                                        {meetingInsights.length} insight
                                        {meetingInsights.length !== 1 && "s"}
                                      </span>
                                    )}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/share-meeting/${meeting.id}`);
                                  }}
                                  className="bg-zinc-200 hover:bg-white/90 text-zinc-800 shadow-sm h-9 px-3"
                                >
                                  <Mail className="h-4 w-4 mr-2" strokeWidth={2.5} />
                                  Share
                                </Button>
                                <Button
                                  onClick={(e) =>
                                    handleDeleteMeeting(
                                      meeting.id,
                                      meeting.title,
                                      e
                                    )
                                  }
                                  disabled={deleteMeetingMutation.isPending}
                                  className=" text-red-500 hover:bg-zinc-900 shadow-sm h-9 w-9 p-0"
                                >
                                  <Trash2
                                    className="h-4 w-4"
                                    strokeWidth={2.5}
                                  />
                                </Button>

                                {isExpanded ? (
                                  <ChevronUp
                                    className="h-4 w-4"
                                    strokeWidth={2.5}
                                  />
                                ) : (
                                  <ChevronDown
                                    className="h-4 w-4"
                                    strokeWidth={2.5}
                                  />
                                )}
                              </div>
                            </div>
                          </CardHeader>

                          {isExpanded && (
                            <CardContent className="pt-4 pb-6 space-y-6 border-t border-zinc-800 mt-4">
                              {/* Summary */}
                              {meeting.summary && (
                                <div className="space-y-2">
                                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Summary
                                  </h3>
                                  <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50">
                                    {meeting.summary}
                                  </div>
                                </div>
                              )}

                              {/* Minutes */}
                              {meeting.minutes && (
                                <div className="space-y-2">
                                  <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                                    <CheckSquare className="h-4 w-4" />
                                    Minutes
                                  </h3>
                                  <div className="text-sm text-zinc-400 leading-relaxed bg-zinc-900/50 p-4 rounded-xl border border-zinc-800/50 max-h-64 overflow-y-auto">
                                    {meeting.minutes}
                                  </div>
                                </div>
                              )}

                              {/* Insights */}
                              {meetingInsights.length > 0 && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                                      <div className="p-1.5 rounded-lg bg-blue-600/10 backdrop-blur-sm">
                                        <Lightbulb className="h-4 w-4 text-blue-400" />
                                      </div>
                                      AI Insights
                                    </h3>
                                    <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs font-semibold px-3 py-1">
                                      {meetingInsights.length}{" "}
                                      {meetingInsights.length === 1
                                        ? "Insight"
                                        : "Insights"}
                                    </Badge>
                                  </div>

                                  <div className="rounded-2xl border border-zinc-800/60 bg-linear-to-br from-zinc-900/40 to-zinc-950/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20">
                                    <div className="max-h-128 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950">
                                      <table className="w-full">
                                        <thead className="sticky top-0 z-10">
                                          <tr className="bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80">
                                            <th className="px-6 py-4 text-left">
                                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                Type
                                              </span>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                Title
                                              </span>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                Severity
                                              </span>
                                            </th>
                                            <th className="px-6 py-4 text-left">
                                              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                                Description
                                              </span>
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-800/40">
                                          {meetingInsights.map(
                                            (insight: Insight) => (
                                              <tr
                                                key={insight.id}
                                                onClick={() =>
                                                  handleInsightClick(insight)
                                                }
                                                className="group hover:bg-zinc-900/70 transition-all duration-300 cursor-pointer"
                                              >
                                                <td className="px-6 py-4">
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-blue-400 whitespace-nowrap tracking-tight">
                                                      {insight.type
                                                        .replace(/_/g, " ")
                                                        .split(" ")
                                                        .map(
                                                          (word) =>
                                                            word
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                            word
                                                              .slice(1)
                                                              .toLowerCase()
                                                        )
                                                        .join(" ")}
                                                    </span>
                                                  </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                  <span className="text-sm text-white font-semibold leading-snug line-clamp-2">
                                                    {insight.title}
                                                  </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                  <Badge
                                                    className={cn(
                                                      getSeverityColor(
                                                        insight.severity
                                                      ),
                                                      "text-xs tracking-wider rounded-lg"
                                                    )}
                                                  >
                                                    {insight.severity}
                                                  </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                  <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                                                    {insight.description}
                                                  </p>
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          )}
                        </Card>
                      );
                    })
                  ) : (
                    <Card className="border-zinc-800/80 bg-zinc-900/50 shadow-lg">
                      <CardContent className="text-center py-16">
                        <FileText
                          className="h-20 w-20 text-zinc-600 mx-auto mb-4"
                          strokeWidth={1.5}
                        />
                        <h3 className="font-bold text-white text-lg mb-2">
                          No meetings yet
                        </h3>
                        <p className="text-sm text-zinc-500">
                          Upload a meeting transcript to get started with AI
                          analysis
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Case Documents Tab */}
              <TabsContent value="documents" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-white">
                      Case Documents
                    </h2>
                    <Dialog open={isDocumentDialogOpen} onOpenChange={setIsDocumentDialogOpen}>
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
                            <Label className="text-sm font-semibold text-white">
                              Document Title
                            </Label>
                            <Input
                              value={documentTitle}
                              onChange={(e) => setDocumentTitle(e.target.value)}
                              placeholder="e.g., Complaint Document"
                              className="border-zinc-800 focus:border-zinc-700 h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-white">
                              Description (Optional)
                            </Label>
                            <Textarea
                              value={documentDescription}
                              onChange={(e) => setDocumentDescription(e.target.value)}
                              placeholder="Brief description of the document"
                              className="border-zinc-800 focus:border-zinc-700"
                              rows={3}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-semibold text-white">
                              File
                            </Label>
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
                            <p className="text-xs text-zinc-500 font-medium">
                              Supported: PDF, DOCX, TXT (max 50MB)
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <Button
                            onClick={() => {
                              setIsDocumentDialogOpen(false);
                              setDocumentFile(null);
                              setDocumentTitle("");
                              setDocumentDescription("");
                            }}
                            className="bg-zinc-950 text-zinc-300 border border-zinc-800 hover:bg-zinc-900 h-11 px-6"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => uploadDocumentMutation.mutate()}
                            disabled={!documentFile || !documentTitle || uploadDocumentMutation.isPending}
                            className="bg-white text-black hover:bg-white/90 shadow-lg h-11 px-6"
                          >
                            {uploadDocumentMutation.isPending ? "Uploading..." : "Upload Document"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {caseDocuments && caseDocuments.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2">
                      {caseDocuments.map((doc: CaseDocument) => (
                        <Card key={doc.id} className="border-zinc-800/80 bg-zinc-950 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3 flex-1">
                                <div className="p-2.5 rounded-xl bg-blue-600/10 shadow-lg">
                                  <FileText className="h-5 w-5 text-blue-400" strokeWidth={2.5} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-sm font-bold text-white truncate">
                                    {doc.title}
                                  </h3>
                                  {doc.description && (
                                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                                      {doc.description}
                                    </p>
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
                                        deleteDocumentMutation.mutate(doc.id);
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
                  ) : (
                    <Card className="border-zinc-800/80 bg-zinc-950">
                      <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                        <div className="p-4 rounded-2xl bg-zinc-900/50 inline-block mb-4">
                          <FileText className="h-12 w-12 text-zinc-600" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">
                          No documents yet
                        </h3>
                        <p className="text-sm text-zinc-500 mb-4">
                          Upload case documents to provide context for AI analysis
                        </p>
                        <Button
                          onClick={() => setIsDocumentDialogOpen(true)}
                          className="bg-zinc-800 hover:bg-zinc-700 text-white"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add First Document
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Action Items Tab */}
              <TabsContent value="actions" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-white">
                    Action Items
                  </h2>
                  {actionItems && actionItems.length > 0 ? (
                    <div className="space-y-3">
                      {actionItems.map((item: ActionItem) => (
                        <Card
                          key={item.id}
                          className="border-zinc-800/80 bg-zinc-950 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4 flex-1">
                                <div
                                  className={cn(
                                    "p-2.5 rounded-xl shadow-lg",
                                    item.status === "completed"
                                      ? "bg-linear-to-br from-emerald-600 to-emerald-700 shadow-emerald-600/25"
                                      : item.status === "in_progress"
                                      ? "bg-linear-to-br from-blue-600 to-blue-700 shadow-blue-600/25"
                                      : "bg-linear-to-br from-zinc-900 to-zinc-700 shadow-zinc-900/25"
                                  )}
                                >
                                  {item.status === "completed" ? (
                                    <CheckCircle
                                      className="h-4 w-4 text-white"
                                      strokeWidth={2.5}
                                    />
                                  ) : (
                                    <Clock
                                      className="h-4 w-4 text-white"
                                      strokeWidth={2.5}
                                    />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-bold text-sm text-white tracking-tight mb-1">
                                    {item.description}
                                  </h3>
                                  {item.due_date && (
                                    <p className="text-xs font-semibold text-zinc-500 tracking-wide flex items-center gap-1.5">
                                      <Calendar className="h-3 w-3" />
                                      Due: {formatDate(item.due_date)}
                                    </p>
                                  )}
                                  {item.assigned_to && (
                                    <p className="text-xs text-zinc-500 mt-1">
                                      Assigned to: {item.assigned_to}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-2">
                                  <Badge
                                    className={cn(
                                      getSeverityColor(item.priority),
                                      "text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md transition-all duration-300"
                                    )}
                                  >
                                    {item.priority}
                                  </Badge>
                                  <Badge
                                    className={cn(
                                      getStatusColor(item.status),
                                      "text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md transition-all duration-300"
                                    )}
                                  >
                                    {item.status.replace("_", " ")}
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
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48 bg-zinc-900 border-zinc-800"
                                  >
                                    <DropdownMenuLabel className="text-zinc-400 text-xs">
                                      Change Status
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateActionItemStatus(
                                          item.id,
                                          "pending"
                                        )
                                      }
                                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                                    >
                                      <Clock className="h-4 w-4 mr-2" />
                                      Pending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateActionItemStatus(
                                          item.id,
                                          "in_progress"
                                        )
                                      }
                                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                                    >
                                      <ChevronUp className="h-4 w-4 mr-2" />
                                      In Progress
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateActionItemStatus(
                                          item.id,
                                          "completed"
                                        )
                                      }
                                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Completed
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-zinc-800" />

                                    <DropdownMenuLabel className="text-zinc-400 text-xs">
                                      Change Priority
                                    </DropdownMenuLabel>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateActionItemPriority(
                                          item.id,
                                          "low"
                                        )
                                      }
                                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                                    >
                                      <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                                      Low
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateActionItemPriority(
                                          item.id,
                                          "medium"
                                        )
                                      }
                                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                                    >
                                      <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></span>
                                      Medium
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleUpdateActionItemPriority(
                                          item.id,
                                          "high"
                                        )
                                      }
                                      className="text-zinc-300 hover:bg-zinc-800 hover:text-white cursor-pointer"
                                    >
                                      <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                                      High
                                    </DropdownMenuItem>

                                    <DropdownMenuSeparator className="bg-zinc-800" />

                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDeleteActionItem(
                                          item.id,
                                          item.description
                                        )
                                      }
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
                  ) : (
                    <Card className="border-zinc-800/80 bg-zinc-900/50 shadow-lg">
                      <CardContent className="text-center py-12">
                        <CheckSquare
                          className="h-16 w-16 text-zinc-600 mx-auto mb-3"
                          strokeWidth={1.5}
                        />
                        <p className="text-sm font-semibold text-zinc-500">
                          No action items yet
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - AI Chat Assistant */}
          <div className="w-96 shrink-0">
            <Card className="border-zinc-800/80 bg-zinc-950 shadow-xl sticky top-24 overflow-hidden">
              <CardHeader className="bg-zinc-900 text-white pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-zinc-950/10 backdrop-blur-sm">
                      <Bot className="h-5 w-5" strokeWidth={2.5} />
                    </div>
                    Legal AI Assistant
                  </CardTitle>
                  <Button
                    onClick={handleNewChat}
                    size="sm"
                    variant="outline"
                    className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 h-8 px-3"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} />
                    New
                  </Button>
                </div>
                <CardDescription className="text-zinc-200 text-xs font-medium mt-2">
                  Ask questions about this case, meetings, and insights
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] p-6">
                  {chatMessages.length === 0 ? (
                    <div className="text-center py-12">
                      <Bot
                        className="h-16 w-16 text-zinc-300 mx-auto mb-4"
                        strokeWidth={1.5}
                      />
                      <p className="text-sm font-semibold text-zinc-500 mb-2">
                        Start a conversation
                      </p>
                      <p className="text-xs text-zinc-400">
                        Ask me anything about this case
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((msg, idx) => (
                        <ChatMessage
                          key={idx}
                          role={msg.role}
                          content={msg.content}
                          timestamp={msg.timestamp}
                          sources={msg.sources}
                        />
                      ))}
                      {isChatLoading && (
                        <div className="flex gap-3">
                          <div className="p-2 rounded-lg bg-linear-to-br from-zinc-900 to-zinc-700 shadow-lg h-fit">
                            <Bot
                              className="h-4 w-4 text-white"
                              strokeWidth={2.5}
                            />
                          </div>
                          <div className="bg-linear-to-br from-zinc-50 to-zinc-100 rounded-2xl px-4 py-3 border border-zinc-800/50">
                            <div className="flex gap-1.5">
                              <div
                                className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                                style={{ animationDelay: "0ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                                style={{ animationDelay: "150ms" }}
                              ></div>
                              <div
                                className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                                style={{ animationDelay: "300ms" }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>
                  )}
                </ScrollArea>
                <div className="border-t border-zinc-800 p-4 bg-zinc-900/50">
                  {/* Web Search Toggle */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                        size="sm"
                        variant={webSearchEnabled ? "default" : "outline"}
                        className={cn(
                          "h-7 px-3 text-xs font-semibold transition-all",
                          webSearchEnabled
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 text-zinc-400"
                        )}
                      >
                        <Globe className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} />
                        Web Search
                      </Button>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-medium">
                      {webSearchEnabled 
                        ? "Searching web + case context" 
                        : "Case context only"}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Textarea
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder={webSearchEnabled 
                        ? "Ask anything - searching web + case context..." 
                        : "Ask about this case..."}
                      className="resize-none border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900 min-h-20 text-sm"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!chatInput.trim() || isChatLoading}
                      className="bg-linear-to-r from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600 text-white shadow-lg shadow-zinc-900/25 h-auto px-4"
                    >
                      <Send className="h-4 w-4" strokeWidth={2.5} />
                    </Button>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-2 font-medium">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Insight Detail Modal */}
      <Dialog open={isInsightModalOpen} onOpenChange={setIsInsightModalOpen}>
        <DialogContent className="bg-zinc-950 border-zinc-800 shadow-2xl max-w-3xl">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-bold tracking-tight text-white mb-2">
                  {selectedInsight?.title}
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-zinc-400">
                  Detailed insight information
                </DialogDescription>
              </div>
              {selectedInsight && (
                <Badge
                  className={cn(
                    getSeverityColor(selectedInsight.severity),
                    "text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-lg shadow-xl"
                  )}
                >
                  {selectedInsight.severity}
                </Badge>
              )}
            </div>
          </DialogHeader>

          {selectedInsight && (
            <div className="space-y-6 py-4">
              {/* Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Type
                </label>
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                  <p className="text-base font-bold text-blue-400 tracking-tight">
                    {selectedInsight.type
                      .replace(/_/g, " ")
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Description
                </label>
                <div className="bg-zinc-900/50 border border-zinc-800/60 rounded-xl p-4">
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {selectedInsight.description}
                  </p>
                </div>
              </div>

              {/* Timestamp if available */}
              {selectedInsight.timestamp && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                    Timestamp
                  </label>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-zinc-500" />
                    <p className="text-sm text-zinc-400">
                      {selectedInsight.timestamp}
                    </p>
                  </div>
                </div>
              )}

              {/* Created At */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Created
                </label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <p className="text-sm text-zinc-400">
                    {formatDate(selectedInsight.created_at)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
