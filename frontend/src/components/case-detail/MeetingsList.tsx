import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { MeetingCard } from './MeetingCard';
import type { Meeting, Insight } from '@/types';

interface MeetingsListProps {
  meetings: Meeting[];
  allInsights: Record<number, Insight[]>;
  onDeleteMeeting: (meetingId: number, meetingTitle: string, e: React.MouseEvent) => void;
  isDeleting: boolean;
  onInsightClick: (insight: Insight) => void;
}

export function MeetingsList({
  meetings,
  allInsights,
  onDeleteMeeting,
  isDeleting,
  onInsightClick,
}: MeetingsListProps) {
  if (!meetings || meetings.length === 0) {
    return (
      <Card className="border-zinc-800/80 bg-zinc-900/50 shadow-lg">
        <CardContent className="text-center py-16">
          <FileText className="h-20 w-20 text-zinc-600 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="font-bold text-white text-lg mb-2">No meetings yet</h3>
          <p className="text-sm text-zinc-500">Upload a meeting transcript to get started with AI analysis</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting: Meeting) => {
        const meetingInsights = allInsights[meeting.id] || [];
        return (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            insights={meetingInsights}
            onDelete={onDeleteMeeting}
            isDeleting={isDeleting}
            onInsightClick={onInsightClick}
          />
        );
      })}
    </div>
  );
}
