import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
} from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, Lightbulb, FileText, CheckSquare } from 'lucide-react';
import {
  CaseHeader,
  CaseInfo,
  QuickStats,
  UploadMeetingDialog,
  MeetingsList,
  ActionItemsList,
  DocumentsList,
  UploadDocumentDialog,
  ChatAssistant,
  InsightDetailDialog,
} from '@/components/case-detail';
import type { Meeting, Insight, ActionItem, CaseDocument } from '@/types';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  sources?: string[];
}

export default function CaseDetail() {
  const { id } = useParams<{ id: string }>();
  const caseId = parseInt(id || '0');

  // Meeting upload state
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState<string>(() => {
    const now = new Date();
    now.setHours(9, 0, 0, 0);
    return now.toISOString().slice(0, 16);
  });

  // Insight modal state
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const [isInsightModalOpen, setIsInsightModalOpen] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  // Document upload state
  const [isDocumentDialogOpen, setIsDocumentDialogOpen] = useState(false);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentDescription, setDocumentDescription] = useState('');

  const queryClient = useQueryClient();

  // Queries
  const { data: caseData } = useQuery({
    queryKey: ['case', caseId],
    queryFn: async () => {
      const response = await getCase(caseId);
      return response.data;
    },
  });

  const { data: meetings } = useQuery({
    queryKey: ['meetings', caseId],
    queryFn: async () => {
      const response = await getCaseMeetings(caseId);
      return response.data;
    },
  });

  const { data: actionItems } = useQuery({
    queryKey: ['actionItems', caseId],
    queryFn: async () => {
      const response = await getCaseActionItems(caseId);
      return response.data;
    },
  });

  const { data: caseDocuments } = useQuery({
    queryKey: ['caseDocuments', caseId],
    queryFn: async () => {
      const response = await getCaseDocuments(caseId);
      return response.data;
    },
  });

  // Fetch insights for all meetings
  const meetingIds = meetings?.map((m: Meeting) => m.id) || [];
  const insightsQueries = useQuery({
    queryKey: ['allInsights', meetingIds],
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

  // Mutations
  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return uploadMeeting(caseId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', caseId] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      setIsOpen(false);
      setFile(null);
      setMeetingTitle('');
      const now = new Date();
      now.setHours(9, 0, 0, 0);
      setMeetingDate(now.toISOString().slice(0, 16));
    },
  });

  const deleteMeetingMutation = useMutation({
    mutationFn: deleteMeeting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meetings', caseId] });
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
  });

  const updateActionItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ActionItem> }) => updateActionItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', caseId] });
    },
  });

  const deleteActionItemMutation = useMutation({
    mutationFn: deleteActionItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionItems', caseId] });
    },
  });

  const uploadDocumentMutation = useMutation({
    mutationFn: async () => {
      if (!documentFile) throw new Error('No file selected');
      const formData = new FormData();
      formData.append('file', documentFile);
      formData.append('title', documentTitle);
      formData.append('description', documentDescription);
      return uploadCaseDocument(caseId, formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseDocuments', caseId] });
      setIsDocumentDialogOpen(false);
      setDocumentFile(null);
      setDocumentTitle('');
      setDocumentDescription('');
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: deleteCaseDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['caseDocuments', caseId] });
    },
  });

  // Handlers
  const handleUpload = async () => {
    if (!file || !meetingTitle) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', meetingTitle);
    const date = new Date(meetingDate);
    const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
      date.getDate()
    ).padStart(2, '0')}T${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(
      2,
      '0'
    )}:${String(date.getSeconds()).padStart(2, '0')}`;
    formData.append('meeting_date', isoDate);
    uploadMutation.mutate(formData);
  };

  const handleDeleteMeeting = (meetingId: number, meetingTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (
      confirm(
        `Are you sure you want to delete "${meetingTitle}"? This will also delete all associated insights and action items.`
      )
    ) {
      deleteMeetingMutation.mutate(meetingId);
    }
  };

  const handleUpdateActionItemStatus = (itemId: number, status: 'pending' | 'in_progress' | 'completed') => {
    updateActionItemMutation.mutate({
      id: itemId,
      data: { status },
    });
  };

  const handleUpdateActionItemPriority = (itemId: number, priority: 'low' | 'medium' | 'high') => {
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
    setChatInput('');
    setChatMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
    ]);
    setIsChatLoading(true);

    try {
      const response = await sendChatMessage({
        message: userMessage,
        case_id: caseId,
        session_id: chatSessionId || undefined,
        web_search: webSearchEnabled,
      });

      if (response.data.session_id) {
        setChatSessionId(response.data.session_id);
      }

      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
          sources: response.data.sources,
        },
      ]);
    } catch (error) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleNewChat = () => {
    setChatMessages([]);
    setChatSessionId(null);
    setChatInput('');
  };

  if (!caseData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
        <div className="text-center">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse mx-auto mb-4 shadow-lg shadow-blue-900/50"></div>
          <p className="text-sm font-semibold text-zinc-300">Loading case details...</p>
        </div>
      </div>
    );
  }

  const allInsights = insightsQueries.data || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 relative overflow-hidden">
      <div className="relative z-10">
        <CaseHeader caseNumber={caseData.case_number} title={caseData.title} status={caseData.status} />

        {/* Main Content */}
        <div className="mx-auto p-8">
        <div className="flex gap-8">
          {/* Left Column - Tabs */}
          <div className="flex-1">
            <Tabs defaultValue="details" className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/50  h-auto shadow-2xl rounded-xl">
                  <TabsTrigger
                    value="details"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-sm tracking-tight px-6 py-2 rounded-lg text-zinc-400 transition-all duration-200"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Case Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="meetings"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-sm tracking-tight px-6 py-2 rounded-lg text-zinc-400 transition-all duration-200"
                  >
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Meeting Insights
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-sm tracking-tight px-6 py-2 rounded-lg text-zinc-400 transition-all duration-200"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Case Documents
                  </TabsTrigger>
                  <TabsTrigger
                    value="actions"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg font-semibold text-sm tracking-tight px-6 py-2 rounded-lg text-zinc-400 transition-all duration-200"
                  >
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Action Items
                  </TabsTrigger>
                </TabsList>

                <UploadMeetingDialog
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                  meetingTitle={meetingTitle}
                  setMeetingTitle={setMeetingTitle}
                  meetingDate={meetingDate}
                  setMeetingDate={setMeetingDate}
                  file={file}
                  setFile={setFile}
                  onUpload={handleUpload}
                  isUploading={uploadMutation.isPending}
                />
              </div>

              {/* Case Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-white">Case Information</h2>
                  <CaseInfo caseData={caseData} />
                  <QuickStats
                    meetingsCount={meetings?.length || 0}
                    documentsCount={caseDocuments?.length || 0}
                    actionItemsCount={actionItems?.length || 0}
                  />
                </div>
              </TabsContent>

              {/* Meetings Tab */}
              <TabsContent value="meetings" className="space-y-4 mt-6">
                <MeetingsList
                  meetings={meetings || []}
                  allInsights={allInsights}
                  onDeleteMeeting={handleDeleteMeeting}
                  isDeleting={deleteMeetingMutation.isPending}
                  onInsightClick={handleInsightClick}
                />
              </TabsContent>

              {/* Documents Tab */}
              <TabsContent value="documents" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold tracking-tight text-white">Case Documents</h2>
                    <UploadDocumentDialog
                      isOpen={isDocumentDialogOpen}
                      onOpenChange={setIsDocumentDialogOpen}
                      documentTitle={documentTitle}
                      setDocumentTitle={setDocumentTitle}
                      documentDescription={documentDescription}
                      setDocumentDescription={setDocumentDescription}
                      documentFile={documentFile}
                      setDocumentFile={setDocumentFile}
                      onUpload={() => uploadDocumentMutation.mutate()}
                      isUploading={uploadDocumentMutation.isPending}
                    />
                  </div>
                  <DocumentsList
                    documents={caseDocuments || []}
                    onDelete={(id) => deleteDocumentMutation.mutate(id)}
                    onAddDocument={() => setIsDocumentDialogOpen(true)}
                  />
                </div>
              </TabsContent>

              {/* Action Items Tab */}
              <TabsContent value="actions" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-white">Action Items</h2>
                  <ActionItemsList
                    actionItems={actionItems || []}
                    onUpdateStatus={handleUpdateActionItemStatus}
                    onUpdatePriority={handleUpdateActionItemPriority}
                    onDelete={handleDeleteActionItem}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - AI Chat Assistant */}
          <div className="w-96 shrink-0">
            <ChatAssistant
              messages={chatMessages}
              input={chatInput}
              onInputChange={setChatInput}
              onSendMessage={handleSendMessage}
              onNewChat={handleNewChat}
              isLoading={isChatLoading}
              webSearchEnabled={webSearchEnabled}
              onToggleWebSearch={() => setWebSearchEnabled(!webSearchEnabled)}
            />
          </div>
        </div>
      </div>

      {/* Insight Detail Modal */}
      <InsightDetailDialog insight={selectedInsight} isOpen={isInsightModalOpen} onOpenChange={setIsInsightModalOpen} />
      </div>
    </div>
  );
}
