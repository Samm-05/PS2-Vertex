import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { TrendingDown, Activity, Compass, Zap } from 'lucide-react';

export const LiveGraphsPanel: React.FC = () => {
  const gdState = useAppSelector((state) => state.gradientDescent);
  const steps = gdState?.steps ?? [];
  const currentStepIndex = gdState?.currentStepIndex ?? 0;

  if (!steps || steps.length === 0) return null;

  const currentSteps = steps.slice(0, currentStepIndex + 1);

  // SVG dimensions
  const width = 280;
  const height = 110;
  const padding = 15;

  const maxLoss = Math.max(...steps.map((s) => s.loss), 1);
  const maxGrad = Math.max(...steps.map((s) => s.gradNorm), 0.1);
  const maxStepSize = Math.max(...steps.map((s) => s.stepSize), 0.01);

  // Helper to map index & value to SVG coordinate space
  const getX = (idx: number) => padding + (idx / Math.max(1, steps.length - 1)) * (width - padding * 2);
  const getY = (val: number, maxVal: number) => height - padding - (Math.min(val, maxVal) / maxVal) * (height - padding * 2);

  // SVG Polyline point strings
  const lossPointsStr = currentSteps.map((s, i) => `${getX(i)},${getY(s.loss, maxLoss)}`).join(' ');
  const gradPointsStr = currentSteps.map((s, i) => `${getX(i)},${getY(s.gradNorm, maxGrad)}`).join(' ');
  const stepPointsStr = currentSteps.map((s, i) => `${getX(i)},${getY(s.stepSize, maxStepSize)}`).join(' ');

  // Weights (w1, w2) range mapping
  const minW = Math.min(...steps.map((s) => Math.min(s.w1, s.w2)), -4);
  const maxW = Math.max(...steps.map((s) => Math.max(s.w1, s.w2)), 4);
  const getWY = (val: number) => height - padding - ((val - minW) / (maxW - minW || 1)) * (height - padding * 2);

  const w1PointsStr = currentSteps.map((s, i) => `${getX(i)},${getWY(s.w1)}`).join(' ');
  const w2PointsStr = currentSteps.map((s, i) => `${getX(i)},${getWY(s.w2)}`).join(' ');

  const currentStep = steps[currentStepIndex] || steps[0];

  return (
    <div className="bg-midnight border border-mountainside rounded-3xl p-5 shadow-hard space-y-4">
      <div className="flex items-center justify-between border-b border-mountainside pb-2">
        <div className="flex items-center gap-2 text-sm font-bold text-arctic">
          <Activity className="w-4 h-4 text-cyan-400" />
          Synchronized Live Analytics & Optimization Curves
        </div>
        <span className="text-[10px] font-mono text-apres">Updated per iteration</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Loss Curve J(w) */}
        <div className="bg-mountainside/30 border border-apres/20 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span className="flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              Loss Curve J(w)
            </span>
            <span className="font-mono text-amber-400 font-bold">{currentStep.loss.toFixed(4)}</span>
          </div>
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#262E36" strokeWidth="1" />
              {currentSteps.length > 1 && (
                <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" points={lossPointsStr} strokeLinecap="round" strokeLinejoin="round" />
              )}
              {currentSteps.length > 0 && (
                <circle cx={getX(currentStepIndex)} cy={getY(currentStep.loss, maxLoss)} r="4" fill="#f59e0b" className="animate-pulse" />
              )}
            </svg>
          </div>
        </div>

        {/* 2. Gradient Norm ||∇J|| */}
        <div className="bg-mountainside/30 border border-apres/20 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Gradient Norm ||∇J||
            </span>
            <span className="font-mono text-cyan-400 font-bold">{currentStep.gradNorm.toFixed(4)}</span>
          </div>
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#262E36" strokeWidth="1" />
              {currentSteps.length > 1 && (
                <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={gradPointsStr} strokeLinecap="round" strokeLinejoin="round" />
              )}
              {currentSteps.length > 0 && (
                <circle cx={getX(currentStepIndex)} cy={getY(currentStep.gradNorm, maxGrad)} r="4" fill="#06b6d4" className="animate-pulse" />
              )}
            </svg>
          </div>
        </div>

        {/* 3. Weight Trajectory (w1 & w2) */}
        <div className="bg-mountainside/30 border border-apres/20 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              Weights (w₁ Cyan / w₂ Emerald)
            </span>
            <span className="font-mono text-xs text-arctic">
              <span className="text-cyan-400 font-bold">{currentStep.w1.toFixed(2)}</span> /{' '}
              <span className="text-emerald-400 font-bold">{currentStep.w2.toFixed(2)}</span>
            </span>
          </div>
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#262E36" strokeWidth="1" />
              {currentSteps.length > 1 && (
                <>
                  <polyline fill="none" stroke="#06b6d4" strokeWidth="2" points={w1PointsStr} strokeLinecap="round" />
                  <polyline fill="none" stroke="#10b981" strokeWidth="2" points={w2PointsStr} strokeLinecap="round" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* 4. Step Size Δw */}
        <div className="bg-mountainside/30 border border-apres/20 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-pink-400" />
              Step Magnitude (Δw)
            </span>
            <span className="font-mono text-pink-400 font-bold">{currentStep.stepSize.toFixed(4)}</span>
          </div>
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#262E36" strokeWidth="1" />
              {currentSteps.length > 1 && (
                <polyline fill="none" stroke="#ec4899" strokeWidth="2.5" points={stepPointsStr} strokeLinecap="round" strokeLinejoin="round" />
              )}
              {currentSteps.length > 0 && (
                <circle cx={getX(currentStepIndex)} cy={getY(currentStep.stepSize, maxStepSize)} r="4" fill="#ec4899" className="animate-pulse" />
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
