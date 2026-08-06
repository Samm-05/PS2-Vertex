import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setParams } from '../linearRegressionSlice';
import { Sliders, Gauge, Zap, Layers, RefreshCw } from 'lucide-react';
import { soundFx } from '../../gradientDescent/utils/soundEffects';

export const RightPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const lrState = useAppSelector((state) => state.linearRegression);

  const params = lrState?.params;
  const steps = lrState?.steps ?? [];
  const currentStepIndex = lrState?.currentStepIndex ?? 0;

  if (!params) return null;

  const currentStep = steps[currentStepIndex] || steps[0] || {
    w: 0,
    b: 0,
    mseLoss: 0,
    gradW: 0,
    gradB: 0,
  };

  return (
    <div className="space-y-5">
      {/* Live Metrics Dashboard Header */}
      <div className="bg-midnight border border-mountainside rounded-2xl p-4 shadow-hard space-y-3">
        <div className="flex items-center justify-between border-b border-mountainside pb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-arctic">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Live State & Metrics
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            Epoch {currentStepIndex} / {params.epochs}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">Loss (MSE)</span>
            <span className="text-sm font-bold text-amber-400">{currentStep.mseLoss.toFixed(4)}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">Learning Rate α</span>
            <span className="text-sm font-bold text-cyan-400">{params.learningRate}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">Weight w (slope)</span>
            <span className="text-sm font-bold text-arctic">{currentStep.w.toFixed(3)}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">Bias b (intercept)</span>
            <span className="text-sm font-bold text-arctic">{currentStep.b.toFixed(3)}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">∂J / ∂w</span>
            <span className="text-xs font-bold text-emerald-400">{currentStep.gradW.toFixed(4)}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">∂J / ∂b</span>
            <span className="text-xs font-bold text-emerald-400">{currentStep.gradB.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Parameter Controls Panel */}
      <div className="bg-midnight border border-mountainside rounded-2xl p-5 shadow-hard space-y-5">
        <div className="flex items-center justify-between border-b border-mountainside pb-2">
          <div className="flex items-center gap-2 text-sm font-bold text-arctic">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Hyperparameter Engine
          </div>
        </div>

        {/* 1. Learning Rate Preset Buttons & Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-arctic flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Learning Rate (α): <span className="font-mono text-cyan-400 font-bold">{params.learningRate}</span>
            </label>
          </div>

          <div className="grid grid-cols-4 gap-1">
            {[
              { label: 'Very Small', val: 0.001 },
              { label: 'Optimal', val: 0.03 },
              { label: 'Large', val: 0.2 },
              { label: 'Too Large', val: 0.8 },
            ].map((lr) => (
              <button
                key={lr.label}
                type="button"
                onClick={() => {
                  dispatch(setParams({ learningRate: lr.val }));
                  if (lr.val >= 0.8) soundFx.playOvershootWarning();
                  else soundFx.playStepSound();
                }}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold capitalize transition-all border text-center ${
                  params.learningRate === lr.val
                    ? 'bg-mountainside text-arctic border-cyan-400/80 shadow-soft'
                    : 'bg-mountainside/40 text-slopes border-transparent hover:bg-mountainside/80'
                }`}
              >
                {lr.label}
              </button>
            ))}
          </div>

          <input
            type="range"
            min="0.0005"
            max="1.5"
            step="0.005"
            value={params.learningRate}
            onChange={(e) => dispatch(setParams({ learningRate: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* 2. Epochs Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-arctic">Max Epochs / Iterations</label>
            <span className="font-mono text-arctic font-bold">{params.epochs}</span>
          </div>
          <input
            type="range"
            min="10"
            max="150"
            step="5"
            value={params.epochs}
            onChange={(e) => dispatch(setParams({ epochs: parseInt(e.target.value, 10) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* 3. Dataset Size Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-arctic">Dataset Size (Points)</label>
            <span className="font-mono text-cyan-400 font-bold">{params.datasetSize}</span>
          </div>
          <input
            type="range"
            min="10"
            max="80"
            step="5"
            value={params.datasetSize}
            onChange={(e) => dispatch(setParams({ datasetSize: parseInt(e.target.value, 10) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* 4. Dataset Noise Level Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-arctic">Noise Level (σ)</label>
            <span className="font-mono text-amber-400 font-bold">{params.noise.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.5"
            step="0.05"
            value={params.noise}
            onChange={(e) => dispatch(setParams({ noise: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* 5. L2 Regularization Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-arctic">L2 Regularization (λ)</label>
            <span className="font-mono text-purple-400 font-bold">{params.regularization.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.02"
            value={params.regularization}
            onChange={(e) => dispatch(setParams({ regularization: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>

        {/* 6. Initial Weight & Bias Start Positions */}
        <div className="space-y-3 pt-2 border-t border-mountainside">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span>Initial Model Weight & Bias</span>
            <button
              type="button"
              onClick={() => dispatch(setParams({ wInitial: 0.2, bInitial: 1.0 }))}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              <RefreshCw className="w-3 h-3" /> Reset Init
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-apres font-mono">Slope w: {params.wInitial.toFixed(2)}</span>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.1"
                value={params.wInitial}
                onChange={(e) => dispatch(setParams({ wInitial: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-apres font-mono">Bias b: {params.bInitial.toFixed(2)}</span>
              <input
                type="range"
                min="-5.0"
                max="5.0"
                step="0.2"
                value={params.bInitial}
                onChange={(e) => dispatch(setParams({ bInitial: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
