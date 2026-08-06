import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setComparisonLearningRate } from '../neuralNetworkSlice';
import Card from '../../../components/ui/Card';
import Center3DScene from './Center3DScene';
import { Eye, Zap, AlertTriangle } from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trajectory, currentEpoch, config, comparisonLearningRate } = useAppSelector(
    (state) => state.neuralNetwork
  );

  const snapshotA = trajectory[currentEpoch] || { loss: 0, accuracy: 0 };

  return (
    <div className="space-y-4">
      <Card className="p-3 bg-midnight/90 border border-apres/30 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-arctic uppercase tracking-wider font-mono">
          <Eye className="w-4 h-4 text-amber-400" />
          Model Comparison Mode: Side-by-Side Hyperparameter Training
        </div>
        <span className="text-[11px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/30">
          Epoch {currentEpoch}
        </span>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Model A */}
        <div className="space-y-2">
          <div className="bg-midnight/90 border border-emerald-500/40 p-3 rounded-2xl flex items-center justify-between font-mono text-xs shadow-soft">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Model A: {config.optimizer.toUpperCase()} (α = {config.learningRate})
            </div>
            <div className="text-arctic font-bold">
              Loss: <span className="text-amber-400">{snapshotA.loss.toFixed(4)}</span> | Acc:{' '}
              <span className="text-emerald-400">{(snapshotA.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>
          <div className="h-[460px]">
            <Center3DScene />
          </div>
        </div>

        {/* Model B */}
        <div className="space-y-2">
          <div className="bg-midnight/90 border border-amber-500/40 p-3 rounded-2xl flex items-center justify-between font-mono text-xs shadow-soft">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Model B: High LR (α = {comparisonLearningRate})
            </div>
            <div className="flex items-center gap-2">
              <span className="text-apres text-[10px]">Set LR:</span>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={comparisonLearningRate}
                onChange={(e) => dispatch(setComparisonLearningRate(parseFloat(e.target.value)))}
                className="w-20 h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
          <div className="h-[460px]">
            <Center3DScene />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonView;
