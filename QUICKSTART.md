# Quick Start Guide

## 🚀 Get Started in 3 Minutes

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Modern web browser

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Open your browser
# Visit http://localhost:5173
```

That's it! The app is now running with the live backend API.

## 📖 First Time Setup

### Step 1: Enter Your Name

1. Visit `http://localhost:5173`
2. Enter your name (2-20 characters)
3. Click "Join Bants"

### Step 2: Select a Match

1. Browse available matches
2. Click on any match card
3. You'll be taken to the chat room

### Step 3: Start Chatting

1. Type your message
2. Press Enter to send
3. Messages appear instantly for all users

## 🔧 Configuration

### Environment Variables

The app uses `.env` for configuration:

```bash
# .env file
VITE_API_BASE_URL=https://room-rant-backend.onrender.com
```

### For Local Backend Development

If you're running the backend locally:

```bash
# .env file
VITE_API_BASE_URL=http://localhost:8000
```

Then restart the dev server:

```bash
npm run dev
```

## 📚 Key Files to Know

### Service Layer

- `src/services/api.config.ts` - API configuration
- `src/services/rooms.service.ts` - Rooms/matches API
- `src/services/messages.service.ts` - Messages + SSE

### Custom Hooks

- `src/hooks/useAuth.ts` - User authentication
- `src/hooks/useMessageStream.ts` - SSE messaging

### Pages

- `src/pages/UserNamePage.tsx` - Name entry
- `src/pages/MatchSelectionPage.tsx` - Match selection
- `src/pages/ChatRoomPage.tsx` - Chat room

## 🎯 Common Tasks

### Adding a New API Endpoint

1. **Update API Config**

```typescript
// src/services/api.config.ts
export const API_CONFIG = {
  ENDPOINTS: {
    // Add new endpoint
    NEW_ENDPOINT: '/new-endpoint',
  },
};
```

2. **Create Service Function**

```typescript
// src/services/new.service.ts
export const getNewData = async () => {
  const response = await apiInstance.get(API_CONFIG.ENDPOINTS.NEW_ENDPOINT);
  return extractData(response);
};
```

3. **Create React Query Hook**

```typescript
export const useNewData = () => {
  return useQuery({
    queryKey: ['newData'],
    queryFn: getNewData,
  });
};
```

4. **Use in Component**

```typescript
const { data, isLoading, error } = useNewData();
```

### Debugging Connection Issues

Check the browser console for logs:

```
[API Request] GET /rooms
[API Response] /rooms {...}
[SSE] Connecting to: https://...
[SSE] Connection established
[SSE] Received heartbeat ping
```

### Viewing React Query State

The app includes React Query DevTools:

1. Look for the floating React Query icon (bottom-left in dev)
2. Click to open DevTools
3. View queries, mutations, and cache

## 🐛 Troubleshooting

### Messages Not Appearing

1. Check connection status badge (should be green "Connected")
2. Open browser console for errors
3. Verify API is accessible: `https://room-rant-backend.onrender.com/rooms`

### Connection Keeps Disconnecting

1. Check your network connection
2. Backend might be sleeping (first request takes longer)
3. Check browser console for SSE errors

### API Errors (400, 404, 500)

1. Check browser console for error details
2. Verify request payload matches API spec
3. See `API_DOCUMENTATION.md` for endpoint details

## 📖 Documentation

- `README.md` - Main documentation
- `API_DOCUMENTATION.md` - Backend API reference
- `SERVICE_ARCHITECTURE.md` - Architecture guide
- `IMPLEMENTATION_API.md` - Implementation summary
- `SPEC.md` - Original specification

## 🧪 Testing

### Run Type Checking

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎓 Learning Resources

### React Query

- [TanStack Query Docs](https://tanstack.com/query/latest/docs/react/overview)
- Used for: API calls, caching, loading states

### Server-Sent Events (SSE)

- [MDN EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- Used for: Real-time message streaming

### Axios

- [Axios Docs](https://axios-http.com/docs/intro)
- Used for: HTTP requests

## 💡 Tips

1. **Hot Reload**: Changes auto-reload in development
2. **Console Logs**: Development mode shows all API calls
3. **DevTools**: Use React Query DevTools to inspect cache
4. **Type Safety**: TypeScript catches errors before runtime
5. **Connection Status**: Always visible in chat header

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 📞 Support

- Check documentation in `docs/` folder
- Review code comments for explanations
- Check browser console for detailed logs

---

**Ready to build?** 🎉

Start the dev server: `npm run dev`
