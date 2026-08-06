import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setParams, setComparisonLearningRate } from '../linearRegressionSlice';
import { Center3DScene } from './Center3DScene';
import { Zap, AlertTriangle } from 'lucide-react';

export const ComparisonView: React.FC = () => {
  const dispatch = useAppDispatch();
  const lrState = useAppSelector((state) => state.linearRegression);

  const params = lrState?.params;
  const steps = lrState?.steps ?? [];
  const comparisonSteps = lrState?.comparisonSteps ?? [];
  const currentStepIndex = lrState?.currentStepIndex ?? 0;
  const comparisonLearningRate = lrState?.comparisonLearningRate ?? 0.8;

  const currentStepA = steps[currentStepIndex] || steps[0] || { mseLoss: 0, w: 0, b: 0 };
  const currentStepB = comparisonSteps[currentStepIndex] || comparisonSteps[0] || { mseLoss: 0, w: 0, b: 0 };

  if (!params) return null;

  return (
    <div className="space-y-4">
      <div className="bg-midnight border border-mountainside p-3 rounded-2xl flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-2 text-xs font-bold text-arctic uppercase tracking-wider">
          <Zap className="w-4 h-4 text-amber-400" />
          Dual Comparison Mode: Side-by-Side Hyperparameter Training
        </div>
        <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          Epoch {currentStepIndex} / {params.epochs}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Model A (Optimal LR) */}
        <div className="space-y-2">
          <div className="bg-midnight/90 border border-emerald-500/40 p-3 rounded-2xl flex items-center justify-between font-mono text-xs shadow-soft">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Model A: Optimal LR (α = {params.learningRate})
            </div>
            <div className="text-arctic font-bold">
              MSE: <span className="text-amber-400">{currentStepA.mseLoss.toFixed(4)}</span> | w: {currentStepA.w.toFixed(2)} | b: {currentStepA.b.toFixed(2)}
            </div>
          </div>
          <Center3DScene isComparisonView />
        </div>

        {/* Right Model B (High / Bad LR) */}
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
                max="1.5"
                step="0.05"
                value={comparisonLearningRate}
                onChange={(e) => dispatch(setComparisonLearningRate(parseFloat(e.target.value)))}
                className="w-20 h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="text-arctic font-bold">
                MSE: <span className="text-amber-400">{currentStepB.mseLoss.toFixed(4)}</span>
              </div>
            </div>
          </div>
          <Center3DScene isComparisonView />
        </div>
      </div>
    </div>
  );
};
