import { decisionTreeDefinition } from './decisionTree';
import { kmeansDefinition } from './kmeans';
import { linearRegressionDefinition } from './linearRegression';
import { logisticRegressionDefinition } from './logisticRegression';
import { pcaDefinition } from './pca';
import { AlgorithmDefinition, AlgorithmId } from './types';

export const algorithmRegistry: Record<AlgorithmId, AlgorithmDefinition<Record<string, number | string>>> = {
  'linear-regression': linearRegressionDefinition,
  kmeans: kmeansDefinition,
  'decision-tree': decisionTreeDefinition,
  'logistic-regression': logisticRegressionDefinition,
  pca: pcaDefinition,
};

export const algorithmOrder: AlgorithmId[] = [
  'linear-regression',
  'kmeans',
  'decision-tree',
  'logistic-regression',
  'pca',
];

export const resolveAlgorithmId = (input?: string): AlgorithmId => {
  if (!input) {
    return 'linear-regression';
  }
  if (input in algorithmRegistry) {
    return input as AlgorithmId;
  }
  if (input === 'linear' || input === 'linear-regression') {
    return 'linear-regression';
  }
  if (input === 'k-means' || input === 'kmeans') {
    return 'kmeans';
  }
  if (input === 'decisiontree' || input === 'decision-tree') {
    return 'decision-tree';
  }
  if (input === 'logistic' || input === 'logistic-regression') {
    return 'logistic-regression';
  }
  return 'linear-regression';
};
