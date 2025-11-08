import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getMeeting, getMeetingInsights, sendMeetingSummary } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import {
  ArrowLeft,
  Mail,
  Plus,
  X,
  Send,
  Calendar,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Insight } from "@/types";

interface Recipient {
  email: string;
  name: string;
}

export default function ShareMeeting() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const [sidebarOpen] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const { data: meeting, isLoading: loadingMeeting } = useQuery({
    queryKey: ["meeting", meetingId],
    queryFn: () => getMeeting(Number(meetingId)),
    select: (response) => response.data,
  });

  const { data: insights, isLoading: loadingInsights } = useQuery({
    queryKey: ["meeting-insights", meetingId],
    queryFn: () => getMeetingInsights(Number(meetingId)),
    select: (response) => response.data as Insight[],
  });

  const sendEmailMutation = useMutation({
    mutationFn: (data: {
      meeting_id: number;
      recipients: Array<{ email: string; name?: string }>;
    }) => sendMeetingSummary(data),
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate(-1);
      }, 3000);
    },
    onError: () => {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    },
  });

  const addRecipient = () => {
    if (!newEmail.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert("Please enter a valid email address");
      return;
    }

    // Check for duplicates
    if (recipients.some((r) => r.email === newEmail)) {
      alert("This email is already in the list");
      return;
    }

    setRecipients([...recipients, { email: newEmail, name: newName }]);
    setNewEmail("");
    setNewName("");
  };

  const removeRecipient = (email: string) => {
    setRecipients(recipients.filter((r) => r.email !== email));
  };

  const handleSend = () => {
    if (recipients.length === 0) {
      alert("Please add at least one recipient");
      return;
    }

    sendEmailMutation.mutate({
      meeting_id: Number(meetingId),
      recipients: recipients.map((r) => ({
        email: r.email,
        name: r.name || "",
      })),
    });
  };

  if (loadingMeeting || loadingInsights) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-400">Loading meeting data...</div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-zinc-400">Meeting not found</div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      critical: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return colors[severity as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="min-h-screen bg-black">
      <Sidebar />

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300 min-h-screen",
          sidebarOpen ? "ml-72" : "ml-[72px]"
        )}
      >
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Success Message */}
            {showSuccess && (
              <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
                <Card className="bg-emerald-500/10 border-emerald-500/20 p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium text-sm">
                      Meeting summary sent successfully!
                    </span>
                  </div>
                </Card>
              </div>
            )}

            {/* Error Message */}
            {showError && (
              <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top">
                <Card className="bg-red-500/10 border-red-500/20 p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-medium text-sm">
                      Failed to send email. Please check your configuration.
                    </span>
                  </div>
                </Card>
              </div>
            )}

            {/* Header */}
            <div className="mb-8 border-b border-zinc-800/50 pb-6">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 text-zinc-400 hover:text-white hover:bg-zinc-900 -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <Mail className="w-5 h-5 text-zinc-400" strokeWidth={2} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    Share Meeting Summary
                  </h1>
                  <p className="text-zinc-500 text-sm mt-1">
                    Send meeting minutes and AI insights to participants via
                    email
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Recipients */}
              <div className="space-y-6">
                {/* Add Recipients Card */}
                <Card className="bg-zinc-950 border-zinc-800 p-6">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    Add Recipients
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="email"
                        className="text-zinc-400 mb-2 block text-xs font-medium uppercase tracking-wide"
                      >
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="participant@example.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-10"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="name"
                        className="text-zinc-400 mb-2 block text-xs font-medium uppercase tracking-wide"
                      >
                        Name (Optional)
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addRecipient()}
                        className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 h-10"
                      />
                    </div>

                    <Button
                      onClick={addRecipient}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm font-medium"
                    >
                      <Plus className="w-4 h-4 mr-2" strokeWidth={2} />
                      Add Recipient
                    </Button>
                  </div>
                </Card>

                {/* Recipients List */}
                <Card className="bg-zinc-950 border-zinc-800 p-6">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center justify-between uppercase tracking-wide">
                    <span className="flex items-center gap-2">
                      <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                      Recipients ({recipients.length})
                    </span>
                  </h2>

                  {recipients.length === 0 ? (
                    <div className="text-center py-12 text-zinc-600 text-sm">
                      No recipients added yet
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {recipients.map((recipient) => (
                        <div
                          key={recipient.email}
                          className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-white font-medium truncate text-sm">
                              {recipient.name || recipient.email}
                            </div>
                            {recipient.name && (
                              <div className="text-xs text-zinc-500 truncate">
                                {recipient.email}
                              </div>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeRecipient(recipient.email)}
                            className="text-zinc-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8 p-0"
                          >
                            <X className="w-3.5 h-3.5" strokeWidth={2} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Send Button */}
                <Button
                  onClick={handleSend}
                  disabled={
                    recipients.length === 0 || sendEmailMutation.isPending
                  }
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 text-sm font-semibold"
                >
                  <Send className="w-4 h-4 mr-2" strokeWidth={2} />
                  {sendEmailMutation.isPending
                    ? "Sending..."
                    : `Send to ${recipients.length} Recipient${
                        recipients.length !== 1 ? "s" : ""
                      }`}
                </Button>
              </div>

              {/* Right Column - Preview */}
              <div className="space-y-6">
                {/* Meeting Info */}
                <Card className="bg-zinc-950 border-zinc-800 p-6">
                  <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                    <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                    Meeting Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <div className="text-zinc-500 text-xs mb-1 flex items-center gap-2 uppercase tracking-wide font-medium">
                        <FileText className="w-3 h-3" strokeWidth={2} />
                        Title
                      </div>
                      <div className="text-white font-medium text-sm">
                        {meeting.title}
                      </div>
                    </div>

                    <div>
                      <div className="text-zinc-500 text-xs mb-1 flex items-center gap-2 uppercase tracking-wide font-medium">
                        <Calendar className="w-3 h-3" strokeWidth={2} />
                        Date
                      </div>
                      <div className="text-white text-sm">
                        {new Date(meeting.meeting_date).toLocaleString()}
                      </div>
                    </div>

                    {meeting.summary && (
                      <div>
                        <div className="text-zinc-500 text-xs mb-2 uppercase tracking-wide font-medium">
                          Summary
                        </div>
                        <div
                          className="text-zinc-400 text-sm bg-zinc-900/40 rounded-lg p-4 border border-zinc-800/60
                 leading-relaxed max-h-48 overflow-y-auto backdrop-blur-sm scrollbar-thin
                 scrollbar-thumb-zinc-700/40 scrollbar-track-transparent hover:scrollbar-thumb-zinc-500/50 transition-all duration-300"
                        >
                          {meeting.summary}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Insights Preview */}
                {insights && insights.length > 0 && (
                  <Card className="bg-zinc-950 border-zinc-800 p-6">
                    <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
                      <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                      AI Insights ({insights.length})
                    </h2>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {insights.slice(0, 5).map((insight) => (
                        <div
                          key={insight.id}
                          className="p-4 rounded-lg bg-zinc-900 border border-zinc-800"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex items-center gap-2 text-zinc-500 text-[10px] uppercase tracking-wider font-semibold">
                              <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                              {insight.type.replace("_", " ")}
                            </div>
                            <Badge
                              className={cn(
                                getSeverityColor(insight.severity),
                                "text-[10px] px-2 py-0.5 uppercase tracking-wide font-semibold"
                              )}
                            >
                              {insight.severity}
                            </Badge>
                          </div>
                          <div className="text-white font-medium mb-1 text-sm">
                            {insight.title}
                          </div>
                          <div className="text-zinc-500 text-xs line-clamp-2 leading-relaxed">
                            {insight.description}
                          </div>
                        </div>
                      ))}
                      {insights.length > 5 && (
                        <div className="text-center text-zinc-600 text-xs py-2 font-medium">
                          + {insights.length - 5} more insights will be included
                        </div>
                      )}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
