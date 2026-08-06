import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GradientDescentParams, LearningRateMode, LossSurfaceType, OptimizationStep } from './types';
import { computeOptimizationSteps } from './engine/optimizer';
import { LOSS_SURFACES } from './engine/lossFunctions';
import { TUTORIAL_STEPS } from './utils/tutorialData';

interface GradientDescentState {
  params: GradientDescentParams;
  steps: OptimizationStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  playbackSpeed: number;
  tutorialMode: boolean;
  currentTutorialStep: number;
  completedTutorialSteps: number[];
  audioMuted: boolean;
  cameraPreset: 'perspective' | 'top-down' | 'side';
}

const initialSurface: LossSurfaceType = 'paraboloid';
const initialSurfaceDef = LOSS_SURFACES[initialSurface];

const initialParams: GradientDescentParams = {
  surfaceType: initialSurface,
  learningRate: 0.05,
  learningRateMode: 'optimal',
  momentum: 0.0,
  epochs: 50,
  noise: 0.0,
  batchMode: 'batch',
  w1Initial: initialSurfaceDef.recommendedInit.w1,
  w2Initial: initialSurfaceDef.recommendedInit.w2,
  regularization: 0.0,
  randomSeed: 42,
};

const initialSteps = computeOptimizationSteps(initialParams);

const initialState: GradientDescentState = {
  params: initialParams,
  steps: initialSteps,
  currentStepIndex: 0,
  isPlaying: false,
  playbackSpeed: 1.0,
  tutorialMode: false,
  currentTutorialStep: 0,
  completedTutorialSteps: [],
  audioMuted: true,
  cameraPreset: 'perspective',
};

const gradientDescentSlice = createSlice({
  name: 'gradientDescent',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<Partial<GradientDescentParams>>) => {
      state.params = { ...state.params, ...action.payload };
      state.steps = computeOptimizationSteps(state.params);
      state.currentStepIndex = Math.min(state.currentStepIndex, Math.max(0, state.steps.length - 1));
    },

    setLearningRateMode: (state, action: PayloadAction<LearningRateMode>) => {
      state.params.learningRateMode = action.payload;
      switch (action.payload) {
        case 'very-small':
          state.params.learningRate = 0.0005;
          break;
        case 'small':
          state.params.learningRate = 0.008;
          break;
        case 'optimal':
          state.params.learningRate = 0.05;
          break;
        case 'large':
          state.params.learningRate = 0.35;
          break;
        case 'too-large':
          state.params.learningRate = 1.8;
          break;
        default:
          break;
      }
      state.steps = computeOptimizationSteps(state.params);
      state.currentStepIndex = 0;
      state.isPlaying = false;
    },

    setSurfaceType: (state, action: PayloadAction<LossSurfaceType>) => {
      const surfaceDef = LOSS_SURFACES[action.payload] || LOSS_SURFACES.paraboloid;
      state.params.surfaceType = action.payload;
      state.params.w1Initial = surfaceDef.recommendedInit.w1;
      state.params.w2Initial = surfaceDef.recommendedInit.w2;
      state.steps = computeOptimizationSteps(state.params);
      state.currentStepIndex = 0;
      state.isPlaying = false;
    },

    setInitialPoint: (state, action: PayloadAction<{ w1: number; w2: number }>) => {
      state.params.w1Initial = action.payload.w1;
      state.params.w2Initial = action.payload.w2;
      state.steps = computeOptimizationSteps(state.params);
      state.currentStepIndex = 0;
      state.isPlaying = false;
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

    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
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
        state.steps = computeOptimizationSteps(state.params);
        state.currentStepIndex = 0;
        state.isPlaying = false;
      }
    },

    setTutorialStepIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < TUTORIAL_STEPS.length) {
        state.currentTutorialStep = action.payload;
        const tutorial = TUTORIAL_STEPS[action.payload];
        state.params = { ...state.params, ...tutorial.presetParams };
        state.steps = computeOptimizationSteps(state.params);
        state.currentStepIndex = 0;
        state.isPlaying = false;
      }
    },

    markTutorialCompleted: (state, action: PayloadAction<number>) => {
      if (!state.completedTutorialSteps.includes(action.payload)) {
        state.completedTutorialSteps.push(action.payload);
      }
    },

    toggleAudioMuted: (state) => {
      state.audioMuted = !state.audioMuted;
    },

    setCameraPreset: (state, action: PayloadAction<'perspective' | 'top-down' | 'side'>) => {
      state.cameraPreset = action.payload;
    },
  },
});

export const {
  setParams,
  setLearningRateMode,
  setSurfaceType,
  setInitialPoint,
  setCurrentStepIndex,
  stepForward,
  stepBackward,
  setIsPlaying,
  togglePlayPause,
  resetPlayback,
  setPlaybackSpeed,
  setTutorialMode,
  setTutorialStepIndex,
  markTutorialCompleted,
  toggleAudioMuted,
  setCameraPreset,
} = gradientDescentSlice.actions;

export default gradientDescentSlice.reducer;
