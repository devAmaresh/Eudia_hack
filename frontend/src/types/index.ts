export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface Case {
  id: number;
  case_number: string;
  title: string;
  description?: string;
  client_side?: string; // plaintiff, defendant, petitioner, respondent
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CaseDocument {
  id: number;
  case_id: number;
  title: string;
  description?: string;
  file_type: string;
  file_size: number;
  file_path?: string;
  uploaded_at: string;
}

export interface Meeting {
  id: number;
  case_id: number;
  title: string;
  meeting_date: string;
  file_type?: string;
  transcript?: string;
  summary?: string;
  minutes?: string;
  created_at: string;
  updated_at: string;
}

export interface Insight {
  id: number;
  meeting_id: number;
  type: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp?: string;
  created_at: string;
}

export interface ActionItem {
  id: number;
  case_id: number;
  meeting_id?: number;
  title: string;
  description: string;
  assigned_to?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  message: string;
  case_id?: number;
  session_id?: string;
  web_search?: boolean;
}

export interface ChatResponse {
  response: string;
  sources?: string[];
  session_id: string;
}

export interface ChatSession {
  session_id: string;
  case: {
    id: number;
    case_number: string;
    title: string;
  } | null;
  message_count: number;
  first_message: string;
  last_message: string;
  created_at: string;
  updated_at: string;
}

export interface ChatHistoryMessage {
  user_message: string;
  bot_response: string;
  created_at: string;
  sources?: string[];
}

export interface DashboardStats {
  total_cases: number;
  active_cases: number;
  total_meetings: number;
  pending_action_items: number;
  critical_insights: number;
}

export interface DashboardData {
  statistics: DashboardStats;
  recent_cases: Case[];
  upcoming_deadlines: ActionItem[];
  critical_insights: Insight[];
}

export interface CalendarEvent {
  id: number;
  case_id?: number;
  meeting_id?: number;
  title: string;
  description?: string;
  event_type: 'hearing' | 'meeting' | 'deadline' | 'consultation' | 'filing';
  location?: string;
  start_time: string;
  end_time: string;
  all_day: boolean;
  reminder_minutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  color: string;
  participants?: Array<{
    name: string;
    email?: string;
    role?: string;
  }>;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  case_id?: number;
  calendar_event_id?: number;
  title: string;
  description?: string;
  assigned_to?: string;
  assignee_email?: string;
  due_date?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  tags?: string[];
  estimated_hours?: number;
  actual_hours?: number;
  dependencies?: number[];
  attachments?: string[];
  checklist?: Array<{
    item: string;
    completed: boolean;
  }>;
  comments?: Array<{
    author: string;
    comment: string;
    timestamp: string;
  }>;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}
