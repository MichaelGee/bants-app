/**
 * Messages Service
 * Handles message sending and real-time message streaming via SSE
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiInstance, extractData } from './api.instance';
import { API_CONFIG, SSE_CONFIG } from './api.config';
import type { ApiResponse } from './api.instance';
import type { SendMessageRequest, SendMessageResponse, StreamMessage, SSEEvent } from '../types';

// ============================================
// API Functions
// ============================================

/**
 * Send a message to a room
 */
export const sendMessage = async (
  roomId: string,
  messageData: SendMessageRequest
): Promise<SendMessageResponse> => {
  const response = await apiInstance.post<ApiResponse<SendMessageResponse>>(
    API_CONFIG.ENDPOINTS.SEND_MESSAGE(roomId),
    messageData
  );
  return extractData(response);
};

// ============================================
// React Query Hooks
// ============================================

/**
 * Hook to send a message to a room
 * Mutation hook with optimistic updates
 */
export const useSendMessage = (roomId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageData: SendMessageRequest) => sendMessage(roomId, messageData),
    onSuccess: () => {
      // Invalidate messages query to refetch
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    },
    onError: error => {
      console.error('Failed to send message:', error);
    },
  });
};

// ============================================
// SSE (Server-Sent Events) Management
// ============================================

/**
 * SSE Connection Manager
 * Handles EventSource connection with reconnection logic
 */
export class SSEMessageStream {
  private eventSource: EventSource | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimeout: ReturnType<typeof setTimeout> | null = null;
  private isManualClose = false;
  private roomId: string;
  private onMessage: (message: StreamMessage) => void;
  private onError?: (error: Event) => void;
  private onConnect?: () => void;

  constructor(
    roomId: string,
    onMessage: (message: StreamMessage) => void,
    onError?: (error: Event) => void,
    onConnect?: () => void
  ) {
    this.roomId = roomId;
    this.onMessage = onMessage;
    this.onError = onError;
    this.onConnect = onConnect;
  }

  /**
   * Start the SSE connection
   */
  connect(): void {
    if (this.eventSource) {
      console.warn('SSE connection already exists');
      return;
    }

    this.isManualClose = false;
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STREAM_MESSAGES(this.roomId)}`;

    if (import.meta.env.DEV) {
      console.log('[SSE] Connecting to:', url);
    }

    try {
      this.eventSource = new EventSource(url);

      // Handle incoming messages
      this.eventSource.onmessage = (event: MessageEvent) => {
        this.resetHeartbeat();

        try {
          const data: SSEEvent = JSON.parse(event.data);

          // Check if it's a ping
          if ('type' in data && data.type === 'ping') {
            if (import.meta.env.DEV) {
              console.log('[SSE] Heartbeat ping');
            }
            return;
          }

          // It's a real message
          this.onMessage(data as StreamMessage);
        } catch (error) {
          console.error('[SSE] Failed to parse message:', error);
        }
      };

      // Handle connection open
      this.eventSource.onopen = () => {
        if (import.meta.env.DEV) {
          console.log('[SSE] Connection established');
        }
        this.reconnectAttempts = 0;
        this.resetHeartbeat();
        this.onConnect?.();
      };

      // Handle errors
      this.eventSource.onerror = (error: Event) => {
        console.error('[SSE] Connection error:', error);
        this.clearHeartbeat();

        if (this.eventSource?.readyState === EventSource.CLOSED) {
          if (import.meta.env.DEV) {
            console.log('[SSE] Connection closed, attempting to reconnect...');
          }
          this.reconnect();
        }

        this.onError?.(error);
      };
    } catch (error) {
      console.error('[SSE] Failed to create EventSource:', error);
      this.reconnect();
    }
  }

  /**
   * Disconnect the SSE connection
   */
  disconnect(): void {
    this.isManualClose = true;
    this.clearReconnectTimeout();
    this.clearHeartbeat();

    if (this.eventSource) {
      if (import.meta.env.DEV) {
        console.log('[SSE] Closing connection');
      }
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  /**
   * Attempt to reconnect with exponential backoff
   */
  private reconnect(): void {
    if (this.isManualClose) {
      if (import.meta.env.DEV) {
        console.log('[SSE] Manual close, not reconnecting');
      }
      return;
    }

    if (this.reconnectAttempts >= SSE_CONFIG.MAX_RECONNECT_ATTEMPTS) {
      console.error('[SSE] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = SSE_CONFIG.RECONNECT_DELAY * this.reconnectAttempts;

    if (import.meta.env.DEV) {
      console.log(`[SSE] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    }

    this.clearReconnectTimeout();
    this.reconnectTimeout = setTimeout(() => {
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      this.connect();
    }, delay);
  }

  /**
   * Reset the heartbeat timeout
   */
  private resetHeartbeat(): void {
    this.clearHeartbeat();
    this.heartbeatTimeout = setTimeout(() => {
      console.warn('[SSE] Heartbeat timeout, reconnecting...');
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      this.reconnect();
    }, SSE_CONFIG.HEARTBEAT_TIMEOUT);
  }

  /**
   * Clear the heartbeat timeout
   */
  private clearHeartbeat(): void {
    if (this.heartbeatTimeout) {
      clearTimeout(this.heartbeatTimeout);
      this.heartbeatTimeout = null;
    }
  }

  /**
   * Clear the reconnect timeout
   */
  private clearReconnectTimeout(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /**
   * Get connection state
   */
  getState(): number | null {
    return this.eventSource?.readyState ?? null;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }
}
