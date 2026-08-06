import {
  DataPoint2D,
  OverfittingConfig,
  OverfittingResult,
  CurvePoint,
  BiasVariancePoint,
  EpochLossPoint,
  FitRegime,
} from '../types';

// Ground truth non-linear target function: y = sin(x) + 0.5 * cos(2x)
export function trueTargetFunction(x: number): number {
  return Math.sin(x) + 0.5 * Math.cos(2 * x);
}

// Pseudo-random Gaussian Noise generator
function gaussianNoise(stdDev: number): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * stdDev;
}

// Generate Dataset with Train (70%) and Validation (30%) split
export function generateOverfittingDataset(size: number, noise: number): DataPoint2D[] {
  const points: DataPoint2D[] = [];
  const minX = -2.8;
  const maxX = 2.8;
  const step = (maxX - minX) / (size - 1);

  for (let i = 0; i < size; i++) {
    const x = minX + i * step + (Math.random() - 0.5) * 0.1;
    const yTrue = trueTargetFunction(x);
    const y = yTrue + gaussianNoise(noise);
    const isTrain = Math.random() < 0.7; // 70% train split

    points.push({
      id: `pt_${i}_${Date.now()}`,
      x,
      y,
      isTrain,
    });
  }

  return points;
}

// Solve Polynomial Ridge Regression (X^T X + lambda I)^-1 X^T Y
export function solvePolynomialFit(
  points: DataPoint2D[],
  config: OverfittingConfig
): OverfittingResult {
  const { degree, lambda, epochs } = config;
  const trainPoints = points.filter((p) => p.isTrain);
  const valPoints = points.filter((p) => !p.isTrain);

  const numTrain = Math.max(1, trainPoints.length);
  const d = Math.max(1, Math.min(15, degree));

  // Build Design Matrix X (numTrain x d+1)
  const X: number[][] = [];
  const Y: number[] = [];

  trainPoints.forEach((p) => {
    const row: number[] = [];
    for (let k = 0; k <= d; k++) {
      row.push(Math.pow(p.x, k));
    }
    X.push(row);
    Y.push(p.y);
  });

  // Calculate Normal Equations: (X^T X + lambda I) w = X^T Y
  const numFeatures = d + 1;
  const XtX: number[][] = Array.from({ length: numFeatures }, () =>
    new Array(numFeatures).fill(0)
  );
  const XtY: number[] = new Array(numFeatures).fill(0);

  for (let i = 0; i < numFeatures; i++) {
    for (let j = 0; j < numFeatures; j++) {
      let sum = 0;
      for (let r = 0; r < numTrain; r++) {
        sum += X[r][i] * X[r][j];
      }
      // Add L2 Ridge Regularization (except bias term w0)
      if (i === j && i > 0) {
        sum += lambda * numTrain * 10;
      }
      XtX[i][j] = sum;
    }

    let sumY = 0;
    for (let r = 0; r < numTrain; r++) {
      sumY += X[r][i] * Y[r];
    }
    XtY[i] = sumY;
  }

  // Gaussian Elimination Solver for Weights
  const weights = solveGaussian(XtX, XtY);

  // Evaluate Prediction Polynomial Curve y = sum(w_k * x^k)
  const predict = (x: number): number => {
    let val = 0;
    for (let k = 0; k <= d; k++) {
      val += (weights[k] ?? 0) * Math.pow(x, k);
    }
    return val;
  };

  // Compute Loss Errors
  let trainLossSum = 0;
  trainPoints.forEach((p) => {
    const err = p.y - predict(p.x);
    trainLossSum += err * err;
  });
  const trainLoss = trainLossSum / numTrain;

  let valLossSum = 0;
  const numVal = Math.max(1, valPoints.length);
  valPoints.forEach((p) => {
    const err = p.y - predict(p.x);
    valLossSum += err * err;
  });
  const valLoss = valLossSum / numVal;

  // Determine Regime
  let regime: FitRegime = 'good_fit';
  if (d <= 2 || (trainLoss > 0.45 && valLoss > 0.45)) {
    regime = 'underfitting';
  } else if (d >= 6 && lambda < 0.02 && valLoss > 1.35 * trainLoss) {
    regime = 'overfitting';
  }

  // Generate Prediction Curve Line Data
  const predictionCurve: CurvePoint[] = [];
  const curveSteps = 100;
  const minX = -3.0;
  const maxX = 3.0;
  const stepX = (maxX - minX) / curveSteps;

  for (let i = 0; i <= curveSteps; i++) {
    const x = minX + i * stepX;
    predictionCurve.push({ x, y: predict(x) });
  }

  // Compute Bias-Variance Tradeoff Curve across degrees 1 to 12
  const biasVarianceCurve: BiasVariancePoint[] = [];
  for (let deg = 1; deg <= 12; deg++) {
    const biasSq = Math.max(0.01, 1.2 / Math.pow(deg, 1.2));
    const variance = Math.max(0.01, 0.02 * Math.pow(deg, 1.6) * (1 / (1 + lambda * 20)));
    const totalError = biasSq + variance + config.noise * 0.1;

    biasVarianceCurve.push({
      degree: deg,
      biasSq: Number(biasSq.toFixed(3)),
      variance: Number(variance.toFixed(3)),
      totalError: Number(totalError.toFixed(3)),
    });
  }

  // Generate Epoch Training Loss History
  const lossHistory: EpochLossPoint[] = [];
  for (let ep = 0; ep <= epochs; ep += Math.max(1, Math.floor(epochs / 20))) {
    const decay = Math.exp(-ep / (epochs * 0.3));
    const tL = Math.max(0.02, trainLoss + (0.8 - trainLoss) * decay);
    const vL = Math.max(0.05, valLoss + (1.0 - valLoss) * decay);
    lossHistory.push({
      epoch: ep,
      trainLoss: Number(tL.toFixed(4)),
      valLoss: Number(vL.toFixed(4)),
    });
  }

  return {
    weights,
    trainLoss,
    valLoss,
    bias: Math.sqrt(Math.max(0, trainLoss)),
    variance: Math.max(0, valLoss - trainLoss),
    regime,
    predictionCurve,
    biasVarianceCurve,
    lossHistory,
  };
}

// Simple Gaussian Elimination with Pivoting
function solveGaussian(A: number[][], B: number[]): number[] {
  const n = B.length;
  const M = A.map((row, i) => [...row, B[i]]);

  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) {
        maxRow = k;
      }
    }
    [M[i], M[maxRow]] = [M[maxRow], M[i]];

    if (Math.abs(M[i][i]) < 1e-10) continue;

    for (let k = i + 1; k < n; k++) {
      const c = -M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        if (i === j) {
          M[k][j] = 0;
        } else {
          M[k][j] += c * M[i][j];
        }
      }
    }
  }

  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = M[i][n];
    for (let j = i + 1; j < n; j++) {
      sum -= M[i][j] * x[j];
    }
    x[i] = M[i][i] !== 0 ? sum / M[i][i] : 0;
  }

  return x;
}
