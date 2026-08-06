import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DataPoint2D, DatasetPresetType, LinearRegressionParams, RegressionStep } from './types';
import { generateSyntheticDataset } from './engine/datasetGenerator';
import { computeRegressionSteps } from './engine/regressionSolver';
import { TUTORIAL_STEPS } from './utils/tutorialData';

interface LinearRegressionState {
  params: LinearRegressionParams;
  points: DataPoint2D[];
  steps: RegressionStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  tutorialMode: boolean;
  currentTutorialStep: number;
  completedTutorialSteps: number[];
  comparisonMode: boolean; // Dual split screen mode
  comparisonLearningRate: number; // Secondary LR for split screen
  comparisonSteps: RegressionStep[];
  audioMuted: boolean;
  cameraPreset: 'perspective' | 'flat' | 'side';
}

const initialParams: LinearRegressionParams = {
  learningRate: 0.03,
  epochs: 50,
  noise: 0.4,
  datasetSize: 30,
  trainTestSplit: 80,
  batchSize: 30,
  normalizeInputs: false,
  regularization: 0.0,
  randomSeed: 42,
  preset: 'positive',
  wInitial: 0.2,
  bInitial: 1.0,
};

const initialPoints = generateSyntheticDataset(
  initialParams.preset,
  initialParams.datasetSize,
  initialParams.noise,
  initialParams.randomSeed
);

const initialSteps = computeRegressionSteps(initialPoints, initialParams);
const initialComparisonSteps = computeRegressionSteps(initialPoints, { ...initialParams, learningRate: 0.8 });

const initialState: LinearRegressionState = {
  params: initialParams,
  points: initialPoints,
  steps: initialSteps,
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1.0,
  tutorialMode: false,
  currentTutorialStep: 0,
  completedTutorialSteps: [],
  comparisonMode: false,
  comparisonLearningRate: 0.8,
  comparisonSteps: initialComparisonSteps,
  audioMuted: true,
  cameraPreset: 'perspective',
};

const linearRegressionSlice = createSlice({
  name: 'linearRegression',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<Partial<LinearRegressionParams>>) => {
      state.params = { ...state.params, ...action.payload };
      if (action.payload.preset || action.payload.datasetSize !== undefined || action.payload.noise !== undefined) {
        state.points = generateSyntheticDataset(
          state.params.preset,
          state.params.datasetSize,
          state.params.noise,
          state.params.randomSeed
        );
      }
      state.steps = computeRegressionSteps(state.points, state.params);
      if (state.comparisonMode) {
        state.comparisonSteps = computeRegressionSteps(state.points, {
          ...state.params,
          learningRate: state.comparisonLearningRate,
        });
      }
      state.currentStepIndex = Math.min(state.currentStepIndex, Math.max(0, state.steps.length - 1));
    },

    setDatasetPreset: (state, action: PayloadAction<DatasetPresetType>) => {
      state.params.preset = action.payload;
      state.points = generateSyntheticDataset(
        action.payload,
        state.params.datasetSize,
        state.params.noise,
        state.params.randomSeed
      );
      state.steps = computeRegressionSteps(state.points, state.params);
      if (state.comparisonMode) {
        state.comparisonSteps = computeRegressionSteps(state.points, {
          ...state.params,
          learningRate: state.comparisonLearningRate,
        });
      }
      state.currentStepIndex = 0;
      state.isPlaying = false;
    },

    setPoints: (state, action: PayloadAction<DataPoint2D[]>) => {
      state.points = action.payload;
      state.params.preset = 'custom';
      state.steps = computeRegressionSteps(state.points, state.params);
      if (state.comparisonMode) {
        state.comparisonSteps = computeRegressionSteps(state.points, {
          ...state.params,
          learningRate: state.comparisonLearningRate,
        });
      }
      state.currentStepIndex = 0;
      state.isPlaying = false;
    },

    addPoint: (state, action: PayloadAction<{ x: number; y: number }>) => {
      const newPt: DataPoint2D = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        x: parseFloat(action.payload.x.toFixed(2)),
        y: parseFloat(action.payload.y.toFixed(2)),
      };
      state.points.push(newPt);
      state.params.preset = 'custom';
      state.steps = computeRegressionSteps(state.points, state.params);
      if (state.comparisonMode) {
        state.comparisonSteps = computeRegressionSteps(state.points, {
          ...state.params,
          learningRate: state.comparisonLearningRate,
        });
      }
    },

    updatePointPos: (state, action: PayloadAction<{ id: string; x: number; y: number }>) => {
      const pt = state.points.find((p) => p.id === action.payload.id);
      if (pt) {
        pt.x = parseFloat(action.payload.x.toFixed(2));
        pt.y = parseFloat(action.payload.y.toFixed(2));
        state.steps = computeRegressionSteps(state.points, state.params);
        if (state.comparisonMode) {
          state.comparisonSteps = computeRegressionSteps(state.points, {
            ...state.params,
            learningRate: state.comparisonLearningRate,
          });
        }
      }
    },

    deletePoint: (state, action: PayloadAction<string>) => {
      state.points = state.points.filter((p) => p.id !== action.payload);
      state.steps = computeRegressionSteps(state.points, state.params);
      if (state.comparisonMode) {
        state.comparisonSteps = computeRegressionSteps(state.points, {
          ...state.params,
          learningRate: state.comparisonLearningRate,
        });
      }
    },

    setCurrentStepIndex: (state, action: PayloadAction<number>) => {
      state.currentStepIndex = Math.max(0, Math.min(action.payload, state.steps.length - 1));
    },

    stepForward: (state) => {
      if (state.currentStepIndex < state.steps.length - 1) {
        state.currentStepIndex += 1;
      } else {
        state.isPlaying = false;
      }
    },

    stepBackward: (state) => {
      if (state.currentStepIndex > 0) {
        state.currentStepIndex -= 1;
      }
    },

    togglePlayPause: (state) => {
      if (state.currentStepIndex >= state.steps.length - 1) {
        state.currentStepIndex = 0;
        state.isPlaying = true;
      } else {
        state.isPlaying = !state.isPlaying;
      }
    },

    resetPlayback: (state) => {
      state.isPlaying = false;
      state.currentStepIndex = 0;
    },

    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      state.playbackSpeed = action.payload;
    },

    setTutorialMode: (state, action: PayloadAction<boolean>) => {
      state.tutorialMode = action.payload;
      if (action.payload) {
        const firstTutorial = TUTORIAL_STEPS[0];
        state.currentTutorialStep = 0;
        state.params = { ...state.params, ...firstTutorial.presetParams };
        state.points = generateSyntheticDataset(
          state.params.preset,
          state.params.datasetSize,
          state.params.noise,
          state.params.randomSeed
        );
        state.steps = computeRegressionSteps(state.points, state.params);
        state.currentStepIndex = 0;
        state.isPlaying = false;
      }
    },

    setTutorialStepIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < TUTORIAL_STEPS.length) {
        state.currentTutorialStep = action.payload;
        const tutorial = TUTORIAL_STEPS[action.payload];
        state.params = { ...state.params, ...tutorial.presetParams };
        state.points = generateSyntheticDataset(
          state.params.preset,
          state.params.datasetSize,
          state.params.noise,
          state.params.randomSeed
        );
        state.steps = computeRegressionSteps(state.points, state.params);
        state.currentStepIndex = 0;
        state.isPlaying = false;
      }
    },

    markTutorialCompleted: (state, action: PayloadAction<number>) => {
      if (!state.completedTutorialSteps.includes(action.payload)) {
        state.completedTutorialSteps.push(action.payload);
      }
    },

    toggleComparisonMode: (state) => {
      state.comparisonMode = !state.comparisonMode;
      if (state.comparisonMode) {
        state.comparisonSteps = computeRegressionSteps(state.points, {
          ...state.params,
          learningRate: state.comparisonLearningRate,
        });
      }
    },

    setComparisonLearningRate: (state, action: PayloadAction<number>) => {
      state.comparisonLearningRate = action.payload;
      state.comparisonSteps = computeRegressionSteps(state.points, {
        ...state.params,
        learningRate: action.payload,
      });
    },

    toggleAudioMuted: (state) => {
      state.audioMuted = !state.audioMuted;
    },

    setCameraPreset: (state, action: PayloadAction<'perspective' | 'flat' | 'side'>) => {
      state.cameraPreset = action.payload;
    },
  },
});

export const {
  setParams,
  setDatasetPreset,
  setPoints,
  addPoint,
  updatePointPos,
  deletePoint,
  setCurrentStepIndex,
  stepForward,
  stepBackward,
  togglePlayPause,
  resetPlayback,
  setPlaybackSpeed,
  setTutorialMode,
  setTutorialStepIndex,
  markTutorialCompleted,
  toggleComparisonMode,
  setComparisonLearningRate,
  toggleAudioMuted,
  setCameraPreset,
} = linearRegressionSlice.actions;

export default linearRegressionSlice.reducer;
