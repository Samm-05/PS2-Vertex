import { DataPoint2D, LinearRegressionParams, RegressionStep } from '../types';

export function computeClosedFormOLS(points: DataPoint2D[]): { wOptimal: number; bOptimal: number } {
  if (points.length === 0) return { wOptimal: 0, bOptimal: 0 };

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const pt of points) {
    sumX += pt.x;
    sumY += pt.y;
    sumXY += pt.x * pt.y;
    sumXX += pt.x * pt.x;
  }

  const meanX = sumX / n;
  const meanY = sumY / n;

  const denominator = sumXX - n * meanX * meanX;
  if (Math.abs(denominator) < 0.00001) {
    return { wOptimal: 0, bOptimal: meanY };
  }

  const wOptimal = (sumXY - n * meanX * meanY) / denominator;
  const bOptimal = meanY - wOptimal * meanX;

  return { wOptimal, bOptimal };
}

export function computeRegressionSteps(
  points: DataPoint2D[],
  params: LinearRegressionParams
): RegressionStep[] {
  const steps: RegressionStep[] = [];
  if (points.length === 0) return steps;

  let currentW = params.wInitial;
  let currentB = params.bInitial;
  const n = points.length;

  for (let epoch = 0; epoch <= params.epochs; epoch++) {
    // 1. Calculate predictions ŷ = wx + b and residuals (y - ŷ)
    let sumSquaredError = 0;
    let gradW = 0;
    let gradB = 0;

    const currentPredictions = points.map((pt) => {
      const predicted = currentW * pt.x + currentB;
      const residual = pt.y - predicted;
      const diff = predicted - pt.y; // ŷ - y

      sumSquaredError += residual * residual;
      gradW += diff * pt.x;
      gradB += diff;

      return {
        id: pt.id,
        x: pt.x,
        y: pt.y,
        predicted,
        residual,
      };
    });

    // Average gradients over dataset
    gradW = gradW / n + params.regularization * currentW;
    gradB = gradB / n;

    // Mean Squared Error Loss
    const mseLoss = sumSquaredError / (2 * n);

    // Dynamic educational narrative
    let what = `Epoch ${epoch}: Loss MSE = ${mseLoss.toFixed(4)} with slope w = ${currentW.toFixed(3)}, intercept b = ${currentB.toFixed(3)}.`;
    let why = '';
    let next = '';

    if (epoch === 0) {
      why = `Model initialized with slope w = ${currentW.toFixed(2)} and bias b = ${currentB.toFixed(2)}. Initial gradients are ∂J/∂w = ${gradW.toFixed(3)}, ∂J/∂b = ${gradB.toFixed(3)}.`;
      next = `Applying weight updates Δw = -α (∂J/∂w) and Δb = -α (∂J/∂b) with learning rate α = ${params.learningRate}.`;
    } else {
      const prevStep = steps[epoch - 1];
      const lossDiff = mseLoss - prevStep.mseLoss;

      if (Math.abs(lossDiff) < 0.0001 && Math.abs(gradW) < 0.02 && Math.abs(gradB) < 0.02) {
        why = `Gradients ∂J/∂w and ∂J/∂b are close to zero. The regression line has settled on the optimal line of best fit!`;
        next = `Loss has stabilized. Training complete.`;
      } else if (lossDiff > 0.1) {
        why = `Loss increased by +${lossDiff.toFixed(3)}! Learning rate α = ${params.learningRate} is too large, causing the regression line to overshoot optimal parameters.`;
        next = `Risk of divergence! Reduce learning rate to stabilize convergence.`;
      } else if (params.learningRate < 0.005) {
        why = `Small learning rate (α = ${params.learningRate}) causes tiny micro-adjustments in slope and bias.`;
        next = `Taking another small downhill update step.`;
      } else {
        why = `Calculated gradients ∂J/∂w = ${gradW.toFixed(3)}, ∂J/∂b = ${gradB.toFixed(3)}. Slope w updated by ${(-params.learningRate * gradW).toFixed(3)}, bias b by ${(-params.learningRate * gradB).toFixed(3)}.`;
        next = `Proceeding to next epoch to further shrink residual error lines.`;
      }
    }

    steps.push({
      epoch,
      w: currentW,
      b: currentB,
      mseLoss,
      gradW,
      gradB,
      predictions: currentPredictions,
      explanation: { what, why, next },
    });

    // Update weight & bias for next iteration: w = w - alpha * gradW, b = b - alpha * gradB
    currentW -= params.learningRate * gradW;
    currentB -= params.learningRate * gradB;

    // Safety guard against numerical exploding divergence
    if (Math.abs(currentW) > 50 || Math.abs(currentB) > 50 || isNaN(currentW) || isNaN(currentB)) {
      break;
    }
  }

  return steps;
}
