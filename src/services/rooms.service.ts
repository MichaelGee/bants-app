/**
 * Rooms Service
 * Handles all room-related API operations (fetching rooms, joining rooms)
 */

import { useQuery, useMutation } from '@tanstack/react-query';
import { apiInstance, extractData } from './api.instance';
import { API_CONFIG } from './api.config';
import type { ApiResponse } from './api.instance';
import type { RoomsResponse, JoinRoomRequest, JoinRoomResponse, Match } from '../types';
import { roomToMatch } from '../types';

// ============================================
// API Functions
// ============================================

/**
 * Fetch all available rooms
 */
export const getRooms = async (): Promise<RoomsResponse> => {
  const response = await apiInstance.get<ApiResponse<RoomsResponse>>(API_CONFIG.ENDPOINTS.ROOMS);
  return extractData(response);
};

/**
 * Join a specific room
 */
export const joinRoom = async (
  roomId: string,
  userData: JoinRoomRequest
): Promise<JoinRoomResponse> => {
  const response = await apiInstance.post<ApiResponse<JoinRoomResponse>>(
    API_CONFIG.ENDPOINTS.JOIN_ROOM(roomId),
    userData
  );
  return extractData(response);
};

// ============================================
// React Query Hooks
// ============================================

/**
 * Hook to fetch all available rooms (matches)
 * Returns rooms converted to Match format for frontend
 */
export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: getRooms,
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true,
    select: (data): Match[] => {
      // Transform Room[] to Match[]
      return data.rooms.map(roomToMatch);
    },
  });
};

/**
 * Hook to join a room
 * Mutation hook for joining a specific room
 */
export const useJoinRoom = () => {
  return useMutation({
    mutationFn: ({ roomId, userData }: { roomId: string; userData: JoinRoomRequest }) =>
      joinRoom(roomId, userData),
    onError: error => {
      console.error('Failed to join room:', error);
    },
  });
};

/**
 * Hook to get a specific room by ID
 * Useful for displaying room details
 */
export const useRoom = (roomId: string | undefined) => {
  return useQuery({
    queryKey: ['rooms', roomId],
    queryFn: getRooms,
    enabled: !!roomId, // Only run query if roomId is provided
    staleTime: 30000,
    select: (data): Match | undefined => {
      const room = data.rooms.find(r => r.id === roomId);
      return room ? roomToMatch(room) : undefined;
    },
  });
};
