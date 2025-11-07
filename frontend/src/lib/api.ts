import axios from 'axios';
import { API_BASE_URL } from '@/types';
import type {
  Case,
  CaseDocument,
  Meeting,
  Insight,
  ActionItem,
  ChatMessage,
  ChatResponse,
  DashboardData,
} from '@/types';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cases
export const getCases = () => api.get<Case[]>('/api/cases/');
export const getCase = (id: number) => api.get<Case>(`/api/cases/${id}`);
export const createCase = (data: Partial<Case>) => api.post<Case>('/api/cases/', data);
export const updateCase = (id: number, data: Partial<Case>) => 
  api.put<Case>(`/api/cases/${id}`, data);
export const deleteCase = (id: number) => api.delete(`/api/cases/${id}`);
export const getCaseMeetings = (id: number) => api.get<Meeting[]>(`/api/cases/${id}/meetings`);
export const getCaseActionItems = (id: number) => 
  api.get<ActionItem[]>(`/api/cases/${id}/action-items`);

// Meetings
export const uploadMeeting = (caseId: number, formData: FormData) => {
  formData.append('case_id', caseId.toString());
  return api.post<Meeting>('/api/meetings/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
export const getMeeting = (id: number) => api.get<Meeting>(`/api/meetings/${id}`);
export const getMeetingInsights = (id: number) => 
  api.get<Insight[]>(`/api/meetings/${id}/insights`);
export const getMeetingActionItems = (id: number) => 
  api.get<ActionItem[]>(`/api/meetings/${id}/action-items`);
export const deleteMeeting = (id: number) => api.delete(`/api/meetings/${id}`);

// Action Items
export const getActionItems = (status?: string) => 
  api.get<ActionItem[]>('/api/action-items/', { params: { status } });
export const getActionItem = (id: number) => 
  api.get<ActionItem>(`/api/action-items/${id}`);
export const createActionItem = (data: Partial<ActionItem>) => 
  api.post<ActionItem>('/api/action-items/', data);
export const updateActionItem = (id: number, data: Partial<ActionItem>) => 
  api.put<ActionItem>(`/api/action-items/${id}`, data);
export const deleteActionItem = (id: number) => api.delete(`/api/action-items/${id}`);

// Chat
export const sendChatMessage = (data: ChatMessage) => 
  api.post<ChatResponse>('/api/chat/', data);
export const getChatHistory = (sessionId: string) => 
  api.get(`/api/chat/history/${sessionId}`);
export const getChatSessions = () => 
  api.get('/api/chat/sessions');
export const deleteChatSession = (sessionId: string) => 
  api.delete(`/api/chat/sessions/${sessionId}`);

// Dashboard
export const getDashboardData = () => api.get<DashboardData>('/api/dashboard/');
export const getInsightsSummary = () => api.get('/api/dashboard/insights/summary');

// Email
export const sendMeetingSummary = (data: {
  meeting_id: number;
  recipients: Array<{ email: string; name?: string }>;
}) => api.post('/api/email/send-meeting-summary', data);

export const testEmailConfig = () => api.get('/api/email/test');

export const getEmailHistory = (params?: { case_id?: number; meeting_id?: number }) => 
  api.get('/api/email/history', { params });

// Case Documents
export const uploadCaseDocument = (caseId: number, formData: FormData) => {
  formData.append('case_id', caseId.toString());
  return api.post<CaseDocument>('/api/case-documents/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getCaseDocuments = (caseId: number) => 
  api.get<CaseDocument[]>(`/api/case-documents/case/${caseId}`);

export const deleteCaseDocument = (documentId: number) => 
  api.delete(`/api/case-documents/${documentId}`);

export default api;
