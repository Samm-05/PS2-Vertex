import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import practiceReducer from '../features/practice/practiceSlice';
import leaderboardReducer from '../features/leaderboard/leaderboardSlice';
import profileReducer from '../features/profile/profileSlice';
import uiReducer from '../features/ui/uiSlice';

import gradientDescentReducer from '../features/gradientDescent/gradientDescentSlice';
import linearRegressionReducer from '../features/linearRegression/linearRegressionSlice';
import logisticRegressionReducer from '../features/logisticRegression/logisticRegressionSlice';
import neuralNetworkReducer from '../features/neuralNetwork/neuralNetworkSlice';
import overfittingReducer from '../features/overfittingLab/overfittingSlice';
import coachReducer from '../features/coach/coachSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    coach: coachReducer,
    gradientDescent: gradientDescentReducer,
    linearRegression: linearRegressionReducer,
    logisticRegression: logisticRegressionReducer,
    neuralNetwork: neuralNetworkReducer,
    overfitting: overfittingReducer,
    practice: practiceReducer,
    leaderboard: leaderboardReducer,
    profile: profileReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;