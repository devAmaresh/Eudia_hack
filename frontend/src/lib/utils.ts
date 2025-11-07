import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: string | Date) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getSeverityColor(severity:string) {
  switch (severity?.toLowerCase()) {
    case "high":
      return "bg-red-500/20 border border-red-400/30 text-red-200 backdrop-blur-md shadow-[0_0_10px_rgba(255,0,0,0.2)]";
    case "medium":
      return "bg-yellow-500/20 border border-yellow-400/30 text-yellow-200 backdrop-blur-md shadow-[0_0_10px_rgba(255,255,0,0.15)]";
    case "low":
      return "bg-green-500/20 border border-green-400/30 text-green-200 backdrop-blur-md shadow-[0_0_10px_rgba(0,255,0,0.15)]";
    case "info":
      return "bg-blue-500/20 border border-blue-400/30 text-blue-200 backdrop-blur-md shadow-[0_0_10px_rgba(0,0,255,0.15)]";
    default:
      return "bg-zinc-400/10 border border-white/20 text-white/80 backdrop-blur-md";
  }
}
export function getPriorityColor(priority: string) {
  switch (priority) {
    case 'high':
      return 'bg-red-50 text-red-700 border border-red-200/60';
    case 'medium':
      return 'bg-amber-50 text-amber-700 border border-amber-200/60';
    case 'low':
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
    default:
      return 'bg-zinc-50 text-zinc-700 border border-zinc-200/60';
  }
}

export function getStatusColor(status: string) {
  switch (status?.toLowerCase()) {
    case "completed":
      return [
        "bg-emerald-500/15",
        "text-emerald-300",
        "border border-emerald-400/25",
        "backdrop-blur-md",
        "shadow-[0_0_10px_rgba(16,185,129,0.15)]"
      ].join(" ");
    case "in_progress":
      return [
        "bg-blue-500/15",
        "text-blue-300",
        "border border-blue-400/25",
        "backdrop-blur-md",
        "shadow-[0_0_10px_rgba(59,130,246,0.15)]"
      ].join(" ");
    case "pending":
      return [
        "bg-amber-500/15",
        "text-amber-200",
        "border border-amber-400/25",
        "backdrop-blur-md",
        "shadow-[0_0_10px_rgba(245,158,11,0.12)]"
      ].join(" ");
    case "active":
      return [
        "bg-green-500/15",
        "text-green-300",
        "border border-green-400/25",
        "backdrop-blur-md",
        "shadow-[0_0_10px_rgba(34,197,94,0.15)]"
      ].join(" ");
    case "closed":
      return [
        "bg-zinc-500/10",
        "text-zinc-300",
        "border border-zinc-400/20",
        "backdrop-blur-md",
        "shadow-[0_0_8px_rgba(120,120,120,0.08)]"
      ].join(" ");
    default:
      return [
        "bg-zinc-400/10",
        "text-zinc-300",
        "border border-zinc-400/20",
        "backdrop-blur-md",
        "shadow-[0_0_8px_rgba(120,120,120,0.08)]"
      ].join(" ");
  }
}

