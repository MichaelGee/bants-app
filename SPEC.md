# Football Match Chat Application - Technical Specification

## Project Overview

A real-time chat application that allows users to join football match-specific chat rooms. Users can enter their name, select a match, and participate in match discussions.

## Tech Stack

- **Framework**: React 19.1.1 with TypeScript
- **Routing**: React Router DOM 6.28.1
- **Styling**: Tailwind CSS 4.1.14
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **State Management**: React Query 5.90.5
- **Build Tool**: Vite 7.1.7

## Architecture & Design Principles

### 1. Component Structure (Atomic Design)

```
src/
├── pages/                    # Page-level components
│   ├── UserNamePage.tsx     # Step 1: Name entry
│   ├── MatchSelectionPage.tsx # Step 2: Match selection
│   └── ChatRoomPage.tsx     # Step 3: Chat interface
├── components/
│   ├── ui/                  # Shadcn components (existing)
│   └── features/            # Feature-specific components
│       ├── chat/
│       │   ├── ChatHeader.tsx
│       │   ├── ChatMessage.tsx
│       │   ├── ChatInput.tsx
│       │   └── MessageList.tsx
│       └── match/
│           └── MatchCard.tsx
├── hooks/                   # Custom React hooks
│   ├── useAuth.ts          # Username management
│   └── useLocalStorage.ts  # Generic local storage hook
├── types/                   # TypeScript definitions
│   └── index.ts
├── utils/                   # Utility functions
│   └── storage.ts          # Local storage utilities
└── routes/                  # Route configuration
    ├── index.tsx           # Route definitions
    └── ProtectedRoute.tsx  # Authentication guard
```

### 2. Routing Strategy

#### Route Definitions

```
/ (root)              → UserNamePage
/matches              → MatchSelectionPage (Protected)
/chat/:matchId        → ChatRoomPage (Protected)
```

#### Route Protection

- **Protected Routes**: `/matches` and `/chat/:matchId`
- **Authentication**: Check for `username` in localStorage
- **Redirect Logic**: If no username exists, redirect to `/`
- **Navigation Guards**: Implement `ProtectedRoute` component wrapper

### 3. Data Models

#### User Model

```typescript
interface User {
  id: string; // UUID generated on name submission
  username: string; // User's display name
  joinedAt: string; // ISO timestamp
}
```

#### Match Model

```typescript
interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeTeamLogo: string; // Emoji or icon
  awayTeamLogo: string;
  kickOffTime: Date;
  venue: string;
  competition: string; // e.g., "Premier League"
  status: 'scheduled' | 'live' | 'finished';
}
```

#### Message Model

```typescript
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

### 4. State Management

#### Local Storage Schema

```json
{
  "bants_user": {
    "id": "uuid-v4",
    "username": "John Doe",
    "joinedAt": "2025-10-16T10:30:00Z"
  },
  "bants_messages_<matchId>": [
    {
      "id": "msg-uuid",
      "matchId": "match-1",
      "userId": "user-uuid",
      "username": "John Doe",
      "content": "Great goal!",
      "timestamp": "2025-10-16T15:45:00Z",
      "isSystemMessage": false
    }
  ]
}
```

#### React Query Cache Strategy

- **Messages**: Cache per match with 5-minute stale time
- **Matches**: Cache globally with 10-minute stale time
- **Persistence**: Use async-storage-persister for offline support

### 5. Page Specifications

#### Page 1: UserNamePage (`/`)

**Purpose**: Capture user's display name for chat participation

**UI Components**:

- Hero section with app branding
- Input field for username (Shadcn Input)
- Submit button (Shadcn Button)
- Validation message area

**Validation Rules**:

- Minimum 2 characters
- Maximum 20 characters
- Alphanumeric with spaces allowed
- Trim whitespace

**User Flow**:

1. User enters name
2. Click "Join Bants" button
3. Generate UUID for user
4. Store in localStorage
5. Navigate to `/matches`

**Error Handling**:

- Show inline validation errors
- Display toast for storage failures

---

#### Page 2: MatchSelectionPage (`/matches`)

**Purpose**: Display available matches for users to join

**UI Components**:

- Header with user greeting
- Grid/List of match cards
- Logout button (clears localStorage)
- Loading skeletons

**Match Card Contents**:

- Team logos (emojis)
- Team names
- Kick-off time (formatted)
- Venue
- Competition badge
- Live indicator (if applicable)
- Participant count (mock data)

**Mock Data** (5-6 matches):

- Premier League fixtures
- Champions League matches
- Various time slots (today, upcoming)
- Mix of live and scheduled

**User Flow**:

1. View available matches
2. Click on desired match card
3. Navigate to `/chat/:matchId`
4. System message announces user joining

**Accessibility**:

- Keyboard navigation
- ARIA labels for screen readers
- Focus management

---

#### Page 3: ChatRoomPage (`/chat/:matchId`)

**Purpose**: Real-time chat interface for match discussion

**Layout**:

```
┌─────────────────────────────────────┐
│  ChatHeader (Match Info)            │
├─────────────────────────────────────┤
│                                      │
│  MessageList (Scrollable)           │
│  - System messages                  │
│  - User messages                    │
│  - Auto-scroll to bottom            │
│                                      │
├─────────────────────────────────────┤
│  ChatInput (Send message)           │
└─────────────────────────────────────┘
```

**ChatHeader Components**:

- Back button (navigate to `/matches`)
- Team names and logos
- Score display (mock live updates)
- Match time/status
- Online users count

**Message Types**:

- **User Messages**: Username, content, timestamp
- **System Messages**: "John joined the chat", match events
- **Own Messages**: Distinguished styling

**Chat Input Features**:

- Textarea with emoji support
- Character limit (500 chars)
- Send button / Enter to send
- Shift+Enter for new line
- Real-time character counter

**Message Persistence**:

- Store in localStorage per match
- Load on mount
- Simulate real-time with mock events

**Auto-scroll Behavior**:

- Scroll to bottom on new message
- Preserve position if user scrolled up
- "New messages" indicator

### 6. Feature Implementation Details

#### Authentication System

```typescript
// hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('bants_user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (username: string) => {
    const user = {
      id: crypto.randomUUID(),
      username,
      joinedAt: new Date().toISOString(),
    };
    localStorage.setItem('bants_user', JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('bants_user');
    setUser(null);
  };

  return { user, login, logout, isAuthenticated: !!user };
};
```

#### Protected Route Component

```typescript
// routes/ProtectedRoute.tsx
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

#### Mock Data Strategy

- **Matches**: Hard-coded array of 6 matches
- **Live Updates**: setTimeout to simulate score changes
- **Messages**: Periodic system messages (goals, cards, etc.)

### 7. Styling Guidelines

#### Design System

- **Colors**:
  - Primary: Football green (#00A859)
  - Secondary: Pitch lines white
  - Accent: Bright red for live indicators
  - Dark mode support via next-themes

- **Typography**:
  - Headers: Bold, large
  - Body: Regular, readable (16px base)
  - Timestamps: Small, muted

- **Spacing**: Tailwind spacing scale
- **Animations**: Subtle transitions (200-300ms)
- **Responsive**: Mobile-first design

#### Component Styling Patterns

- Use CVA (class-variance-authority) for variants
- Consistent padding/margins
- Card-based layouts
- Smooth hover states

### 8. Performance Optimizations

- **Code Splitting**: Lazy load pages with `React.lazy()`
- **Memoization**: `useMemo` for expensive computations
- **Virtualization**: If message list exceeds 100 items
- **Debouncing**: Chat input optimistic updates
- **Local Storage**: Limit message history (last 500 per match)

### 9. Error Boundaries & Fallbacks

- Page-level error boundaries
- Loading skeletons during navigation
- Offline indicators
- Storage quota exceeded handling

### 10. Testing Strategy (Future)

- **Unit Tests**: Hooks, utilities
- **Integration Tests**: Page flows
- **E2E Tests**: Complete user journeys
- **Accessibility Tests**: WCAG 2.1 AA compliance

### 11. Future Enhancements

- Real WebSocket integration
- User avatars
- Emoji reactions
- Message threading
- Push notifications
- Match predictions/polls
- GIF support
- Read receipts

## Implementation Checklist

### Phase 1: Foundation (30 min)

- [ ] Set up React Router
- [ ] Create route structure
- [ ] Implement useAuth hook
- [ ] Create ProtectedRoute component
- [ ] Define TypeScript types

### Phase 2: Page 1 - UserName (20 min)

- [ ] Create UserNamePage component
- [ ] Implement form validation
- [ ] Add localStorage integration
- [ ] Style with Shadcn components
- [ ] Add error handling

### Phase 3: Page 2 - Match Selection (30 min)

- [ ] Create MatchSelectionPage
- [ ] Design MatchCard component
- [ ] Generate mock match data
- [ ] Implement grid layout
- [ ] Add user greeting header
- [ ] Implement logout functionality

### Phase 4: Page 3 - Chat Room (45 min)

- [ ] Create ChatRoomPage layout
- [ ] Build ChatHeader component
- [ ] Implement MessageList with ScrollArea
- [ ] Create ChatMessage component
- [ ] Build ChatInput with validation
- [ ] Add message persistence
- [ ] Implement auto-scroll logic
- [ ] Add system messages

### Phase 5: Polish (15 min)

- [ ] Add loading states
- [ ] Implement transitions
- [ ] Test all user flows
- [ ] Mobile responsive checks
- [ ] Accessibility review

## Success Criteria

1. ✅ Users can enter username and persist it
2. ✅ Navigation guards prevent unauthorized access
3. ✅ All three pages are fully functional
4. ✅ Messages persist in localStorage
5. ✅ Clean, professional UI using Shadcn
6. ✅ Smooth user experience with proper feedback
7. ✅ Mobile responsive design
8. ✅ No console errors or warnings

---

**Estimated Total Time**: 2-3 hours for complete implementation
**Complexity Level**: Intermediate
**Priority**: High - Core MVP features
