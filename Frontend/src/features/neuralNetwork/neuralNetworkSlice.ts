import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DataPoint2D,
  DatasetType,
  EpochSnapshot,
  NNConfig,
  ViewMode,
} from './types';
import { generateDataset, NeuralNetworkEngine } from './engine/nnEngine';

interface NeuralNetworkState {
  layerSizes: number[]; // e.g. [2, 4, 3, 1]
  config: NNConfig;
  points: DataPoint2D[];
  trajectory: EpochSnapshot[];
  currentEpoch: number;
  isPlaying: boolean;
  playbackSpeed: number;
  viewMode: ViewMode;
  selectedNeuron: { layerIndex: number; neuronIndex: number } | null;
  selectedLessonId: number;
  completedLessons: number[];
  hoveredNeuron: { layerIndex: number; neuronIndex: number } | null;
  comparisonLearningRate: number; // For split-screen comparison mode
}

const defaultConfig: NNConfig = {
  learningRate: 0.03,
  activation: 'tanh',
  optimizer: 'adam',
  lossFunc: 'bce',
  datasetType: 'xor',
  datasetSize: 60,
  noise: 0.2,
  batchSize: 60,
  l1Lambda: 0.0,
  l2Lambda: 0.0,
  maxEpochs: 60,
};

const initialLayerSizes = [2, 4, 3, 1];
const initialPoints = generateDataset(defaultConfig.datasetType, defaultConfig.datasetSize, defaultConfig.noise);

// Generate initial trajectory
function runSimulation(
  layerSizes: number[],
  points: DataPoint2D[],
  config: NNConfig
): EpochSnapshot[] {
  const engine = new NeuralNetworkEngine(layerSizes);
  const snapshots: EpochSnapshot[] = [];

  for (let epoch = 0; epoch <= config.maxEpochs; epoch++) {
    const { loss, accuracy, gradientNorm, networkState } = engine.trainEpoch(points, config);
    const decisionGrid = engine.evaluateGrid(25, config.activation);

    let status: 'normal' | 'vanishing' | 'exploding' = 'normal';
    if (gradientNorm < 0.0001) status = 'vanishing';
    else if (gradientNorm > 15.0) status = 'exploding';

    snapshots.push({
      epoch,
      loss,
      accuracy,
      gradientNorm,
      vanishingExplodingStatus: status,
      networkState,
      decisionGrid,
    });
  }

  return snapshots;
}

const initialTrajectory = runSimulation(initialLayerSizes, initialPoints, defaultConfig);

const initialState: NeuralNetworkState = {
  layerSizes: initialLayerSizes,
  config: defaultConfig,
  points: initialPoints,
  trajectory: initialTrajectory,
  currentEpoch: 0,
  isPlaying: false,
  playbackSpeed: 1.0,
  viewMode: 'playground',
  selectedNeuron: null,
  selectedLessonId: 1,
  completedLessons: [],
  hoveredNeuron: null,
  comparisonLearningRate: 0.8,
};

export const neuralNetworkSlice = createSlice({
  name: 'neuralNetwork',
  initialState,
  reducers: {
    setLayerSizes: (state, action: PayloadAction<number[]>) => {
      state.layerSizes = action.payload;
      state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
      state.currentEpoch = 0;
      state.isPlaying = false;
    },

    addLayer: (state) => {
      if (state.layerSizes.length < 8) {
        // Insert a new hidden layer before output layer with 4 neurons
        const newSizes = [...state.layerSizes];
        newSizes.splice(newSizes.length - 1, 0, 4);
        state.layerSizes = newSizes;
        state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
        state.currentEpoch = 0;
        state.isPlaying = false;
      }
    },

    removeLayer: (state, action: PayloadAction<number>) => {
      if (state.layerSizes.length > 3 && action.payload > 0 && action.payload < state.layerSizes.length - 1) {
        state.layerSizes = state.layerSizes.filter((_, idx) => idx !== action.payload);
        state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
        state.currentEpoch = 0;
        state.isPlaying = false;
      }
    },

    updateNeuronCount: (state, action: PayloadAction<{ layerIndex: number; delta: number }>) => {
      const { layerIndex, delta } = action.payload;
      if (layerIndex > 0 && layerIndex < state.layerSizes.length - 1) {
        const currCount = state.layerSizes[layerIndex];
        const newCount = Math.max(1, Math.min(20, currCount + delta));
        state.layerSizes[layerIndex] = newCount;
        state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
        state.currentEpoch = 0;
        state.isPlaying = false;
      }
    },

    updateConfig: (state, action: PayloadAction<Partial<NNConfig>>) => {
      state.config = { ...state.config, ...action.payload };
      if (action.payload.datasetType || action.payload.datasetSize !== undefined || action.payload.noise !== undefined) {
        state.points = generateDataset(state.config.datasetType, state.config.datasetSize, state.config.noise);
      }
      state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
      state.currentEpoch = Math.min(state.currentEpoch, state.trajectory.length - 1);
    },

    setDatasetType: (state, action: PayloadAction<DatasetType>) => {
      state.config.datasetType = action.payload;
      state.points = generateDataset(action.payload, state.config.datasetSize, state.config.noise);
      state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
      state.currentEpoch = 0;
      state.isPlaying = false;
    },

    setPoints: (state, action: PayloadAction<DataPoint2D[]>) => {
      state.points = action.payload;
      state.config.datasetType = 'custom';
      state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
      state.currentEpoch = 0;
      state.isPlaying = false;
    },

    addPoint: (state, action: PayloadAction<{ x1: number; x2: number; label: number }>) => {
      const newPt: DataPoint2D = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        x1: action.payload.x1,
        x2: action.payload.x2,
        label: action.payload.label,
      };
      state.points.push(newPt);
      state.config.datasetType = 'custom';
      state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
    },

    setCurrentEpoch: (state, action: PayloadAction<number>) => {
      state.currentEpoch = Math.max(0, Math.min(action.payload, state.trajectory.length - 1));
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

    setSelectedNeuron: (state, action: PayloadAction<{ layerIndex: number; neuronIndex: number } | null>) => {
      state.selectedNeuron = action.payload;
    },

    setHoveredNeuron: (state, action: PayloadAction<{ layerIndex: number; neuronIndex: number } | null>) => {
      state.hoveredNeuron = action.payload;
    },

    setSelectedLessonId: (state, action: PayloadAction<number>) => {
      state.selectedLessonId = action.payload;
    },

    setComparisonLearningRate: (state, action: PayloadAction<number>) => {
      state.comparisonLearningRate = action.payload;
    },

    resetSimulation: (state) => {
      state.currentEpoch = 0;
      state.isPlaying = false;
      state.trajectory = runSimulation(state.layerSizes, state.points, state.config);
    },
  },
});

export const {
  setLayerSizes,
  addLayer,
  removeLayer,
  updateNeuronCount,
  updateConfig,
  setDatasetType,
  setPoints,
  addPoint,
  setCurrentEpoch,
  setIsPlaying,
  setPlaybackSpeed,
  setViewMode,
  setSelectedNeuron,
  setHoveredNeuron,
  setSelectedLessonId,
  setComparisonLearningRate,
  resetSimulation,
} = neuralNetworkSlice.actions;

export default neuralNetworkSlice.reducer;
