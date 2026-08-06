import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import { Sparkles, TrendingDown, Target, HelpCircle } from 'lucide-react';

export const ExplanationPanel: React.FC = () => {
  const { trajectory, currentEpoch, config, points } = useAppSelector(
    (state) => state.logisticRegression
  );

  const currentMetrics = trajectory[currentEpoch] || {
    loss: 0,
    accuracy: 0,
    confusionMatrix: { tp: 0, fp: 0, tn: 0, fn: 0 },
    weights: { w1: 0, w2: 0, b: 0 },
  };

  const initialMetrics = trajectory[0] || currentMetrics;
  const lossDrop = (initialMetrics.loss - currentMetrics.loss).toFixed(3);
  const accPercent = (currentMetrics.accuracy * 100).toFixed(1);

  return (
    <Card className="p-4 space-y-3 bg-midnight/90 border border-apres/30">
      <div className="flex items-center justify-between border-b border-apres/30 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <h4 className="text-xs uppercase font-bold tracking-wider text-arctic">
            AI Epoch Explanation
          </h4>
        </div>
        <span className="text-xs font-mono text-cyan-400">Epoch {currentEpoch}</span>
      </div>

      <div className="space-y-2 text-xs font-mono text-slopes">
        <div className="flex items-start gap-2 bg-mountainside/30 p-2.5 rounded-xl border border-apres/20">
          <TrendingDown className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-arctic font-semibold">Optimization Progress:</span>{' '}
            BCE Loss is currently <span className="text-amber-400 font-bold">{currentMetrics.loss.toFixed(4)}</span> (reduced by {lossDrop} from initial epoch).
          </div>
        </div>

        <div className="flex items-start gap-2 bg-mountainside/30 p-2.5 rounded-xl border border-apres/20">
          <Target className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-arctic font-semibold">Boundary Position:</span>{' '}
            The decision plane is oriented at normal vector ({currentMetrics.weights.w1.toFixed(2)}, {currentMetrics.weights.w2.toFixed(2)}) with offset b = {currentMetrics.weights.b.toFixed(2)}. Accuracy is {accPercent}%.
          </div>
        </div>

        <div className="flex items-start gap-2 bg-mountainside/30 p-2.5 rounded-xl border border-apres/20">
          <HelpCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <div>
            <span className="text-arctic font-semibold">Classification Insights:</span>{' '}
            {currentMetrics.confusionMatrix.fp > 0 && (
              <span className="text-amber-300">
                {currentMetrics.confusionMatrix.fp} False Positives exist. Try lowering the threshold or adjusting learning rate.{' '}
              </span>
            )}
            {currentMetrics.confusionMatrix.fn > 0 && (
              <span className="text-amber-300">
                {currentMetrics.confusionMatrix.fn} False Negatives exist. Try raising the threshold.{' '}
              </span>
            )}
            {currentMetrics.confusionMatrix.fp === 0 && currentMetrics.confusionMatrix.fn === 0 && (
              <span className="text-green-400 font-bold">
                Perfect classification achieved! All points are correctly categorized.
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExplanationPanel;
