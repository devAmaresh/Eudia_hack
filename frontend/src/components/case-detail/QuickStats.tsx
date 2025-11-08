import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, FileText, CheckSquare } from 'lucide-react';

interface QuickStatsProps {
  meetingsCount: number;
  documentsCount: number;
  actionItemsCount: number;
}

export function QuickStats({ meetingsCount, documentsCount, actionItemsCount }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-900/60 transition-all duration-200 hover:shadow-lg hover:shadow-purple-900/10 hover:border-purple-800/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 shadow-lg shadow-purple-900/50">
              <Lightbulb className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{meetingsCount}</p>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Meetings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-900/60 transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/10 hover:border-blue-800/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg shadow-blue-900/50">
              <FileText className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{documentsCount}</p>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Documents</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-sm hover:bg-zinc-900/60 transition-all duration-200 hover:shadow-lg hover:shadow-green-900/10 hover:border-green-800/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-600 to-green-700 shadow-lg shadow-green-900/50">
              <CheckSquare className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">{actionItemsCount}</p>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-1">Action Items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
