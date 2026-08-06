import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import { Info, HelpCircle, ArrowRightCircle } from 'lucide-react';

export const ExplanationPanel: React.FC = () => {
  const { trajectory, currentEpoch, config } = useAppSelector((state) => state.neuralNetwork);
  const snapshot = trajectory[currentEpoch] || {
    epoch: 0,
    loss: 0,
    accuracy: 0,
    gradientNorm: 0,
    vanishingExplodingStatus: 'normal',
  };

  let what = `Epoch ${currentEpoch}: Loss = ${snapshot.loss.toFixed(4)}, Accuracy = ${(snapshot.accuracy * 100).toFixed(1)}%.`;
  let why = `Signals forwarded through network layers using ${config.activation.toUpperCase()} activation function.`;
  let next = `Backpropagation computed gradients using ${config.optimizer.toUpperCase()} with learning rate α = ${config.learningRate}.`;

  if (currentEpoch === 0) {
    what = `Epoch 0: Network initialized with random weights. Initial Loss = ${snapshot.loss.toFixed(4)}.`;
    why = `Weights initialized using Xavier/He uniform distribution. Initial predictions are random.`;
    next = `Press Train to start gradient descent optimization.`;
  } else if (snapshot.vanishingExplodingStatus === 'vanishing') {
    why = `⚠️ Gradient norm fell below 0.0001! Deep layer chain rule derivatives collapsed. Early layers stopped updating.`;
    next = `Switch to ReLU activation or reduce network depth to revive gradient flow.`;
  } else if (snapshot.vanishingExplodingStatus === 'exploding') {
    why = `🚨 Gradient norm exceeded 15.0! Weight updates are exploding.`;
    next = `Reduce learning rate α or enable L2 Regularization.`;
  } else if (snapshot.accuracy >= 0.98) {
    why = `🎯 Outstanding classification! Decision boundary cleanly separates dataset points with high confidence.`;
    next = `Model has converged to minimal loss state.`;
  }

  return (
    <Card className="p-4 space-y-3 bg-midnight/90 border border-apres/30">
      <div className="flex items-center gap-1.5 border-b border-apres/30 pb-2 text-xs font-bold text-arctic uppercase font-mono">
        <Info className="w-4 h-4 text-cyan-400" />
        Realtime AI Explanation & Physical Intuition
      </div>

      <div className="space-y-3 font-mono text-xs">
        <div className="bg-mountainside/30 p-2.5 rounded-xl border border-cyan-500/30 space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> 1. What Happened
          </span>
          <p className="text-arctic leading-relaxed">{what}</p>
        </div>

        <div className="bg-mountainside/30 p-2.5 rounded-xl border border-amber-500/30 space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5" /> 2. Why Weights Updated
          </span>
          <p className="text-arctic leading-relaxed">{why}</p>
        </div>

        <div className="bg-mountainside/30 p-2.5 rounded-xl border border-emerald-500/30 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase flex items-center gap-1">
            <ArrowRightCircle className="w-3.5 h-3.5" /> 3. Next Optimization Step
          </span>
          <p className="text-arctic leading-relaxed">{next}</p>
        </div>
      </div>
    </Card>
  );
};

export default ExplanationPanel;
