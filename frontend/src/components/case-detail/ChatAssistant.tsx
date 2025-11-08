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
    <Card className="border-zinc-800/80 bg-zinc-950 shadow-xl sticky top-24 overflow-hidden">
      <CardHeader className="bg-zinc-900 text-white pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 rounded-lg bg-zinc-950/10 backdrop-blur-sm">
              <Bot className="h-5 w-5" strokeWidth={2.5} />
            </div>
            Legal AI Assistant
          </CardTitle>
          <Button
            onClick={onNewChat}
            size="sm"
            variant="outline"
            className="bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 text-zinc-300 h-8 px-3"
          >
            <Plus className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} />
            New
          </Button>
        </div>
        <CardDescription className="text-zinc-200 text-xs font-medium mt-2">
          Ask questions about this case, meetings, and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-6">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-zinc-300 mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-sm font-semibold text-zinc-500 mb-2">Start a conversation</p>
              <p className="text-xs text-zinc-400">Ask me anything about this case</p>
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
        <div className="border-t border-zinc-800 p-4 bg-zinc-900/50">
          {/* Web Search Toggle */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={onToggleWebSearch}
                size="sm"
                variant={webSearchEnabled ? 'default' : 'outline'}
                className={cn(
                  'h-7 px-3 text-xs font-semibold transition-all',
                  webSearchEnabled
                    ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
                    : 'bg-zinc-800/50 border-zinc-700 hover:bg-zinc-800 text-zinc-400'
                )}
              >
                <Globe className="h-3.5 w-3.5 mr-1.5" strokeWidth={2.5} />
                Web Search
              </Button>
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">
              {webSearchEnabled ? 'Searching web + case context' : 'Case context only'}
            </p>
          </div>

          <div className="flex gap-2">
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
              className="resize-none border-zinc-800 focus:border-zinc-900 focus:ring-zinc-900 min-h-20 text-sm"
            />
            <Button
              onClick={onSendMessage}
              disabled={!input.trim() || isLoading}
              className="bg-linear-to-r from-zinc-900 to-zinc-700 hover:from-zinc-800 hover:to-zinc-600 text-white shadow-lg shadow-zinc-900/25 h-auto px-4"
            >
              <Send className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </div>
          <p className="text-[10px] text-zinc-400 mt-2 font-medium">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
