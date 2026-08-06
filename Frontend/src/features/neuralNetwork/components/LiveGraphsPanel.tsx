import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import { TrendingDown, Activity, BarChart2 } from 'lucide-react';

export const LiveGraphsPanel: React.FC = () => {
  const { trajectory, currentEpoch } = useAppSelector((state) => state.neuralNetwork);

  if (!trajectory || trajectory.length === 0) return null;

  const currentSnapshots = trajectory.slice(0, currentEpoch + 1);

  const width = 280;
  const height = 90;
  const padding = 12;

  const maxLoss = Math.max(...trajectory.map((s) => s.loss), 0.1);
  const maxGrad = Math.max(...trajectory.map((s) => s.gradientNorm), 1.0);

  const getX = (idx: number) =>
    padding + (idx / Math.max(1, trajectory.length - 1)) * (width - padding * 2);

  const getYLoss = (val: number) =>
    height - padding - (Math.min(val, maxLoss) / maxLoss) * (height - padding * 2);

  const getYAcc = (val: number) =>
    height - padding - val * (height - padding * 2);

  const getYGrad = (val: number) =>
    height - padding - (Math.min(val, maxGrad) / maxGrad) * (height - padding * 2);

  const lossPoints = currentSnapshots.map((s, i) => `${getX(i)},${getYLoss(s.loss)}`).join(' ');
  const accPoints = currentSnapshots.map((s, i) => `${getX(i)},${getYAcc(s.accuracy)}`).join(' ');
  const gradPoints = currentSnapshots.map((s, i) => `${getX(i)},${getYGrad(s.gradientNorm)}`).join(' ');

  const currentSnapshot = trajectory[currentEpoch] || trajectory[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
      {/* 1. Loss Curve */}
      <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1 font-bold text-arctic">
            <TrendingDown className="w-3.5 h-3.5 text-amber-400" /> Loss Curve
          </span>
          <span className="text-amber-400 font-bold">{currentSnapshot.loss.toFixed(4)}</span>
        </div>
        <div className="w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#262E36"
              strokeWidth="1"
            />
            {currentSnapshots.length > 1 && (
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                points={lossPoints}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {currentSnapshots.length > 0 && (
              <circle
                cx={getX(currentEpoch)}
                cy={getYLoss(currentSnapshot.loss)}
                r="3.5"
                fill="#f59e0b"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>
      </Card>

      {/* 2. Accuracy Curve */}
      <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1 font-bold text-arctic">
            <Activity className="w-3.5 h-3.5 text-emerald-400" /> Classification Accuracy
          </span>
          <span className="text-emerald-400 font-bold">
            {(currentSnapshot.accuracy * 100).toFixed(1)}%
          </span>
        </div>
        <div className="w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#262E36"
              strokeWidth="1"
            />
            {currentSnapshots.length > 1 && (
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                points={accPoints}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {currentSnapshots.length > 0 && (
              <circle
                cx={getX(currentEpoch)}
                cy={getYAcc(currentSnapshot.accuracy)}
                r="3.5"
                fill="#10b981"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>
      </Card>

      {/* 3. Gradient Norm */}
      <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1 font-bold text-arctic">
            <BarChart2 className="w-3.5 h-3.5 text-purple-400" /> Gradient Norm ||∇W||
          </span>
          <span className="text-purple-400 font-bold">{currentSnapshot.gradientNorm.toFixed(3)}</span>
        </div>
        <div className="w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-20 overflow-visible">
            <line
              x1={padding}
              y1={height - padding}
              x2={width - padding}
              y2={height - padding}
              stroke="#262E36"
              strokeWidth="1"
            />
            {currentSnapshots.length > 1 && (
              <polyline
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="2.5"
                points={gradPoints}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {currentSnapshots.length > 0 && (
              <circle
                cx={getX(currentEpoch)}
                cy={getYGrad(currentSnapshot.gradientNorm)}
                r="3.5"
                fill="#8b5cf6"
                className="animate-pulse"
              />
            )}
          </svg>
        </div>
      </Card>
    </div>
  );
};

export default LiveGraphsPanel;
