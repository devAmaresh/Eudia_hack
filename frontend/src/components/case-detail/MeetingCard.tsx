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
    <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm shadow-lg hover:shadow-2xl hover:shadow-blue-900/10 transition-all duration-300 overflow-hidden hover:border-zinc-700/50">
      <CardHeader
        className="cursor-pointer hover:bg-zinc-900/70 transition-all duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5 flex-1">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900">
              <Calendar className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl font-bold tracking-tight text-white">{meeting.title}</CardTitle>
              <CardDescription className="mt-2 text-xs font-semibold text-zinc-400 tracking-wide flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-zinc-800/50 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                  <Clock className="h-3.5 w-3.5" />
                  {formattedDate} at {formattedTime}
                </span>
                {insights.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 bg-blue-950/50 px-2.5 py-1 rounded-lg backdrop-blur-sm text-blue-400 border border-blue-800/30">
                    <Lightbulb className="h-3.5 w-3.5" />
                    {insights.length} insight{insights.length !== 1 && 's'}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/share-meeting/${meeting.id}`);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg h-10 px-4 font-semibold"
            >
              <Mail className="h-4 w-4 mr-2" strokeWidth={2.5} />
              Share
            </Button>
            <Button
              onClick={(e) => onDelete(meeting.id, meeting.title, e)}
              disabled={isDeleting}
              variant="outline"
              className="text-red-400 hover:bg-red-950/30 border-red-800/30 hover:border-red-700/50 shadow-sm h-10 w-10 p-0"
            >
              <Trash2 className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-zinc-400" strokeWidth={2.5} />
            ) : (
              <ChevronDown className="h-5 w-5 text-zinc-400" strokeWidth={2.5} />
            )}
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-6 pb-8 space-y-8 border-t border-zinc-800/50 mt-4 bg-zinc-950/30">
          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {meeting.minutes && (
              <Button
                onClick={() => setShowMinutesModal(true)}
                variant="outline"
                size={'sm'}
                className="bg-blue-600/10 border-blue-600/40 hover:bg-blue-600/20 hover:border-blue-600/60 text-blue-400 font-semibold backdrop-blur-sm shadow-lg"
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
                className="bg-emerald-600/10 border-emerald-600/40 hover:bg-emerald-600/20 hover:border-emerald-600/60 text-emerald-400 font-semibold backdrop-blur-sm shadow-lg"
              >
                <FileDown className="h-4 w-4 mr-2" strokeWidth={2.5} />
                View Raw Transcript
              </Button>
            )}
          </div>

          {/* Summary */}
          {meeting.summary && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-600/10 border border-purple-600/20">
                  <FileText className="h-4 w-4 text-purple-400" />
                </div>
                Summary
              </h3>
              <div className="text-sm text-zinc-300 leading-relaxed bg-zinc-900/50 p-5 rounded-xl border border-zinc-800/50 backdrop-blur-sm shadow-lg font-medium">
                {meeting.summary}
              </div>
            </div>
          )}

          {/* Insights */}
          {insights.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/50">
                    <Lightbulb className="h-4 w-4 text-white" />
                  </div>
                  AI Insights
                </h3>
                <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/40 text-xs font-bold px-4 py-1.5 rounded-lg shadow-lg backdrop-blur-sm">
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
