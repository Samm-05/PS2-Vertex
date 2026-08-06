import { AlgorithmDefinition, DataPoint3D, DatasetConfig, SimulationStep, TreeEdgeVisual, TreeNodeVisual } from './types';

interface DecisionTreeParams {
  maxDepth: number;
  minSamples: number;
  criterion: 'gini' | 'entropy';
}

interface SplitNode {
  id: string;
  depth: number;
  feature: 'x' | 'y';
  threshold: number;
  left?: SplitNode;
  right?: SplitNode;
  leafClass?: number;
  gain: number;
}

const impurity = (labels: number[], criterion: DecisionTreeParams['criterion']) => {
  if (labels.length === 0) {
    return 0;
  }
  const p = labels.filter((label) => label === 1).length / labels.length;
  if (criterion === 'gini') {
    return 1 - (p * p + (1 - p) * (1 - p));
  }
  const safe = (value: number) => (value > 0 ? value * Math.log2(value) : 0);
  return -(safe(p) + safe(1 - p));
};

const buildClassificationDataset = (size: number, noise: number): DataPoint3D[] => {
  return Array.from({ length: size }, (_, id) => {
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 10;
    const circle = x * x + y * y + (Math.random() - 0.5) * noise * 10;
    return {
      id,
      x,
      y,
      z: 0,
      label: circle > 12 ? 1 : 0,
      predicted: 0,
    };
  });
};

const majorityClass = (labels: number[]) => {
  const ones = labels.filter((value) => value === 1).length;
  return ones >= labels.length - ones ? 1 : 0;
};

const findBestSplit = (points: DataPoint3D[], criterion: DecisionTreeParams['criterion']) => {
  let bestGain = 0;
  let best: { feature: 'x' | 'y'; threshold: number; gain: number } | null = null;
  const labels = points.map((point) => point.label ?? 0);
  const parentImpurity = impurity(labels, criterion);

  (['x', 'y'] as const).forEach((feature) => {
    const sorted = [...points].sort((a, b) => a[feature] - b[feature]);
    for (let i = 1; i < sorted.length; i += 1) {
      const threshold = (sorted[i - 1][feature] + sorted[i][feature]) / 2;
      const left = sorted.filter((point) => point[feature] <= threshold);
      const right = sorted.filter((point) => point[feature] > threshold);
      if (left.length === 0 || right.length === 0) {
        continue;
      }
      const leftImp = impurity(left.map((point) => point.label ?? 0), criterion);
      const rightImp = impurity(right.map((point) => point.label ?? 0), criterion);
      const weighted = (left.length / sorted.length) * leftImp + (right.length / sorted.length) * rightImp;
      const gain = parentImpurity - weighted;
      if (gain > bestGain) {
        bestGain = gain;
        best = { feature, threshold, gain };
      }
    }
  });

  return best;
};

const predictNode = (node: SplitNode, point: DataPoint3D): number => {
  if (typeof node.leafClass === 'number') {
    return node.leafClass;
  }
  if (point[node.feature] <= node.threshold) {
    return predictNode(node.left as SplitNode, point);
  }
  return predictNode(node.right as SplitNode, point);
};

export const decisionTreeDefinition: AlgorithmDefinition<DecisionTreeParams> = {
  id: 'decision-tree',
  name: 'Decision Tree',
  description: 'Build a tree by selecting best splits and visualizing branch growth.',
  sceneType: 'decision-tree',
  defaultParams: {
    maxDepth: 4,
    minSamples: 12,
    criterion: 'gini',
  },
  parameterDefinitions: [
    { key: 'maxDepth', label: 'Max Depth', type: 'slider', min: 1, max: 7, step: 1 },
    { key: 'minSamples', label: 'Min Samples', type: 'slider', min: 4, max: 30, step: 1 },
    {
      key: 'criterion',
      label: 'Split Criterion',
      type: 'select',
      options: [
        { label: 'Gini', value: 'gini' },
        { label: 'Entropy', value: 'entropy' },
      ],
    },
  ],
  defaultDataset: { preset: 'classification', size: 280, noise: 0.35 },
  graphKeys: { primary: 'accuracy', secondary: 'gain' },
  graphLabels: { primary: 'Accuracy vs Depth', secondary: 'Information Gain' },
  generateDataset: (config: DatasetConfig) => buildClassificationDataset(config.size, config.noise),
  buildSteps: (dataset: DataPoint3D[], params: DecisionTreeParams) => {
    const steps: SimulationStep[] = [];
    const points = dataset.map((point) => ({ ...point }));
    let nodeCounter = 0;
    const nodes: TreeNodeVisual[] = [];
    const edges: TreeEdgeVisual[] = [];

    const build = (subset: DataPoint3D[], depth: number, x: number, parentId?: string): SplitNode => {
      const nodeId = `node-${nodeCounter++}`;
      const labels = subset.map((point) => point.label ?? 0);
      const leaf = depth >= params.maxDepth || subset.length < params.minSamples || new Set(labels).size <= 1;

      const visualNode: TreeNodeVisual = {
        id: nodeId,
        depth,
        x,
        y: -depth * 1.6,
        label: leaf ? `Leaf: ${majorityClass(labels)}` : 'Split',
        leaf,
        highlighted: true,
      };
      nodes.push(visualNode);
      if (parentId) {
        edges.push({ from: parentId, to: nodeId });
      }

      const predictions = points.map((point) => (leaf ? majorityClass(labels) : point.predicted ?? 0));
      const accuracy =
        predictions.filter((pred, index) => pred === (points[index].label ?? 0)).length / Math.max(points.length, 1);

      steps.push({
        stepIndex: steps.length,
        phase: leaf ? 'leaf' : 'split',
        title: leaf ? `Create Leaf Node (Depth ${depth})` : `Find Best Split (Depth ${depth})`,
        explanation: leaf
          ? 'A terminal node is created because depth/sample purity stopping criteria is reached.'
          : 'The algorithm evaluates split thresholds and chooses the maximum information gain.',
        points: points.map((point) => ({ ...point })),
        treeNodes: nodes.map((node) => ({ ...node, highlighted: node.id === nodeId })),
        treeEdges: edges.map((edge) => ({ ...edge })),
        metrics: { accuracy, gain: 0 },
      });

      if (leaf) {
        return { id: nodeId, depth, feature: 'x', threshold: 0, leafClass: majorityClass(labels), gain: 0 };
      }

      const best = findBestSplit(subset, params.criterion);
      if (!best) {
        const leafClass = majorityClass(labels);
        nodes[nodes.length - 1] = { ...visualNode, label: `Leaf: ${leafClass}`, leaf: true, highlighted: true };
        return { id: nodeId, depth, feature: 'x', threshold: 0, leafClass, gain: 0 };
      }

      nodes[nodes.length - 1] = {
        ...visualNode,
        leaf: false,
        label: `${best.feature} <= ${best.threshold.toFixed(2)}`,
        highlighted: true,
      };

      const left = subset.filter((point) => point[best.feature] <= best.threshold);
      const right = subset.filter((point) => point[best.feature] > best.threshold);

      steps.push({
        stepIndex: steps.length,
        phase: 'branch',
        title: `Grow Branches (Depth ${depth})`,
        explanation: 'The dataset is split into left and right branches and recursion continues.',
        points: points.map((point) => ({ ...point })),
        treeNodes: nodes.map((node) => ({ ...node, highlighted: node.id === nodeId })),
        treeEdges: edges.map((edge) => ({ ...edge })),
        metrics: {
          accuracy,
          gain: best.gain,
        },
      });

      const leftNode = build(left, depth + 1, x - 4 / (depth + 1), nodeId);
      const rightNode = build(right, depth + 1, x + 4 / (depth + 1), nodeId);
      return {
        id: nodeId,
        depth,
        feature: best.feature,
        threshold: best.threshold,
        left: leftNode,
        right: rightNode,
        gain: best.gain,
      };
    };

    const tree = build(points, 0, 0);
    points.forEach((point) => {
      point.predicted = predictNode(tree, point);
    });

    const finalAccuracy =
      points.filter((point) => point.predicted === point.label).length / Math.max(points.length, 1);

    steps.push({
      stepIndex: steps.length,
      phase: 'complete',
      title: 'Tree Built',
      explanation: 'All branches are expanded and predictions now follow root-to-leaf decision paths.',
      points: points.map((point) => ({ ...point })),
      treeNodes: nodes.map((node) => ({ ...node, highlighted: false })),
      treeEdges: edges.map((edge) => ({ ...edge })),
      metrics: { accuracy: finalAccuracy, gain: 0 },
    });

    return steps;
  },
};
