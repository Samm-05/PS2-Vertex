import {
  ActivationType,
  DataPoint2D,
  DatasetType,
  EpochSnapshot,
  LossType,
  NetworkState,
  NNConfig,
  OptimizerType,
} from '../types';

// Activation functions & derivatives
export function activate(x: number, type: ActivationType): number {
  switch (type) {
    case 'sigmoid':
      return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, x))));
    case 'relu':
      return Math.max(0, x);
    case 'tanh':
      return Math.tanh(x);
    case 'leaky_relu':
      return x > 0 ? x : 0.01 * x;
    case 'softmax':
      return 1 / (1 + Math.exp(-Math.max(-30, Math.min(30, x))));
    default:
      return 1 / (1 + Math.exp(-x));
  }
}

export function activateDerivative(a: number, type: ActivationType): number {
  switch (type) {
    case 'sigmoid':
    case 'softmax':
      return a * (1 - a);
    case 'relu':
      return a > 0 ? 1 : 0;
    case 'tanh':
      return 1 - a * a;
    case 'leaky_relu':
      return a > 0 ? 1 : 0.01;
    default:
      return a * (1 - a);
  }
}

// Synthetic Dataset Generators
export function generateDataset(type: DatasetType, size: number, noise: number): DataPoint2D[] {
  const points: DataPoint2D[] = [];
  const n = Math.max(20, size);

  for (let i = 0; i < n; i++) {
    let x1 = 0;
    let x2 = 0;
    let label: 0 | 1 = 0;

    if (type === 'xor') {
      x1 = (Math.random() - 0.5) * 6;
      x2 = (Math.random() - 0.5) * 6;
      label = (x1 > 0 && x2 > 0) || (x1 < 0 && x2 < 0) ? 1 : 0;
    } else if (type === 'circle') {
      const r = Math.random() * 3.5;
      const theta = Math.random() * 2 * Math.PI;
      x1 = r * Math.cos(theta);
      x2 = r * Math.sin(theta);
      label = r < 1.8 ? 1 : 0;
    } else if (type === 'spiral') {
      const isClass1 = i % 2 === 1;
      const r = (i / n) * 3.8 + 0.2;
      const t = 1.75 * (i / n) * 2 * Math.PI + (isClass1 ? Math.PI : 0);
      x1 = r * Math.cos(t);
      x2 = r * Math.sin(t);
      label = isClass1 ? 1 : 0;
    } else if (type === 'moons') {
      const isClass1 = i % 2 === 1;
      const theta = Math.random() * Math.PI;
      if (isClass1) {
        x1 = Math.cos(theta) * 2.2 + 0.8;
        x2 = Math.sin(theta) * 2.2 - 0.6;
        label = 1;
      } else {
        x1 = Math.cos(theta) * 2.2 - 0.8;
        x2 = -Math.sin(theta) * 2.2 + 0.6;
        label = 0;
      }
    } else {
      // Gaussian clusters
      const isClass1 = i % 2 === 1;
      const cx = isClass1 ? 1.5 : -1.5;
      const cy = isClass1 ? 1.5 : -1.5;
      x1 = cx + (Math.random() - 0.5) * 2.2;
      x2 = cy + (Math.random() - 0.5) * 2.2;
      label = isClass1 ? 1 : 0;
    }

    // Add noise
    x1 += (Math.random() - 0.5) * noise;
    x2 += (Math.random() - 0.5) * noise;

    points.push({
      id: `pt_${i}_${Date.now()}`,
      x1: Math.max(-4, Math.min(4, x1)),
      x2: Math.max(-4, Math.min(4, x2)),
      label,
    });
  }

  return points;
}

// Deep Neural Network Implementation
export class NeuralNetworkEngine {
  layerSizes: number[];
  weights: number[][][]; // weights[layerIndex][neuronIndex][prevNeuronIndex]
  biases: number[][]; // biases[layerIndex][neuronIndex]

  // Optimizer momentums & squared gradients
  mW: number[][][];
  vW: number[][][];
  mB: number[][];
  vB: number[][];

  constructor(layerSizes: number[]) {
    this.layerSizes = layerSizes;
    this.weights = [];
    this.biases = [];
    this.mW = [];
    this.vW = [];
    this.mB = [];
    this.vB = [];

    this.initNetwork();
  }

  initNetwork() {
    this.weights = [];
    this.biases = [];
    this.mW = [];
    this.vW = [];
    this.mB = [];
    this.vB = [];

    for (let l = 1; l < this.layerSizes.length; l++) {
      const prevSize = this.layerSizes[l - 1];
      const currSize = this.layerSizes[l];

      const layerW: number[][] = [];
      const layermW: number[][] = [];
      const layervW: number[][] = [];
      const layerB: number[] = [];
      const layermB: number[] = [];
      const layervB: number[] = [];

      // Xavier / He initialization
      const scale = Math.sqrt(2.0 / prevSize);

      for (let i = 0; i < currSize; i++) {
        const nW: number[] = [];
        const nmW: number[] = [];
        const nvW: number[] = [];
        for (let j = 0; j < prevSize; j++) {
          nW.push((Math.random() * 2 - 1) * scale);
          nmW.push(0);
          nvW.push(0);
        }
        layerW.push(nW);
        layermW.push(nmW);
        layervW.push(nvW);

        layerB.push(0);
        layermB.push(0);
        layervB.push(0);
      }

      this.weights.push(layerW);
      this.biases.push(layerB);
      this.mW.push(layermW);
      this.vW.push(layervW);
      this.mB.push(layermB);
      this.vB.push(layervB);
    }
  }

  forward(input: number[], activation: ActivationType): { z: number[][]; a: number[][] } {
    const aList: number[][] = [input];
    const zList: number[][] = [[]];

    for (let l = 0; l < this.weights.length; l++) {
      const prevA = aList[l];
      const currW = this.weights[l];
      const currB = this.biases[l];

      const zNext: number[] = [];
      const aNext: number[] = [];

      const isOutput = l === this.weights.length - 1;
      const actType = isOutput ? 'sigmoid' : activation;

      for (let i = 0; i < currW.length; i++) {
        let sum = currB[i];
        for (let j = 0; j < prevA.length; j++) {
          sum += currW[i][j] * prevA[j];
        }
        zNext.push(sum);
        aNext.push(activate(sum, actType));
      }

      zList.push(zNext);
      aList.push(aNext);
    }

    return { z: zList, a: aList };
  }

  trainEpoch(
    dataset: DataPoint2D[],
    config: NNConfig
  ): {
    loss: number;
    accuracy: number;
    gradientNorm: number;
    networkState: NetworkState;
  } {
    let totalLoss = 0;
    let correctCount = 0;

    // Accumulate gradients
    const gradWAcc = this.weights.map((l) => l.map((n) => n.map(() => 0)));
    const gradBAcc = this.biases.map((l) => l.map(() => 0));

    const numLayers = this.weights.length;

    for (const pt of dataset) {
      const { z, a } = this.forward([pt.x1, pt.x2], config.activation);
      const outputProb = a[numLayers][0];

      // Loss calculation (Binary Cross Entropy)
      const target = pt.label;
      const pClamped = Math.max(1e-7, Math.min(1 - 1e-7, outputProb));
      const bce = -(target * Math.log(pClamped) + (1 - target) * Math.log(1 - pClamped));
      totalLoss += bce;

      const predLabel = outputProb >= 0.5 ? 1 : 0;
      if (predLabel === target) correctCount++;

      // Backpropagation Error at Output
      const deltas: number[][] = new Array(numLayers + 1);

      // Output layer delta: dL/dz = a_out - y (for BCE with Sigmoid)
      deltas[numLayers] = [outputProb - target];

      // Backward pass through hidden layers
      for (let l = numLayers - 1; l >= 1; l--) {
        const nextDelta = deltas[l + 1];
        const nextW = this.weights[l]; // W between l and l+1
        const currA = a[l];
        const currDelta: number[] = [];

        for (let j = 0; j < currA.length; j++) {
          let sumDeltaW = 0;
          for (let i = 0; i < nextDelta.length; i++) {
            sumDeltaW += nextDelta[i] * nextW[i][j];
          }
          const da = activateDerivative(currA[j], config.activation);
          currDelta.push(sumDeltaW * da);
        }
        deltas[l] = currDelta;
      }

      // Accumulate gradients
      for (let l = 0; l < numLayers; l++) {
        const deltaCurr = deltas[l + 1];
        const aPrev = a[l];

        for (let i = 0; i < deltaCurr.length; i++) {
          gradBAcc[l][i] += deltaCurr[i];
          for (let j = 0; j < aPrev.length; j++) {
            gradWAcc[l][i][j] += deltaCurr[i] * aPrev[j];
          }
        }
      }
    }

    const n = Math.max(1, dataset.length);
    let totalGradSq = 0;

    // Apply Optimizer Updates & Regularization
    for (let l = 0; l < numLayers; l++) {
      for (let i = 0; i < this.weights[l].length; i++) {
        // Bias update
        const gb = gradBAcc[l][i] / n;
        this.biases[l][i] -= config.learningRate * gb;
        totalGradSq += gb * gb;

        // Weight updates
        for (let j = 0; j < this.weights[l][i].length; j++) {
          let gw = gradWAcc[l][i][j] / n;

          // L1 & L2 Regularization
          if (config.l2Lambda > 0) {
            gw += config.l2Lambda * this.weights[l][i][j];
          }
          if (config.l1Lambda > 0) {
            gw += config.l1Lambda * Math.sign(this.weights[l][i][j]);
          }

          totalGradSq += gw * gw;

          // Optimizer mechanics
          if (config.optimizer === 'adam') {
            const beta1 = 0.9;
            const beta2 = 0.999;
            this.mW[l][i][j] = beta1 * this.mW[l][i][j] + (1 - beta1) * gw;
            this.vW[l][i][j] = beta2 * this.vW[l][i][j] + (1 - beta2) * gw * gw;
            const mHat = this.mW[l][i][j] / (1 - beta1);
            const vHat = this.vW[l][i][j] / (1 - beta2);
            this.weights[l][i][j] -= (config.learningRate * mHat) / (Math.sqrt(vHat) + 1e-8);
          } else if (config.optimizer === 'momentum') {
            const beta = 0.9;
            this.mW[l][i][j] = beta * this.mW[l][i][j] + config.learningRate * gw;
            this.weights[l][i][j] -= this.mW[l][i][j];
          } else if (config.optimizer === 'rmsprop') {
            const beta = 0.9;
            this.vW[l][i][j] = beta * this.vW[l][i][j] + (1 - beta) * gw * gw;
            this.weights[l][i][j] -= (config.learningRate * gw) / (Math.sqrt(this.vW[l][i][j]) + 1e-8);
          } else {
            // Standard SGD
            this.weights[l][i][j] -= config.learningRate * gw;
          }
        }
      }
    }

    const avgLoss = totalLoss / n;
    const accuracy = correctCount / n;
    const gradientNorm = Math.sqrt(totalGradSq);

    // Build Current Network State snapshot for 3D visualization & inspector
    const networkState: NetworkState = {
      layers: this.layerSizes.map((size, lIdx) => {
        const isInput = lIdx === 0;
        return {
          layerIndex: lIdx,
          neurons: Array.from({ length: size }, (_, nIdx) => {
            if (isInput) {
              return {
                layerIndex: 0,
                neuronIndex: nIdx,
                z: 0,
                a: 0,
                bias: 0,
                gradB: 0,
                weights: [],
                gradW: [],
              };
            }
            const wArr = this.weights[lIdx - 1][nIdx];
            const gArr = gradWAcc[lIdx - 1][nIdx].map((g) => g / n);
            return {
              layerIndex: lIdx,
              neuronIndex: nIdx,
              z: 0,
              a: 0,
              bias: this.biases[lIdx - 1][nIdx],
              gradB: gradBAcc[lIdx - 1][nIdx] / n,
              weights: [...wArr],
              gradW: gArr,
            };
          }),
        };
      }),
    };

    return { loss: avgLoss, accuracy, gradientNorm, networkState };
  }

  // Generate 2D Grid Decision Boundary Probability Heatmap
  evaluateGrid(gridSize = 25, activation: ActivationType): number[][] {
    const grid: number[][] = [];
    const minVal = -4;
    const maxVal = 4;
    const step = (maxVal - minVal) / (gridSize - 1);

    for (let r = 0; r < gridSize; r++) {
      const row: number[] = [];
      const x2 = maxVal - r * step; // Y axis
      for (let c = 0; c < gridSize; c++) {
        const x1 = minVal + c * step; // X axis
        const { a } = this.forward([x1, x2], activation);
        const prob = a[a.length - 1][0];
        row.push(prob);
      }
      grid.push(row);
    }
    return grid;
  }
}
