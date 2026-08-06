import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { leaderboardAPI } from './leaderboardAPI';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  algorithmsCompleted: number;
  streak: number;
  badges: string[];
}

interface LeaderboardState {
  global: LeaderboardEntry[];
  weekly: LeaderboardEntry[];
  byAlgorithm: Record<string, LeaderboardEntry[]>;
  userRank: {
    global: number;
    weekly: number;
    byAlgorithm: Record<string, number>;
  };
  loading: boolean;
  error: string | null;
}

const initialState: LeaderboardState = {
  global: [],
  weekly: [],
  byAlgorithm: {},
  userRank: {
    global: 0,
    weekly: 0,
    byAlgorithm: {},
  },
  loading: false,
  error: null,
};

export const fetchGlobalLeaderboard = createAsyncThunk(
  'leaderboard/fetchGlobal',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaderboardAPI.getGlobal();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
    }
  }
);

export const fetchWeeklyLeaderboard = createAsyncThunk(
  'leaderboard/fetchWeekly',
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaderboardAPI.getWeekly();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch weekly leaderboard');
    }
  }
);

export const fetchAlgorithmLeaderboard = createAsyncThunk(
  'leaderboard/fetchByAlgorithm',
  async (algorithm: string, { rejectWithValue }) => {
    try {
      const response = await leaderboardAPI.getByAlgorithm(algorithm);
      return { algorithm, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch algorithm leaderboard');
    }
  }
);

const leaderboardSlice = createSlice({
  name: 'leaderboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Global Leaderboard
      .addCase(fetchGlobalLeaderboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGlobalLeaderboard.fulfilled, (state, action) => {
        state.loading = false;
        state.global = action.payload.entries;
        state.userRank.global = action.payload.userRank;
      })
      .addCase(fetchGlobalLeaderboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Weekly Leaderboard
      .addCase(fetchWeeklyLeaderboard.fulfilled, (state, action) => {
        state.weekly = action.payload.entries;
        state.userRank.weekly = action.payload.userRank;
      })
      // Algorithm Leaderboard
      .addCase(fetchAlgorithmLeaderboard.fulfilled, (state, action) => {
        const { algorithm, data } = action.payload;
        state.byAlgorithm[algorithm] = data.entries;
        state.userRank.byAlgorithm[algorithm] = data.userRank;
      });
  },
});

export default leaderboardSlice.reducer;