import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { updateConfig, setLayerSizes } from '../neuralNetworkSlice';
import Card from '../../../components/ui/Card';
import { Activity, AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const GradientFlowInspector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { config, trajectory, currentEpoch, layerSizes } = useAppSelector(
    (state) => state.neuralNetwork
  );

  const snapshot = trajectory[currentEpoch] || {
    gradientNorm: 0,
    vanishingExplodingStatus: 'normal',
  };

  const layers = snapshot.networkState?.layers || [];

  return (
    <Card className="p-5 space-y-5 bg-midnight/90 border border-apres/30 max-w-4xl mx-auto text-arctic font-mono text-xs">
      <div className="flex items-center justify-between border-b border-apres/30 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <Activity className="w-5 h-5 text-cyan-400" />
          Deep Learning Gradient Flow Inspector
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            snapshot.vanishingExplodingStatus === 'vanishing'
              ? 'bg-amber-950 text-amber-300 border-amber-500/50'
              : snapshot.vanishingExplodingStatus === 'exploding'
              ? 'bg-red-950 text-red-300 border-red-500/50'
              : 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
          }`}
        >
          {snapshot.vanishingExplodingStatus === 'vanishing'
            ? '⚠️ Vanishing Gradient'
            : snapshot.vanishingExplodingStatus === 'exploding'
            ? '🚨 Exploding Gradient'
            : '✓ Healthy Gradient Flow'}
        </span>
      </div>

      {/* Preset Scenario Buttons */}
      <div className="space-y-2">
        <label className="text-xs text-apres font-semibold">Test Gradient Scenarios:</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => {
              dispatch(setLayerSizes([2, 6, 6, 6, 6, 1]));
              dispatch(updateConfig({ activation: 'sigmoid' }));
            }}
            className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/40 text-left hover:border-amber-400 transition-all space-y-1"
          >
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Trigger Vanishing
            </div>
            <p className="text-[11px] text-apres font-sans">
              Deep 6-layer Sigmoid network. Chain rule derivatives collapse to 0 in early layers.
            </p>
          </button>

          <button
            onClick={() => {
              dispatch(setLayerSizes([2, 5, 5, 1]));
              dispatch(updateConfig({ learningRate: 0.5, l2Lambda: 0.0 }));
            }}
            className="p-3 rounded-xl bg-red-950/30 border border-red-500/40 text-left hover:border-red-400 transition-all space-y-1"
          >
            <div className="font-bold text-red-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> Trigger Exploding
            </div>
            <p className="text-[11px] text-apres font-sans">
              High learning rate α=0.5 with unregularized deep weights causing gradient explosion.
            </p>
          </button>

          <button
            onClick={() => {
              dispatch(setLayerSizes([2, 4, 3, 1]));
              dispatch(updateConfig({ activation: 'relu', learningRate: 0.03, l2Lambda: 0.005 }));
            }}
            className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-left hover:border-emerald-400 transition-all space-y-1"
          >
            <div className="font-bold text-emerald-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Healthy Flow (ReLU)
            </div>
            <p className="text-[11px] text-apres font-sans">
              ReLU activations + L2 Regularization + Adam optimizer maintaining 100% healthy gradients.
            </p>
          </button>
        </div>
      </div>

      {/* Layer Gradient Magnitude Bars */}
      <div className="space-y-3 pt-3 border-t border-apres/30">
        <span className="text-xs text-arctic font-bold">Layer Gradient Magnitude (∂L/∂W):</span>
        <div className="space-y-2">
          {layers.map((layer, lIdx) => {
            if (lIdx === 0) return null;
            let avgGrad = 0;
            let count = 0;

            layer.neurons.forEach((n) => {
              n.gradW.forEach((g) => {
                avgGrad += Math.abs(g);
                count++;
              });
            });

            avgGrad = count > 0 ? avgGrad / count : 0;
            const barWidthPct = Math.min(100, Math.max(4, avgGrad * 200));

            return (
              <div key={`layer_grad_bar_${lIdx}`} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span>Layer {lIdx} ({layer.neurons.length} Neurons)</span>
                  <span className="font-bold text-cyan-400">Avg ||∂L/∂W||: {avgGrad.toFixed(6)}</span>
                </div>
                <div className="w-full h-3 bg-mountainside/50 rounded-full overflow-hidden border border-apres/20">
                  <div
                    style={{ width: `${barWidthPct}%` }}
                    className={`h-full rounded-full transition-all duration-300 ${
                      avgGrad < 0.0001
                        ? 'bg-amber-400'
                        : avgGrad > 5.0
                        ? 'bg-red-500'
                        : 'bg-cyan-400'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default GradientFlowInspector;
