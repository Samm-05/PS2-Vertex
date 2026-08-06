export interface User {
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
  createdAt: string;
  updatedAt: string;
  lastActive: string;
  isEmailVerified: boolean;
  settings: UserSettings;
  progress: UserProgress;
}

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

export interface UserProgress {
  algorithms: AlgorithmProgress[];
  totalPracticeTime: number;
  averageScore: number;
  rank: number;
  level: number;
  experience: number;
  nextLevelExp: number;
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