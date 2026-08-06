import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface LossChartProps {
  data: number[];
  height?: number;
}

const LossChart: React.FC<LossChartProps> = ({ data, height = 200 }) => {
  const chartData = data.map((value, index) => ({
    step: index + 1,
    loss: value,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
        <XAxis dataKey="step" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-secondary-800 p-3 rounded-lg shadow-medium border border-secondary-200 dark:border-secondary-700">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Step: {payload[0].payload.step}
                  </p>
                  <p className="text-sm font-semibold text-primary-600">
                    Loss: {payload[0].value?.toFixed(4)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Line type="monotone" dataKey="loss" stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LossChart;