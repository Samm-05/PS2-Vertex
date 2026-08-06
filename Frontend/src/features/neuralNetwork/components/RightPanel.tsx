import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateConfig } from '../neuralNetworkSlice';
import Card from '../../../components/ui/Card';
import NeuronInspector from './NeuronInspector';
import { Sliders, Target, Zap, Shield, Activity, BarChart2 } from 'lucide-react';
import { ActivationType, LossType, OptimizerType } from '../types';

export const RightPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.neuralNetwork
  );

  const snapshot = trajectory[currentEpoch] || {
    epoch: 0,
    loss: 0,
    accuracy: 0,
    gradientNorm: 0,
  };

  return (
    <div className="w-full h-full flex flex-col space-y-4 overflow-y-auto pr-1 scrollbar-hide">
      {/* Realtime Metrics Readouts */}
      <div className="grid grid-cols-2 gap-2">
        <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-apres">
            <span>Loss</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-mono font-bold text-amber-400">
            {snapshot.loss.toFixed(4)}
          </div>
        </Card>

        <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-apres">
            <span>Accuracy</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-mono font-bold text-emerald-400">
            {(snapshot.accuracy * 100).toFixed(1)}%
          </div>
        </Card>

        <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-apres">
            <span>Epoch</span>
            <BarChart2 className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg font-mono font-bold text-cyan-400">
            {currentEpoch} / {config.maxEpochs}
          </div>
        </Card>

        <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-1">
          <div className="flex items-center justify-between text-[11px] font-mono text-apres">
            <span>Gradient Norm</span>
            <BarChart2 className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-lg font-mono font-bold text-purple-400">
            {snapshot.gradientNorm.toFixed(3)}
          </div>
        </Card>
      </div>

      {/* Selected Neuron Inspector Subpanel */}
      <NeuronInspector />

      {/* Hyperparameter Controls */}
      <Card className="p-4 space-y-4 bg-midnight/90 border border-apres/30">
        <h4 className="text-xs uppercase font-bold tracking-wider text-arctic border-b border-apres/30 pb-2 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-cyan-400" /> Hyperparameter Tuning
        </h4>

        {/* Activation Function */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-apres">Activation Function:</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['tanh', 'relu', 'sigmoid', 'leaky_relu', 'softmax'] as ActivationType[]).map((act) => (
              <button
                key={act}
                onClick={() => dispatch(updateConfig({ activation: act }))}
                className={`py-1.5 text-[11px] rounded-xl font-mono uppercase border transition-all ${
                  config.activation === act
                    ? 'bg-arctic text-midnight font-bold border-arctic'
                    : 'bg-mountainside/40 border-apres/30 text-slopes hover:text-arctic'
                }`}
              >
                {act.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Optimizer Selector */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-apres">Optimizer Algorithm:</label>
          <div className="grid grid-cols-2 gap-1.5">
            {(['adam', 'sgd', 'momentum', 'rmsprop'] as OptimizerType[]).map((opt) => (
              <button
                key={opt}
                onClick={() => dispatch(updateConfig({ optimizer: opt }))}
                className={`py-1.5 px-2 text-xs rounded-xl font-mono uppercase border transition-all ${
                  config.optimizer === opt
                    ? 'bg-amber-400 text-midnight font-bold border-amber-400'
                    : 'bg-mountainside/40 border-apres/30 text-slopes hover:text-arctic'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Rate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-apres">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Learning Rate (α):
            </span>
            <span className="text-arctic font-bold">{config.learningRate}</span>
          </div>
          <input
            type="range"
            min="0.001"
            max="0.5"
            step="0.005"
            value={config.learningRate}
            onChange={(e) => dispatch(updateConfig({ learningRate: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>

        {/* Loss Function */}
        <div className="space-y-1">
          <label className="text-xs font-mono text-apres">Loss Function:</label>
          <div className="grid grid-cols-3 gap-1.5">
            {(['bce', 'mse', 'cce'] as LossType[]).map((lFunc) => (
              <button
                key={lFunc}
                onClick={() => dispatch(updateConfig({ lossFunc: lFunc }))}
                className={`py-1.5 text-xs rounded-xl font-mono uppercase border transition-all ${
                  config.lossFunc === lFunc
                    ? 'bg-cyan-500 text-midnight font-bold border-cyan-500'
                    : 'bg-mountainside/40 border-apres/30 text-slopes hover:text-arctic'
                }`}
              >
                {lFunc}
              </button>
            ))}
          </div>
        </div>

        {/* L2 Regularization Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono text-apres">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-purple-400" /> L2 Regularization (λ):
            </span>
            <span className="text-arctic font-bold">{config.l2Lambda}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="0.1"
            step="0.005"
            value={config.l2Lambda}
            onChange={(e) => dispatch(updateConfig({ l2Lambda: parseFloat(e.target.value) }))}
            className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-purple-400"
          />
        </div>
      </Card>
    </div>
  );
};

export default RightPanel;
