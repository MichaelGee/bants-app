import { useEffect, useCallback, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRoom, useJoinRoom, useSendMessage } from '@/services';
import { useMessageStream } from '@/hooks/useMessageStream';
import { ChatHeader } from '@/components/features/chat/ChatHeader';
import { MessageList } from '@/components/features/chat/MessageList';
import { ChatInput } from '@/components/features/chat/ChatInput';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export function ChatRoomPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const { user } = useAuth();
  const hasJoinedRef = useRef(false); // Track if we've already joined

  // Fetch match/room details
  const { data: match, isLoading: isLoadingMatch, error: matchError } = useRoom(matchId);

  // Join room mutation
  const joinRoomMutation = useJoinRoom();

  // Send message mutation
  const sendMessageMutation = useSendMessage(matchId || '');

  // SSE message stream
  const {
    messages,
    isConnected,
    error: streamError,
  } = useMessageStream({
    roomId: matchId || '',
    enabled: !!matchId && !!user,
    onConnect: () => {
      toast.success('Connected to chat! ⚽');
    },
    onError: error => {
      console.error('Stream error:', error);
      toast.error('Connection lost. Trying to reconnect...');
    },
  });

  // Join room when component mounts (only once)
  useEffect(() => {
    if (!matchId || !user || hasJoinedRef.current) return;

    hasJoinedRef.current = true; // Mark as joined

    joinRoomMutation.mutate({
      roomId: matchId,
      userData: {
        user_id: user.id,
        user_name: user.username,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchId, user?.id]); // Only depend on matchId and user.id

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!matchId || !user) return;

      sendMessageMutation.mutate(
        {
          user_id: user.id,
          user_name: user.username,
          message: content,
        },
        {
          onSuccess: () => {
            // Message sent successfully
            // SSE will update the UI automatically
          },
          onError: error => {
            console.error('Failed to send message:', error);
            toast.error('Failed to send message. Please try again.');
          },
        }
      );
    },
    [matchId, user, sendMessageMutation]
  );

  // Loading state
  if (isLoadingMatch) {
    return (
      <div className="flex h-svh flex-col bg-gray-100 dark:bg-gray-950">
        {/* Centered container with max-width */}
        <div className="mx-auto flex h-full w-full max-w-2xl flex-col bg-white shadow-lg dark:bg-gray-900">
          <div className="border-b border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-48" />
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-gray-600 dark:text-gray-400">Loading match details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error or not found
  if (matchError || !match) {
    toast.error('Match not found');
    return <Navigate to="/matches" replace />;
  }

  return (
    <div className="flex h-svh flex-col bg-gray-100 dark:bg-gray-950">
      {/* Centered container with max-width */}
      <div className="mx-auto flex h-full w-full max-w-2xl flex-col bg-white shadow-lg dark:bg-gray-900">
        <ChatHeader match={match} isConnected={isConnected} hasStreamError={!!streamError} />
        <MessageList messages={messages} currentUserId={user?.id || ''} />
        <ChatInput
          onSendMessage={handleSendMessage}
          disabled={sendMessageMutation.isPending || !isConnected}
        />
      </div>
    </div>
  );
}
