import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../../app/hooks';
import Card from '../../../../components/ui/Card';
import { Activity, Zap } from 'lucide-react';

export const GradientMagnitudeInspector: React.FC = () => {
  const { layerSizes, trajectory, currentEpoch } = useAppSelector(
    (state) => state.neuralNetwork
  );

  const snapshot = trajectory[currentEpoch];

  // Calculate average gradient magnitude per layer
  const layerGradients = layerSizes.map((_, lIdx) => {
    if (lIdx === 0) return { layer: 0, avgGrad: 0, maxGrad: 0 };
    const layerData = snapshot?.networkState?.layers[lIdx];
    if (!layerData) return { layer: lIdx, avgGrad: 0, maxGrad: 0 };

    let totalGrad = 0;
    let maxG = 0;
    let count = 0;

    layerData.neurons.forEach((n) => {
      n.gradW.forEach((g) => {
        const absG = Math.abs(g);
        totalGrad += absG;
        if (absG > maxG) maxG = absG;
        count++;
      });
    });

    const avgGrad = count > 0 ? totalGrad / count : 0;
    return { layer: lIdx, avgGrad, maxGrad: maxG };
  }).filter((item) => item.layer > 0);

  const maxOverall = Math.max(0.0001, ...layerGradients.map((item) => item.maxGrad));

  return (
    <Card className="p-5 space-y-4 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <Activity className="w-4 h-4 text-slopes" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-arctic tracking-tight">Layer Gradient Learning Speeds (||∂L/∂W||)</h3>
            <p className="text-[10px] font-mono text-apres">Which parameters learn faster during backpropagation</p>
          </div>
        </div>
      </div>

      {/* Layer Gradient Bars */}
      <div className="space-y-3 pt-1">
        {layerGradients.map((item) => {
          const pct = Math.min(100, Math.round((item.avgGrad / maxOverall) * 100));

          return (
            <div key={`grad_bar_layer_${item.layer}`} className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-arctic font-medium">Layer {item.layer} Parameters</span>
                <span className="text-amber-400 font-bold">
                  Avg |∂L/∂W| = {item.avgGrad.toFixed(5)}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-midnight border border-mountainside overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(4, pct)}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-amber-400 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Callout */}
      <div className="p-3.5 rounded-xl bg-midnight/80 border border-mountainside text-xs font-mono text-slopes space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-arctic">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Educational Insight: Learning Speed Variance</span>
        </div>
        <p className="text-[11px] text-apres leading-relaxed">
          Output and final hidden layers receive direct backpropagation loss signals, updating weights rapidly. Earlier hidden layers receive multiplied chain-rule derivatives, causing them to learn at different speeds.
        </p>
      </div>
    </Card>
  );
};

export default GradientMagnitudeInspector;
