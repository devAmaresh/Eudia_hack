import { Card, CardContent } from '@/components/ui/card';
import { FileText, Calendar, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Case } from '@/types';

interface CaseInfoProps {
  caseData: Case;
}

export function CaseInfo({ caseData }: CaseInfoProps) {
  return (
    <Card className="border-zinc-800/80 bg-zinc-950 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Case Number and Status */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              <FileText className="h-4 w-4" strokeWidth={2.5} />
              Case Number
            </div>
            <p className="text-lg font-bold text-white">{caseData.case_number}</p>
          </div>
        </div>

        {/* Client Side */}
        {caseData.client_side && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              Client Side / Representation
            </div>
            <div className="flex items-center gap-3">
              <div>
                <p className="text-base font-semibold text-white capitalize">{caseData.client_side}</p>
                <p className="text-sm text-zinc-400 mt-0.5">
                  You are representing the {caseData.client_side} in this case
                </p>
              </div>
            </div>
            <div className="mt-3 p-4 rounded-lg bg-blue-950/30 border border-blue-900/30">
              <p className="text-sm text-blue-200 leading-relaxed">
                <span className="font-semibold">AI Context:</span> The legal assistant will tailor responses
                considering your position as the {caseData.client_side}, providing strategic insights and
                recommendations aligned with your client's interests.
              </p>
            </div>
          </div>
        )}

        {/* Description */}
        {caseData.description && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              <FileText className="h-4 w-4" strokeWidth={2.5} />
              Description
            </div>
            <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                {caseData.description}
              </p>
            </div>
          </div>
        )}

        {/* Timestamps */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-zinc-800/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              <Calendar className="h-4 w-4" strokeWidth={2.5} />
              Created
            </div>
            <p className="text-sm font-medium text-zinc-400">{formatDate(caseData.created_at)}</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
              <Clock className="h-4 w-4" strokeWidth={2.5} />
              Last Updated
            </div>
            <p className="text-sm font-medium text-zinc-400">{formatDate(caseData.updated_at)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
