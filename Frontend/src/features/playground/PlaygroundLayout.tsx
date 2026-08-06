import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Brain,
  Sliders,
  Activity,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import PageContainer from '../../components/layout/PageContainer';

export interface LabTab {
  id: string;
  name: string;
  shortName: string;
  path: string;
  icon: React.ElementType;
  color: string;
  badge: string;
  description: string;
}

export const LAB_TABS: LabTab[] = [
  {
    id: 'linear-lab',
    name: 'Linear Regression Lab',
    shortName: 'Linear Lab',
    path: '/playground/linear-lab',
    icon: Sliders,
    color: 'text-amber-400 border-amber-500/40 bg-amber-500/10',
    badge: 'Supervised',
    description: 'Hyperplane fitting, cost minimization & loss landscapes',
  },
  {
    id: 'gd-lab',
    name: 'Gradient Descent Lab',
    shortName: 'GD Lab',
    path: '/playground/gd-lab',
    icon: Layers,
    color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10',
    badge: 'Optimization',
    description: '3D loss surface optimization, learning rates & momentum',
  },
  {
    id: 'logistic-lab',
    name: 'Logistic Regression Lab',
    shortName: 'Logistic Lab',
    path: '/playground/logistic-lab',
    icon: Activity,
    color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10',
    badge: 'Classification',
    description: 'Sigmoid activation, log-loss & decision boundaries',
  },
  {
    id: 'overfitting-lab',
    name: 'Overfitting & Regularization',
    shortName: 'Overfitting Lab',
    path: '/playground/overfitting-lab',
    icon: ShieldCheck,
    color: 'text-rose-400 border-rose-500/40 bg-rose-500/10',
    badge: 'Validation',
    description: 'Polynomial complexity, L1/L2 penalties & bias-variance',
  },
  {
    id: 'nn-lab',
    name: 'Neural Network Lab',
    shortName: 'NN Lab',
    path: '/playground/nn-lab',
    icon: Brain,
    color: 'text-purple-400 border-purple-500/40 bg-purple-500/10',
    badge: 'Deep Learning',
    description: 'Multi-layer perceptron, forward & backpropagation dynamics',
  },
];

export const PlaygroundLayout: React.FC = () => {
  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-4 px-4 space-y-4 font-sans select-none">
      {/* Clean Lab Switcher Navigation Bar (Top of Workspace) */}
      <div className="flex items-center gap-2 p-2 bg-midnight/90 backdrop-blur-xl rounded-2xl border border-mountainside shadow-hard overflow-x-auto scrollbar-hide">
        {LAB_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                `relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
                    : 'text-slopes hover:text-arctic hover:bg-mountainside/50 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-arctic' : 'text-apres'}`} />
                  <span>{tab.shortName}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${tab.color}`}
                  >
                    {tab.badge}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeLabTab"
                      className="absolute inset-0 bg-mountainside/30 rounded-xl border border-apres/40 -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Render Active Lab Component */}
      <div className="w-full">
        <Outlet />
      </div>
    </PageContainer>
  );
};

export default PlaygroundLayout;
