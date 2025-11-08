// Utility functions to handle timezone conversions properly
// These ensure that when user selects a time, it's stored as-is without timezone conversion
export const formatDateTimeLocal = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Convert datetime-local input value to ISO string WITHOUT timezone conversion
// This preserves the user's selected time exactly as they see it
export const localDateTimeToISO = (localDateTime: string) => {
  if (!localDateTime) return '';
  // Parse the local datetime string and treat it as UTC to prevent timezone shift
  const date = new Date(localDateTime);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// Convert ISO string from backend to datetime-local format for input
// This shows the stored time exactly as it was saved
export const isoToLocalDateTime = (isoString: string) => {
  if (!isoString) return '';
  // Extract date and time parts directly without timezone conversion
  const date = isoString.slice(0, 16); // Gets YYYY-MM-DDTHH:mm
  return date;
};

export const EVENT_TYPES = [
  { value: 'hearing', label: 'Hearing', color: '#ef4444' },
  { value: 'meeting', label: 'Meeting', color: '#3b82f6' },
  { value: 'deadline', label: 'Deadline', color: '#f59e0b' },
  { value: 'consultation', label: 'Consultation', color: '#10b981' },
  { value: 'filing', label: 'Filing', color: '#8b5cf6' },
];

export const TASK_PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-zinc-600', textColor: 'text-zinc-500' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-600', textColor: 'text-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-600', textColor: 'text-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-600', textColor: 'text-red-500' },
];

export const TASK_STATUSES = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
];
