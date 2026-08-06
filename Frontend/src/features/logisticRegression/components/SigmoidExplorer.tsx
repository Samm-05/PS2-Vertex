import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import { sigmoid } from '../engine/logisticRegressionEngine';

export const SigmoidExplorer: React.FC = () => {
  const [zVal, setZVal] = useState<number>(0);
  const prob = sigmoid(zVal);

  return (
    <Card className="p-4 space-y-3 bg-midnight/90 border border-apres/30">
      <div className="flex items-center justify-between border-b border-apres/30 pb-2">
        <h4 className="text-xs uppercase font-bold tracking-wider text-arctic">
          Interactive Sigmoid Function σ(z)
        </h4>
        <span className="text-xs font-mono text-cyan-400">
          z = {zVal.toFixed(2)} → σ(z) = {(prob * 100).toFixed(1)}%
        </span>
      </div>

      {/* 2D SVG Sigmoid Curve */}
      <div className="relative w-full h-36 bg-mountainside/40 rounded-xl overflow-hidden border border-apres/20 flex items-center justify-center">
        <svg className="w-full h-full p-2" viewBox="-6 -0.1 12 1.2">
          {/* Grid lines */}
          <line x1="-6" y1="0.5" x2="6" y2="0.5" stroke="#334155" strokeDasharray="0.2" strokeWidth="0.03" />
          <line x1="0" y1="0" x2="0" y2="1" stroke="#334155" strokeDasharray="0.2" strokeWidth="0.03" />

          {/* Sigmoid Curve */}
          <path
            d={Array.from({ length: 120 }, (_, i) => {
              const x = -6 + (i / 120) * 12;
              const y = 1 - sigmoid(x);
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="#38bdf8"
            strokeWidth="0.1"
          />

          {/* Active z point marker */}
          <circle
            cx={zVal}
            cy={1 - prob}
            r="0.25"
            fill="#ef4444"
            stroke="#ffffff"
            strokeWidth="0.05"
          />
        </svg>

        {/* Floating Probability Tooltip */}
        <div className="absolute top-2 right-2 px-2 py-1 bg-midnight/80 rounded text-[10px] font-mono text-arctic">
          P(y=1) = {prob.toFixed(3)}
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono text-apres">
          <span>Drag Weighted Sum (z):</span>
          <span className="text-yellow-400 font-bold">{zVal.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="-6"
          max="6"
          step="0.1"
          value={zVal}
          onChange={(e) => setZVal(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Pipeline animation summary */}
      <div className="flex items-center justify-between text-[11px] font-mono p-2 bg-mountainside/30 rounded-lg text-slopes">
        <span>Features (x)</span>
        <span>→</span>
        <span className="text-yellow-400 font-bold">z = {zVal.toFixed(1)}</span>
        <span>→</span>
        <span className="text-cyan-400 font-bold">σ(z) = {prob.toFixed(2)}</span>
        <span>→</span>
        <span className={prob >= 0.5 ? 'text-red-400 font-bold' : 'text-blue-400 font-bold'}>
          Pred: {prob >= 0.5 ? 1 : 0}
        </span>
      </div>
    </Card>
  );
};

export default SigmoidExplorer;
