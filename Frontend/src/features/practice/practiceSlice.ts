import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { practiceAPI } from './practiceAPI';
import { toast } from 'react-hot-toast';

interface Challenge {
  id: string;
  title: string;
  description: string;
  algorithm: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  points: number;
  timeEstimate: number;
  completed: boolean;
  completedAt?: string;
  score?: number;
}

interface PracticeState {
  challenges: Challenge[];
  currentChallenge: Challenge | null;
  userStats: {
    totalPoints: number;
    completedChallenges: number;
    averageScore: number;
    rank: number;
    streak: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: PracticeState = {
  challenges: [],
  currentChallenge: null,
  userStats: {
    totalPoints: 0,
    completedChallenges: 0,
    averageScore: 0,
    rank: 0,
    streak: 0,
  },
  loading: false,
  error: null,
};

export const fetchChallenges = createAsyncThunk(
  'practice/fetchChallenges',
  async (_, { rejectWithValue }) => {
    try {
      const response = await practiceAPI.getChallenges();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch challenges');
    }
  }
);

export const submitChallenge = createAsyncThunk(
  'practice/submitChallenge',
  async ({ challengeId, answer }: { challengeId: string; answer: any }, { rejectWithValue }) => {
    try {
      const response = await practiceAPI.submitChallenge(challengeId, answer);
      toast.success('Challenge completed! +' + response.data.points + ' points');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit challenge');
      return rejectWithValue(error.response?.data?.message || 'Failed to submit challenge');
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  'practice/fetchUserStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await practiceAPI.getUserStats();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const practiceSlice = createSlice({
  name: 'practice',
  initialState,
  reducers: {
    setCurrentChallenge: (state, action: PayloadAction<Challenge | null>) => {
      state.currentChallenge = action.payload;
    },
    clearChallenges: (state) => {
      state.challenges = [];
      state.currentChallenge = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Challenges
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action) => {
        state.loading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Submit Challenge
      .addCase(submitChallenge.fulfilled, (state, action) => {
        const updatedChallenge = action.payload;
        const index = state.challenges.findIndex(c => c.id === updatedChallenge.id);
        if (index !== -1) {
          state.challenges[index] = { ...state.challenges[index], ...updatedChallenge };
        }
        if (state.currentChallenge?.id === updatedChallenge.id) {
          state.currentChallenge = { ...state.currentChallenge, ...updatedChallenge };
        }
      })
      // Fetch User Stats
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.userStats = action.payload;
      });
  },
});

export const { setCurrentChallenge, clearChallenges } = practiceSlice.actions;
export default practiceSlice.reducer;