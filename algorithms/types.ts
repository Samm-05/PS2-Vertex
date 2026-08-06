export type AlgorithmId =
  | 'linear-regression'
  | 'kmeans'
  | 'decision-tree'
  | 'logistic-regression'
  | 'pca';

export type SceneType = 'kmeans' | 'regression' | 'decision-tree' | 'logistic' | 'pca';

export interface DataPoint3D {
  id: number;
  x: number;
  y: number;
  z: number;
  label?: number;
  cluster?: number;
  predicted?: number;
  target?: number;
}

export interface RegressionLine {
  start: [number, number, number];
  end: [number, number, number];
}

export interface TreeNodeVisual {
  id: string;
  depth: number;
  x: number;
  y: number;
  label: string;
  leaf: boolean;
  highlighted?: boolean;
}

export interface TreeEdgeVisual {
  from: string;
  to: string;
}

export interface SimulationStep {
  stepIndex: number;
  phase: string;
  title: string;
  explanation: string;
  points: DataPoint3D[];
  centroids?: Array<{ x: number; y: number; z: number; cluster: number }>;
  regressionLine?: RegressionLine;
  errorSegments?: Array<{ from: [number, number, number]; to: [number, number, number] }>;
  treeNodes?: TreeNodeVisual[];
  treeEdges?: TreeEdgeVisual[];
  vectors?: Array<{ start: [number, number, number]; end: [number, number, number]; color: string }>;
  metrics: Record<string, number>;
}

export interface DatasetConfig {
  preset: 'random' | 'blobs' | 'moons' | 'line' | 'classification';
  size: number;
  noise: number;
}

export interface SliderParamDefinition {
  key: string;
  label: string;
  type: 'slider';
  min: number;
  max: number;
  step: number;
}

export interface SelectParamDefinition {
  key: string;
  label: string;
  type: 'select';
  options: Array<{ label: string; value: string }>;
}

export type ParameterDefinition = SliderParamDefinition | SelectParamDefinition;

export interface AlgorithmDefinition<TParams extends Record<string, number | string>> {
  id: AlgorithmId;
  name: string;
  description: string;
  sceneType: SceneType;
  defaultParams: TParams;
  parameterDefinitions: ParameterDefinition[];
  defaultDataset: DatasetConfig;
  graphKeys: { primary: string; secondary: string };
  graphLabels: { primary: string; secondary: string };
  generateDataset: (config: DatasetConfig, params: TParams) => DataPoint3D[];
  buildSteps: (dataset: DataPoint3D[], params: TParams) => SimulationStep[];
}
