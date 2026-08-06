import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setConfig,
  setPresetRegime,
  reseedDataset,
} from '../overfittingSlice';
import Card from '../../../components/ui/Card';
import { Sliders, RefreshCw } from 'lucide-react';
import { FitRegime } from '../types';

export const ControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { config, result } = useAppSelector((state) => state.overfitting);

  return (
    <Card className="p-5 space-y-4 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <Sliders className="w-4 h-4 text-slopes" />
          </div>
          <h3 className="text-sm font-bold text-arctic tracking-tight">Hyperparameters & Regime Config</h3>
        </div>

        {/* Reseed Dataset Button */}
        <button
          onClick={() => dispatch(reseedDataset())}
          className="p-2 rounded-xl bg-midnight text-slopes hover:text-arctic border border-mountainside hover:border-slopes transition-all"
          title="Reseed Data Points"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Regime Shortcut Buttons */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-apres">Quick Regime Presets:</span>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['underfitting', 'Underfitting', 'bg-blue-950/60 border-blue-500/40 text-blue-400'],
              ['good_fit', 'Good Fit', 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'],
              ['overfitting', 'Overfitting', 'bg-rose-950/60 border-rose-500/40 text-rose-400'],
            ] as [FitRegime, string, string][]
          ).map(([regime, label, style]) => (
            <button
              key={regime}
              onClick={() => dispatch(setPresetRegime(regime))}
              className={`px-3 py-2 text-xs font-mono font-bold rounded-xl border transition-all text-center ${style} ${
                result.regime === regime ? 'ring-2 ring-arctic/30 shadow-md' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Controls Sliders */}
      <div className="space-y-3 pt-2">
        {/* Polynomial Degree Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slopes">Polynomial Degree (d):</span>
            <span className="text-arctic font-bold">{config.degree}</span>
          </div>
          <input
            type="range"
            min={1}
            max={12}
            step={1}
            value={config.degree}
            onChange={(e) => dispatch(setConfig({ degree: Number(e.target.value) }))}
            className="w-full accent-arctic bg-mountainside rounded-lg h-1.5"
          />
        </div>

        {/* L2 Ridge Regularization Lambda Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slopes">L2 Regularization (λ):</span>
            <span className="text-arctic font-bold">{config.lambda.toFixed(3)}</span>
          </div>
          <input
            type="range"
            min={0.0}
            max={0.1}
            step={0.001}
            value={config.lambda}
            onChange={(e) => dispatch(setConfig({ lambda: Number(e.target.value) }))}
            className="w-full accent-arctic bg-mountainside rounded-lg h-1.5"
          />
        </div>

        {/* Dataset Size Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slopes">Dataset Size (N):</span>
            <span className="text-arctic font-bold">{config.datasetSize}</span>
          </div>
          <input
            type="range"
            min={20}
            max={200}
            step={10}
            value={config.datasetSize}
            onChange={(e) => dispatch(setConfig({ datasetSize: Number(e.target.value) }))}
            className="w-full accent-arctic bg-mountainside rounded-lg h-1.5"
          />
        </div>

        {/* Noise Level Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slopes">Noise Level (σ):</span>
            <span className="text-arctic font-bold">{config.noise.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min={0.05}
            max={0.8}
            step={0.05}
            value={config.noise}
            onChange={(e) => dispatch(setConfig({ noise: Number(e.target.value) }))}
            className="w-full accent-arctic bg-mountainside rounded-lg h-1.5"
          />
        </div>
      </div>
    </Card>
  );
};

export default ControlPanel;
