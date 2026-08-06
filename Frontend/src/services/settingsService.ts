import apiClient from './apiClient';

export const settingsService = {
  getSettings: () => apiClient.get('/settings'),
  updateProfile: (data: any) => apiClient.put('/settings', data),
  uploadAvatar: (formData: FormData) =>
    apiClient.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  updatePreferences: (data: any) => apiClient.patch('/settings/preferences', data),
  updateNotifications: (data: any) => apiClient.patch('/settings/notifications', data),
  updateTheme: (data: any) => apiClient.patch('/settings/theme', data),
  updateSecurity: (data: any) => apiClient.patch('/settings/security', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiClient.post('/profile/change-password', data),
  deleteAccount: (password: string) =>
    apiClient.delete('/profile/account', { data: { password } }),
  exportData: () => apiClient.get('/profile/export', { responseType: 'blob' }),
};