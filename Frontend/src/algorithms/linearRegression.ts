import { AlgorithmDefinition, DataPoint3D, DatasetConfig, SimulationStep } from './types';

interface LinearRegressionParams {
  learningRate: number;
  iterations: number;
  regularization: number;
}

const makeLineDataset = (size: number, noise: number): DataPoint3D[] => {
  const slope = 1.7;
  const intercept = -0.8;
  return Array.from({ length: size }, (_, id) => {
    const x = -6 + (12 * id) / Math.max(size - 1, 1);
    const y = slope * x + intercept + (Math.random() - 0.5) * noise * 8;
    return { id, x, y, z: 0, target: y };
  });
};

export const linearRegressionDefinition: AlgorithmDefinition<LinearRegressionParams> = {
  id: 'linear-regression',
  name: 'Linear Regression',
  description: 'Fit a line through gradient descent and monitor loss shrinkage.',
  sceneType: 'regression',
  defaultParams: {
    learningRate: 0.02,
    iterations: 40,
    regularization: 0.02,
  },
  parameterDefinitions: [
    { key: 'learningRate', label: 'Learning Rate', type: 'slider', min: 0.001, max: 0.1, step: 0.001 },
    { key: 'iterations', label: 'Iterations', type: 'slider', min: 10, max: 120, step: 1 },
    { key: 'regularization', label: 'Regularization', type: 'slider', min: 0, max: 0.2, step: 0.005 },
  ],
  defaultDataset: { preset: 'line', size: 180, noise: 0.3 },
  graphKeys: { primary: 'loss', secondary: 'accuracy' },
  graphLabels: { primary: 'Loss (MSE)', secondary: 'Prediction Accuracy' },
  generateDataset: (config: DatasetConfig) => makeLineDataset(config.size, config.noise),
  buildSteps: (dataset: DataPoint3D[], params: LinearRegressionParams) => {
    const steps: SimulationStep[] = [];
    const points = dataset.map((point) => ({ ...point }));
    let m = Math.random() * 0.5 - 0.25;
    let b = Math.random() * 0.5 - 0.25;
    const n = points.length;

    for (let iter = 0; iter < params.iterations; iter += 1) {
      const predictions = points.map((point) => m * point.x + b);
      const residuals = predictions.map((pred, idx) => pred - points[idx].y);
      const loss = residuals.reduce((sum, value) => sum + value * value, 0) / Math.max(1, n);
      const mae = residuals.reduce((sum, value) => sum + Math.abs(value), 0) / Math.max(1, n);
      const accuracy = 1 / (1 + mae);

      const gradM =
        (2 / Math.max(1, n)) * residuals.reduce((sum, value, idx) => sum + value * points[idx].x, 0) + 2 * params.regularization * m;
      const gradB = (2 / Math.max(1, n)) * residuals.reduce((sum, value) => sum + value, 0);
      m -= params.learningRate * gradM;
      b -= params.learningRate * gradB;

      const xMin = Math.min(...points.map((point) => point.x));
      const xMax = Math.max(...points.map((point) => point.x));
      const sampled = points.filter((_, idx) => idx % Math.ceil(points.length / 22) === 0).slice(0, 22);

      steps.push({
        stepIndex: iter,
        phase: iter === 0 ? 'initialize' : 'optimize',
        title: `Gradient Update ${iter + 1}`,
        explanation:
          iter === 0
            ? 'Weights are initialized and predictions are computed.'
            : 'Loss gradients update slope and intercept, pulling the line closer to data.',
        points: points.map((point, idx) => ({
          ...point,
          predicted: predictions[idx],
          label: 0,
        })),
        regressionLine: {
          start: [xMin, m * xMin + b, 0],
          end: [xMax, m * xMax + b, 0],
        },
        errorSegments: sampled.map((point) => ({
          from: [point.x, point.y, 0],
          to: [point.x, m * point.x + b, 0],
        })),
        metrics: { loss, accuracy },
      });
    }

    return steps;
  },
};
