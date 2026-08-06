import apiClient from './apiClient';

export const authService = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),

  register: (userData: any) =>
    apiClient.post('/auth/register', userData),

  forgotPassword: (email: string) =>
    apiClient.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post('/auth/reset-password', { token, password }),

  refreshToken: (refreshToken: string) =>
    apiClient.post('/auth/refresh-token', { refreshToken }),

  logout: () =>
    apiClient.post('/auth/logout'),

  verifyEmail: (token: string) =>
    apiClient.get(`/auth/verify-email/${token}`),
};
