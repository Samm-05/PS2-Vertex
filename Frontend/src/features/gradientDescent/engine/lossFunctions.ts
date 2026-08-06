import { LossSurfaceDefinition, LossSurfaceType } from '../types';

export const LOSS_SURFACES: Record<LossSurfaceType, LossSurfaceDefinition> = {
  paraboloid: {
    id: 'paraboloid',
    name: 'Convex Paraboloid',
    formulaTex: 'J(w_1, w_2) = \\frac{1}{2} w_1^2 + \\frac{3}{2} w_2^2',
    description: 'A smooth, single-minimum convex bowl with asymmetric curvature (steeper in w₂). Ideal for demonstrating fundamental gradient descent mechanics.',
    compute: (w1: number, w2: number) => 0.5 * w1 * w1 + 1.5 * w2 * w2,
    computeGradient: (w1: number, w2: number) => ({
      gradW1: w1,
      gradW2: 3 * w2,
    }),
    globalMinimum: { w1: 0, w2: 0, loss: 0 },
    domain: { minW1: -4, maxW1: 4, minW2: -4, maxW2: 4, maxLoss: 25 },
    recommendedInit: { w1: 3.5, w2: 3.5 },
  },

  saddle: {
    id: 'saddle',
    name: 'Saddle Point Landscape',
    formulaTex: 'J(w_1, w_2) = w_1^2 - w_2^2 + 0.1 w_1^4 + 0.1 w_2^4',
    description: 'A non-convex landscape with a zero-gradient saddle point plateau. Demonstrates why standard gradient descent stalls and momentum is necessary.',
    compute: (w1: number, w2: number) => w1 * w1 - w2 * w2 + 0.1 * Math.pow(w1, 4) + 0.1 * Math.pow(w2, 4),
    computeGradient: (w1: number, w2: number) => ({
      gradW1: 2 * w1 + 0.4 * Math.pow(w1, 3),
      gradW2: -2 * w2 + 0.4 * Math.pow(w2, 3),
    }),
    globalMinimum: { w1: 0, w2: 2.236, loss: -2.5 },
    domain: { minW1: -3.5, maxW1: 3.5, minW2: -3.5, maxW2: 3.5, maxLoss: 20 },
    recommendedInit: { w1: 0.1, w2: 2.8 },
  },

  rosenbrock: {
    id: 'rosenbrock',
    name: 'Rosenbrock Valley (Banana Function)',
    formulaTex: 'J(w_1, w_2) = (1 - w_1)^2 + 10(w_2 - w_1^2)^2',
    description: 'A classic benchmark optimization problem. The global minimum lies in a narrow, parabolic flat valley. Finding the valley is easy; converging to (1,1) is tricky.',
    compute: (w1: number, w2: number) => Math.pow(1 - w1, 2) + 10 * Math.pow(w2 - w1 * w1, 2),
    computeGradient: (w1: number, w2: number) => ({
      gradW1: -2 * (1 - w1) - 40 * w1 * (w2 - w1 * w1),
      gradW2: 20 * (w2 - w1 * w1),
    }),
    globalMinimum: { w1: 1, w2: 1, loss: 0 },
    domain: { minW1: -2, maxW1: 2.2, minW2: -1, maxW2: 3, maxLoss: 30 },
    recommendedInit: { w1: -1.5, w2: 2.0 },
  },

  himmelblau: {
    id: 'himmelblau',
    name: 'Himmelblau Multi-Modal Surface',
    formulaTex: 'J(w_1, w_2) = \\frac{1}{50}\\left[(w_1^2 + w_2 - 11)^2 + (w_1 + w_2^2 - 7)^2\\right]',
    description: 'A multi-modal landscape featuring 4 identical global minima. Shows how random initial weights determine which local basin the optimizer settles in.',
    compute: (w1: number, w2: number) => {
      const term1 = Math.pow(w1 * w1 + w2 - 11, 2);
      const term2 = Math.pow(w1 + w2 * w2 - 7, 2);
      return (term1 + term2) / 50;
    },
    computeGradient: (w1: number, w2: number) => {
      const term1 = w1 * w1 + w2 - 11;
      const term2 = w1 + w2 * w2 - 7;
      const g1 = (4 * w1 * term1 + 2 * term2) / 50;
      const g2 = (2 * term1 + 4 * w2 * term2) / 50;
      return { gradW1: g1, gradW2: g2 };
    },
    globalMinimum: { w1: 3, w2: 2, loss: 0 },
    domain: { minW1: -4.5, maxW1: 4.5, minW2: -4.5, maxW2: 4.5, maxLoss: 25 },
    recommendedInit: { w1: 0, w2: 0 },
  },
};
