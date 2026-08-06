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
import { Target } from 'lucide-react';

export const BiasVarianceChart: React.FC = () => {
  const { result, config } = useAppSelector((state) => state.overfitting);

  return (
    <Card className="p-5 space-y-3 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <Target className="w-4 h-4 text-slopes" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-arctic tracking-tight">Bias-Variance Tradeoff Curve</h3>
            <p className="text-[10px] font-mono text-apres">Optimal Model Complexity Sweet Spot</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-midnight text-arctic border border-mountainside">
          Degree d = {config.degree}
        </span>
      </div>

      <div className="h-56 p-2 rounded-xl bg-midnight border border-mountainside">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={result.biasVarianceCurve}>
            <CartesianGrid strokeDasharray="3 3" stroke="#262E36" />
            <XAxis dataKey="degree" stroke="#6C6D74" fontSize={11} fontFamily="JetBrains Mono" />
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
            <Line type="monotone" dataKey="biasSq" name="Bias² (Underfitting)" stroke="#3B82F6" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="variance" name="Variance (Overfitting)" stroke="#EF4444" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="totalError" name="Total Expected Error" stroke="#10B981" strokeWidth={2.5} strokeDasharray="3 3" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default BiasVarianceChart;
