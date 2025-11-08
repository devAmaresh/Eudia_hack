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
    <div className="bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-20 shadow-2xl relative">
      {/* Gradient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-blue-600/10 rounded-full blur-3xl" />
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-purple-600/10 rounded-full blur-3xl" />
      
      <div className="max-w-[1800px] mx-auto px-8 py-4 relative z-10">
        <div className="flex items-center gap-5">
          <Button asChild variant="outline" className="h-10 w-10 p-0 border-zinc-700/50 hover:bg-zinc-800/50 backdrop-blur-sm shadow-lg">
            <Link to="/cases">
              <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold tracking-tight text-zinc-100">
              {title}
            </h1>
            <p className="mt-1.5 text-xs font-semibold text-zinc-400 tracking-wider uppercase flex items-center gap-2">
              Case #{caseNumber}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={cn(
                getStatusColor(status),
                'text-xs tracking-wide uppercase px-4 py-2 rounded-lg bg-green-400/10 backdrop-blur-md border border-green-400/20 shadow-lg text-green-400 font-semibold'
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
