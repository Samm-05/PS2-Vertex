import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardAPI } from './dashboardAPI';

interface DashboardStats {
  totalPoints: number;
  completedAlgorithms: number;
  totalPracticeTime: number;
  averageScore: number;
  rank: number;
  streak: number;
}

interface RecentActivity {
  id: string;
  type: 'practice' | 'simulation' | 'challenge' | 'badge';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
  icon?: string;
  color?: string;
  bgColor?: string;
}

interface DashboardState {
  stats: DashboardStats | null;
  recentActivity: RecentActivity[];
  recommendations: any[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  stats: null,
  recentActivity: [],
  recommendations: [],
  loading: false,
  error: null,
};

export const fetchDashboardStats = createAsyncThunk(
  'dashboard/fetchStats',
  async () => {
    const response = await dashboardAPI.getStats();
    return response.data;
  }
);

export const fetchRecentActivity = createAsyncThunk(
  'dashboard/fetchRecentActivity',
  async () => {
    const response = await dashboardAPI.getRecentActivity();
    return response.data;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch stats';
      })
      // Fetch Recent Activity
      .addCase(fetchRecentActivity.fulfilled, (state, action) => {
        state.recentActivity = action.payload;
      });
  },
});

export default dashboardSlice.reducer;