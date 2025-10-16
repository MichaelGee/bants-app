import type { Message } from '@/types';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
  isOwnMessage: boolean;
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  if (message.isSystemMessage) {
    return (
      <div className="flex justify-center py-2">
        <div className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn('flex flex-col gap-1 px-4 py-2', isOwnMessage ? 'items-end' : 'items-start')}
    >
      {/* Username and timestamp */}
      {!isOwnMessage && (
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-gray-700 dark:text-gray-300">{message.username}</span>
          <span className="text-gray-500 dark:text-gray-400">{formatTime(message.timestamp)}</span>
        </div>
      )}

      {/* Message bubble */}
      <div
        className={cn(
          'max-w-[75%] break-words rounded-2xl px-4 py-2',
          isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : 'bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white'
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
      </div>

      {/* Own message timestamp */}
      {isOwnMessage && (
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {formatTime(message.timestamp)}
        </span>
      )}
    </div>
  );
}
