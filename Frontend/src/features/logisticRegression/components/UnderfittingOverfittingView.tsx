import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setDatasetType, updateConfig } from '../logisticRegressionSlice';
import Card from '../../../components/ui/Card';
import Center3DScene from './Center3DScene';
import { Layers, Shield, Sparkles, CheckCircle2 } from 'lucide-react';

export const UnderfittingOverfittingView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasetType, config, trajectory, currentEpoch } = useAppSelector(
    (state) => state.logisticRegression
  );

  const metrics = trajectory[currentEpoch] || { loss: 0, accuracy: 0 };

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Top Banner */}
      <div className="p-4 bg-midnight/90 rounded-2xl border border-apres/30 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-arctic tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" /> Underfitting vs Good Fit vs Overfitting Explorer
          </h3>
          <span className="text-xs font-mono text-cyan-400">Interactive Model Complexity Lab</span>
        </div>
        <p className="text-xs text-slopes">
          Experiment with dataset complexity, polynomial feature expansion, and regularization (L1/L2) to see how capacity affects classification boundaries.
        </p>
      </div>

      {/* Preset Controls Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs">
        {/* Preset 1: Underfitting */}
        <button
          onClick={() => {
            dispatch(setDatasetType('circular'));
            dispatch(updateConfig({ featureType: 'linear', regularization: 'none' }));
          }}
          className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
            datasetType === 'circular' && config.featureType === 'linear'
              ? 'bg-amber-950/40 border-amber-500 text-amber-300'
              : 'bg-midnight/90 border-apres/30 text-slopes hover:text-arctic'
          }`}
        >
          <div className="font-bold text-amber-400 flex items-center gap-1">
            1. Underfitting Case (High Bias)
          </div>
          <p className="text-[11px] text-apres">
            Linear model attempting to separate concentric circular data. Boundary cannot curve!
          </p>
        </button>

        {/* Preset 2: Good Fit */}
        <button
          onClick={() => {
            dispatch(setDatasetType('circular'));
            dispatch(updateConfig({ featureType: 'polynomial', regularization: 'l2', regLambda: 0.01 }));
          }}
          className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
            datasetType === 'circular' && config.featureType === 'polynomial' && config.regularization === 'l2'
              ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300'
              : 'bg-midnight/90 border-apres/30 text-slopes hover:text-arctic'
          }`}
        >
          <div className="font-bold text-emerald-400 flex items-center gap-1">
            2. Good Fit (Balanced)
          </div>
          <p className="text-[11px] text-apres">
            Polynomial terms + mild L2 Regularization create a smooth circular decision boundary.
          </p>
        </button>

        {/* Preset 3: Overfitting Noise */}
        <button
          onClick={() => {
            dispatch(setDatasetType('highly_overlapping'));
            dispatch(updateConfig({ featureType: 'polynomial', regularization: 'none' }));
          }}
          className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
            datasetType === 'highly_overlapping' && config.featureType === 'polynomial' && config.regularization === 'none'
              ? 'bg-red-950/40 border-red-500 text-red-300'
              : 'bg-midnight/90 border-apres/30 text-slopes hover:text-arctic'
          }`}
        >
          <div className="font-bold text-red-400 flex items-center gap-1">
            3. Overfitting Case (High Variance)
          </div>
          <p className="text-[11px] text-apres">
            High degree polynomial on noisy overlapping data without regularization. Boundary warps around noise!
          </p>
        </button>
      </div>

      {/* Main Interactive Canvas Area */}
      <div className="flex-1 min-h-[450px] relative">
        <Center3DScene />
        <div className="absolute top-4 right-4 z-20 bg-midnight/90 backdrop-blur-md p-3 rounded-2xl border border-apres/40 text-xs font-mono space-y-1">
          <div>Loss: <span className="text-amber-400 font-bold">{metrics.loss.toFixed(4)}</span></div>
          <div>Accuracy: <span className="text-emerald-400 font-bold">{(metrics.accuracy * 100).toFixed(1)}%</span></div>
          <div>Model: <span className="text-cyan-400 font-bold">{config.featureType}</span></div>
          <div>Reg: <span className="text-purple-400 font-bold">{config.regularization}</span></div>
        </div>
      </div>
    </div>
  );
};

export default UnderfittingOverfittingView;
