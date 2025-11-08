import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, FileText, CheckSquare } from 'lucide-react';

interface QuickStatsProps {
  meetingsCount: number;
  documentsCount: number;
  actionItemsCount: number;
}

export function QuickStats({ meetingsCount, documentsCount, actionItemsCount }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="border-zinc-800/80 bg-zinc-950">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/10">
              <Lightbulb className="h-5 w-5 text-purple-400" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{meetingsCount}</p>
              <p className="text-xs font-semibold text-zinc-500 uppercase">Meetings</p>
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
              <p className="text-2xl font-bold text-white">{documentsCount}</p>
              <p className="text-xs font-semibold text-zinc-500 uppercase">Documents</p>
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
              <p className="text-2xl font-bold text-white">{actionItemsCount}</p>
              <p className="text-xs font-semibold text-zinc-500 uppercase">Action Items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
