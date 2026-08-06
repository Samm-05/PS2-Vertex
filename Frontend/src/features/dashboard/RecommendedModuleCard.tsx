import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Target, ArrowRight, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';

export const RecommendedModuleCard: React.FC = () => {
  const navigate = useNavigate();

  const objectives = [
    'Understand gradient descent learning rates',
    'Visualize MSE loss convergence in 3D',
    'Minimize weight bias errors interactively',
  ];

  return (
    <Card hoverable className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside border border-apres/40 text-arctic">
            <Sparkles className="w-4 h-4 text-slopes" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slopes">
            Smart Recommendation
          </span>
        </div>
        <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-mountainside text-arctic border border-apres/40">
          Intermediate • 15 Mins
        </span>
      </div>

      <h3 className="text-xl font-bold text-arctic mb-2">
        Gradient Descent Optimization
      </h3>

      {/* Why Recommended */}
      <div className="p-3.5 rounded-xl bg-midnight/80 border border-mountainside mb-4 text-xs font-mono text-slopes leading-relaxed">
        <span className="text-arctic font-bold">Why recommended: </span>
        Based on your 85% score in Linear Regression, mastering parameter update optimization will double your convergence rate understanding.
      </div>

      {/* Learning Objectives */}
      <div className="space-y-2 mb-6">
        <p className="text-xs font-mono uppercase text-apres">Learning Objectives:</p>
        {objectives.map((obj, i) => (
          <div key={i} className="flex items-center gap-2 text-xs text-slopes">
            <CheckCircle2 className="w-3.5 h-3.5 text-arctic shrink-0" />
            <span>{obj}</span>
          </div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/simulator/linear-regression')}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-arctic text-midnight font-bold text-xs hover:bg-slopes transition-all shadow-soft"
      >
        <span>Launch Recommended Lesson</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </Card>
  );
};

export default RecommendedModuleCard;
