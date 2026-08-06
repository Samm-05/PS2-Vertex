import apiClient from '../../services/apiClient';   

// Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultAlgorithmView: '2d' | '3d';
  animationSpeed: number;
  showExplanations: boolean;
}

export interface AlgorithmProgress {
  algorithmId: string;
  name: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastPracticed: string;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface UserProgress {
  algorithms: AlgorithmProgress[];
  totalPracticeTime: number;
  averageScore: number;
  rank: number;
  level: number;
  experience: number;
  nextLevelExp: number; 
}

export interface ProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'admin' | 'instructor';
  avatar?: string;
  institution?: string;
  bio?: string;
  points: number;
  badges: Badge[];
  streak: number;
  joinedAt: string;
  lastActive: string;
  isEmailVerified: boolean;
  settings: UserSettings;
  progress: UserProgress;
}

export interface SavedSimulation {
  id: string;
  name: string;
  algorithm: string;
  createdAt: string;
  parameters: Record<string, any>;
  results?: {
    accuracy?: number;
    loss?: number;
  };
}

export interface Activity {
  id: string;
  type: 'practice' | 'simulation' | 'challenge' | 'badge' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  metadata?: Record<string, any>;
}

export const profileAPI = {
  /**
   * Get user profile data
   */
  getProfile: async (): Promise<ProfileData> => {
    const response = await apiClient.get('/profile');
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: Partial<ProfileData>): Promise<ProfileData> => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },

  /**
   * Upload avatar image
   */
  uploadAvatar: async (file: File): Promise<{ avatarUrl: string }> => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await apiClient.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  /**
   * Get saved simulations
   */
  getSavedSimulations: async (): Promise<SavedSimulation[]> => {
    const response = await apiClient.get('/profile/simulations');
    return response.data;
  },

  /**
   * Save a simulation
   */
  saveSimulation: async (simulationId: string): Promise<void> => {
    await apiClient.post(`/profile/simulations/${simulationId}`);
  },

  /**
   * Remove a saved simulation
   */
  removeSimulation: async (simulationId: string): Promise<void> => {
    await apiClient.delete(`/profile/simulations/${simulationId}`);
  },

  /**
   * Get user achievements/badges
   */
  getAchievements: async (): Promise<Badge[]> => {
    const response = await apiClient.get('/profile/achievements');
    return response.data;
  },

  /**
   * Update user settings
   */
  updateSettings: async (settings: Partial<UserSettings>): Promise<UserSettings> => {
    const response = await apiClient.put('/profile/settings', settings);
    return response.data;
  },

  /**
   * Get user progress
   */
  getProgress: async (): Promise<UserProgress> => {
    const response = await apiClient.get('/profile/progress');
    return response.data;
  },

  /**
   * Get recent activity
   */
  getActivity: async (limit: number = 10): Promise<Activity[]> => {
    const response = await apiClient.get('/profile/activity', { params: { limit } });
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/profile/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Delete account
   */
  deleteAccount: async (password: string): Promise<{ message: string }> => {
    const response = await apiClient.delete('/profile/account', { data: { password } });
    return response.data;
  },

  /**
   * Export user data
   */
  exportData: async (): Promise<Blob> => {
    const response = await apiClient.get('/profile/export', {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default profileAPI;