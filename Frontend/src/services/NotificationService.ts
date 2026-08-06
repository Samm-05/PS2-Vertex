import apiClient from './apiClient';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'lesson' | 'quiz' | 'streak' | 'achievement' | 'leaderboard' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface NotificationResponse {
  notifications: AppNotification[];
  unreadCount: number;
}

export const notificationService = {
  getNotifications: () => apiClient.get<NotificationResponse>('/notifications'),
  markAsRead: (id: string) => apiClient.patch<AppNotification>(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch<NotificationResponse>('/notifications/read-all'),
};