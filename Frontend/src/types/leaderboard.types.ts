export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  algorithmsCompleted: number;
  streak: number;
  badges: string[];
  institution?: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  userRank: number;
  totalParticipants: number;
}

export interface LeaderboardFilter {
  algorithm?: string;
  timeRange: 'all' | 'weekly' | 'monthly';
  institution?: string;
  limit?: number;
}