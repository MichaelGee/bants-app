import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import { ProtectedRoute } from '@/routes/ProtectedRoute';
import { UserNamePage } from '@/pages/UserNamePage';
import { MatchSelectionPage } from '@/pages/MatchSelectionPage';
import { ChatRoomPage } from '@/pages/ChatRoomPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<UserNamePage />} />
        <Route
          path="/matches"
          element={
            <ProtectedRoute>
              <MatchSelectionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:matchId"
          element={
            <ProtectedRoute>
              <ChatRoomPage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ReactQueryDevtools initialIsOpen={false} />
    </BrowserRouter>
  );
}

export default App;
