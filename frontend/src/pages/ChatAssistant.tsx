import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCases,
  sendChatMessage,
  getChatSessions,
  getChatHistory,
  deleteChatSession,
} from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Bot,
  FileText,
  MessageSquare,
  Trash2,
  Plus,
  Hash,
  Clock,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatSession, ChatHistoryMessage } from "@/types";
import { ChatMessage } from "@/components/ChatMessage";

interface ChatMsg {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  sources?: string[];
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [selectedCase, setSelectedCase] = useState<string>("");
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: cases } = useQuery({
    queryKey: ["cases"],
    queryFn: async () => {
      const response = await getCases();
      return response.data;
    },
  });

  const { data: chatSessions, refetch: refetchSessions } = useQuery({
    queryKey: ["chatSessions"],
    queryFn: async () => {
      const response = await getChatSessions();
      return response.data as ChatSession[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteChatSession,
    onSuccess: () => {
      refetchSessions();
      if (
        currentSessionId &&
        chatSessions?.find((s) => s.session_id === currentSessionId)
      ) {
        startNewChat();
      }
    },
  });

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (response) => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
          timestamp: new Date(),
          sources: response.data.sources,
        },
      ]);
      setCurrentSessionId(response.data.session_id);
      refetchSessions();
    },
  });

  const loadChatHistory = async (sessionId: string) => {
    try {
      const response = await getChatHistory(sessionId);
      const history = response.data as ChatHistoryMessage[];

      const loadedMessages: ChatMsg[] = [];
      history.forEach((msg) => {
        loadedMessages.push({
          role: "user",
          content: msg.user_message,
          timestamp: new Date(msg.created_at),
        });
        loadedMessages.push({
          role: "assistant",
          content: msg.bot_response,
          timestamp: new Date(msg.created_at),
          sources: msg.sources,
        });
      });

      setMessages(loadedMessages);
      setCurrentSessionId(sessionId);

      // Set the case if it exists
      const session = chatSessions?.find((s) => s.session_id === sessionId);
      if (session?.case) {
        setSelectedCase(session.case.id.toString());
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const startNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hello! I'm Lexicase AI, your legal assistant. I can help you with questions about your cases, meetings, and legal insights. How can I assist you today?",
        timestamp: new Date(),
      },
    ]);
    setCurrentSessionId(null);
    setSelectedCase("");
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMsg = {
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    chatMutation.mutate({
      message: input,
      case_id: selectedCase ? parseInt(selectedCase) : undefined,
      session_id: currentSessionId || undefined,
      web_search: webSearchEnabled,
    });
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat thread?")) {
      deleteMutation.mutate(sessionId);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Start with a new chat on mount
    startNewChat();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Chat History Sidebar */}
      <div className="w-80 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-zinc-800 shrink-0">
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2.5 mb-4">
            <MessageSquare className="h-4 w-4" strokeWidth={2.5} />
            Chat History
          </h2>
          <Button
            onClick={startNewChat}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
          >
            <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
            New Chat
          </Button>
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-2">
              {chatSessions && chatSessions.length > 0 ? (
                chatSessions.map((session) => (
                  <Card
                    key={session.session_id}
                    className={cn(
                      "border-zinc-800 cursor-pointer transition-colors hover:bg-zinc-900 group",
                      currentSessionId === session.session_id
                        ? "bg-zinc-900 border-blue-600"
                        : "bg-transparent"
                    )}
                    onClick={() => loadChatHistory(session.session_id)}
                  >
                    <CardContent className="p-4 overflow-visible">
                      <div className="flex items-start gap-3 mb-2.5">
                        <p className="text-sm font-semibold text-white line-clamp-2 flex-1 overflow-hidden leading-snug">
                          {session.first_message}
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 shrink-0 text-zinc-500 hover:text-red-400 hover:bg-transparent"
                          onClick={(e) =>
                            handleDeleteSession(session.session_id, e)
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                        </Button>
                      </div>

                      {session.case && (
                        <div className="flex flex-wrap items-center gap-2 mb-2.5">
                          <Badge className="text-[10px] font-bold bg-blue-600/10 text-blue-500 border-blue-600/20 shrink-0">
                            {session.case.case_number}
                          </Badge>
                          <span className="text-xs font-medium text-zinc-500 leading-snug wrap-break-word">
                            {session.case.title}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mt-2">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="h-3 w-3" strokeWidth={2} />
                          <span>{session.message_count}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" strokeWidth={2} />
                          <span>
                            {new Date(session.updated_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card className="border-zinc-800 bg-transparent">
                  <CardContent className="text-center py-12">
                    <MessageSquare
                      className="h-10 w-10 text-zinc-700 mx-auto mb-3"
                      strokeWidth={2}
                    />
                    <p className="text-sm font-semibold text-zinc-600">
                      No chat history yet
                    </p>
                    <p className="text-xs font-medium text-zinc-700 mt-1">
                      Start a new conversation
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-zinc-950 border-b border-zinc-800">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  AI Legal Assistant
                </h1>
                <p className="mt-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                  {currentSessionId
                    ? `Session ${currentSessionId.substring(0, 8)}`
                    : "New conversation"}
                </p>
              </div>
              <div className="w-80">
                <Select value={selectedCase} onValueChange={setSelectedCase}>
                  <SelectTrigger className="bg-zinc-900 border-zinc-800 font-medium text-sm">
                    <SelectValue placeholder="Select a case (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cases</SelectItem>
                    {cases?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.case_number} - {c.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden p-8">
          {/* Messages */}
          <Card className="flex-1 flex flex-col overflow-hidden border-zinc-800 bg-zinc-950">
            <ScrollArea className="flex-1 p-8" ref={scrollRef}>
              <div className="space-y-6 max-w-4xl mx-auto max-h-[60vh] overflow-auto">
                {messages.map((message, index) => (
                  <ChatMessage
                    key={index}
                    role={message.role}
                    content={message.content}
                    timestamp={message.timestamp}
                    sources={message.sources}
                  />
                ))}
                {chatMutation.isPending && (
                  <div className="flex gap-4 justify-start">
                    <div className="shrink-0">
                      <div className="h-9 w-9 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Bot className="h-5 w-5 text-white" strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3">
                      <div className="flex gap-1.5">
                        <div
                          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-zinc-800 p-5">
              {/* Web Search Toggle */}
              <div className="mb-4 flex items-center justify-between">
                <Button
                  onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  size="sm"
                  variant={webSearchEnabled ? "default" : "outline"}
                  className={cn(
                    "h-8 px-4 text-xs font-bold transition-colors",
                    webSearchEnabled
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      : "bg-transparent border-zinc-700 hover:border-zinc-600 text-zinc-400 hover:text-zinc-300"
                  )}
                >
                  <Globe className="h-3.5 w-3.5 mr-2" strokeWidth={2.5} />
                  Web Search
                </Button>
                {webSearchEnabled && (
                  <span className="text-xs text-blue-500 font-semibold">
                    Searching web + case data
                  </span>
                )}
              </div>

              <form onSubmit={handleSend} className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    webSearchEnabled
                      ? "Ask anything - searching web + cases..."
                      : "Ask about cases, meetings, insights..."
                  }
                  className="flex-1 h-11 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 font-medium text-sm focus-visible:border-blue-600"
                  disabled={chatMutation.isPending}
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || chatMutation.isPending}
                  className="h-11 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  <Send className="h-4 w-4" strokeWidth={2.5} />
                </Button>
              </form>
              <p className="text-xs font-medium text-zinc-600 mt-3 px-1">
                {selectedCase &&
                cases?.find((c) => c.id.toString() === selectedCase)
                  ? `Context: ${
                      cases?.find((c) => c.id.toString() === selectedCase)
                        ?.title
                    }`
                  : "Tip: Select a case for more relevant responses"}
              </p>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="mt-5 grid grid-cols-2 gap-3 max-w-4xl mx-auto w-full">
            <Button
              onClick={() =>
                setInput("What are the critical insights from recent meetings?")
              }
              variant="outline"
              className="h-11 bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900 justify-start font-semibold text-sm"
            >
              <FileText className="h-4 w-4 mr-2.5" strokeWidth={2} />
              Critical insights
            </Button>
            <Button
              onClick={() => setInput("What are the pending action items?")}
              variant="outline"
              className="h-11 bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900 justify-start font-semibold text-sm"
            >
              <FileText className="h-4 w-4 mr-2.5" strokeWidth={2} />
              Pending actions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
