export type ActivationType = 'sigmoid' | 'relu' | 'tanh' | 'leaky_relu' | 'softmax';

export type OptimizerType = 'sgd' | 'momentum' | 'adam' | 'rmsprop';

export type LossType = 'bce' | 'mse' | 'cce';

export type DatasetType = 'xor' | 'circle' | 'spiral' | 'moons' | 'gaussian' | 'custom';

export interface DataPoint2D {
  id: string;
  x1: number; // Feature 1 (-4 to 4)
  x2: number; // Feature 2 (-4 to 4)
  label: number; // 0 or 1
}

export interface NeuronState {
  layerIndex: number;
  neuronIndex: number;
  z: number; // weighted sum
  a: number; // activation output
  bias: number;
  gradB: number; // bias gradient
  weights: number[]; // incoming weights from previous layer
  gradW: number[]; // weight gradients
}

export interface LayerState {
  layerIndex: number;
  neurons: NeuronState[];
}

export interface NetworkState {
  layers: LayerState[];
}

export interface EpochSnapshot {
  epoch: number;
  loss: number;
  accuracy: number;
  gradientNorm: number;
  vanishingExplodingStatus: 'normal' | 'vanishing' | 'exploding';
  networkState: NetworkState;
  decisionGrid: number[][]; // 2D array of probability values for heatmap rendering
}

export interface NNConfig {
  learningRate: number;
  activation: ActivationType;
  optimizer: OptimizerType;
  lossFunc: LossType;
  datasetType: DatasetType;
  datasetSize: number;
  noise: number;
  batchSize: number;
  l1Lambda: number;
  l2Lambda: number;
  maxEpochs: number;
}

export type ViewMode = 'playground' | 'comparison' | 'gradient_flow' | 'lesson' | 'quiz';

export interface LessonStep {
  id: number;
  title: string;
  category: string;
  description: string;
  explanation: string;
  actionHint: string;
  presetTopology?: number[];
  presetConfig?: Partial<NNConfig>;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}
