import { useEffect, useRef, useState } from 'react';
import type { Message } from '@/types';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const lastMessageCountRef = useRef(messages.length);
  const isUserAwayRef = useRef(false);

  // Track when user leaves/returns to the window
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isUserAwayRef.current = true;
      } else {
        // User returned - if they're at the bottom, clear indicator
        if (containerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
          const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
          if (isAtBottom) {
            setShowNewMessageIndicator(false);
            setUnreadCount(0);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Handle new messages
  useEffect(() => {
    if (messages.length > lastMessageCountRef.current) {
      const newMessageCount = messages.length - lastMessageCountRef.current;

      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

        // If user was away and returned, show indicator instead of auto-scrolling
        if (isUserAwayRef.current && !isAtBottom) {
          setShowNewMessageIndicator(true);
          setUnreadCount(prev => prev + newMessageCount);
          isUserAwayRef.current = false;
        } else if (isAtBottom) {
          // User is at bottom, auto-scroll
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        } else {
          // User is scrolled up but window is active, show indicator
          setShowNewMessageIndicator(true);
          setUnreadCount(prev => prev + newMessageCount);
        }
      }
    }
    lastMessageCountRef.current = messages.length;
  }, [messages]);

  // Handle manual scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (isAtBottom) {
        setShowNewMessageIndicator(false);
        setUnreadCount(0);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
      setShowNewMessageIndicator(false);
      setUnreadCount(0);
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

      {/* New Message Indicator */}
      {showNewMessageIndicator && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <Button onClick={scrollToBottom} className="gap-2 shadow-lg" size="sm" variant="default">
            <ArrowDown className="h-4 w-4" />
            {unreadCount > 0
              ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`
              : 'New messages'}
          </Button>
        </div>
      )}
    </div>
  );
}
