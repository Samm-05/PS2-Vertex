import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Network, GitMerge, Layers, Eye, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';

export const UpcomingModulesGrid: React.FC = () => {
  const upcoming = [
    {
      title: 'Neural Networks (MLP)',
      category: 'Deep Learning',
      icon: Network,
      release: 'Phase 3',
    },
    {
      title: 'Support Vector Machines (SVM)',
      category: 'Kernel Methods',
      icon: Cpu,
      release: 'Phase 3',
    },
    {
      title: 'K-Nearest Neighbors (KNN)',
      category: 'Lazy Learning',
      icon: Layers,
      release: 'Phase 3',
    },
    {
      title: 'Random Forest Ensembles',
      category: 'Ensemble Learning',
      icon: GitMerge,
      release: 'Phase 4',
    },
    {
      title: 'Convolutional Nets (CNN)',
      category: 'Computer Vision',
      icon: Eye,
      release: 'Phase 4',
    },
    {
      title: 'Transformer Architecture',
      category: 'Generative AI',
      icon: Sparkles,
      release: 'Phase 4',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-arctic tracking-tight">Upcoming 3D Simulator Modules</h3>
          <p className="text-xs font-mono text-apres">Curriculum Expansion Roadmap</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-mountainside text-apres border border-mountainside">
          Coming Soon
        </span>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcoming.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -2 }}
            className="p-4 rounded-2xl bg-midnight/60 border border-mountainside/60 select-none opacity-80 hover:opacity-100 transition-opacity"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-xl bg-mountainside border border-apres/30 text-slopes">
                <item.icon className="w-4 h-4 text-slopes" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mountainside text-apres border border-mountainside">
                {item.release}
              </span>
            </div>

            <h4 className="text-sm font-bold text-arctic tracking-tight">{item.title}</h4>
            <p className="text-[11px] font-mono text-apres mt-1">{item.category}</p>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default UpcomingModulesGrid;
