import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { profileAPI } from './profileAPI';
import { toast } from 'react-hot-toast';

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  institution?: string;
  bio?: string;
  points: number;
  badges: Badge[];
  streak: number;
  joinedAt: string;
  lastActive: string;
  settings: UserSettings;
  progress: UserProgress;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  emailNotifications: boolean;
  pushNotifications: boolean;
  defaultAlgorithmView: '2d' | '3d';
  animationSpeed: number;
  showExplanations: boolean;
}

interface UserProgress {
  algorithms: AlgorithmProgress[];
  totalPracticeTime: number;
  averageScore: number;
  rank: number;
  level: number;
  experience: number;
  nextLevelExp: number;
}

interface AlgorithmProgress {
  algorithmId: string;
  name: string;
  completed: boolean;
  score: number;
  attempts: number;
  lastPracticed: string;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

interface ProfileState {
  profile: UserProfile | null;
  savedSimulations: any[];
  achievements: any[];
  loading: boolean;
  error: string | null;
  isEditing: boolean;
}

const initialState: ProfileState = {
  profile: null,
  savedSimulations: [],
  achievements: [],
  loading: false,
  error: null,
  isEditing: false,
};

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getProfile();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData: Partial<UserProfile>, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateProfile(profileData);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await profileAPI.uploadAvatar(file);
      toast.success('Avatar updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

export const fetchSavedSimulations = createAsyncThunk(
  'profile/fetchSavedSimulations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileAPI.getSavedSimulations();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch simulations');
    }
  }
);

export const updateSettings = createAsyncThunk(
  'profile/updateSettings',
  async (settings: Partial<UserSettings>, { rejectWithValue }) => {
    try {
      const response = await profileAPI.updateSettings(settings);
      toast.success('Settings updated successfully');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.savedSimulations = [];
      state.achievements = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = { ...state.profile, ...action.payload } as UserProfile;
        state.isEditing = false;
      })
      // Upload Avatar
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatar = action.payload.avatarUrl;
        }
      })
      // Fetch Saved Simulations
      .addCase(fetchSavedSimulations.fulfilled, (state, action) => {
        state.savedSimulations = action.payload;
      })
      // Update Settings
      .addCase(updateSettings.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.settings = { ...state.profile.settings, ...action.payload };
        }
      });
  },
});

export const { setEditing, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;