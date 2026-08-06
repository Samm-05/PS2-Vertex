import { AlgorithmDefinition, DataPoint3D, DatasetConfig, SimulationStep } from './types';

interface PCAParams {
  components: number;
  iterations: number;
  noise: number;
}

const dot = (a: [number, number, number], b: [number, number, number]) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (v: [number, number, number]) => Math.sqrt(dot(v, v)) || 1;
const normalize = (v: [number, number, number]): [number, number, number] => {
  const n = norm(v);
  return [v[0] / n, v[1] / n, v[2] / n];
};
const mulMatVec = (m: number[][], v: [number, number, number]): [number, number, number] => [
  m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2],
  m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2],
  m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2],
];

const generatePcaDataset = (size: number, noise: number): DataPoint3D[] => {
  return Array.from({ length: size }, (_, id) => {
    const t = (Math.random() - 0.5) * 8;
    const x = t + (Math.random() - 0.5) * noise * 2;
    const y = 0.7 * t + (Math.random() - 0.5) * noise * 2;
    const z = -0.4 * t + (Math.random() - 0.5) * noise * 2;
    return { id, x, y, z };
  });
};

export const pcaDefinition: AlgorithmDefinition<PCAParams> = {
  id: 'pca',
  name: 'Principal Component Analysis',
  description: 'Find principal directions and project data into lower dimensions.',
  sceneType: 'pca',
  defaultParams: {
    components: 2,
    iterations: 16,
    noise: 0.25,
  },
  parameterDefinitions: [
    { key: 'components', label: 'Components', type: 'slider', min: 1, max: 3, step: 1 },
    { key: 'iterations', label: 'Power Iterations', type: 'slider', min: 5, max: 30, step: 1 },
    { key: 'noise', label: 'Noise Weight', type: 'slider', min: 0.05, max: 0.8, step: 0.01 },
  ],
  defaultDataset: { preset: 'random', size: 260, noise: 0.35 },
  graphKeys: { primary: 'explainedVariance', secondary: 'reconstructionError' },
  graphLabels: { primary: 'Explained Variance', secondary: 'Reconstruction Error' },
  generateDataset: (config: DatasetConfig, params: PCAParams) => generatePcaDataset(config.size, config.noise + params.noise * 0.4),
  buildSteps: (dataset: DataPoint3D[], params: PCAParams) => {
    const points = dataset.map((point) => ({ ...point }));
    const n = Math.max(1, points.length);
    const mean: [number, number, number] = [
      points.reduce((sum, point) => sum + point.x, 0) / n,
      points.reduce((sum, point) => sum + point.y, 0) / n,
      points.reduce((sum, point) => sum + point.z, 0) / n,
    ];

    const centered = points.map((point) => ({
      ...point,
      x: point.x - mean[0],
      y: point.y - mean[1],
      z: point.z - mean[2],
    }));

    const covariance = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ];

    centered.forEach((point) => {
      covariance[0][0] += point.x * point.x;
      covariance[0][1] += point.x * point.y;
      covariance[0][2] += point.x * point.z;
      covariance[1][0] += point.y * point.x;
      covariance[1][1] += point.y * point.y;
      covariance[1][2] += point.y * point.z;
      covariance[2][0] += point.z * point.x;
      covariance[2][1] += point.z * point.y;
      covariance[2][2] += point.z * point.z;
    });
    for (let i = 0; i < 3; i += 1) {
      for (let j = 0; j < 3; j += 1) {
        covariance[i][j] /= n;
      }
    }

    const steps: SimulationStep[] = [
      {
        stepIndex: 0,
        phase: 'center',
        title: 'Center Dataset',
        explanation: 'Mean is removed from every feature so PCA captures variance directions only.',
        points: centered.map((point) => ({ ...point })),
        metrics: { explainedVariance: 0, reconstructionError: 1 },
      },
    ];

    let v1: [number, number, number] = normalize([Math.random(), Math.random(), Math.random()]);
    for (let i = 0; i < params.iterations; i += 1) {
      v1 = normalize(mulMatVec(covariance, v1));
      const lambda1 = dot(v1, mulMatVec(covariance, v1));
      steps.push({
        stepIndex: steps.length,
        phase: 'power-iteration',
        title: `Estimate Principal Axis 1 (${i + 1})`,
        explanation: 'Power iteration aligns vector with the direction of maximum variance.',
        points: centered.map((point) => ({ ...point })),
        vectors: [{ start: [0, 0, 0], end: [v1[0] * 6, v1[1] * 6, v1[2] * 6], color: '#6366f1' }],
        metrics: {
          explainedVariance: Math.max(0, Math.min(1, lambda1 / (covariance[0][0] + covariance[1][1] + covariance[2][2]))),
          reconstructionError: Math.max(0, 1 - lambda1 / (covariance[0][0] + covariance[1][1] + covariance[2][2])),
        },
      });
    }

    const lambda1 = dot(v1, mulMatVec(covariance, v1));
    const projected = centered.map((point) => {
      const score = dot([point.x, point.y, point.z], v1);
      return { ...point, x: score * v1[0], y: score * v1[1], z: score * v1[2] };
    });
    const reconstructionError =
      centered.reduce((sum, point, idx) => {
        const dx = point.x - projected[idx].x;
        const dy = point.y - projected[idx].y;
        const dz = point.z - projected[idx].z;
        return sum + Math.sqrt(dx * dx + dy * dy + dz * dz);
      }, 0) / n;

    steps.push({
      stepIndex: steps.length,
      phase: 'project',
      title: 'Project to Principal Subspace',
      explanation: 'Points are projected onto principal axes to reduce dimensionality while preserving variance.',
      points: projected.map((point) => ({ ...point })),
      vectors: [{ start: [0, 0, 0], end: [v1[0] * 6, v1[1] * 6, v1[2] * 6], color: '#6366f1' }],
      metrics: {
        explainedVariance: Math.max(0, Math.min(1, lambda1 / (covariance[0][0] + covariance[1][1] + covariance[2][2]))),
        reconstructionError,
      },
    });

    return steps;
  },
};
