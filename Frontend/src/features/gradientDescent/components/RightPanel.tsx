import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setParams, setLearningRateMode, setSurfaceType, setInitialPoint } from '../gradientDescentSlice';
import { LearningRateMode, LossSurfaceType } from '../types';
import { LOSS_SURFACES } from '../engine/lossFunctions';
import { Sliders, RefreshCw, Zap, Gauge, Layers } from 'lucide-react';
import { soundFx } from '../utils/soundEffects';

export const RightPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const gdState = useAppSelector((state) => state.gradientDescent);
  const params = gdState?.params;
  const steps = gdState?.steps ?? [];
  const currentStepIndex = gdState?.currentStepIndex ?? 0;

  if (!params) return null;

  const currentStep = steps[currentStepIndex] || steps[0] || {
    w1: 0,
    w2: 0,
    loss: 0,
    gradNorm: 0,
    stepSize: 0,
  };

  const handleLearningRateMode = (mode: LearningRateMode) => {
    dispatch(setLearningRateMode(mode));
    if (mode === 'too-large') {
      soundFx.playOvershootWarning();
    } else {
      soundFx.playStepSound();
    }
  };

  const handleSurfaceChange = (surface: LossSurfaceType) => {
    dispatch(setSurfaceType(surface));
    soundFx.playStepSound();
  };

  return (
    <div className="space-y-5">
      {/* Live Metrics Quick Dashboard Header */}
      <div className="bg-midnight border border-mountainside rounded-2xl p-4 shadow-hard space-y-3">
        <div className="flex items-center justify-between border-b border-mountainside pb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-arctic">
            <Gauge className="w-4 h-4 text-cyan-400" />
            Live State & Metrics
          </div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            Iter {currentStepIndex} / {params.epochs}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 font-mono">
          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">Loss J(w)</span>
            <span className="text-sm font-bold text-amber-400">{currentStep.loss.toFixed(4)}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">||∇J|| Norm</span>
            <span className="text-sm font-bold text-cyan-400">{currentStep.gradNorm.toFixed(4)}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">w₁ Weight</span>
            <span className="text-sm font-bold text-arctic">{currentStep.w1.toFixed(3)}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl">
            <span className="text-[10px] text-apres uppercase block">w₂ Weight</span>
            <span className="text-sm font-bold text-arctic">{currentStep.w2.toFixed(3)}</span>
          </div>

          <div className="bg-mountainside/50 border border-apres/20 p-2.5 rounded-xl col-span-2 flex items-center justify-between">
            <span className="text-[10px] text-apres uppercase">Step Size (Δw)</span>
            <span className="text-xs font-bold text-emerald-400">{currentStep.stepSize.toFixed(4)}</span>
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

        {/* 1. Loss Surface Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-arctic flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            Loss Landscape Surface
          </label>
          <select
            value={params.surfaceType}
            onChange={(e) => handleSurfaceChange(e.target.value as LossSurfaceType)}
            className="w-full bg-mountainside border border-apres/40 text-arctic text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-400 font-medium"
          >
            {Object.values(LOSS_SURFACES).map((surf) => (
              <option key={surf.id} value={surf.id}>
                {surf.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Learning Rate Modes Selector */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-arctic flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Learning Rate (α): <span className="font-mono text-cyan-400 font-bold">{params.learningRate}</span>
            </label>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {(['very-small', 'small', 'optimal', 'large', 'too-large'] as LearningRateMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => handleLearningRateMode(mode)}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold capitalize transition-all border text-center ${
                  params.learningRateMode === mode
                    ? 'bg-mountainside text-arctic border-cyan-400/80 shadow-soft'
                    : 'bg-mountainside/40 text-slopes border-transparent hover:bg-mountainside/80'
                }`}
              >
                {mode.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Continuous LR Slider */}
          <input
            type="range"
            min="0.0001"
            max="2.0"
            step="0.001"
            value={params.learningRate}
            onChange={(e) => {
              dispatch(setParams({ learningRate: parseFloat(e.target.value), learningRateMode: 'custom' }));
            }}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
        </div>

        {/* 3. Momentum Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-arctic">Momentum (β)</label>
            <span className="font-mono text-cyan-400 font-bold">{params.momentum.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.99"
            step="0.01"
            value={params.momentum}
            onChange={(e) => dispatch(setParams({ momentum: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-emerald-400"
          />
        </div>

        {/* 4. Mini-Batch Noise Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-semibold text-arctic">Mini-Batch Noise (σ)</label>
            <span className="font-mono text-amber-400 font-bold">{params.noise.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1.0"
            step="0.02"
            value={params.noise}
            onChange={(e) => dispatch(setParams({ noise: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* 5. Epochs Slider */}
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

        {/* 6. Initial Point w1, w2 sliders */}
        <div className="space-y-3 pt-2 border-t border-mountainside">
          <div className="flex items-center justify-between text-xs font-semibold text-arctic">
            <span>Initial Weight Positions</span>
            <button
              type="button"
              onClick={() => {
                const surfaceDef = LOSS_SURFACES[params.surfaceType];
                dispatch(setInitialPoint({ w1: surfaceDef.recommendedInit.w1, w2: surfaceDef.recommendedInit.w2 }));
              }}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
            >
              <RefreshCw className="w-3 h-3" /> Reset Init
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[10px] text-apres font-mono">w₁ Start: {params.w1Initial.toFixed(2)}</span>
              <input
                type="range"
                min="-3.5"
                max="3.5"
                step="0.1"
                value={params.w1Initial}
                onChange={(e) => dispatch(setParams({ w1Initial: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] text-apres font-mono">w₂ Start: {params.w2Initial.toFixed(2)}</span>
              <input
                type="range"
                min="-3.5"
                max="3.5"
                step="0.1"
                value={params.w2Initial}
                onChange={(e) => dispatch(setParams({ w2Initial: parseFloat(e.target.value) }))}
                className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
