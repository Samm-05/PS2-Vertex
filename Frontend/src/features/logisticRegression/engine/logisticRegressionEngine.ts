import {
  DataPoint2D,
  DatasetType,
  ModelWeights,
  EpochMetrics,
  ConfusionMatrixData,
  PointPrediction,
  ModelConfig,
  FeatureType,
} from '../types';

/**
 * Numerically stable Sigmoid Activation Function: σ(z) = 1 / (1 + e^-z)
 */
export const sigmoid = (z: number): number => {
  if (z >= 30) return 0.999999;
  if (z <= -30) return 0.000001;
  return 1 / (1 + Math.exp(-z));
};

/**
 * Map 2D point (x1, x2) to feature vector depending on FeatureType
 */
export const mapFeatures = (x1: number, x2: number, featureType: FeatureType): number[] => {
  if (featureType === 'polynomial') {
    return [x1, x2, x1 * x1, x2 * x2, x1 * x2];
  }
  if (featureType === 'rbf') {
    const r1 = Math.sqrt((x1 - 1) ** 2 + (x2 - 1) ** 2);
    const r2 = Math.sqrt((x1 + 1) ** 2 + (x2 + 1) ** 2);
    return [x1, x2, Math.exp(-r1), Math.exp(-r2)];
  }
  // Linear
  return [x1, x2];
};

/**
 * Generate synthetic dataset based on user-selected preset
 */
export const generateDataset = (type: DatasetType, count = 120, noise = 0.2): DataPoint2D[] => {
  const points: DataPoint2D[] = [];

  const gaussianNoise = (std = noise) => {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1 || 1e-6)) * Math.cos(2 * Math.PI * u2) * std;
  };

  switch (type) {
    case 'linear': {
      const num = Math.floor(count / 2);
      for (let i = 0; i < num; i++) {
        points.push({
          id: `p0_${i}`,
          x1: -1.8 + gaussianNoise(0.7),
          x2: -1.8 + gaussianNoise(0.7),
          label: 0,
        });
        points.push({
          id: `p1_${i}`,
          x1: 1.8 + gaussianNoise(0.7),
          x2: 1.8 + gaussianNoise(0.7),
          label: 1,
        });
      }
      break;
    }

    case 'slightly_overlapping': {
      const num = Math.floor(count / 2);
      for (let i = 0; i < num; i++) {
        points.push({
          id: `p0_${i}`,
          x1: -0.9 + gaussianNoise(0.9),
          x2: -0.9 + gaussianNoise(0.9),
          label: 0,
        });
        points.push({
          id: `p1_${i}`,
          x1: 0.9 + gaussianNoise(0.9),
          x2: 0.9 + gaussianNoise(0.9),
          label: 1,
        });
      }
      break;
    }

    case 'highly_overlapping': {
      const num = Math.floor(count / 2);
      for (let i = 0; i < num; i++) {
        points.push({
          id: `p0_${i}`,
          x1: -0.3 + gaussianNoise(1.2),
          x2: -0.3 + gaussianNoise(1.2),
          label: 0,
        });
        points.push({
          id: `p1_${i}`,
          x1: 0.3 + gaussianNoise(1.2),
          x2: 0.3 + gaussianNoise(1.2),
          label: 1,
        });
      }
      break;
    }

    case 'circular': {
      for (let i = 0; i < count; i++) {
        const r = Math.random() * 4.2;
        const theta = Math.random() * 2 * Math.PI;
        const x1 = r * Math.cos(theta) + gaussianNoise(0.1);
        const x2 = r * Math.sin(theta) + gaussianNoise(0.1);
        const label = r < 2.0 ? 0 : 1;
        points.push({ id: `circ_${i}`, x1, x2, label });
      }
      break;
    }

    case 'xor': {
      for (let i = 0; i < count; i++) {
        const x1 = (Math.random() - 0.5) * 6;
        const x2 = (Math.random() - 0.5) * 6;
        const label = (x1 > 0 && x2 > 0) || (x1 < 0 && x2 < 0) ? 1 : 0;
        points.push({
          id: `xor_${i}`,
          x1: x1 + gaussianNoise(0.15),
          x2: x2 + gaussianNoise(0.15),
          label,
        });
      }
      break;
    }

    case 'spiral': {
      const n = count / 2;
      for (let i = 0; i < n; i++) {
        const r = (i / n) * 4;
        const t = 1.75 * (i / n) * 2 * Math.PI;
        
        // Spiral 1 (Class 0)
        points.push({
          id: `sp0_${i}`,
          x1: r * Math.sin(t) + gaussianNoise(0.1),
          x2: r * Math.cos(t) + gaussianNoise(0.1),
          label: 0,
        });
        // Spiral 2 (Class 1)
        points.push({
          id: `sp1_${i}`,
          x1: -r * Math.sin(t) + gaussianNoise(0.1),
          x2: -r * Math.cos(t) + gaussianNoise(0.1),
          label: 1,
        });
      }
      break;
    }

    case 'custom':
    default: {
      return generateDataset('linear', count, noise);
    }
  }

  return points;
};

/**
 * Predict outputs for all points using current model weights and threshold
 */
export const predictDataset = (
  points: DataPoint2D[],
  weights: ModelWeights,
  threshold = 0.5,
  featureType: FeatureType = 'linear'
): PointPrediction[] => {
  return points.map((pt) => {
    const phi = mapFeatures(pt.x1, pt.x2, featureType);
    let z = weights.b;

    z += (weights.w1 ?? 0) * phi[0];
    z += (weights.w2 ?? 0) * phi[1];

    if (featureType === 'polynomial') {
      z += (weights.w11 ?? 0) * (phi[2] ?? 0);
      z += (weights.w22 ?? 0) * (phi[3] ?? 0);
      z += (weights.w12 ?? 0) * (phi[4] ?? 0);
    }

    const probability = sigmoid(z);
    const predictedLabel = probability >= threshold ? 1 : 0;
    const isCorrect = predictedLabel === pt.label;

    return {
      id: pt.id,
      x1: pt.x1,
      x2: pt.x2,
      label: pt.label,
      z,
      probability,
      predictedLabel,
      isCorrect,
    };
  });
};

/**
 * Compute Binary Cross-Entropy Loss & Metrics
 */
export const evaluateModel = (
  points: DataPoint2D[],
  weights: ModelWeights,
  config: ModelConfig
): {
  loss: number;
  confusionMatrix: ConfusionMatrixData;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
} => {
  if (points.length === 0) {
    return {
      loss: 0,
      confusionMatrix: { tp: 0, fp: 0, tn: 0, fn: 0 },
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      auc: 0.5,
    };
  }

  const predictions = predictDataset(points, weights, config.threshold, config.featureType);

  let totalBCE = 0;
  const eps = 1e-15;

  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;

  predictions.forEach((p) => {
    const prob = Math.max(eps, Math.min(1 - eps, p.probability));
    const y = p.label;

    // Binary Cross Entropy per point: -(y log(p) + (1-y) log(1-p))
    totalBCE += -(y * Math.log(prob) + (1 - y) * Math.log(1 - prob));

    if (p.predictedLabel === 1 && y === 1) tp++;
    else if (p.predictedLabel === 1 && y === 0) fp++;
    else if (p.predictedLabel === 0 && y === 0) tn++;
    else if (p.predictedLabel === 0 && y === 1) fn++;
  });

  let loss = totalBCE / points.length;

  // Regularization cost
  if (config.regularization === 'l2') {
    const regCost =
      0.5 *
      config.regLambda *
      (weights.w1 ** 2 +
        weights.w2 ** 2 +
        (weights.w11 ?? 0) ** 2 +
        (weights.w22 ?? 0) ** 2 +
        (weights.w12 ?? 0) ** 2);
    loss += regCost;
  } else if (config.regularization === 'l1') {
    const regCost =
      config.regLambda *
      (Math.abs(weights.w1) +
        Math.abs(weights.w2) +
        Math.abs(weights.w11 ?? 0) +
        Math.abs(weights.w22 ?? 0) +
        Math.abs(weights.w12 ?? 0));
    loss += regCost;
  }

  const total = points.length;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  const precision = tp + fp > 0 ? tp / (tp + fp) : 0;
  const recall = tp + fn > 0 ? tp / (tp + fn) : 0;
  const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

  // Compute ROC AUC
  const sorted = [...predictions].sort((a, b) => b.probability - a.probability);
  let auc = 0.5;
  const totalP = sorted.filter((p) => p.label === 1).length;
  const totalN = sorted.filter((p) => p.label === 0).length;

  if (totalP > 0 && totalN > 0) {
    let tpCount = 0;
    let fpCount = 0;
    let prevFp = 0;
    let prevTp = 0;

    sorted.forEach((p) => {
      if (p.label === 1) tpCount++;
      else fpCount++;

      const tpr = tpCount / totalP;
      const fpr = fpCount / totalN;

      auc += (fpr - prevFp) * (tpr + prevTp) * 0.5;
      prevFp = fpr;
      prevTp = tpr;
    });
  }

  return {
    loss,
    confusionMatrix: { tp, fp, tn, fn },
    accuracy,
    precision,
    recall,
    f1Score,
    auc: Math.max(0, Math.min(1, auc)),
  };
};

/**
 * Train Logistic Regression Model over `maxEpochs` and return full training history
 */
export const trainModelTrajectory = (
  points: DataPoint2D[],
  config: ModelConfig
): EpochMetrics[] => {
  const trajectory: EpochMetrics[] = [];
  const N = points.length;

  if (N === 0) return trajectory;

  // Initialize weights
  let weights: ModelWeights = {
    w1: (Math.random() - 0.5) * 1.5,
    w2: (Math.random() - 0.5) * 1.5,
    b: (Math.random() - 0.5) * 0.5,
    w11: config.featureType === 'polynomial' ? (Math.random() - 0.5) * 0.5 : 0,
    w22: config.featureType === 'polynomial' ? (Math.random() - 0.5) * 0.5 : 0,
    w12: config.featureType === 'polynomial' ? (Math.random() - 0.5) * 0.5 : 0,
  };

  const lr = config.learningRate;
  const maxEpochs = config.maxEpochs;

  for (let epoch = 0; epoch <= maxEpochs; epoch++) {
    // Evaluate current state
    const evalResult = evaluateModel(points, weights, config);

    // Compute gradients
    let dw1 = 0;
    let dw2 = 0;
    let db = 0;
    let dw11 = 0;
    let dw22 = 0;
    let dw12 = 0;

    points.forEach((pt) => {
      const phi = mapFeatures(pt.x1, pt.x2, config.featureType);
      let z = weights.b + weights.w1 * phi[0] + weights.w2 * phi[1];
      if (config.featureType === 'polynomial') {
        z += (weights.w11 ?? 0) * phi[2] + (weights.w22 ?? 0) * phi[3] + (weights.w12 ?? 0) * phi[4];
      }

      const p = sigmoid(z);
      const diff = p - pt.label;

      dw1 += diff * phi[0];
      dw2 += diff * phi[1];
      db += diff;

      if (config.featureType === 'polynomial') {
        dw11 += diff * phi[2];
        dw22 += diff * phi[3];
        dw12 += diff * phi[4];
      }
    });

    dw1 /= N;
    dw2 /= N;
    db /= N;
    dw11 /= N;
    dw22 /= N;
    dw12 /= N;

    // Apply Regularization Gradients
    if (config.regularization === 'l2') {
      dw1 += config.regLambda * weights.w1;
      dw2 += config.regLambda * weights.w2;
      dw11 += config.regLambda * (weights.w11 ?? 0);
      dw22 += config.regLambda * (weights.w22 ?? 0);
      dw12 += config.regLambda * (weights.w12 ?? 0);
    } else if (config.regularization === 'l1') {
      dw1 += config.regLambda * Math.sign(weights.w1);
      dw2 += config.regLambda * Math.sign(weights.w2);
      dw11 += config.regLambda * Math.sign(weights.w11 ?? 0);
      dw22 += config.regLambda * Math.sign(weights.w22 ?? 0);
      dw12 += config.regLambda * Math.sign(weights.w12 ?? 0);
    }

    const gradNorm = Math.sqrt(dw1 ** 2 + dw2 ** 2 + db ** 2);

    trajectory.push({
      epoch,
      loss: evalResult.loss,
      accuracy: evalResult.accuracy,
      precision: evalResult.precision,
      recall: evalResult.recall,
      f1Score: evalResult.f1Score,
      auc: evalResult.auc,
      weights: { ...weights },
      confusionMatrix: evalResult.confusionMatrix,
      gradientNorm: gradNorm,
    });

    // Update weights via Gradient Descent
    weights = {
      w1: weights.w1 - lr * dw1,
      w2: weights.w2 - lr * dw2,
      b: weights.b - lr * db,
      w11: config.featureType === 'polynomial' ? (weights.w11 ?? 0) - lr * dw11 : 0,
      w22: config.featureType === 'polynomial' ? (weights.w22 ?? 0) - lr * dw22 : 0,
      w12: config.featureType === 'polynomial' ? (weights.w12 ?? 0) - lr * dw12 : 0,
    };
  }

  return trajectory;
};
