import { useNavigate } from 'react-router-dom';
import type { Match } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  match: Match;
}

export function MatchCard({ match }: MatchCardProps) {
  const navigate = useNavigate();

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(date);
    }
  };

  const handleJoinChat = () => {
    navigate(`/chat/${match.id}`);
  };

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      {/* Live indicator */}
      {match.status === 'live' && (
        <div className="absolute right-4 top-4 z-10">
          <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            LIVE
          </span>
        </div>
      )}

      <div className="p-6">
        {/* Competition Badge */}
        <div className="mb-4 flex items-center justify-between">
          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {match.competition}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(match.kickOffTime)}
          </span>
        </div>

        {/* Teams */}
        <div className="mb-4 space-y-3">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {match.homeTeam.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {match.homeTeam}
              </span>
            </div>
            {match.status === 'live' && match.homeScore !== undefined && (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {match.homeScore}
              </span>
            )}
          </div>

          {/* VS Divider */}
          <div className="flex items-center justify-center">
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            <span className="px-3 text-xs font-medium text-gray-500 dark:text-gray-400">
              {match.status === 'live' ? 'LIVE' : 'VS'}
            </span>
            <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {match.awayTeam.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {match.awayTeam}
              </span>
            </div>
            {match.status === 'live' && match.awayScore !== undefined && (
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {match.awayScore}
              </span>
            )}
          </div>
        </div>

        {/* Match Info */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{match.venue}</span>
          </div>
          {match.status === 'scheduled' && (
            <div className="flex items-center gap-1">
              <span>🕐</span>
              <span>{formatTime(match.kickOffTime)}</span>
            </div>
          )}
        </div>

        {/* Join Button */}
        <Button
          onClick={handleJoinChat}
          className={cn(
            'w-full transition-all',
            match.status === 'live' &&
              'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
          )}
          size="lg"
        >
          {match.status === 'live' ? 'Join Live Chat 🔥' : 'Join Chat Room'}
        </Button>
      </div>

      {/* Hover effect */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-green-50 to-blue-50 opacity-0 transition-opacity group-hover:opacity-100 dark:from-green-900/10 dark:to-blue-900/10"></div>
    </div>
  );
}
