export const ALGORITHMS = {
  LINEAR_REGRESSION: 'linear-regression',
  KMEANS: 'kmeans',
  DECISION_TREE: 'decision-tree',
  NEURAL_NETWORK: 'neural-network',
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const MASTERY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
  EXPERT: 'expert',
} as const;

export const CHART_COLORS = {
  primary: '#2563EB',
  accent: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  purple: '#8B5CF6',
  pink: '#EC4899',
  teal: '#14B8A6',
  orange: '#F97316',
} as const;

export const ANIMATION_SPEEDS = {
  SLOW: 0.5,
  NORMAL: 1,
  FAST: 2,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
    LOGOUT: '/auth/logout',
  },
  SIMULATIONS: {
    RUN: '/simulations/run',
    SAVE: '/simulations/save',
    GET: '/simulations',
    USER: '/simulations/user',
  },
  LEADERBOARD: {
    GLOBAL: '/leaderboard/global',
    WEEKLY: '/leaderboard/weekly',
    ALGORITHM: '/leaderboard/algorithm',
  },
} as const;