import apiClient from '../../services/apiClient';

export const dashboardAPI = {
  getStats: () => apiClient.get('/dashboard/stats'),
  getRecentActivity: () => apiClient.get('/dashboard/activity'),
};
