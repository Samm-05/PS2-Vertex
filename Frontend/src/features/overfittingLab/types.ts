export type FitRegime = 'underfitting' | 'good_fit' | 'overfitting';

export interface DataPoint2D {
  id: string;
  x: number; // Normalized x (-3 to 3)
  y: number; // Target y value
  isTrain: boolean; // true = training point, false = validation/test point
}

export interface OverfittingConfig {
  datasetSize: number; // Number of sample data points (20 to 300)
  noise: number; // Gaussian noise std dev (0 to 1.0)
  degree: number; // Polynomial degree (1 to 15)
  lambda: number; // L2 Ridge Regularization parameter (0.0 to 1.0)
  epochs: number; // Epochs for gradient descent convergence (20 to 300)
  learningRate: number; // Learning rate alpha (0.001 to 0.5)
}

export interface CurvePoint {
  x: number;
  y: number;
}

export interface BiasVariancePoint {
  degree: number;
  biasSq: number;
  variance: number;
  totalError: number;
}

export interface EpochLossPoint {
  epoch: number;
  trainLoss: number;
  valLoss: number;
}

export interface OverfittingResult {
  weights: number[]; // Fitted polynomial weights [w0, w1, w2, ...]
  trainLoss: number;
  valLoss: number;
  bias: number;
  variance: number;
  regime: FitRegime;
  predictionCurve: CurvePoint[];
  biasVarianceCurve: BiasVariancePoint[];
  lossHistory: EpochLossPoint[];
}
