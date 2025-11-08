import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { getStatusColor, cn } from '@/lib/utils';

interface CaseHeaderProps {
  caseNumber: string;
  title: string;
  status: string;
}

export function CaseHeader({ caseNumber, title, status }: CaseHeaderProps) {
  return (
    <div className="bg-zinc-950/90 backdrop-blur-2xl border-b border-zinc-800/80 sticky top-0 z-20 shadow-2xl">
      <div className="max-w-[1800px] mx-auto px-8 py-3">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" className="h-8 w-8 p-0">
            <Link to="/cases">
              <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-bold tracking-tight text-white">{title}</h1>
            <p className="mt-1 text-xs font-semibold text-zinc-500 tracking-wider uppercase">
              Case #{caseNumber}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                getStatusColor(status),
                'text-xs tracking-wide uppercase px-3 py-1.5 rounded-md bg-green-400/10 backdrop-blur-md border border-green-400/20 shadow-sm text-green-400'
              )}
            >
              {status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
