import { useQuery } from '@tanstack/react-query';
import { getEmailHistory } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, CheckCircle, XCircle, Clock, FileText, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface EmailLog {
  id: number;
  meeting_id: number;
  meeting_title: string;
  case_id: number;
  case_title: string;
  recipients: string[];
  subject: string;
  status: string;
  sent_at: string;
}

export default function EmailHistory() {
  const navigate = useNavigate();
  
  const { data: emailLogs, isLoading } = useQuery({
    queryKey: ['email-history'],
    queryFn: async () => {
      const response = await getEmailHistory();
      return response.data as EmailLog[];
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-10">
        <div className="px-8 py-8">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Email History</h1>
              <p className="mt-1 text-sm font-medium text-zinc-400">
                Track all meeting summaries shared via email
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <Card className="border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm">
          <CardHeader className="pb-6 border-b border-zinc-800/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-white">Sent Emails</CardTitle>
                <CardDescription className="mt-1.5 text-sm text-zinc-400">
                  {emailLogs?.length || 0} email{emailLogs?.length !== 1 ? 's' : ''} sent
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {emailLogs && emailLogs.length > 0 ? (
              <div className="divide-y divide-zinc-800/50">
                {emailLogs.map((log) => (
                  <div
                    key={log.id}
                    onClick={() => navigate(`/cases/${log.case_id}`)}
                    className="p-6 hover:bg-zinc-800/30 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-6">
                      {/* Left: Email Info */}
                      <div className="flex-1 space-y-3">
                        {/* Status & Time */}
                        <div className="flex items-center gap-3">
                          {log.status === 'sent' ? (
                            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-600/10 border border-emerald-600/20 rounded-md">
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.5} />
                              <span className="text-xs font-semibold tracking-wide uppercase text-emerald-400">
                                Sent
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 px-2.5 py-1 bg-red-600/10 border border-red-600/20 rounded-md">
                              <XCircle className="h-3.5 w-3.5 text-red-500" strokeWidth={2.5} />
                              <span className="text-xs font-semibold tracking-wide uppercase text-red-400">
                                Failed
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                            <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
                            <span>
                              {formatDistanceToNow(new Date(log.sent_at + 'Z'), { addSuffix: true })} • {new Date(log.sent_at + 'Z').toLocaleString('en-IN', { 
                                timeZone: 'Asia/Kolkata',
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-white">{log.subject}</p>
                        </div>

                        {/* Meeting & Case Info */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-blue-500 rounded-full" />
                            <FileText className="h-4 w-4 text-zinc-500" strokeWidth={2.5} />
                            <span className="text-xs font-medium text-zinc-400">
                              {log.meeting_title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-1 h-4 bg-violet-500 rounded-full" />
                            <Briefcase className="h-4 w-4 text-zinc-500" strokeWidth={2.5} />
                            <span className="text-xs font-medium text-zinc-400">
                              {log.case_title}
                            </span>
                          </div>
                        </div>

                        {/* Recipients */}
                        <div className="flex items-start gap-2">
                          <Mail className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" strokeWidth={2.5} />
                          <div className="flex flex-wrap gap-2">
                            {log.recipients.map((recipient, idx) => (
                              <Badge
                                key={idx}
                                variant="outline"
                                className="px-2 py-0.5 text-xs font-medium bg-zinc-800/50 border-zinc-700/50 text-zinc-300 hover:bg-zinc-800"
                              >
                                {recipient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <div className="inline-flex p-4 bg-zinc-800/30 rounded-full border border-zinc-800/50 mb-4">
                  <Mail className="h-8 w-8 text-zinc-600" strokeWidth={2} />
                </div>
                <p className="text-sm font-medium text-zinc-400">No emails sent yet</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Email history will appear here once you share meeting summaries
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
