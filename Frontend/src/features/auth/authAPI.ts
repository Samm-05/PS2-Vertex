import apiClient from "../../services/apiClient";

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post("/auth/login", { email, password }),

  register: (userData: any) =>
    apiClient.post("/auth/register", userData),

  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post("/auth/reset-password", { token, password }),

  refreshToken: (refreshToken: string) =>
    apiClient.post("/auth/refresh-token", { refreshToken }),

  logout: (refreshToken: string) =>
    apiClient.post("/auth/logout", { refreshToken }),

  verifyEmail: (token: string) =>
    apiClient.get(`/auth/verify-email/${token}`),
};