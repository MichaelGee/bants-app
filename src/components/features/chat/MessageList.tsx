import { useEffect, useRef } from 'react';
import type { Message } from '@/types';
import { ChatMessage } from './ChatMessage';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <span className="text-4xl">💬</span>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            No messages yet. Be the first to say something!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="py-4">
        {messages.map(message => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwnMessage={message.userId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
