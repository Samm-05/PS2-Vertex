import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, TrendingUp, GitBranch, PieChart, Activity, Cpu } from 'lucide-react';

interface AlgorithmItem {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  icon: React.FC<{ className?: string }>;
  route: string;
  accent: string;
  isFuture?: boolean;
}

const algorithmList: AlgorithmItem[] = [
  {
    id: 'linear-regression',
    name: 'Linear Regression',
    category: 'Supervised Learning',
    difficulty: 'Beginner',
    description: 'Fit optimal parameter hyperplanes using gradient descent and observe real-time loss reduction curves.',
    icon: TrendingUp,
    route: '/linear-regression',
    accent: 'from-primary-500 to-indigo-600',
  },
  {
    id: 'gradient-descent',
    name: 'Gradient Descent',
    category: 'Optimization',
    difficulty: 'Intermediate',
    description: 'Observe 3D loss surface landscapes and learning rate convergence step-by-step.',
    icon: Layers,
    route: '/gradient-descent',
    accent: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'overfitting-lab',
    name: 'Overfitting & Regularization',
    category: 'Validation',
    difficulty: 'Intermediate',
    description: 'Explore bias-variance trade-offs, L1/L2 penalty parameters, and cross-validation bounds.',
    icon: GitBranch,
    route: '/overfitting-lab',
    accent: 'from-amber-400 to-orange-600',
  },
  {
    id: 'logistic-regression',
    name: 'Logistic Regression',
    category: 'Supervised Learning',
    difficulty: 'Advanced',
    description: 'Separate binary classes using sigmoid activation surfaces and log-loss decision boundaries.',
    icon: Activity,
    route: '/logistic-regression',
    accent: 'from-purple-500 to-pink-600',
  },
  {
    id: 'neural-networks',
    name: 'Neural Networks',
    category: 'Deep Learning',
    difficulty: 'Advanced',
    description: 'Multi-layer backpropagation visualization with activation heatmaps and gradient propagation paths.',
    icon: Cpu,
    route: '/neural-network',
    accent: 'from-rose-500 to-red-600',
  },
];

export const AlgorithmsSection: React.FC = () => {
  return (
    <section id="algorithms" className="py-24 bg-secondary-950 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[30rem] rounded-full bg-primary-600/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-accent-400">
              Interactive Library
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
              Algorithm Labs
            </h2>
            <p className="mt-4 text-secondary-300 text-base sm:text-lg max-w-2xl">
              Choose an algorithm below to launch an interactive 3D simulation sandbox.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-400 hover:text-primary-300 transition-colors"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Algorithm Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {algorithmList.map((item) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.25 }}
                className="group relative p-8 rounded-3xl bg-secondary-900/80 border border-secondary-800 hover:border-primary-500/60 backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden"
              >
                {/* Top Border Glowing Gradient */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accent} opacity-75 group-hover:opacity-100 transition-opacity`} />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-lg`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isFuture ? (
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-accent-500/20 text-accent-300 border border-accent-500/40">
                          PREVIEW
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-secondary-800 text-secondary-300 border border-secondary-700">
                          {item.difficulty}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-mono text-secondary-400 uppercase tracking-wider block mb-1">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-secondary-300 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                {/* Card Action Link */}
                <Link
                  to={item.route}
                  className="inline-flex items-center justify-between w-full pt-4 border-t border-secondary-800 text-sm font-semibold text-white group-hover:text-primary-400 transition-colors"
                >
                  <span>{item.isFuture ? 'View Model Roadmap' : 'Launch Simulation'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AlgorithmsSection;
