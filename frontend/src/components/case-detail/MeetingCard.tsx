import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Lightbulb, ChevronDown, ChevronUp, Mail, Trash2, FileText, FileDown, Eye } from 'lucide-react';
import { getSeverityColor, cn } from '@/lib/utils';
import { MinutesViewDialog } from './MinutesViewDialog';
import type { Meeting, Insight } from '@/types';

interface MeetingCardProps {
  meeting: Meeting;
  insights: Insight[];
  onDelete: (meetingId: number, meetingTitle: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
  onInsightClick: (insight: Insight) => void;
}

export function MeetingCard({ meeting, insights, onDelete, isDeleting, onInsightClick }: MeetingCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMinutesModal, setShowMinutesModal] = useState(false);
  const navigate = useNavigate();

  // Format date and time separately
  const meetingDate = new Date(meeting.meeting_date);
  const formattedDate = meetingDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = meetingDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <Card className="border-zinc-800/80 bg-zinc-950 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <CardHeader
        className="cursor-pointer hover:bg-zinc-900/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 rounded-xl bg-linear-to-br from-zinc-900 to-zinc-700 shadow-lg shadow-zinc-900/25">
              <Calendar className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg font-bold tracking-tight text-white">{meeting.title}</CardTitle>
              <CardDescription className="mt-1 text-xs font-semibold text-zinc-500 tracking-wide flex items-center gap-2">
                <Clock className="h-3 w-3" />
                {formattedDate} at {formattedTime}
                {insights.length > 0 && (
                  <span className="ml-3 inline-flex items-center gap-1.5">
                    <Lightbulb className="h-3 w-3" />
                    {insights.length} insight{insights.length !== 1 && 's'}
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
              onClick={(e) => onDelete(meeting.id, meeting.title, e)}
              disabled={isDeleting}
              className="text-red-500 hover:bg-zinc-900 shadow-sm h-9 w-9 p-0"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" strokeWidth={2.5} />
            ) : (
              <ChevronDown className="h-4 w-4" strokeWidth={2.5} />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-4 pb-6 space-y-6 border-t border-zinc-800 mt-4">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {meeting.minutes && (
              <Button
                onClick={() => setShowMinutesModal(true)}
                variant="outline"
                size={'sm'}
                className="bg-blue-600/10 border-blue-600/30 hover:bg-blue-600/20 hover:border-blue-600/40 text-blue-400 font-medium"
              >
                <Eye className="h-4 w-4 mr-2" strokeWidth={2.5} />
                View Minutes
              </Button>
            )}
            {meeting.file_path && (
              <Button
                onClick={() => {
                  const filename = meeting.file_path?.split('/').pop() || meeting.file_path;
                  window.open(`http://localhost:8000/${filename}`, '_blank');
                }}
                size={'sm'}
                variant="outline"
                className="bg-emerald-600/10 border-emerald-600/30 hover:bg-emerald-600/20 hover:border-emerald-600/40 text-emerald-400 font-medium"
              >
                <FileDown className="h-4 w-4 mr-2" strokeWidth={2.5} />
                View Raw Transcript
              </Button>
            )}
          </div>

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

          {/* Insights */}
          {insights.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-600/10 backdrop-blur-sm">
                    <Lightbulb className="h-4 w-4 text-blue-400" />
                  </div>
                  AI Insights
                </h3>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 text-xs font-semibold px-3 py-1">
                  {insights.length} {insights.length === 1 ? 'Insight' : 'Insights'}
                </Badge>
              </div>

              <div className="rounded-2xl border border-zinc-800/60 bg-linear-to-br from-zinc-900/40 to-zinc-950/40 backdrop-blur-xl overflow-hidden shadow-2xl shadow-black/20">
                <div className="max-h-128 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-zinc-950">
                  <table className="w-full">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800/80">
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Type</span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Title</span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Severity</span>
                        </th>
                        <th className="px-6 py-4 text-left">
                          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Description
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/40">
                      {insights.map((insight: Insight) => (
                        <tr
                          key={insight.id}
                          onClick={() => onInsightClick(insight)}
                          className="group hover:bg-zinc-900/70 transition-all duration-300 cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-400 whitespace-nowrap tracking-tight">
                                {insight.type
                                  .replace(/_/g, ' ')
                                  .split(' ')
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                                  .join(' ')}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-white font-semibold leading-snug line-clamp-2">
                              {insight.title}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={cn(getSeverityColor(insight.severity), 'text-xs tracking-wider rounded-lg')}>
                              {insight.severity}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">{insight.description}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}

      {/* Minutes Modal */}
      <MinutesViewDialog
        isOpen={showMinutesModal}
        onOpenChange={setShowMinutesModal}
        title={meeting.title}
        minutes={meeting.minutes || ''}
      />
    </Card>
  );
}
