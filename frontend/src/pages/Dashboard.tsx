import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { formatDate, getSeverityColor, getPriorityColor, getStatusColor, cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await getDashboardData();
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = data?.statistics;

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="bg-zinc-900/50 backdrop-blur-xl border-b border-zinc-800/50 sticky top-0 z-10">
        <div className="px-8 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="mt-2 text-sm font-medium text-zinc-400">
            Comprehensive overview of your legal matters and critical insights
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          <Card className="border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-600 to-blue-500" />
            <CardHeader className="pb-2 pt-6">
              <CardDescription className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500">Total Cases</CardDescription>
              <CardTitle className="text-4xl font-bold tracking-tight text-white">{stats?.total_cases || 0}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <FileText className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>All time records</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-emerald-600 to-emerald-500" />
            <CardHeader className="pb-2 pt-6">
              <CardDescription className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500">Active Cases</CardDescription>
              <CardTitle className="text-4xl font-bold tracking-tight text-white">{stats?.active_cases || 0}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Currently ongoing</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-violet-600 to-violet-500" />
            <CardHeader className="pb-2 pt-6">
              <CardDescription className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500">Total Meetings</CardDescription>
              <CardTitle className="text-4xl font-bold tracking-tight text-white">{stats?.total_meetings || 0}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <Calendar className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Sessions recorded</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-amber-600 to-amber-500" />
            <CardHeader className="pb-2 pt-6">
              <CardDescription className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500">Pending Actions</CardDescription>
              <CardTitle className="text-4xl font-bold tracking-tight text-white">{stats?.pending_action_items || 0}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <Clock className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>Require attention</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-200 overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-red-600 to-red-500" />
            <CardHeader className="pb-2 pt-6">
              <CardDescription className="text-[11px] font-semibold tracking-wider uppercase text-zinc-500">Critical Insights</CardDescription>
              <CardTitle className="text-4xl font-bold tracking-tight text-white">{stats?.critical_insights || 0}</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
                <AlertCircle className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span>High priority items</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="cases" className="space-y-6">
          <TabsList className="bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/60 p-1 h-auto shadow-sm">
            <TabsTrigger value="cases" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-zinc-900/20 font-semibold text-xs tracking-tight px-6 py-2.5 rounded-lg">Recent Cases</TabsTrigger>
            <TabsTrigger value="insights" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-zinc-900/20 font-semibold text-xs tracking-tight px-6 py-2.5 rounded-lg">Critical Insights</TabsTrigger>
            <TabsTrigger value="deadlines" className="data-[state=active]:bg-zinc-800 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-zinc-900/20 font-semibold text-xs tracking-tight px-6 py-2.5 rounded-lg">Upcoming Deadlines</TabsTrigger>
          </TabsList>

          <TabsContent value="cases" className="space-y-4">
            <Card className="border-zinc-800/60 bg-zinc-900/80 backdrop-blur-sm shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-bold tracking-tight text-white">Recent Cases</CardTitle>
                <CardDescription className="text-sm font-medium text-zinc-400">Latest matters added to the system</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.recent_cases && data.recent_cases.length > 0 ? (
                  <div className="space-y-3">
                    {data.recent_cases.map((caseItem) => (
                      <Link
                        key={caseItem.id}
                        to={`/cases/${caseItem.id}`}
                        className="block p-5 rounded-xl border border-zinc-800/60 hover:border-zinc-900 hover:shadow-lg hover:shadow-zinc-900/5 transition-all duration-200 bg-zinc-900/50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <h3 className="font-bold text-[15px] tracking-tight text-white">{caseItem.title}</h3>
                              <Badge className={cn(getStatusColor(caseItem.status), "font-semibold text-[10px] tracking-wide uppercase px-2.5 py-0.5")}>
                                {caseItem.status}
                              </Badge>
                            </div>
                            <p className="text-xs font-semibold text-zinc-500 mt-1.5 tracking-wide uppercase">
                              Case #{caseItem.case_number}
                            </p>
                            {caseItem.description && (
                              <p className="text-sm font-medium text-zinc-400 mt-3 line-clamp-2">
                                {caseItem.description}
                              </p>
                            )}
                          </div>
                          <div className="text-xs font-semibold text-zinc-500 tracking-wide">
                            {formatDate(caseItem.created_at)}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="mx-auto h-12 w-12 text-zinc-400" />
                    <p className="mt-4 text-sm text-zinc-500">No cases yet</p>
                    <Link
                      to="/cases"
                      className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700"
                    >
                      Create your first case
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Critical Insights</CardTitle>
                <CardDescription>High priority items requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                {data?.critical_insights && data.critical_insights.length > 0 ? (
                  <div className="space-y-3">
                    {data.critical_insights.map((insight) => (
                      <div
                        key={insight.id}
                        className="p-4 rounded-lg border border-zinc-900"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-zinc-200">{insight.title}</h4>
                              <Badge className={getSeverityColor(insight.severity)}>
                                {insight.severity}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {insight.type.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-300 mt-1">{insight.description}</p>
                            {insight.timestamp && (
                              <p className="text-xs text-zinc-400 mt-2">
                                Timestamp: {insight.timestamp}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <p className="mt-4 text-sm text-zinc-500">No critical insights</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deadlines" className="space-y-4">
            <Card className="border-zinc-800/60 bg-zinc-900/50 shadow-xl">
              <CardHeader className="border-b border-zinc-800/60">
                <CardTitle className="text-white">Upcoming Deadlines</CardTitle>
                <CardDescription className="text-zinc-400">Action items with approaching due dates</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {data?.upcoming_deadlines && data.upcoming_deadlines.length > 0 ? (
                  <div className="space-y-3">
                    {data.upcoming_deadlines.map((item) => (
                      <div
                        key={item.id}
                        className="p-5 rounded-lg border border-zinc-800/60 bg-zinc-950/50 hover:bg-zinc-900/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-white">{item.title}</h4>
                              <Badge className={cn(getPriorityColor(item.priority), "text-xs font-semibold")}>
                                {item.priority}
                              </Badge>
                              <Badge className={cn(getStatusColor(item.status), "text-xs font-semibold")}>
                                {item.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-400 mb-3">{item.description}</p>
                            {item.assigned_to && (
                              <div className="flex items-center gap-2 text-xs text-zinc-500">
                                <span className="font-semibold">Assigned to:</span>
                                <span>{item.assigned_to}</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <div className="flex items-center gap-2 text-sm font-semibold text-amber-400 mb-1">
                              <Clock className="h-4 w-4" />
                              {item.due_date ? formatDate(item.due_date) : 'No date'}
                            </div>
                            <p className="text-xs text-zinc-500">Due Date</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clock className="mx-auto h-16 w-16 text-zinc-600" strokeWidth={1.5} />
                    <p className="mt-4 text-sm font-medium text-zinc-500">No upcoming deadlines</p>
                    <p className="text-xs text-zinc-600 mt-1">All caught up!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}



