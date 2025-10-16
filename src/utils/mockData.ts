import type { Match } from '@/types';

export const MOCK_MATCHES: Match[] = [
  {
    id: 'match-1',
    homeTeam: 'Chelsea',
    awayTeam: 'Manchester United',
    kickOffTime: new Date('2025-10-16T19:45:00'),
    venue: 'Stamford Bridge',
    competition: 'Premier League',
    status: 'live',
    homeScore: 2,
    awayScore: 1,
  },
  {
    id: 'match-2',
    homeTeam: 'Liverpool',
    awayTeam: 'Arsenal',
    kickOffTime: new Date('2025-10-16T20:00:00'),
    venue: 'Anfield',
    competition: 'Premier League',
    status: 'live',
    homeScore: 1,
    awayScore: 1,
  },
  {
    id: 'match-3',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    kickOffTime: new Date('2025-10-17T16:30:00'),
    venue: 'Etihad Stadium',
    competition: 'Premier League',
    status: 'scheduled',
  },
  {
    id: 'match-4',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    kickOffTime: new Date('2025-10-17T20:00:00'),
    venue: 'Santiago Bernabéu',
    competition: 'La Liga',
    status: 'scheduled',
  },
  {
    id: 'match-5',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    kickOffTime: new Date('2025-10-18T17:30:00'),
    venue: 'Allianz Arena',
    competition: 'Bundesliga',
    status: 'scheduled',
  },
  {
    id: 'match-6',
    homeTeam: 'PSG',
    awayTeam: 'Marseille',
    kickOffTime: new Date('2025-10-18T20:45:00'),
    venue: 'Parc des Princes',
    competition: 'Ligue 1',
    status: 'scheduled',
  },
];

export const getMatchById = (id: string): Match | undefined => {
  return MOCK_MATCHES.find(match => match.id === id);
};
