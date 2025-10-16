import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { MatchCard } from '@/components/features/match/MatchCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useRooms } from '@/services';
import { AlertCircle } from 'lucide-react';

export function MatchSelectionPage() {
  const { user, logout } = useAuth();
  const { data: matches, isLoading, error, refetch } = useRooms();

  return (
    <div className="min-h-svh bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚽</span>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bants</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, <span className="font-medium">{user?.username}</span>!
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Select a Match</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Join a chat room and discuss the game with other fans
          </p>
        </div>

        {/* Matches Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800"
              >
                <Skeleton className="mb-4 h-4 w-24" />
                <Skeleton className="mb-2 h-8 w-full" />
                <Skeleton className="mb-2 h-8 w-full" />
                <Skeleton className="mb-4 h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-12 dark:border-gray-700 dark:bg-gray-800">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Failed to load matches
            </h3>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
              {error instanceof Error ? error.message : 'An error occurred while fetching matches'}
            </p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : matches && matches.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map(match => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <span className="text-6xl">⚽</span>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              No matches available
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Check back later for upcoming matches
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
