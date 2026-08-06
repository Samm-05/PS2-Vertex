import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppSelector } from '../../../../app/hooks';
import Card from '../../../../components/ui/Card';
import { TrendingUp } from 'lucide-react';

export const WeightHistoryTimeline: React.FC = () => {
  const { trajectory, currentEpoch } = useAppSelector((state) => state.neuralNetwork);

  // Extract weight histories over epochs for key representative weights across layers
  const chartData = trajectory.map((snap) => {
    const l1w0 = snap.networkState?.layers[1]?.neurons[0]?.weights[0] ?? 0;
    const l1w1 = snap.networkState?.layers[1]?.neurons[1]?.weights[0] ?? 0;
    const l2w0 = snap.networkState?.layers[2]?.neurons[0]?.weights[0] ?? 0;

    return {
      epoch: snap.epoch,
      Loss: Number(snap.loss.toFixed(4)),
      'L1 Weight (w1)': Number(l1w0.toFixed(4)),
      'L1 Weight (w2)': Number(l1w1.toFixed(4)),
      'L2 Weight (w1)': Number(l2w0.toFixed(4)),
    };
  });

  return (
    <Card className="p-5 space-y-3 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <TrendingUp className="w-4 h-4 text-slopes" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-arctic tracking-tight">Weight Dynamics & Convergence History</h3>
            <p className="text-[10px] font-mono text-apres">Parameter updates over training epochs</p>
          </div>
        </div>
        <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-midnight text-arctic border border-mountainside">
          Epoch {currentEpoch} / {trajectory.length - 1}
        </span>
      </div>

      <div className="h-64 p-2 rounded-xl bg-midnight border border-mountainside">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262E36" />
            <XAxis dataKey="epoch" stroke="#6C6D74" fontSize={11} fontFamily="JetBrains Mono" />
            <YAxis stroke="#6C6D74" fontSize={11} fontFamily="JetBrains Mono" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#090F15',
                borderColor: '#262E36',
                borderRadius: '0.75rem',
                color: '#D3D1CE',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '11px', color: '#B3B7BA' }} />
            <Line type="monotone" dataKey="Loss" stroke="#EF4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="L1 Weight (w1)" stroke="#10B981" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="L1 Weight (w2)" stroke="#3B82F6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="L2 Weight (w1)" stroke="#F59E0B" strokeWidth={2} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default WeightHistoryTimeline;
