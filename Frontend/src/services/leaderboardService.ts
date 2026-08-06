import apiClient from './apiClient';

export const leaderboardService = {
  getGlobal: () =>
    apiClient.get('/leaderboard/global'),

  getWeekly: () =>
    apiClient.get('/leaderboard/weekly'),

  getByAlgorithm: (algorithm: string) =>
    apiClient.get(`/leaderboard/algorithm/${algorithm}`),

  getUserRank: () =>
    apiClient.get('/leaderboard/user-rank'),

  getTopPerformers: (limit: number = 10) =>
    apiClient.get(`/leaderboard/top?limit=${limit}`),
};