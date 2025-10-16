# Service Layer Architecture Documentation

## Overview

The application follows a clean service layer architecture pattern that separates API logic from UI components. This ensures maintainability, testability, and scalability.

## Architecture Layers

```
┌─────────────────────────────────────┐
│         React Components            │
│  (Pages, Features, UI Components)   │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│      Custom React Query Hooks       │
│   (useRooms, useSendMessage, etc)   │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│         Service Layer               │
│   (rooms.service, messages.service) │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│      Axios Instance + Config        │
│   (api.instance, api.config)        │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│          Backend API                │
│   (room-rant-backend.onrender.com)  │
└─────────────────────────────────────┘
```

## Directory Structure

```
src/
├── services/
│   ├── api.config.ts         # API endpoints and configuration
│   ├── api.instance.ts       # Axios instance with interceptors
│   ├── rooms.service.ts      # Room/Match related API calls
│   ├── messages.service.ts   # Message sending and SSE streaming
│   └── index.ts              # Service exports
├── hooks/
│   ├── useMessageStream.ts   # SSE message streaming hook
│   ├── useAuth.ts            # Authentication hook
│   └── useLocalStorage.ts    # LocalStorage hook
├── types/
│   └── index.ts              # TypeScript types and converters
└── pages/
    ├── UserNamePage.tsx      # Uses useAuth
    ├── MatchSelectionPage.tsx# Uses useRooms
    └── ChatRoomPage.tsx      # Uses useRoom, useJoinRoom, useSendMessage, useMessageStream
```

## Service Layer Components

### 1. API Configuration (`api.config.ts`)

Centralizes all API configuration:

```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://room-rant-backend.onrender.com',
  ENDPOINTS: {
    ROOMS: '/rooms',
    JOIN_ROOM: (roomId: string) => `/rooms/${roomId}/join`,
    SEND_MESSAGE: (roomId: string) => `/rooms/${roomId}/messages`,
    STREAM_MESSAGES: (roomId: string) => `/rooms/${roomId}/stream`,
  },
  TIMEOUT: 30000,
};
```

### 2. Axios Instance (`api.instance.ts`)

Configured Axios instance with:

- Request/response interceptors
- Automatic error handling
- Response data extraction
- Development logging

```typescript
export const apiInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

**Features:**

- Automatic logging in development
- Standardized error handling
- Response unwrapping with `extractData()` helper

### 3. Rooms Service (`rooms.service.ts`)

Handles room/match operations:

**API Functions:**

- `getRooms()` - Fetch all available rooms
- `joinRoom(roomId, userData)` - Join a specific room

**React Query Hooks:**

- `useRooms()` - Query hook to fetch rooms (auto-converted to Match format)
- `useJoinRoom()` - Mutation hook to join a room
- `useRoom(roomId)` - Query hook to fetch a specific room

**Example Usage:**

```typescript
// In MatchSelectionPage.tsx
const { data: matches, isLoading, error, refetch } = useRooms();

// Automatically:
// - Fetches from API
// - Converts Room[] to Match[]
// - Caches data for 30 seconds
// - Refetches on window focus
```

### 4. Messages Service (`messages.service.ts`)

Handles message operations and SSE streaming:

**API Functions:**

- `sendMessage(roomId, messageData)` - Send a message to a room

**React Query Hooks:**

- `useSendMessage(roomId)` - Mutation hook to send messages

**SSE Management:**

- `SSEMessageStream` class - Manages Server-Sent Events connection
  - Automatic reconnection with exponential backoff
  - Heartbeat monitoring
  - Connection state management
  - Graceful cleanup

**Example Usage:**

```typescript
// Sending a message
const sendMessageMutation = useSendMessage(roomId);
sendMessageMutation.mutate({
  user_id: user.id,
  user_name: user.username,
  message: 'Hello!',
});

// SSE Streaming
const stream = new SSEMessageStream(
  roomId,
  message => console.log('New message:', message),
  error => console.error('Error:', error),
  () => console.log('Connected!')
);
stream.connect();
```

### 5. Custom Hooks

#### `useMessageStream` Hook

Manages SSE connection lifecycle and message state:

```typescript
const { messages, isConnected, error, reconnect } = useMessageStream({
  roomId: 'room123',
  enabled: true,
  onConnect: () => toast.success('Connected!'),
  onError: err => toast.error('Connection lost'),
});
```

**Features:**

- Automatic connection/disconnection
- Message deduplication
- Reconnection logic
- Connection state tracking

## Data Flow Examples

### Fetching Rooms (Matches)

```
1. Component calls: useRooms()
   ↓
2. React Query executes: getRooms()
   ↓
3. Service calls: apiInstance.get('/rooms')
   ↓
4. Backend returns: { status: 200, data: { rooms: [...] } }
   ↓
5. Service extracts: extractData(response)
   ↓
6. React Query transforms: rooms.map(roomToMatch)
   ↓
7. Component receives: Match[]
```

### Sending a Message

```
1. Component calls: sendMessageMutation.mutate({ ... })
   ↓
2. React Query executes: sendMessage(roomId, data)
   ↓
3. Service calls: apiInstance.post(`/rooms/${roomId}/messages`, data)
   ↓
4. Backend broadcasts message via SSE
   ↓
5. SSEMessageStream receives: onmessage event
   ↓
6. Hook updates: setMessages([...prev, newMessage])
   ↓
7. Component UI updates with new message
```

### Real-time Message Streaming

```
1. Component mounts with: useMessageStream({ roomId })
   ↓
2. Hook creates: new SSEMessageStream(roomId, handlers)
   ↓
3. Stream connects: new EventSource(`/rooms/${roomId}/stream`)
   ↓
4. Backend sends historical messages
   ↓
5. Stream receives: eventSource.onmessage
   ↓
6. Hook updates: setMessages([ ...historical ])
   ↓
7. [Wait for new messages...]
   ↓
8. New message arrives via SSE
   ↓
9. Hook adds to state: setMessages([...prev, new])
   ↓
10. Component renders new message
```

## React Query Configuration

The app uses React Query for:

- **Data Fetching** - Automatic caching and background updates
- **Mutations** - Optimistic updates and error handling
- **Cache Management** - Intelligent cache invalidation

**Configuration** (`src/config/ReactQuery.tsx`):

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIMES.DEFAULT, // 5 minutes
      refetchOnWindowFocus: true,
      retry: 2,
    },
  },
});
```

## Type Safety

### API Types (Backend Contract)

```typescript
interface Room {
  id: string;
  name: string;
  description: string;
  created_at: string;
  active_users: number;
}

interface StreamMessage {
  id: string;
  user_id: string;
  user_name: string;
  message: string;
  timestamp: string;
  room_id: string;
}
```

### Frontend Types

```typescript
interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  // ... frontend-specific fields
}

interface Message {
  id: string;
  matchId: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isSystemMessage: boolean;
}
```

### Type Converters

```typescript
// Convert backend Room to frontend Match
export const roomToMatch = (room: Room): Match => {
  /* ... */
};

// Convert backend StreamMessage to frontend Message
export const streamMessageToMessage = (streamMsg: StreamMessage): Message => {
  /* ... */
};
```

## Error Handling

### Axios Interceptor

Centralized error handling in `api.instance.ts`:

```typescript
apiInstance.interceptors.response.use(
  response => response,
  error => {
    // Handle different error scenarios
    if (error.response?.status === 404) {
      console.error('Not Found:', error.response.data?.message);
    }
    // ... other status codes
    return Promise.reject(error);
  }
);
```

### React Query Error Handling

```typescript
const { data, error } = useRooms();

if (error) {
  // Display error UI
  return <ErrorComponent message={error.message} />;
}
```

### SSE Error Handling

```typescript
const stream = new SSEMessageStream(roomId, onMessage, error => {
  console.error('SSE Error:', error);
  // Automatic reconnection kicks in
});
```

## Best Practices

### 1. Service Layer Pattern

✅ **DO:**

```typescript
// In component
const { data: matches } = useRooms();
```

❌ **DON'T:**

```typescript
// In component
const [matches, setMatches] = useState([]);
useEffect(() => {
  axios.get('https://api.example.com/rooms').then(res => setMatches(res.data));
}, []);
```

### 2. Query Keys

Use structured query keys for better cache management:

```typescript
// Good: Structured keys
['rooms'][('rooms', roomId)][('messages', roomId)][
  // Bad: Flat keys
  'roomsList'
]['roomDetail'];
```

### 3. Mutation Success Handlers

Invalidate relevant queries after mutations:

```typescript
const sendMessageMutation = useSendMessage(roomId);

// In mutate call
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
};
```

### 4. SSE Connection Management

Always clean up SSE connections:

```typescript
useEffect(() => {
  const stream = new SSEMessageStream(/* ... */);
  stream.connect();

  return () => {
    stream.disconnect(); // Cleanup!
  };
}, [roomId]);
```

## Testing Strategy

### Unit Tests

```typescript
// Test service functions
describe('getRooms', () => {
  it('should fetch rooms from API', async () => {
    const rooms = await getRooms();
    expect(rooms).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// Test hooks with React Query
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const { result } = renderHook(() => useRooms(), { wrapper });
```

## Performance Optimizations

1. **React Query Caching** - Reduces unnecessary API calls
2. **Stale Time Configuration** - Balance freshness vs performance
3. **SSE Heartbeat** - Detect dead connections early
4. **Message Deduplication** - Prevent duplicate messages in UI
5. **Automatic Reconnection** - Handle network issues gracefully

## Environment Configuration

Create `.env` file:

```bash
VITE_API_BASE_URL=https://room-rant-backend.onrender.com
```

For local development:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Monitoring and Debugging

### Development Logging

All API calls are logged in development mode:

```
[API Request] GET /rooms
[API Response] /rooms {...}
[SSE] Connecting to: https://...
[SSE] Connection established
[SSE] Received heartbeat ping
```

### React Query DevTools

Already configured in the app:

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Shows query state, cache, and mutations
```

## Migration from Mock Data

Before:

```typescript
// pages/MatchSelectionPage.tsx
import { MOCK_MATCHES } from '@/utils/mockData';
const matches = MOCK_MATCHES;
```

After:

```typescript
// pages/MatchSelectionPage.tsx
import { useRooms } from '@/services';
const { data: matches, isLoading, error } = useRooms();
```

## Summary

The service layer architecture provides:

✅ **Separation of Concerns** - API logic separate from UI  
✅ **Type Safety** - End-to-end TypeScript types  
✅ **Caching** - Automatic data caching via React Query  
✅ **Real-time** - SSE integration for live updates  
✅ **Error Handling** - Centralized error management  
✅ **Testability** - Easy to mock and test  
✅ **Maintainability** - Clear structure and patterns  
✅ **Scalability** - Easy to add new endpoints/features

This architecture follows industry best practices from companies like Google, Meta, and Amazon, ensuring the codebase is production-ready and maintainable.
