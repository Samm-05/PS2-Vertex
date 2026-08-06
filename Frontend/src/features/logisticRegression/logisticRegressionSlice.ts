import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DataPoint2D,
  DatasetType,
  EpochMetrics,
  ModelConfig,
  ViewMode,
} from './types';
import {
  generateDataset,
  trainModelTrajectory,
} from './engine/logisticRegressionEngine';
import { logisticLessons } from './utils/lessonData';

interface LogisticRegressionState {
  datasetType: DatasetType;
  points: DataPoint2D[];
  config: ModelConfig;
  trajectory: EpochMetrics[];
  currentEpoch: number;
  isPlaying: boolean;
  playbackSpeed: number;
  viewMode: ViewMode;
  selectedLessonId: number;
  hoveredPointId: string | null;
  selectedPointId: string | null;
  // Comparison Mode States
  modelAConfig: ModelConfig;
  modelBConfig: ModelConfig;
  trajectoryA: EpochMetrics[];
  trajectoryB: EpochMetrics[];
}

const initialConfig: ModelConfig = {
  learningRate: 0.1,
  threshold: 0.5,
  regularization: 'none',
  regLambda: 0.01,
  featureType: 'linear',
  maxEpochs: 80,
};

const initialPoints = generateDataset('linear', 100);
const initialTrajectory = trainModelTrajectory(initialPoints, initialConfig);

const initialState: LogisticRegressionState = {
  datasetType: 'linear',
  points: initialPoints,
  config: initialConfig,
  trajectory: initialTrajectory,
  currentEpoch: initialTrajectory.length > 0 ? initialTrajectory.length - 1 : 0,
  isPlaying: false,
  playbackSpeed: 1,
  viewMode: 'playground',
  selectedLessonId: 1,
  hoveredPointId: null,
  selectedPointId: null,
  modelAConfig: { ...initialConfig, learningRate: 0.02 },
  modelBConfig: { ...initialConfig, learningRate: 0.5 },
  trajectoryA: trainModelTrajectory(initialPoints, { ...initialConfig, learningRate: 0.02 }),
  trajectoryB: trainModelTrajectory(initialPoints, { ...initialConfig, learningRate: 0.5 }),
};

export const logisticRegressionSlice = createSlice({
  name: 'logisticRegression',
  initialState,
  reducers: {
    setDatasetType: (state, action: PayloadAction<DatasetType>) => {
      state.datasetType = action.payload;
      state.points = generateDataset(action.payload, 100);
      state.trajectory = trainModelTrajectory(state.points, state.config);
      state.currentEpoch = state.trajectory.length > 0 ? state.trajectory.length - 1 : 0;
      state.trajectoryA = trainModelTrajectory(state.points, state.modelAConfig);
      state.trajectoryB = trainModelTrajectory(state.points, state.modelBConfig);
    },

    setPoints: (state, action: PayloadAction<DataPoint2D[]>) => {
      state.points = action.payload;
      state.trajectory = trainModelTrajectory(state.points, state.config);
      state.currentEpoch = state.trajectory.length > 0 ? state.trajectory.length - 1 : 0;
      state.trajectoryA = trainModelTrajectory(state.points, state.modelAConfig);
      state.trajectoryB = trainModelTrajectory(state.points, state.modelBConfig);
    },

    addPoint: (state, action: PayloadAction<{ x1: number; x2: number; label: 0 | 1 }>) => {
      const newPt: DataPoint2D = {
        id: `pt_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
        x1: action.payload.x1,
        x2: action.payload.x2,
        label: action.payload.label,
      };
      state.points.push(newPt);
      state.datasetType = 'custom';
      state.trajectory = trainModelTrajectory(state.points, state.config);
      state.trajectoryA = trainModelTrajectory(state.points, state.modelAConfig);
      state.trajectoryB = trainModelTrajectory(state.points, state.modelBConfig);
    },

    updatePointPosition: (
      state,
      action: PayloadAction<{ id: string; x1: number; x2: number }>
    ) => {
      const pt = state.points.find((p) => p.id === action.payload.id);
      if (pt) {
        pt.x1 = action.payload.x1;
        pt.x2 = action.payload.x2;
        state.trajectory = trainModelTrajectory(state.points, state.config);
        state.trajectoryA = trainModelTrajectory(state.points, state.modelAConfig);
        state.trajectoryB = trainModelTrajectory(state.points, state.modelBConfig);
      }
    },

    removePoint: (state, action: PayloadAction<string>) => {
      state.points = state.points.filter((p) => p.id !== action.payload);
      state.trajectory = trainModelTrajectory(state.points, state.config);
      state.trajectoryA = trainModelTrajectory(state.points, state.modelAConfig);
      state.trajectoryB = trainModelTrajectory(state.points, state.modelBConfig);
    },

    updateConfig: (state, action: PayloadAction<Partial<ModelConfig>>) => {
      state.config = { ...state.config, ...action.payload };
      state.trajectory = trainModelTrajectory(state.points, state.config);
      if (state.currentEpoch >= state.trajectory.length) {
        state.currentEpoch = state.trajectory.length - 1;
      }
    },

    updateModelAConfig: (state, action: PayloadAction<Partial<ModelConfig>>) => {
      state.modelAConfig = { ...state.modelAConfig, ...action.payload };
      state.trajectoryA = trainModelTrajectory(state.points, state.modelAConfig);
    },

    updateModelBConfig: (state, action: PayloadAction<Partial<ModelConfig>>) => {
      state.modelBConfig = { ...state.modelBConfig, ...action.payload };
      state.trajectoryB = trainModelTrajectory(state.points, state.modelBConfig);
    },

    setCurrentEpoch: (state, action: PayloadAction<number>) => {
      state.currentEpoch = Math.max(
        0,
        Math.min(action.payload, state.trajectory.length - 1)
      );
    },

    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },

    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      state.playbackSpeed = action.payload;
    },

    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },

    setSelectedLessonId: (state, action: PayloadAction<number>) => {
      state.selectedLessonId = action.payload;
      const lesson = logisticLessons.find((l) => l.id === action.payload);
      if (lesson) {
        if (lesson.targetPreset) {
          state.datasetType = lesson.targetPreset;
          state.points = generateDataset(lesson.targetPreset, 100);
        }
        if (lesson.targetThreshold !== undefined) {
          state.config.threshold = lesson.targetThreshold;
        }
        if (lesson.targetLearningRate !== undefined) {
          state.config.learningRate = lesson.targetLearningRate;
        }
        if (lesson.targetFeatureType !== undefined) {
          state.config.featureType = lesson.targetFeatureType;
        }
        state.trajectory = trainModelTrajectory(state.points, state.config);
        state.currentEpoch = state.trajectory.length - 1;
      }
    },

    setHoveredPointId: (state, action: PayloadAction<string | null>) => {
      state.hoveredPointId = action.payload;
    },

    setSelectedPointId: (state, action: PayloadAction<string | null>) => {
      state.selectedPointId = action.payload;
    },

    resetSimulation: (state) => {
      state.config = { ...initialConfig };
      state.points = generateDataset(state.datasetType, 100);
      state.trajectory = trainModelTrajectory(state.points, state.config);
      state.currentEpoch = state.trajectory.length - 1;
      state.isPlaying = false;
    },
  },
});

export const {
  setDatasetType,
  setPoints,
  addPoint,
  updatePointPosition,
  removePoint,
  updateConfig,
  updateModelAConfig,
  updateModelBConfig,
  setCurrentEpoch,
  setIsPlaying,
  setPlaybackSpeed,
  setViewMode,
  setSelectedLessonId,
  setHoveredPointId,
  setSelectedPointId,
  resetSimulation,
} = logisticRegressionSlice.actions;

export default logisticRegressionSlice.reducer;
