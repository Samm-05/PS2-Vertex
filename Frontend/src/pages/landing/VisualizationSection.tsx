import React, { useRef } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useScrollReveal } from '../../animations/scrollAnimations';

const regressionData = [
  { x: 1, actual: 8, predicted: 7.5 },
  { x: 2, actual: 12, predicted: 11.3 },
  { x: 3, actual: 15, predicted: 14.8 },
  { x: 4, actual: 19, predicted: 18.2 },
  { x: 5, actual: 23, predicted: 22.1 },
  { x: 6, actual: 26, predicted: 25.6 },
];

const kMeansData = [
  { x: 2, y: 5, cluster: 1 },
  { x: 3, y: 6, cluster: 1 },
  { x: 7, y: 3, cluster: 2 },
  { x: 8, y: 2, cluster: 2 },
  { x: 5, y: 8, cluster: 3 },
  { x: 6, y: 9, cluster: 3 },
];

const VisualizationSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="visualization" ref={sectionRef} className="py-20 bg-white dark:bg-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal>
          <h2 className="text-4xl font-semibold text-secondary-900 dark:text-secondary-50">Visualization Demo</h2>
          <p className="mt-4 text-base text-secondary-600 dark:text-secondary-300 max-w-3xl">
            Preview how model behavior is rendered in ML Visual Lab with live charts and interpretable visual outputs.
          </p>
        </div>

        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <article className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 p-5" data-reveal>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50">Linear Regression Fit</h3>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={regressionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
                  <XAxis dataKey="x" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="predicted" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 p-5" data-reveal>
            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50">K-Means Cluster Preview</h3>
            <div className="h-72 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.25} />
                  <XAxis type="number" dataKey="x" name="Feature X" stroke="#64748b" />
                  <YAxis type="number" dataKey="y" name="Feature Y" stroke="#64748b" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter data={kMeansData.filter((point) => point.cluster === 1)} fill="#6366f1" />
                  <Scatter data={kMeansData.filter((point) => point.cluster === 2)} fill="#14b8a6" />
                  <Scatter data={kMeansData.filter((point) => point.cluster === 3)} fill="#f59e0b" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>

        <div id="docs" className="mt-8 rounded-xl border border-primary-200 dark:border-primary-900/40 bg-primary-50 dark:bg-primary-900/20 p-6" data-reveal>
          <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">Documentation & Learning Notes</h3>
          <p className="mt-3 text-secondary-700 dark:text-secondary-300">
            Every simulator includes explanation panels, formula breakdowns, and guided parameter tips for each step.
          </p>
        </div>
      </div>
    </section>
  );
};

export default VisualizationSection;
