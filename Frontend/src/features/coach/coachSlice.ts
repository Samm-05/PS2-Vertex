import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoachState } from './types';

const STORAGE_KEY = 'ml_coach_completed';

const loadCompletedModulesFromStorage = (): string[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load completed modules from storage', err);
    return [];
  }
};

const initialState: CoachState = {
  completedModules: loadCompletedModulesFromStorage(),
};

export const coachSlice = createSlice({
  name: 'coach',
  initialState,
  reducers: {
    markModuleCompleted: (state, action: PayloadAction<string>) => {
      const moduleId = action.payload;
      if (!state.completedModules.includes(moduleId)) {
        state.completedModules.push(moduleId);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.completedModules));
        } catch (err) {
          console.error('Failed to save completed modules to storage', err);
        }
      }
    },
    resetCoachProgress: (state) => {
      state.completedModules = [];
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (err) {
        console.error('Failed to reset coach progress in storage', err);
      }
    },
  },
});

export const { markModuleCompleted, resetCoachProgress } = coachSlice.actions;
export default coachSlice.reducer;
