/**
 * Services Index
 * Central export point for all service modules
 */

// API Configuration
export { API_CONFIG, SSE_CONFIG } from './api.config';

// API Instance
export { apiInstance, extractData } from './api.instance';
export type { ApiResponse, ApiError } from './api.instance';

// Rooms Service
export { getRooms, joinRoom, useRooms, useJoinRoom, useRoom } from './rooms.service';

// Messages Service
export { sendMessage, useSendMessage, SSEMessageStream } from './messages.service';
