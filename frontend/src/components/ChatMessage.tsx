import { Bot, User, ExternalLink } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Markdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
  sources?: string[];
}

export function ChatMessage({ role, content, timestamp, sources }: ChatMessageProps) {
  return (
    <div className={`flex gap-4 ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {/* {role === 'assistant' && (
        <div className="shrink-0">
          <div className="h-10 w-10 rounded-xl bg-zinc-950 flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" strokeWidth={2.5} />
          </div>
        </div>
      )} */}
      
      <div
        className={`max-w-[95%] ${
          role === 'user'
            ? 'bg-zinc-200 text-black shadow-lg shadow-blue-600/20'
            : 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 shadow-sm'
        } rounded-2xl px-5 py-4`}
      >
        <div className="text-sm leading-relaxed font-medium prose prose-sm prose-invert max-w-none">
            <Markdown>
          {content}</Markdown>
        </div>
        
        {sources && sources.length > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-800">
            <p className="text-xs font-semibold text-zinc-400 mb-2">Sources:</p>
            <div className="space-y-1.5">
              {sources.map((source, i) => {
                // Check if source is a URL
                const isUrl = source.startsWith('http://') || source.startsWith('https://');
                
                return (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <ExternalLink className="h-3 w-3 mt-0.5 shrink-0 text-blue-400" />
                    {isUrl ? (
                      <a
                        href={source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 hover:underline break-all transition-colors"
                      >
                        {source}
                      </a>
                    ) : (
                      <span className="text-zinc-400 break-all">{source}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {timestamp && (
          <p className="text-xs mt-2 opacity-70">
            {formatDateTime(timestamp)}
          </p>
        )}
      </div>
      
      {/* {role === 'user' && (
        <div className="shrink-0">
          <div className="h-10 w-10 rounded-xl bg-zinc-800 shadow-lg flex items-center justify-center">
            <User className="h-5 w-5 text-zinc-300" strokeWidth={2.5} />
          </div>
        </div>
      )} */}
    </div>
  );
}
