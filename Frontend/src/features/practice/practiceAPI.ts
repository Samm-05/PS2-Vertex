import apiClient from '../../services/apiClient';

export const practiceAPI = {
  getChallenges: () => apiClient.get('/practice/challenges'),
  submitChallenge: (challengeId: string, answer: unknown) =>
    apiClient.post(`/practice/challenges/${challengeId}/submit`, { answer }),
  getUserStats: () => apiClient.get('/practice/stats'),
};
