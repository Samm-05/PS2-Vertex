export interface Simulation {
  id: string;
  userId: string;
  algorithm: AlgorithmType;
  name: string;
  description?: string;
  parameters: SimulationParameters;
  results: SimulationResults;
  data: any;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  tags?: string[];
}

export type AlgorithmType = 
  | 'linear-regression'
  | 'kmeans'
  | 'decision-tree'
  | 'neural-network';

export interface SimulationParameters {
  learningRate?: number;
  epochs?: number;
  noise?: number;
  k?: number;
  maxIterations?: number;
  maxDepth?: number;
  minSamplesSplit?: number;
  criterion?: 'gini' | 'entropy';
  [key: string]: any;
}

export interface SimulationResults {
  finalLoss?: number;
  accuracy?: number;
  iterations?: number;
  convergenceTime?: number;
  lossHistory: number[];
  accuracyHistory?: number[];
  parameters: Record<string, any>;
}

export interface SimulationData {
  points: DataPoint[];
  line?: RegressionLine;
  centroids?: Centroid[];
  tree?: DecisionTreeNode;
}

export interface DataPoint {
  x: number;
  y: number;
  z?: number;
  label?: number;
  cluster?: number;
  highlighted?: boolean;
}

export interface RegressionLine {
  slope: number;
  intercept: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Centroid {
  x: number;
  y: number;
  z?: number;
  cluster: number;
}

export interface DecisionTreeNode {
  isLeaf: boolean;
  feature?: string;
  threshold?: number;
  value?: number;
  left?: DecisionTreeNode;
  right?: DecisionTreeNode;
  samples: number;
  impurity?: number;
}