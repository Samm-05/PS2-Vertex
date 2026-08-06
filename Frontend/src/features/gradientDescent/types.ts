export type LossSurfaceType = 'paraboloid' | 'saddle' | 'rosenbrock' | 'himmelblau';

export type LearningRateMode = 'very-small' | 'small' | 'optimal' | 'large' | 'too-large' | 'custom';

export type GradientMode = 'batch' | 'stochastic' | 'mini-batch';

export interface GradientDescentParams {
  surfaceType: LossSurfaceType;
  learningRate: number;
  learningRateMode: LearningRateMode;
  momentum: number;
  epochs: number;
  noise: number;
  batchMode: GradientMode;
  w1Initial: number;
  w2Initial: number;
  regularization: number; // L2 lambda
  randomSeed: number;
}

export interface OptimizationStep {
  stepIndex: number;
  w1: number;
  w2: number;
  loss: number;
  gradW1: number;
  gradW2: number;
  gradNorm: number;
  stepSize: number;
  velocityW1: number;
  velocityW2: number;
  explanation: {
    what: string;
    why: string;
    next: string;
  };
}

export interface LossSurfaceDefinition {
  id: LossSurfaceType;
  name: string;
  formulaTex: string;
  description: string;
  compute: (w1: number, w2: number) => number;
  computeGradient: (w1: number, w2: number) => { gradW1: number; gradW2: number };
  globalMinimum: { w1: number; w2: number; loss: number };
  domain: { minW1: number; maxW1: number; minW2: number; maxW2: number; maxLoss: number };
  recommendedInit: { w1: number; w2: number };
}

export interface TutorialStep {
  id: number;
  title: string;
  subtitle: string;
  objective: string;
  concept: string;
  formula: string;
  presetParams: Partial<GradientDescentParams>;
  verification: (params: GradientDescentParams, steps: OptimizationStep[], currentStep: number) => boolean;
  hint: string;
}
