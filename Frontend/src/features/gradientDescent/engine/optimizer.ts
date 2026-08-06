import { GradientDescentParams, OptimizationStep } from '../types';
import { LOSS_SURFACES } from './lossFunctions';

/**
 * Seeded pseudo-random Gaussian generator (Box-Muller transform)
 */
function gaussianRandom(mean = 0, std = 1, seed = 0): number {
  const u1 = Math.abs(Math.sin(seed * 9999 + 1));
  const u2 = Math.abs(Math.cos(seed * 7777 + 2));
  const z0 = Math.sqrt(-2.0 * Math.log(u1 || 0.00001)) * Math.cos(2.0 * Math.PI * u2);
  return mean + z0 * std;
}

export function computeOptimizationSteps(params: GradientDescentParams): OptimizationStep[] {
  const surfaceDef = LOSS_SURFACES[params.surfaceType] || LOSS_SURFACES.paraboloid;
  const steps: OptimizationStep[] = [];

  let currentW1 = params.w1Initial;
  let currentW2 = params.w2Initial;
  let vW1 = 0;
  let vW2 = 0;

  for (let i = 0; i <= params.epochs; i++) {
    const rawLoss = surfaceDef.compute(currentW1, currentW2);
    const { gradW1: rawGW1, gradW2: rawGW2 } = surfaceDef.computeGradient(currentW1, currentW2);

    // Apply L2 Regularization (lambda * w)
    let gW1 = rawGW1 + params.regularization * currentW1;
    let gW2 = rawGW2 + params.regularization * currentW2;

    // Apply Stochastic Noise
    if (params.noise > 0) {
      const noiseW1 = gaussianRandom(0, params.noise, params.randomSeed + i * 2);
      const noiseW2 = gaussianRandom(0, params.noise, params.randomSeed + i * 2 + 1);
      gW1 += noiseW1;
      gW2 += noiseW2;
    }

    const gradNorm = Math.sqrt(gW1 * gW1 + gW2 * gW2);

    // Velocity update with Momentum: v_{t+1} = beta * v_t + alpha * grad
    vW1 = params.momentum * vW1 + params.learningRate * gW1;
    vW2 = params.momentum * vW2 + params.learningRate * gW2;

    const stepSize = Math.sqrt(vW1 * vW1 + vW2 * vW2);

    // Narrative generation
    let what = `Iteration ${i}: Current loss is ${rawLoss.toFixed(4)} at w₁ = ${currentW1.toFixed(3)}, w₂ = ${currentW2.toFixed(3)}.`;
    let why = '';
    let next = '';

    if (i === 0) {
      why = `Model initialized at weight position (${currentW1.toFixed(2)}, ${currentW2.toFixed(2)}). Calculated initial gradient norm is ||∇J|| = ${gradNorm.toFixed(3)}.`;
      next = `Moving step along steepest descent direction -∇J scaled by learning rate α = ${params.learningRate}.`;
    } else {
      const prevStep = steps[i - 1];
      const lossDiff = rawLoss - prevStep.loss;

      if (Math.abs(lossDiff) < 0.0001 && gradNorm < 0.05) {
        why = `Gradient norm ||∇J|| is near zero (${gradNorm.toFixed(4)}). The algorithm has converged close to a local/global minimum!`;
        next = `Loss has stabilized. Optimization complete.`;
      } else if (lossDiff > 0.5) {
        why = `Loss increased by +${lossDiff.toFixed(2)}! High learning rate (α = ${params.learningRate}) is causing the model to overshoot the valley walls.`;
        next = `Risk of divergence! Reduce learning rate or add momentum to stabilize.`;
      } else if (params.momentum > 0 && Math.abs(vW1) > Math.abs(gW1 * params.learningRate)) {
        why = `Momentum (β = ${params.momentum}) is accelerating weight updates, propelling the optimizer past flat regions faster than standard GD.`;
        next = `Continuing down the gradient path with accumulated kinetic velocity.`;
      } else if (params.learningRate < 0.005) {
        why = `Small learning rate (α = ${params.learningRate}) results in tiny step sizes (${stepSize.toFixed(4)}). Convergence is very slow.`;
        next = `Taking another micro-step downhill.`;
      } else {
        why = `Calculated gradient ||∇J|| = ${gradNorm.toFixed(3)}. Step size Δw = ${stepSize.toFixed(4)}. Loss decreased by ${Math.abs(lossDiff).toFixed(4)}.`;
        next = `Proceeding down the loss surface toward the minimum.`;
      }
    }

    steps.push({
      stepIndex: i,
      w1: currentW1,
      w2: currentW2,
      loss: Math.min(rawLoss, surfaceDef.domain.maxLoss * 2),
      gradW1: gW1,
      gradW2: gW2,
      gradNorm,
      stepSize,
      velocityW1: vW1,
      velocityW2: vW2,
      explanation: { what, why, next },
    });

    // Update weights for next iteration
    currentW1 -= vW1;
    currentW2 -= vW2;

    // Safety guard against infinite divergence
    if (Math.abs(currentW1) > 20 || Math.abs(currentW2) > 20 || isNaN(currentW1) || isNaN(currentW2)) {
      break;
    }
  }

  return steps;
}
