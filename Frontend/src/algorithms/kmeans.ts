import { AlgorithmDefinition, DataPoint3D, DatasetConfig, SimulationStep } from './types';

interface KMeansParams {
  clusters: number;
  maxIterations: number;
  distance: 'euclidean' | 'manhattan';
}

const palette = ['#6366f1', '#14b8a6', '#f59e0b', '#ef4444', '#22c55e', '#a855f7'];

const distance = (a: DataPoint3D, b: { x: number; y: number; z: number }, metric: KMeansParams['distance']) => {
  if (metric === 'manhattan') {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y) + Math.abs(a.z - b.z);
  }
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
};

const buildClustersDataset = (size: number, noise: number, k: number): DataPoint3D[] => {
  const safeK = Number.isFinite(k) && k >= 2 ? Math.floor(k) : 3;
  const centers = Array.from({ length: safeK }, (_, i) => ({
    x: Math.cos((i / safeK) * Math.PI * 2) * 4,
    y: Math.sin((i / safeK) * Math.PI * 2) * 4,
    z: (i - safeK / 2) * 1.2,
  }));

  return Array.from({ length: size }, (_, id) => {
    const c = centers[id % safeK] ?? centers[0];
    return {
      id,
      x: c.x + (Math.random() - 0.5) * noise * 6,
      y: c.y + (Math.random() - 0.5) * noise * 6,
      z: c.z + (Math.random() - 0.5) * noise * 6,
      cluster: -1,
    };
  });
};

export const kmeansDefinition: AlgorithmDefinition<KMeansParams> = {
  id: 'kmeans',
  name: 'K-Means Clustering',
  description: 'Cluster points in 3D by minimizing inertia iteratively.',
  sceneType: 'kmeans',
  defaultParams: {
    clusters: 3,
    maxIterations: 12,
    distance: 'euclidean',
  },
  parameterDefinitions: [
    { key: 'clusters', label: 'Clusters (K)', type: 'slider', min: 2, max: 6, step: 1 },
    { key: 'maxIterations', label: 'Max Iterations', type: 'slider', min: 3, max: 25, step: 1 },
    {
      key: 'distance',
      label: 'Distance Metric',
      type: 'select',
      options: [
        { label: 'Euclidean', value: 'euclidean' },
        { label: 'Manhattan', value: 'manhattan' },
      ],
    },
  ],
  defaultDataset: { preset: 'blobs', size: 320, noise: 0.55 },
  graphKeys: { primary: 'inertia', secondary: 'variance' },
  graphLabels: { primary: 'Inertia', secondary: 'Cluster Variance' },
  generateDataset: (config: DatasetConfig, params: KMeansParams) => {
    return buildClustersDataset(config.size, config.noise, params.clusters);
  },
  buildSteps: (dataset: DataPoint3D[], params: KMeansParams) => {
    const steps: SimulationStep[] = [];
    const points = dataset.map((p) => ({ ...p }));
    let centroids = Array.from({ length: params.clusters }, (_, i) => {
      const p = points[(i * Math.floor(points.length / params.clusters)) % points.length];
      return { x: p.x, y: p.y, z: p.z, cluster: i };
    });

    steps.push({
      stepIndex: 0,
      phase: 'initialize',
      title: 'Initialize Random Centroids',
      explanation: 'Random centroids are spawned as the starting cluster anchors.',
      points: points.map((p) => ({ ...p, cluster: -1 })),
      centroids: centroids.map((c) => ({ ...c })),
      metrics: { inertia: 0, variance: 0 },
    });

    for (let iteration = 1; iteration <= params.maxIterations; iteration += 1) {
      points.forEach((point) => {
        let bestIndex = 0;
        let bestDist = Number.POSITIVE_INFINITY;
        centroids.forEach((centroid, idx) => {
          const d = distance(point, centroid, params.distance);
          if (d < bestDist) {
            bestDist = d;
            bestIndex = idx;
          }
        });
        point.cluster = bestIndex;
      });

      let inertia = 0;
      points.forEach((point) => {
        const centroid = centroids[point.cluster ?? 0];
        inertia += distance(point, centroid, params.distance) ** 2;
      });

      steps.push({
        stepIndex: steps.length,
        phase: 'assignment',
        title: `Assign Points - Iteration ${iteration}`,
        explanation: 'Each point is assigned to the nearest centroid based on the chosen distance metric.',
        points: points.map((p) => ({ ...p })),
        centroids: centroids.map((c) => ({ ...c })),
        metrics: {
          inertia,
          variance: inertia / Math.max(points.length, 1),
        },
      });

      const nextCentroids = centroids.map((centroid) => ({ ...centroid }));
      for (let c = 0; c < params.clusters; c += 1) {
        const clusterPoints = points.filter((point) => point.cluster === c);
        if (clusterPoints.length === 0) {
          continue;
        }
        const inv = 1 / clusterPoints.length;
        nextCentroids[c] = {
          cluster: c,
          x: clusterPoints.reduce((sum, point) => sum + point.x, 0) * inv,
          y: clusterPoints.reduce((sum, point) => sum + point.y, 0) * inv,
          z: clusterPoints.reduce((sum, point) => sum + point.z, 0) * inv,
        };
      }

      const centroidShift = nextCentroids.reduce((sum, centroid, idx) => {
        return sum + Math.hypot(centroid.x - centroids[idx].x, centroid.y - centroids[idx].y, centroid.z - centroids[idx].z);
      }, 0);

      centroids = nextCentroids;

      steps.push({
        stepIndex: steps.length,
        phase: 'update',
        title: `Update Centroids - Iteration ${iteration}`,
        explanation: 'Centroids move to the mean of points in each cluster, reducing overall inertia.',
        points: points.map((p) => ({ ...p })),
        centroids: centroids.map((c) => ({ ...c })),
        metrics: {
          inertia,
          variance: centroidShift / Math.max(params.clusters, 1),
        },
      });

      if (centroidShift < 0.01) {
        steps.push({
          stepIndex: steps.length,
          phase: 'converged',
          title: `Converged at Iteration ${iteration}`,
          explanation: 'Centroid movement is negligible, so clustering has stabilized.',
          points: points.map((p) => ({ ...p })),
          centroids: centroids.map((c) => ({ ...c })),
          metrics: { inertia, variance: centroidShift },
        });
        break;
      }
    }

    return steps.map((step) => ({
      ...step,
      points: step.points.map((p) => ({ ...p, label: p.cluster, predicted: p.cluster })),
      metrics: { ...step.metrics },
      vectors: step.centroids?.map((centroid) => ({
        start: [centroid.x, centroid.y, -6] as [number, number, number],
        end: [centroid.x, centroid.y, centroid.z] as [number, number, number],
        color: palette[centroid.cluster % palette.length],
      })),
    }));
  },
};
