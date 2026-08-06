import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateConfig } from '../logisticRegressionSlice';
import Card from '../../../components/ui/Card';
import SigmoidExplorer from './SigmoidExplorer';
import { Sliders, Target, Zap, Shield, Activity, BarChart2 } from 'lucide-react';

export const RightPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.logisticRegression
  );

  const metrics = trajectory[currentEpoch] || {
    epoch: 0,
    loss: 0,
    accuracy: 0,
    precision: 0,
    recall: 0,
    f1Score: 0,
    auc: 0.5,
    weights: { w1: 0, w2: 0, b: 0 },
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 overflow-y-auto pr-1 scrollbar-hide">
      {/* Realtime Performance Cards Grid */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-apres">
            <span>BCE Loss</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-mono font-bold text-amber-400">
            {metrics.loss.toFixed(4)}
          </div>
        </Card>

        <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-apres">
            <span>Accuracy</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {(metrics.accuracy * 100).toFixed(1)}%
          </div>
        </Card>

        <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-apres">
            <span>Precision</span>
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-mono font-bold text-cyan-400">
            {(metrics.precision * 100).toFixed(1)}%
          </div>
        </Card>

        <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-apres">
            <span>Recall</span>
            <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-mono font-bold text-purple-400">
            {(metrics.recall * 100).toFixed(1)}%
          </div>
        </Card>
      </div>

      {/* Threshold Slider Card */}
      <Card className="p-4 space-y-3 bg-midnight/90 border border-apres/30">
        <div className="flex items-center justify-between border-b border-apres/30 pb-2">
          <h4 className="text-xs uppercase font-bold tracking-wider text-arctic flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-cyan-400" /> Classification Threshold (τ)
          </h4>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {config.threshold.toFixed(2)}
          </span>
        </div>

        <div className="space-y-1">
          <input
            type="range"
            min="0.05"
            max="0.95"
            step="0.01"
            value={config.threshold}
            onChange={(e) => dispatch(updateConfig({ threshold: parseFloat(e.target.value) }))}
            className="w-full h-2 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-[10px] font-mono text-apres">
            <span>0.0 (Predict All 1s)</span>
            <span>0.5 (Default)</span>
            <span>1.0 (Predict All 0s)</span>
          </div>
        </div>
      </Card>

      {/* Hyperparameters Card */}
      <Card className="p-4 space-y-4 bg-midnight/90 border border-apres/30">
        <h4 className="text-xs uppercase font-bold tracking-wider text-arctic border-b border-apres/30 pb-2">
          Hyperparameter Tuning
        </h4>

        {/* Learning Rate */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-apres">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Learning Rate (α):
            </span>
            <span className="text-arctic font-bold">{config.learningRate}</span>
          </div>
          <input
            type="range"
            min="0.005"
            max="1.0"
            step="0.005"
            value={config.learningRate}
            onChange={(e) => dispatch(updateConfig({ learningRate: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Feature Expansion */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-apres">Boundary Feature Model:</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => dispatch(updateConfig({ featureType: 'linear' }))}
              className={`p-2 text-xs rounded-xl font-medium border transition-all ${
                config.featureType === 'linear'
                  ? 'bg-arctic text-midnight font-bold border-arctic'
                  : 'bg-mountainside/40 border-apres/30 text-slopes hover:text-arctic'
              }`}
            >
              Linear Line
            </button>
            <button
              onClick={() => dispatch(updateConfig({ featureType: 'polynomial' }))}
              className={`p-2 text-xs rounded-xl font-medium border transition-all ${
                config.featureType === 'polynomial'
                  ? 'bg-arctic text-midnight font-bold border-arctic'
                  : 'bg-mountainside/40 border-apres/30 text-slopes hover:text-arctic'
              }`}
            >
              Polynomial 2°
            </button>
          </div>
        </div>

        {/* Regularization */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-apres">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-purple-400" /> Regularization:
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['none', 'l1', 'l2'] as const).map((reg) => (
              <button
                key={reg}
                onClick={() => dispatch(updateConfig({ regularization: reg }))}
                className={`py-1.5 text-xs rounded-xl uppercase font-mono border transition-all ${
                  config.regularization === reg
                    ? 'bg-purple-500 text-white font-bold border-purple-500'
                    : 'bg-mountainside/40 border-apres/30 text-slopes hover:text-arctic'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Interactive Sigmoid Subpanel */}
      <SigmoidExplorer />
    </div>
  );
};

export default RightPanel;
