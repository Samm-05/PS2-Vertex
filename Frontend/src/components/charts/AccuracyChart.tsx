import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AccuracyChartProps {
  data: number[];
  height?: number;
}

const AccuracyChart: React.FC<AccuracyChartProps> = ({ data, height = 200 }) => {
  const chartData = data.map((value, index) => ({
    epoch: index + 1,
    accuracy: value * 100,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
        <XAxis dataKey="epoch" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} />
        <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 100]} />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-secondary-800 p-3 rounded-lg shadow-medium border border-secondary-200 dark:border-secondary-700">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Epoch: {payload[0].payload.epoch}
                  </p>
                  <p className="text-sm font-semibold text-accent-500">
                    Accuracy: {payload[0].value?.toFixed(2)}%
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Line type="monotone" dataKey="accuracy" stroke="#22c55e" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AccuracyChart;