import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';

export const MathFormulaPanel: React.FC = () => {
  const { trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.logisticRegression
  );

  const currentWeights = trajectory[currentEpoch]?.weights || {
    w1: 0,
    w2: 0,
    b: 0,
  };
  const currentLoss = trajectory[currentEpoch]?.loss || 0;

  return (
    <Card className="p-4 space-y-4 font-mono bg-midnight/90 border border-apres/30">
      <div className="flex items-center justify-between border-b border-apres/30 pb-2">
        <h4 className="text-xs uppercase font-bold tracking-wider text-arctic">
          Live Mathematical Formulation
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slopes/20 text-slopes">
          {config.featureType === 'polynomial' ? 'Polynomial (Degree 2)' : 'Linear'}
        </span>
      </div>

      {/* Equation 1: Weighted Sum z */}
      <div className="p-3 bg-mountainside/40 rounded-xl space-y-1 text-xs border border-apres/20">
        <div className="text-[11px] text-apres">1. Linear Combination (z):</div>
        <div className="text-sm font-semibold text-arctic">
          z = ({currentWeights.w1.toFixed(2)}) · x₁ + ({currentWeights.w2.toFixed(2)}) · x₂ + ({currentWeights.b.toFixed(2)})
        </div>
        {config.featureType === 'polynomial' && (
          <div className="text-xs text-yellow-300 pt-1">
            + ({currentWeights.w11?.toFixed(2)})x₁² + ({currentWeights.w22?.toFixed(2)})x₂² + ({currentWeights.w12?.toFixed(2)})x₁x₂
          </div>
        )}
      </div>

      {/* Equation 2: Sigmoid Activation */}
      <div className="p-3 bg-mountainside/40 rounded-xl space-y-1 text-xs border border-apres/20">
        <div className="text-[11px] text-apres">2. Sigmoid Probability Activation:</div>
        <div className="text-sm font-semibold text-cyan-400">
          P(y = 1 | x) = σ(z) = 1 / (1 + e<sup>-z</sup>)
        </div>
      </div>

      {/* Equation 3: Decision Criterion */}
      <div className="p-3 bg-mountainside/40 rounded-xl space-y-1 text-xs border border-apres/20">
        <div className="text-[11px] text-apres">3. Decision Rule (Threshold τ = {config.threshold}):</div>
        <div className="text-xs text-arctic">
          ŷ = <span className="text-red-400 font-bold">1</span> if P ≥ {config.threshold.toFixed(2)} else <span className="text-blue-400 font-bold">0</span>
        </div>
      </div>

      {/* Equation 4: Binary Cross Entropy Loss */}
      <div className="p-3 bg-mountainside/40 rounded-xl space-y-1 text-xs border border-apres/20">
        <div className="flex items-center justify-between text-[11px] text-apres">
          <span>4. Binary Cross-Entropy (Log Loss):</span>
          <span className="text-amber-400 font-bold">L = {currentLoss.toFixed(4)}</span>
        </div>
        <div className="text-xs text-arctic">
          L = -1/N ∑ [ yᵢ log(pᵢ) + (1 - yᵢ) log(1 - pᵢ) ]
        </div>
      </div>
    </Card>
  );
};

export default MathFormulaPanel;
