import { Bot, User } from 'lucide-react';
import type { Message } from '../lib/supabase';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-4 p-4 ${isUser ? 'bg-white' : 'bg-blue-50'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-gray-200' : 'bg-blue-500'
      }`}>
        {isUser ? (
          <User className="w-5 h-5 text-gray-600" />
        ) : (
          <Bot className="w-5 h-5 text-white" />
        )}
      </div>
      <div className="flex-1 prose prose-sm max-w-none">
        <p className="text-gray-800 whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
