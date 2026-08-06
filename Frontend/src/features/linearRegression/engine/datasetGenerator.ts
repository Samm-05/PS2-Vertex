import { DataPoint2D, DatasetPresetType } from '../types';

/**
 * Seeded pseudo-random Gaussian generator (Box-Muller transform)
 */
function gaussianRandom(mean = 0, std = 1, seed = 0): number {
  const u1 = Math.abs(Math.sin(seed * 9999 + 1));
  const u2 = Math.abs(Math.cos(seed * 7777 + 2));
  const z0 = Math.sqrt(-2.0 * Math.log(u1 || 0.00001)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * std;
}

export function generateSyntheticDataset(
  preset: DatasetPresetType,
  size: number,
  noiseLevel: number,
  seed = 42
): DataPoint2D[] {
  const points: DataPoint2D[] = [];

  let trueW = 1.5;
  let trueB = 1.0;

  if (preset === 'negative') {
    trueW = -1.2;
    trueB = 7.0;
  } else if (preset === 'perfect-line') {
    trueW = 2.0;
    trueB = 0.5;
  } else if (preset === 'random') {
    trueW = 0.5;
    trueB = 3.0;
  }

  const minX = -3.5;
  const maxX = 4.5;
  const stepX = (maxX - minX) / Math.max(1, size - 1);

  for (let i = 0; i < size; i++) {
    const x = minX + i * stepX + (Math.sin(seed + i) * 0.1);
    let y = trueW * x + trueB;

    if (preset !== 'perfect-line') {
      const noise = gaussianRandom(0, Math.max(0.05, noiseLevel), seed + i * 3);
      y += noise;
    }

    points.push({
      id: `pt-${i}-${Date.now()}`,
      x: parseFloat(x.toFixed(2)),
      y: parseFloat(y.toFixed(2)),
    });
  }

  return points;
}
