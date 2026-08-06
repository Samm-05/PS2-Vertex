import { AlgorithmDefinition, DataPoint3D, DatasetConfig, SimulationStep } from './types';

interface LogisticRegressionParams {
  learningRate: number;
  iterations: number;
  regularization: number;
}

const generateClassificationDataset = (size: number, noise: number): DataPoint3D[] => {
  return Array.from({ length: size }, (_, id) => {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const boundary = x * 0.8 - y * 0.6 + (Math.random() - 0.5) * noise * 4;
    const label = boundary > 0 ? 1 : 0;
    return { id, x, y, z: 0, label, target: label, predicted: 0 };
  });
};

const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

export const logisticRegressionDefinition: AlgorithmDefinition<LogisticRegressionParams> = {
  id: 'logistic-regression',
  name: 'Logistic Regression',
  description: 'Classify points with sigmoid optimization and a dynamic decision boundary.',
  sceneType: 'logistic',
  defaultParams: {
    learningRate: 0.03,
    iterations: 50,
    regularization: 0.01,
  },
  parameterDefinitions: [
    { key: 'learningRate', label: 'Learning Rate', type: 'slider', min: 0.001, max: 0.12, step: 0.001 },
    { key: 'iterations', label: 'Iterations', type: 'slider', min: 10, max: 120, step: 1 },
    { key: 'regularization', label: 'Regularization', type: 'slider', min: 0, max: 0.2, step: 0.005 },
  ],
  defaultDataset: { preset: 'classification', size: 260, noise: 0.45 },
  graphKeys: { primary: 'loss', secondary: 'accuracy' },
  graphLabels: { primary: 'Log Loss', secondary: 'Classification Accuracy' },
  generateDataset: (config: DatasetConfig) => generateClassificationDataset(config.size, config.noise),
  buildSteps: (dataset: DataPoint3D[], params: LogisticRegressionParams) => {
    const points = dataset.map((point) => ({ ...point }));
    const steps: SimulationStep[] = [];
    let w1 = Math.random() - 0.5;
    let w2 = Math.random() - 0.5;
    let b = Math.random() - 0.5;
    const n = points.length;

    for (let iter = 0; iter < params.iterations; iter += 1) {
      const probs = points.map((point) => sigmoid(w1 * point.x + w2 * point.y + b));
      const preds = probs.map((probability) => (probability >= 0.5 ? 1 : 0));
      const loss =
        probs.reduce((sum, probability, idx) => {
          const y = points[idx].label ?? 0;
          const safeP = Math.min(0.999, Math.max(0.001, probability));
          return sum + (-y * Math.log(safeP) - (1 - y) * Math.log(1 - safeP));
        }, 0) / Math.max(1, n);

      const accuracy = preds.filter((pred, idx) => pred === (points[idx].label ?? 0)).length / Math.max(1, n);

      const gradW1 =
        probs.reduce((sum, probability, idx) => sum + (probability - (points[idx].label ?? 0)) * points[idx].x, 0) / Math.max(1, n) +
        params.regularization * w1;
      const gradW2 =
        probs.reduce((sum, probability, idx) => sum + (probability - (points[idx].label ?? 0)) * points[idx].y, 0) / Math.max(1, n) +
        params.regularization * w2;
      const gradB = probs.reduce((sum, probability, idx) => sum + (probability - (points[idx].label ?? 0)), 0) / Math.max(1, n);

      w1 -= params.learningRate * gradW1;
      w2 -= params.learningRate * gradW2;
      b -= params.learningRate * gradB;

      const xMin = -6;
      const xMax = 6;
      const yAtMin = (-b - w1 * xMin) / (w2 || 1e-6);
      const yAtMax = (-b - w1 * xMax) / (w2 || 1e-6);

      steps.push({
        stepIndex: iter,
        phase: iter === 0 ? 'initialize' : 'optimize',
        title: `Gradient Step ${iter + 1}`,
        explanation:
          iter === 0
            ? 'The decision boundary starts random and probabilities are evaluated.'
            : 'Weights update to better separate classes and reduce logistic loss.',
        points: points.map((point, idx) => ({
          ...point,
          predicted: preds[idx],
          target: point.label,
        })),
        regressionLine: {
          start: [xMin, yAtMin, 0],
          end: [xMax, yAtMax, 0],
        },
        metrics: { loss, accuracy },
      });
    }

    return steps;
  },
};
