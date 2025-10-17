import { useNavigate } from 'react-router-dom';
import type { Match } from '@/types';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wifi, WifiOff, Users, Loader2 } from 'lucide-react';

interface ChatHeaderProps {
  match: Match;
  isConnected?: boolean;
  hasStreamError?: boolean;
  connectedClients?: number;
  isConnecting?: boolean;
}

export function ChatHeader({
  match,
  isConnected = true,
  hasStreamError = false,
  connectedClients = 0,
  isConnecting = false,
}: ChatHeaderProps) {
  const navigate = useNavigate();

  const formatMatchTime = () => {
    if (match.status === 'live') {
      return 'LIVE NOW';
    }
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(match.kickOffTime);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="px-4 py-3">
        {/* Top Row */}
        <div className="mb-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/matches')} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {/* Connected Users Count */}
            {connectedClients > 0 && (
              <span className="flex items-center gap-1.5 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
                <Users className="h-3 w-3" />
                {connectedClients} {connectedClients === 1 ? 'user' : 'users'}
              </span>
            )}

            {/* Connection Status */}
            {hasStreamError ? (
              <span className="flex items-center gap-1.5 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                <WifiOff className="h-3 w-3" />
                Reconnecting...
              </span>
            ) : isConnecting ? (
              <span className="flex items-center gap-1.5 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
                <Loader2 className="h-3 w-3 animate-spin" />
                Connecting...
              </span>
            ) : !isConnected ? (
              <span className="flex items-center gap-1.5 rounded-full bg-gray-500 px-3 py-1 text-xs font-semibold text-white">
                <WifiOff className="h-3 w-3" />
                Offline
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                <Wifi className="h-3 w-3" />
                Connected
              </span>
            )}

            {/* Live Status */}
            {match.status === 'live' && (
              <span className="flex items-center gap-1.5 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                LIVE
              </span>
            )}
          </div>
        </div>

        {/* Match Info */}
        <div className="space-y-2">
          {/* Teams - Side by side with VS */}
          <div className="flex items-center justify-center gap-3">
            {/* Home Team */}
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                {match.homeTeam.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {match.homeTeam}
              </span>
              {match.status === 'live' && match.homeScore !== undefined && (
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {match.homeScore}
                </span>
              )}
            </div>

            {/* VS */}
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">VS</span>

            {/* Away Team */}
            <div className="flex items-center gap-2">
              {match.status === 'live' && match.awayScore !== undefined && (
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {match.awayScore}
                </span>
              )}
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {match.awayTeam}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {match.awayTeam.substring(0, 2).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center justify-between pt-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">📍 {match.venue}</span>
              <span>•</span>
              <span>{match.competition}</span>
            </div>
            <span>{formatMatchTime()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
