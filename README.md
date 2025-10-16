# Bants - Football Match Chat Application ⚽

A real-time football match chat application built with React, TypeScript, and Shadcn UI. Users can enter their name, select a match, and participate in match-specific chat rooms with **real-time Server-Sent Events (SSE)** messaging.

## 🎯 Features

- **User Authentication**: Name-based authentication with localStorage persistence
- **Real-time Match Data**: Fetches live matches from backend API
- **Match Selection**: Browse and select from available match chat rooms
- **Real-time Chat**: Send and receive messages instantly via SSE (Server-Sent Events)
- **Live Connection Status**: Visual indicators for connection state
- **Protected Routes**: Route guards prevent unauthorized access
- **Responsive Design**: Mobile-first responsive layout
- **Dark Mode Support**: Built-in dark mode compatibility
- **Auto-Reconnection**: Automatic reconnection on network failures
- **Enterprise Architecture**: Service layer pattern with React Query

## 🏗️ Architecture

### Tech Stack

- **Framework**: React 19.1.1
- **Language**: TypeScript
- **Routing**: React Router DOM 6.28.1
- **State Management**: React Query (TanStack Query) 5.90.5
- **HTTP Client**: Axios 1.12.2
- **Real-time**: Server-Sent Events (SSE)
- **Styling**: Tailwind CSS 4.1.14
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Build Tool**: Vite 7.1.7

### Service Layer Architecture

The application follows enterprise-grade service layer pattern:

```
Components → React Query Hooks → Services → Axios → Backend API
```

**Key Services:**

- `rooms.service.ts` - Room/Match management
- `messages.service.ts` - Message sending & SSE streaming
- `api.instance.ts` - Axios configuration & interceptors
- `api.config.ts` - API endpoints & configuration

See [SERVICE_ARCHITECTURE.md](./SERVICE_ARCHITECTURE.md) for detailed documentation.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_BASE_URL=https://room-rant-backend.onrender.com
```

For local backend development:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## 📱 User Flow

### Step 1: Enter Your Name (`/`)

- Visit the home page
- Enter your name (2-20 characters, alphanumeric)
- Click "Join Bants"
- Your name is saved to localStorage

### Step 2: Select a Match (`/matches`)

- **Fetches live matches from API**
- View available match chat rooms
- See match details (teams, venue, competition)
- Click on any match card to join its chat room

### Step 3: Chat Room (`/chat/:matchId`)

- **Automatically joins the room** (POST /rooms/:roomId/join)
- **Real-time SSE connection** established
- **Receives historical messages** immediately
- Send messages to the room
- **Instant message delivery** to all participants
- View connection status (Connected/Offline/Reconnecting)
- **Auto-reconnection** on network issues

## 🔐 Authentication & Route Protection

### How It Works

1. **User Creation**: When a user enters their name:
   - A unique UUID is generated
   - User object is stored in localStorage under key `bants_user`

2. **Protected Routes**: `/matches` and `/chat/:matchId` are protected:
   - `ProtectedRoute` component checks for user in localStorage
   - Unauthenticated users are redirected to `/`

3. **Room Joining**: When entering a chat room:
   - Frontend sends POST request to `/rooms/:roomId/join`
   - Backend registers user in the room
   - SSE connection established for real-time updates

4. **Logout**: Clears user data from localStorage

### localStorage Schema

```json
{
  "bants_user": {
    "id": "uuid-v4",
    "username": "John Doe",
    "joinedAt": "2025-10-16T10:30:00Z"
  }
}
```

## 🌐 API Integration

### Backend API

**Base URL**: `https://room-rant-backend.onrender.com`

**Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

### Key Endpoints

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| GET    | `/rooms`                  | Fetch all available rooms |
| POST   | `/rooms/:roomId/join`     | Join a specific room      |
| POST   | `/rooms/:roomId/messages` | Send a message            |
| GET    | `/rooms/:roomId/stream`   | SSE message stream        |

### Real-time Messaging (SSE)

The application uses **Server-Sent Events** for real-time messaging:

1. **Connection**: `EventSource` connects to `/rooms/:roomId/stream`
2. **Historical Messages**: All past messages sent immediately on connect
3. **Live Updates**: New messages pushed as they arrive
4. **Heartbeat**: Server sends ping every 30 seconds
5. **Auto-Reconnect**: Client reconnects automatically on disconnect

### Data Flow

```
User sends message
     ↓
Frontend → POST /rooms/:roomId/messages
     ↓
Backend broadcasts via SSE
     ↓
All connected clients receive message
     ↓
UI updates automatically
```

## 🛠️ Service Layer

### React Query Hooks

**Rooms/Matches:**

```typescript
const { data: matches, isLoading, error } = useRooms();
const joinRoomMutation = useJoinRoom();
const { data: match } = useRoom(roomId);
```

**Messages:**

```typescript
const sendMessageMutation = useSendMessage(roomId);
const { messages, isConnected, error } = useMessageStream({ roomId });
```

### Benefits

✅ Automatic caching with React Query  
✅ Background refetching  
✅ Optimistic updates  
✅ Error handling  
✅ Loading states  
✅ Type safety  
✅ Easy testing

See [SERVICE_ARCHITECTURE.md](./SERVICE_ARCHITECTURE.md) for complete documentation.

## 📂 Project Structure

```
src/
├── services/              # API service layer
│   ├── api.config.ts      # API configuration
│   ├── api.instance.ts    # Axios instance
│   ├── rooms.service.ts   # Rooms/matches API
│   ├── messages.service.ts# Messages & SSE
│   └── index.ts           # Service exports
├── hooks/                 # Custom React hooks
│   ├── useAuth.ts         # Authentication
│   ├── useMessageStream.ts# SSE message streaming
│   └── useLocalStorage.ts # LocalStorage wrapper
├── components/
│   ├── features/          # Feature-specific components
│   │   ├── chat/          # Chat components
│   │   └── match/         # Match components
│   └── ui/                # Shadcn UI components
├── pages/                 # Route pages
│   ├── UserNamePage.tsx   # Name entry
│   ├── MatchSelectionPage.tsx # Match selection
│   └── ChatRoomPage.tsx   # Chat room
├── routes/                # Routing configuration
│   └── ProtectedRoute.tsx # Route guards
├── types/                 # TypeScript types
│   └── index.ts           # All type definitions
├── utils/                 # Utility functions
│   └── storage.ts         # LocalStorage utilities
├── config/                # App configuration
│   └── ReactQuery.tsx     # React Query setup
└── App.tsx                # Main app component
```

      "isSystemMessage": false
    }

]
}

```

## 💬 Chat Features

### Message Types

1. **User Messages**: Display username, timestamp, and content
2. **System Messages**: User join notifications and match events

### Chat Input

- 500 character limit with counter
- Enter to send, Shift+Enter for new line
- Real-time validation and feedback

### Auto-scroll

- Automatically scrolls to bottom on new messages
- Smooth scrolling animation

## 📊 Mock Data

The app includes 6 mock matches:

1. **Chelsea vs Manchester United** (Premier League) - LIVE
2. **Liverpool vs Arsenal** (Premier League) - LIVE
3. **Manchester City vs Tottenham** (Premier League) - Scheduled
4. **Real Madrid vs Barcelona** (La Liga) - Scheduled
5. **Bayern Munich vs Borussia Dortmund** (Bundesliga) - Scheduled
6. **PSG vs Marseille** (Ligue 1) - Scheduled

Live matches simulate events every 45 seconds (goals, cards, saves, etc.)

## 🎯 Project Structure

```

src/
├── pages/ # Page components
│ ├── UserNamePage.tsx # Name entry
│ ├── MatchSelectionPage.tsx # Match selection
│ └── ChatRoomPage.tsx # Chat interface
├── components/
│ ├── ui/ # Shadcn UI components
│ └── features/ # Feature components
│ ├── chat/ # Chat components
│ └── match/ # Match components
├── hooks/ # Custom React hooks
├── routes/ # Route configuration
├── types/ # TypeScript definitions
├── utils/ # Utility functions
└── App.tsx # Main app with router

````

## 📝 Key Files

- **SPEC.md**: Comprehensive technical specification document
- **src/types/index.ts**: TypeScript type definitions
- **src/hooks/useAuth.ts**: Authentication logic
- **src/utils/storage.ts**: localStorage utilities
- **src/utils/mockData.ts**: Mock match data

## 🔧 Available Scripts

```bash
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Run ESLint
npm run prettier  # Format code
npm run preview   # Preview production build
````

## 🚧 Future Enhancements

- Real WebSocket integration for live chat
- User avatars and profiles
- Emoji reactions to messages
- Push notifications
- Match predictions and polls
- Message search and threading

## 📄 License

MIT

---

Built with ⚽ following best practices from top tech companies.
