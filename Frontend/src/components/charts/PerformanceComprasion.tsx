import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PerformanceData {
  name: string;
  accuracy: number;
  loss: number;
  time: number;
}

interface PerformanceComparisonProps {
  data: PerformanceData[];
  height?: number;
}

const PerformanceComparison: React.FC<PerformanceComparisonProps> = ({ data, height = 300 }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.2} />
        <XAxis dataKey="name" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white dark:bg-secondary-800 p-3 rounded-lg shadow-medium border border-secondary-200 dark:border-secondary-700">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white mb-2">{label}</p>
                  {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                      {entry.name}: {entry.value?.toFixed(2)}
                      {entry.name === 'accuracy' ? '%' : ''}
                    </p>
                  ))}
                </div>
              );
            }
            return null;
          }}
        />
        <Legend />
        <Bar dataKey="accuracy" fill="#2563eb" name="Accuracy (%)" />
        <Bar dataKey="loss" fill="#ef4444" name="Loss" />
        <Bar dataKey="time" fill="#22c55e" name="Time (s)" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PerformanceComparison;