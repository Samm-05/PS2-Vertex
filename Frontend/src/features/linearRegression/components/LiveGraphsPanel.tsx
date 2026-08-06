import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { TrendingDown, Activity, Compass, BarChart2 } from 'lucide-react';

export const LiveGraphsPanel: React.FC = () => {
  const lrState = useAppSelector((state) => state.linearRegression);

  const steps = lrState?.steps ?? [];
  const currentStepIndex = lrState?.currentStepIndex ?? 0;

  if (!steps || steps.length === 0) return null;

  const currentSteps = steps.slice(0, currentStepIndex + 1);

  // SVG dimensions
  const width = 280;
  const height = 110;
  const padding = 15;

  const maxLoss = Math.max(...steps.map((s) => s.mseLoss), 0.1);
  const minW = Math.min(...steps.map((s) => s.w), -2);
  const maxW = Math.max(...steps.map((s) => s.w), 3);

  const minB = Math.min(...steps.map((s) => s.b), -2);
  const maxB = Math.max(...steps.map((s) => s.b), 6);

  // Mapping helpers
  const getX = (idx: number) => padding + (idx / Math.max(1, steps.length - 1)) * (width - padding * 2);
  const getY = (val: number, maxVal: number) => height - padding - (Math.min(val, maxVal) / maxVal) * (height - padding * 2);
  const getRangeY = (val: number, minVal: number, maxVal: number) =>
    height - padding - ((val - minVal) / (maxVal - minVal || 1)) * (height - padding * 2);

  // SVG Point strings
  const msePointsStr = currentSteps.map((s, i) => `${getX(i)},${getY(s.mseLoss, maxLoss)}`).join(' ');
  const wPointsStr = currentSteps.map((s, i) => `${getX(i)},${getRangeY(s.w, minW, maxW)}`).join(' ');
  const bPointsStr = currentSteps.map((s, i) => `${getX(i)},${getRangeY(s.b, minB, maxB)}`).join(' ');

  const currentStep = steps[currentStepIndex] || steps[0];

  // Calculate residual error bins for Residual Distribution Histogram
  const residuals = currentStep.predictions.map((p) => p.residual);
  const residualBins = [0, 0, 0, 0, 0]; // 5 bins: <-1.5, -1.5..-0.5, -0.5..0.5, 0.5..1.5, >1.5
  residuals.forEach((r) => {
    if (r < -1.5) residualBins[0]++;
    else if (r < -0.5) residualBins[1]++;
    else if (r <= 0.5) residualBins[2]++;
    else if (r <= 1.5) residualBins[3]++;
    else residualBins[4]++;
  });
  const maxBinCount = Math.max(...residualBins, 1);

  return (
    <div className="bg-midnight border border-mountainside rounded-3xl p-5 shadow-hard space-y-4">
      <div className="flex items-center justify-between border-b border-mountainside pb-2">
        <div className="flex items-center gap-2 text-sm font-bold text-arctic">
          <Activity className="w-4 h-4 text-cyan-400" />
          Synchronized Live Analytics & Optimization Curves
        </div>
        <span className="text-[10px] font-mono text-apres">Updated per epoch</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Loss Curve (MSE) */}
        <div className="bg-mountainside/30 border border-apres/20 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span className="flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-amber-400" />
              Loss Curve (MSE)
            </span>
            <span className="font-mono text-amber-400 font-bold">{currentStep.mseLoss.toFixed(4)}</span>
          </div>
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#262E36" strokeWidth="1" />
              {currentSteps.length > 1 && (
                <polyline fill="none" stroke="#f59e0b" strokeWidth="2.5" points={msePointsStr} strokeLinecap="round" strokeLinejoin="round" />
              )}
              {currentSteps.length > 0 && (
                <circle cx={getX(currentStepIndex)} cy={getY(currentStep.mseLoss, maxLoss)} r="4" fill="#f59e0b" className="animate-pulse" />
              )}
            </svg>
          </div>
        </div>

        {/* 2. Weight Slope (w) Trajectory */}
        <div className="bg-mountainside/30 border border-apres/20 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              Weight Slope (w)
            </span>
            <span className="font-mono text-cyan-400 font-bold">{currentStep.w.toFixed(3)}</span>
          </div>
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#262E36" strokeWidth="1" />
              {currentSteps.length > 1 && (
                <polyline fill="none" stroke="#06b6d4" strokeWidth="2.5" points={wPointsStr} strokeLinecap="round" strokeLinejoin="round" />
              )}
              {currentSteps.length > 0 && (
                <circle cx={getX(currentStepIndex)} cy={getRangeY(currentStep.w, minW, maxW)} r="4" fill="#06b6d4" className="animate-pulse" />
              )}
            </svg>
          </div>
        </div>

        {/* 3. Bias Intercept (b) Trajectory */}
        <div className="bg-mountainside/30 border border-apres/20 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              Bias Intercept (b)
            </span>
            <span className="font-mono text-emerald-400 font-bold">{currentStep.b.toFixed(3)}</span>
          </div>
          <div className="w-full overflow-hidden">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24 overflow-visible">
              <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#262E36" strokeWidth="1" />
              {currentSteps.length > 1 && (
                <polyline fill="none" stroke="#10b981" strokeWidth="2.5" points={bPointsStr} strokeLinecap="round" strokeLinejoin="round" />
              )}
              {currentSteps.length > 0 && (
                <circle cx={getX(currentStepIndex)} cy={getRangeY(currentStep.b, minB, maxB)} r="4" fill="#10b981" className="animate-pulse" />
              )}
            </svg>
          </div>
        </div>

        {/* 4. Residual Error Distribution Histogram */}
        <div className="bg-mountainside/30 border border-apres/20 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span className="flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
              Residual Distribution
            </span>
            <span className="font-mono text-xs text-purple-400 font-bold">Centered at 0</span>
          </div>
          <div className="w-full h-24 flex items-end justify-between gap-1.5 pt-2">
            {residualBins.map((count, bIdx) => {
              const barHeightPercent = (count / maxBinCount) * 100;
              const isCenterBin = bIdx === 2; // -0.5 to +0.5 bin (ideal centered error)
              return (
                <div key={bIdx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    style={{ height: `${Math.max(8, barHeightPercent)}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      isCenterBin ? 'bg-emerald-400' : 'bg-purple-500/70'
                    }`}
                    title={`Bin ${bIdx + 1}: ${count} points`}
                  />
                  <span className="text-[9px] font-mono text-apres">
                    {bIdx === 0 ? '<-1.5' : bIdx === 1 ? '-1' : bIdx === 2 ? '0' : bIdx === 3 ? '+1' : '>+1.5'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
