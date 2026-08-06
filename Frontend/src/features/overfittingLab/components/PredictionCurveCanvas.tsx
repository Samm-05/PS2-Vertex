import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import { trueTargetFunction } from '../utils/fittingEngine';

export const PredictionCurveCanvas: React.FC = () => {
  const { points, result, config } = useAppSelector((state) => state.overfitting);

  // SVG Canvas dimensions & scaling bounds (-3.2 to 3.2 x, -2.5 to 2.5 y)
  const width = 600;
  const height = 360;
  const margin = 40;

  const mapX = (x: number) => margin + ((x + 3.2) / 6.4) * (width - 2 * margin);
  const mapY = (y: number) => height - margin - ((y + 2.5) / 5.0) * (height - 2 * margin);

  // Generate Ground Truth Curve Path
  const truePathPoints: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const x = -3.0 + (i / 80) * 6.0;
    const y = trueTargetFunction(x);
    truePathPoints.push(`${i === 0 ? 'M' : 'L'} ${mapX(x).toFixed(1)} ${mapY(y).toFixed(1)}`);
  }
  const truePathD = truePathPoints.join(' ');

  // Generate Fitted Polynomial Prediction Curve Path
  const predPathPoints: string[] = [];
  result.predictionCurve.forEach((pt, i) => {
    const clampedY = Math.max(-2.8, Math.min(2.8, pt.y));
    predPathPoints.push(`${i === 0 ? 'M' : 'L'} ${mapX(pt.x).toFixed(1)} ${mapY(clampedY).toFixed(1)}`);
  });
  const predPathD = predPathPoints.join(' ');

  const curveColor =
    result.regime === 'good_fit'
      ? '#10B981'
      : result.regime === 'underfitting'
      ? '#3B82F6'
      : '#EF4444';

  return (
    <Card className="p-5 space-y-3 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-arctic tracking-tight">Polynomial Fit vs Ground Truth</h3>
          <p className="text-[10px] font-mono text-apres">Degree d = {config.degree} • L2 λ = {config.lambda}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-slopes">Train Pts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-slopes font-mono">Val Pts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t border-dashed border-apres" />
            <span className="text-apres">True f(x)</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas Plot */}
      <div className="relative w-full overflow-hidden rounded-xl bg-midnight border border-mountainside/80">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Grid lines & Axes */}
          <line x1={margin} y1={height / 2} x2={width - margin} y2={height / 2} stroke="#262E36" strokeDasharray="3 3" />
          <line x1={width / 2} y1={margin} x2={width / 2} y2={height - margin} stroke="#262E36" strokeDasharray="3 3" />

          {/* Ground Truth Function Path (Dashed) */}
          <path d={truePathD} fill="none" stroke="#6C6D74" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Fitted Polynomial Prediction Curve (Solid) */}
          <motion.path
            d={predPathD}
            fill="none"
            stroke={curveColor}
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Data Points */}
          {points.map((pt) => {
            const cx = mapX(pt.x);
            const cy = mapY(pt.y);
            const isTrain = pt.isTrain;

            return (
              <circle
                key={pt.id}
                cx={cx}
                cy={cy}
                r={isTrain ? 4.5 : 4.0}
                fill={isTrain ? '#10B981' : '#F59E0B'}
                stroke={isTrain ? '#090F15' : '#090F15'}
                strokeWidth="1.5"
                opacity={isTrain ? 0.9 : 0.85}
              />
            );
          })}
        </svg>
      </div>
    </Card>
  );
};

export default PredictionCurveCanvas;
