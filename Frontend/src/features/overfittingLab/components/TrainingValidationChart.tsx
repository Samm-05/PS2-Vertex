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
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import { Activity } from 'lucide-react';

export const TrainingValidationChart: React.FC = () => {
  const { result } = useAppSelector((state) => state.overfitting);

  return (
    <Card className="p-5 space-y-3 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <Activity className="w-4 h-4 text-slopes" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-arctic tracking-tight">Training vs Validation Loss Trajectory</h3>
            <p className="text-[10px] font-mono text-apres">Divergence reveals overfitting gap</p>
          </div>
        </div>
      </div>

      <div className="h-56 p-2 rounded-xl bg-midnight border border-mountainside">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={result.lossHistory}>
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
            <Line type="monotone" dataKey="trainLoss" name="Training Loss" stroke="#10B981" strokeWidth={2.5} dot={false} />
            <Line type="monotone" dataKey="valLoss" name="Validation Loss" stroke="#F59E0B" strokeWidth={2.5} strokeDasharray="4 4" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default TrainingValidationChart;
