import { useEffect, useRef, useState } from 'react';
import type { Message } from '@/types';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  // Monitor scroll position to show/hide scroll button
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

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
    <div className="relative flex flex-1 flex-col overflow-hidden">
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

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <div className="absolute bottom-6 right-6 z-10">
          <Button
            onClick={scrollToBottom}
            size="icon"
            className="h-10 w-10 rounded-full shadow-lg"
            variant="default"
          >
            <ChevronDown className="!h-6 !w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
