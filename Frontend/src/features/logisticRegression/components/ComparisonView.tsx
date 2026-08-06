import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  updateModelAConfig,
  updateModelBConfig,
} from '../logisticRegressionSlice';
import Card from '../../../components/ui/Card';
import Center3DScene from './Center3DScene';

export const ComparisonView: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    modelAConfig,
    modelBConfig,
    trajectoryA,
    trajectoryB,
  } = useAppSelector((state) => state.logisticRegression);

  const metricsA = trajectoryA[trajectoryA.length - 1] || { loss: 0, accuracy: 0 };
  const metricsB = trajectoryB[trajectoryB.length - 1] || { loss: 0, accuracy: 0 };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between p-3 bg-midnight/90 rounded-2xl border border-apres/30 text-xs font-mono">
        <span className="font-bold text-arctic text-sm">
          Dual Model Split-Screen Comparison Mode
        </span>
        <span className="text-apres">
          Compare Convergence Dynamics across Different Hyperparameters
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[450px]">
        {/* Model A Panel */}
        <Card className="p-4 bg-midnight/90 border border-cyan-500/40 space-y-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-apres/30 pb-2">
            <h4 className="text-sm font-bold text-cyan-400 font-mono">
              Model A (Low Learning Rate α = {modelAConfig.learningRate})
            </h4>
            <div className="flex gap-2 text-xs font-mono">
              <span className="text-amber-400 font-bold">Loss: {metricsA.loss.toFixed(4)}</span>
              <span className="text-emerald-400 font-bold">Acc: {(metricsA.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-apres">
              <span>Learning Rate (α):</span>
              <span className="text-arctic font-bold">{modelAConfig.learningRate}</span>
            </div>
            <input
              type="range"
              min="0.005"
              max="0.2"
              step="0.005"
              value={modelAConfig.learningRate}
              onChange={(e) => dispatch(updateModelAConfig({ learningRate: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          <div className="flex-1 min-h-[300px]">
            <Center3DScene />
          </div>
        </Card>

        {/* Model B Panel */}
        <Card className="p-4 bg-midnight/90 border border-purple-500/40 space-y-3 flex flex-col">
          <div className="flex items-center justify-between border-b border-apres/30 pb-2">
            <h4 className="text-sm font-bold text-purple-400 font-mono">
              Model B (High Learning Rate α = {modelBConfig.learningRate})
            </h4>
            <div className="flex gap-2 text-xs font-mono">
              <span className="text-amber-400 font-bold">Loss: {metricsB.loss.toFixed(4)}</span>
              <span className="text-emerald-400 font-bold">Acc: {(metricsB.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between text-apres">
              <span>Learning Rate (α):</span>
              <span className="text-arctic font-bold">{modelBConfig.learningRate}</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="2.0"
              step="0.05"
              value={modelBConfig.learningRate}
              onChange={(e) => dispatch(updateModelBConfig({ learningRate: parseFloat(e.target.value) }))}
              className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-purple-400"
            />
          </div>

          <div className="flex-1 min-h-[300px]">
            <Center3DScene />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonView;
