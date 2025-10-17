/**
 * Custom hook for managing SSE message stream
 * Handles connection lifecycle and message state management
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { SSEMessageStream } from '../services/messages.service';
import { streamMessageToMessage } from '../types';
import type { Message, StreamMessage } from '../types';

interface UseMessageStreamOptions {
  roomId: string;
  enabled?: boolean;
  onConnect?: () => void;
  onError?: (error: Event) => void;
}

interface UseMessageStreamReturn {
  messages: Message[];
  isConnected: boolean;
  isConnecting: boolean;
  error: Event | null;
  reconnect: () => void;
  connectedClients: number;
}

/**
 * Hook to manage SSE message stream for a room
 * Automatically connects/disconnects based on enabled flag
 */
export const useMessageStream = ({
  roomId,
  enabled = true,
  onConnect,
  onError,
}: UseMessageStreamOptions): UseMessageStreamReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Event | null>(null);
  const [connectedClients, setConnectedClients] = useState(0);
  const streamRef = useRef<SSEMessageStream | null>(null);

  // Store callbacks in refs to avoid recreating handlers
  const onConnectRef = useRef(onConnect);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onConnectRef.current = onConnect;
    onErrorRef.current = onError;
  }, [onConnect, onError]);

  // Handle incoming messages
  const handleMessage = useCallback((streamMessage: StreamMessage) => {
    const message = streamMessageToMessage(streamMessage);

    // Update connected clients count
    setConnectedClients(streamMessage.connected_clients);

    setMessages(prev => {
      // Check if message already exists (avoid duplicates)
      if (prev.some(m => m.id === message.id)) {
        return prev;
      }
      return [...prev, message];
    });
  }, []);

  // Handle connection established
  const handleConnect = useCallback(() => {
    setIsConnected(true);
    setIsConnecting(false);
    setError(null);
    onConnectRef.current?.();
  }, []);

  // Handle errors
  const handleError = useCallback((err: Event) => {
    setIsConnected(false);
    setIsConnecting(false);
    setError(err);
    onErrorRef.current?.(err);
  }, []);

  // Reconnect function
  const reconnect = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.disconnect();
    }
    setMessages([]);
    setError(null);
    setIsConnecting(true);

    const stream = new SSEMessageStream(roomId, handleMessage, handleError, handleConnect);
    stream.connect();
    streamRef.current = stream;
  }, [roomId, handleMessage, handleError, handleConnect]);

  // Setup and cleanup SSE connection
  useEffect(() => {
    if (!enabled || !roomId) {
      // Disconnect if disabled or no roomId
      if (streamRef.current) {
        streamRef.current.disconnect();
        streamRef.current = null;
      }
      setIsConnected(false);
      setIsConnecting(false);
      return;
    }

    // Create new SSE connection
    setIsConnecting(true);
    const stream = new SSEMessageStream(roomId, handleMessage, handleError, handleConnect);
    stream.connect();
    streamRef.current = stream;

    // Cleanup on unmount or when dependencies change
    return () => {
      if (streamRef.current) {
        streamRef.current.disconnect();
        streamRef.current = null;
      }
      setIsConnected(false);
      setIsConnecting(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, enabled]); // Only reconnect when roomId or enabled changes

  return {
    messages,
    isConnected,
    isConnecting,
    error,
    reconnect,
    connectedClients,
  };
};
