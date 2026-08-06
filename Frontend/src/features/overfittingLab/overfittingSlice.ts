import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DataPoint2D,
  OverfittingConfig,
  OverfittingResult,
  FitRegime,
} from './types';
import {
  generateOverfittingDataset,
  solvePolynomialFit,
} from './utils/fittingEngine';

interface OverfittingState {
  config: OverfittingConfig;
  points: DataPoint2D[];
  result: OverfittingResult;
  isPlaying: boolean;
  currentEpoch: number;
}

const defaultConfig: OverfittingConfig = {
  datasetSize: 40,
  noise: 0.25,
  degree: 3,
  lambda: 0.001,
  epochs: 100,
  learningRate: 0.05,
};

const initialPoints = generateOverfittingDataset(defaultConfig.datasetSize, defaultConfig.noise);
const initialResult = solvePolynomialFit(initialPoints, defaultConfig);

const initialState: OverfittingState = {
  config: defaultConfig,
  points: initialPoints,
  result: initialResult,
  isPlaying: false,
  currentEpoch: defaultConfig.epochs,
};

export const overfittingSlice = createSlice({
  name: 'overfitting',
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<Partial<OverfittingConfig>>) => {
      state.config = { ...state.config, ...action.payload };
      if (action.payload.datasetSize !== undefined || action.payload.noise !== undefined) {
        state.points = generateOverfittingDataset(state.config.datasetSize, state.config.noise);
      }
      state.result = solvePolynomialFit(state.points, state.config);
    },

    setPresetRegime: (state, action: PayloadAction<FitRegime>) => {
      if (action.payload === 'underfitting') {
        state.config.degree = 1;
        state.config.lambda = 0.0;
      } else if (action.payload === 'good_fit') {
        state.config.degree = 4;
        state.config.lambda = 0.01;
      } else if (action.payload === 'overfitting') {
        state.config.degree = 12;
        state.config.lambda = 0.0;
      }
      state.result = solvePolynomialFit(state.points, state.config);
    },

    reseedDataset: (state) => {
      state.points = generateOverfittingDataset(state.config.datasetSize, state.config.noise);
      state.result = solvePolynomialFit(state.points, state.config);
    },

    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setCurrentEpoch: (state, action: PayloadAction<number>) => {
      state.currentEpoch = Math.max(0, Math.min(action.payload, state.config.epochs));
    },

    resetSimulation: (state) => {
      state.currentEpoch = 0;
      state.isPlaying = false;
    },
  },
});

export const {
  setConfig,
  setPresetRegime,
  reseedDataset,
  setIsPlaying,
  setCurrentEpoch,
  resetSimulation,
} = overfittingSlice.actions;

export default overfittingSlice.reducer;
