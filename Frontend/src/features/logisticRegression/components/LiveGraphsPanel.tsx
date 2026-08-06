import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import Card from '../../../components/ui/Card';

export const LiveGraphsPanel: React.FC = () => {
  const { trajectory, currentEpoch } = useAppSelector(
    (state) => state.logisticRegression
  );

  const chartData = trajectory.map((m) => ({
    epoch: m.epoch,
    loss: parseFloat(m.loss.toFixed(4)),
    accuracy: parseFloat((m.accuracy * 100).toFixed(1)),
    precision: parseFloat((m.precision * 100).toFixed(1)),
    recall: parseFloat((m.recall * 100).toFixed(1)),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
      {/* Chart 1: BCE Loss over Epochs */}
      <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-arctic">BCE Log Loss Progression</span>
          <span className="text-amber-400">
            Loss: {trajectory[currentEpoch]?.loss.toFixed(4) || '0.0000'}
          </span>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
              />
              <ReferenceLine x={currentEpoch} stroke="#38bdf8" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="loss"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Chart 2: Accuracy & Precision/Recall over Epochs */}
      <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="font-bold text-arctic">Metrics vs Epochs</span>
          <div className="flex gap-2 text-[10px]">
            <span className="text-emerald-400">Acc</span>
            <span className="text-cyan-400">Prec</span>
            <span className="text-purple-400">Rec</span>
          </div>
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="epoch" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  fontSize: '11px',
                }}
              />
              <ReferenceLine x={currentEpoch} stroke="#38bdf8" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="precision"
                stroke="#38bdf8"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="recall"
                stroke="#a855f7"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default LiveGraphsPanel;
