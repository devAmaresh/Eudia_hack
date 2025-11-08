import { useRef, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatMessage } from '@/components/ChatMessage';
import { Bot, Plus, Send, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMsg {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  sources?: string[];
}

interface ChatAssistantProps {
  messages: ChatMsg[];
  input: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onNewChat: () => void;
  isLoading: boolean;
  webSearchEnabled: boolean;
  onToggleWebSearch: () => void;
}

export function ChatAssistant({
  messages,
  input,
  onInputChange,
  onSendMessage,
  onNewChat,
  isLoading,
  webSearchEnabled,
  onToggleWebSearch,
}: ChatAssistantProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="border-zinc-800/50 bg-zinc-900/30 backdrop-blur-xl shadow-2xl sticky top-24 overflow-hidden">
      <CardHeader className="bg-gradient-to-b from-zinc-900 to-zinc-900/50 text-white pb-5 border-b border-zinc-800/50 relative">
        {/* Gradient Glow */}
        <div className="absolute top-0 right-0 w-48 h-24 bg-blue-600/10 rounded-full blur-3xl" />
        
        <div className="flex items-center justify-between relative z-10">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-3">
            Legal AI Assistant
          </CardTitle>
          <Button
            onClick={onNewChat}
            size="sm"
            variant="outline"
            className="bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 h-9 px-4 font-semibold backdrop-blur-sm shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" strokeWidth={2.5} />
            New
          </Button>
        </div>
        <CardDescription className="text-zinc-300 text-sm font-medium mt-3">
          Ask questions about this case, meetings, and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-6 bg-zinc-950/20">
          {messages.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 inline-block mb-5 shadow-lg shadow-blue-900/50">
                <Bot className="h-16 w-16 text-white mx-auto" strokeWidth={2} />
              </div>
              <p className="text-base font-bold text-zinc-300 mb-2">Start a conversation</p>
              <p className="text-sm text-zinc-500">Ask me anything about this case</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <ChatMessage
                  key={idx}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                  sources={msg.sources}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="p-2 rounded-lg bg-linear-to-br from-zinc-900 to-zinc-700 shadow-lg h-fit">
                    <Bot className="h-4 w-4 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="bg-linear-to-br from-zinc-50 to-zinc-100 rounded-2xl px-4 py-3 border border-zinc-800/50">
                    <div className="flex gap-1.5">
                      <div
                        className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce"
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          )}
        </ScrollArea>
        <div className="border-t border-zinc-800/50 p-5 bg-zinc-900/50 backdrop-blur-sm">
          {/* Web Search Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={onToggleWebSearch}
                size="sm"
                variant={webSearchEnabled ? 'default' : 'outline'}
                className={cn(
                  'h-9 px-4 text-xs font-bold transition-all shadow-lg',
                  webSearchEnabled
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-blue-600'
                    : 'bg-zinc-800/50 border-zinc-700/50 hover:bg-zinc-800 text-zinc-400 backdrop-blur-sm'
                )}
              >
                <Globe className="h-4 w-4 mr-2" strokeWidth={2.5} />
                Web Search
              </Button>
            </div>
            <p className="text-xs text-zinc-400 font-semibold">
              {webSearchEnabled ? 'Searching web + case context' : 'Case context only'}
            </p>
          </div>

          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage();
                }
              }}
              placeholder={
                webSearchEnabled ? 'Ask anything - searching web + case context...' : 'Ask about this case...'
              }
              className="resize-none border-zinc-800/50 focus:border-zinc-700 focus:ring-zinc-700 min-h-20 text-sm bg-zinc-950/50 backdrop-blur-sm shadow-lg font-medium"
            />
            <Button
              onClick={onSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-900/50 h-auto px-5 font-semibold"
            >
              <Send className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </div>
          <p className="text-xs text-zinc-500 mt-3 font-medium">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
