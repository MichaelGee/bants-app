// User Types
export interface User {
  id: string;
  username: string;
  joinedAt: string;
}

// Match Types - Maps to Room from API
export type MatchStatus = 'scheduled' | 'live' | 'finished';

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickOffTime: Date;
  venue: string;
  competition: string;
  status: MatchStatus;
  homeScore?: number;
  awayScore?: number;
  active_users?: number;
}

// Message Types
export interface Message {
  id: string;
  matchId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isSystemMessage: boolean;
}

// Storage Keys
export const STORAGE_KEYS = {
  USER: 'bants_user',
  MESSAGES: (matchId: string) => `bants_messages_${matchId}`,
} as const;

// ============================================
// API Response Types (from backend)
// ============================================

/**
 * Room object from API
 * Represents a chat room (football match)
 */
export interface Room {
  id: string;
  name: string;
  description: string;
  league: string;
  kickoff_time: string;
  stadium: string;
  created_at: string;
  active_users: number;
}

/**
 * Response when fetching all rooms
 */
export interface RoomsResponse {
  rooms: Room[];
  total_rooms: number;
}

/**
 * Request body for joining a room
 */
export interface JoinRoomRequest {
  user_id: string;
  user_name: string;
}

/**
 * Response when joining a room
 */
export interface JoinRoomResponse {
  room_id: string;
  user_id: string;
  user_name: string;
}

/**
 * Request body for sending a message
 */
export interface SendMessageRequest {
  user_id: string;
  user_name: string;
  message: string;
}

/**
 * Response when sending a message
 */
export interface SendMessageResponse {
  message_id: string;
  room_id: string;
}

/**
 * Message object from SSE stream
 * Represents a chat message in real-time
 */
export interface StreamMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  timestamp: string;
  room_id: string;
  connected_clients: number;
}

/**
 * Keep-alive ping from SSE stream
 */
export interface StreamPing {
  type: 'ping';
}

/**
 * Union type for SSE events
 */
export type SSEEvent = StreamMessage | StreamPing;

// ============================================
// Helper Functions for Type Conversion
// ============================================

/**
 * Convert API Room to frontend Match
 */
export const roomToMatch = (room: Room): Match => {
  // Parse team names from room name (e.g., "Chelsea vs Barca")
  const teams = room.name.split(' vs ').map(t => t.trim());
  const homeTeam = teams[0] || 'Team A';
  const awayTeam = teams[1] || 'Team B';

  return {
    id: room.id,
    homeTeam,
    awayTeam,
    kickOffTime: new Date(room.kickoff_time),
    venue: room.stadium,
    competition: room.league,
    status: 'live' as MatchStatus, // Assume all rooms are live
    active_users: room.active_users,
  };
};

/**
 * Convert API StreamMessage to frontend Message
 */
export const streamMessageToMessage = (streamMsg: StreamMessage): Message => {
  return {
    id: streamMsg.id,
    matchId: streamMsg.room_id,
    userId: streamMsg.user_id,
    username: streamMsg.user_name,
    content: streamMsg.message,
    timestamp: new Date(streamMsg.timestamp),
    isSystemMessage: false,
  };
};

/**
 * Check if SSE event is a ping
 */
export const isPing = (event: SSEEvent): event is StreamPing => {
  return 'type' in event && event.type === 'ping';
};
