/**
 * API Configuration
 * Centralized configuration for API base URL and endpoints
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://room-rant-backend.onrender.com',
  ENDPOINTS: {
    ROOMS: '/rooms',
    JOIN_ROOM: (roomId: string) => `/rooms/${roomId}/join`,
    SEND_MESSAGE: (roomId: string) => `/rooms/${roomId}/messages`,
    STREAM_MESSAGES: (roomId: string) => `/rooms/${roomId}/stream`,
  },
  TIMEOUT: 30000, // 30 seconds
} as const;

export const SSE_CONFIG = {
  RECONNECT_DELAY: 3000, // 3 seconds
  MAX_RECONNECT_ATTEMPTS: 5,
  HEARTBEAT_TIMEOUT: 45000, // 45 seconds (server sends ping every 30s)
} as const;
