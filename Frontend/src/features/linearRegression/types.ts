export interface DataPoint2D {
  id: string;
  x: number;
  y: number;
  predicted?: number;
  residual?: number;
}

export type DatasetPresetType = 'positive' | 'negative' | 'noisy' | 'perfect-line' | 'random' | 'custom';

export interface LinearRegressionParams {
  learningRate: number;
  epochs: number;
  noise: number;
  datasetSize: number;
  trainTestSplit: number; // e.g. 80 for 80%
  batchSize: number;
  normalizeInputs: boolean;
  regularization: number; // L2 lambda
  randomSeed: number;
  preset: DatasetPresetType;
  wInitial: number;
  bInitial: number;
}

export interface RegressionStep {
  epoch: number;
  w: number; // slope
  b: number; // intercept / bias
  mseLoss: number;
  gradW: number;
  gradB: number;
  predictions: { id: string; x: number; y: number; predicted: number; residual: number }[];
  explanation: {
    what: string;
    why: string;
    next: string;
  };
}

export interface TutorialStep {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  concept: string;
  formula: string;
  presetParams: Partial<LinearRegressionParams>;
  verification: (params: LinearRegressionParams, steps: RegressionStep[], currentStep: number) => boolean;
  hint: string;
}
