export type DatasetType =
  | 'linear'
  | 'slightly_overlapping'
  | 'highly_overlapping'
  | 'circular'
  | 'xor'
  | 'spiral'
  | 'custom';

export type FeatureType = 'linear' | 'polynomial' | 'rbf';

export type RegularizationType = 'none' | 'l1' | 'l2';

export interface DataPoint2D {
  id: string;
  x1: number; // Feature 1 (-5 to 5)
  x2: number; // Feature 2 (-5 to 5)
  label: 0 | 1; // Class 0 (Blue) or Class 1 (Red)
}

export interface ModelWeights {
  w1: number;
  w2: number;
  b: number;
  // Polynomial terms if enabled
  w11?: number;
  w22?: number;
  w12?: number;
}

export interface EpochMetrics {
  epoch: number;
  loss: number; // Binary Cross Entropy Loss
  accuracy: number; // 0 to 1
  precision: number; // 0 to 1
  recall: number; // 0 to 1
  f1Score: number; // 0 to 1
  auc: number; // Area under ROC
  weights: ModelWeights;
  confusionMatrix: ConfusionMatrixData;
  gradientNorm: number;
}

export interface ConfusionMatrixData {
  tp: number; // True Positives
  fp: number; // False Positives
  tn: number; // True Negatives
  fn: number; // False Negatives
}

export interface PointPrediction {
  id: string;
  x1: number;
  x2: number;
  label: 0 | 1;
  z: number; // w1*x1 + w2*x2 + b
  probability: number; // σ(z)
  predictedLabel: 0 | 1; // based on classification threshold
  isCorrect: boolean;
}

export interface LessonStep {
  id: number;
  title: string;
  category: string;
  description: string;
  explanation: string;
  actionHint: string;
  targetPreset?: DatasetType;
  targetThreshold?: number;
  targetLearningRate?: number;
  targetFeatureType?: FeatureType;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface ModelConfig {
  learningRate: number;
  threshold: number;
  regularization: RegularizationType;
  regLambda: number;
  featureType: FeatureType;
  maxEpochs: number;
}

export type ViewMode =
  | 'playground'
  | 'sigmoid'
  | 'comparison'
  | 'underfitting'
  | 'lesson'
  | 'quiz';
