import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Play, Sparkles } from 'lucide-react';
import Card from '../../components/ui/Card';

export interface PathNode {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'current' | 'unlocked' | 'locked';
  path?: string;
}

const defaultNodes: PathNode[] = [
  { id: '1', title: 'Machine Learning Basics', category: 'Fundamentals', status: 'completed', path: '/linear-regression' },
  { id: '2', title: 'Linear Regression', category: 'Supervised', status: 'completed', path: '/linear-regression' },
  { id: '3', title: 'Gradient Descent', category: 'Optimization', status: 'current', path: '/gradient-descent' },
  { id: '4', title: 'Logistic Regression', category: 'Classification', status: 'unlocked', path: '/logistic-regression' },
  { id: '5', title: 'Decision Boundary', category: 'Classification', status: 'unlocked', path: '/logistic-regression' },
  { id: '6', title: 'Overfitting Lab', category: 'Validation', status: 'unlocked', path: '/overfitting-lab' },
  { id: '7', title: 'Neural Networks', category: 'Deep Learning', status: 'unlocked', path: '/neural-network' },
  { id: '8', title: 'Practice Challenges', category: 'Mastery', status: 'unlocked', path: '/practice' },
  { id: '9', title: 'Model Evaluation', category: 'Validation', status: 'locked' },
  { id: '10', title: 'Advanced Ensembles', category: 'Ensemble Learning', status: 'locked' },
];

export const LearningPathRoadmap: React.FC<{ nodes?: PathNode[] }> = ({ nodes = defaultNodes }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-arctic tracking-tight">Interactive Learning Path</h3>
          <p className="text-xs font-mono text-apres">Sequential Mastery Curriculum</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-mountainside text-slopes border border-apres/40">
          3 / 10 Completed
        </span>
      </div>

      <div className="relative py-4 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-4 min-w-[900px] px-2">
          {nodes.map((node, index) => {
            const isCompleted = node.status === 'completed';
            const isCurrent = node.status === 'current';
            const isUnlocked = node.status === 'unlocked';
            const isLocked = node.status === 'locked';

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <motion.div
                  whileHover={!isLocked ? { y: -4, scale: 1.02 } : {}}
                  onClick={() => {
                    if (!isLocked && node.path) navigate(node.path);
                  }}
                  className={`
                    relative flex-1 p-4 rounded-2xl border transition-all duration-200 select-none
                    ${isLocked ? 'bg-midnight/40 border-mountainside/50 cursor-not-allowed opacity-60' : 'cursor-pointer'}
                    ${isCompleted ? 'bg-mountainside/60 border-apres text-arctic shadow-soft' : ''}
                    ${isCurrent ? 'bg-secondary-900 border-arctic shadow-medium ring-2 ring-arctic/20' : ''}
                    ${isUnlocked ? 'bg-mountainside/40 border-mountainside text-slopes hover:border-slopes' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-apres uppercase tracking-wider">
                      {node.category}
                    </span>
                    {isCompleted && (
                      <span className="w-5 h-5 rounded-full bg-success/20 text-success border border-success/40 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    {isCurrent && (
                      <span className="w-5 h-5 rounded-full bg-arctic text-midnight flex items-center justify-center animate-pulse">
                        <Play className="w-2.5 h-2.5 fill-midnight" />
                      </span>
                    )}
                    {isUnlocked && (
                      <span className="w-5 h-5 rounded-full bg-mountainside text-slopes flex items-center justify-center">
                        <Sparkles className="w-3 h-3" />
                      </span>
                    )}
                    {isLocked && (
                      <span className="w-5 h-5 rounded-full bg-midnight text-apres flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-arctic tracking-tight">{node.title}</h4>
                  <p className="text-[11px] font-mono text-apres mt-1">
                    {isCompleted ? 'Mastered' : isCurrent ? 'In Progress' : isUnlocked ? 'Ready' : 'Locked'}
                  </p>
                </motion.div>

                {/* Animated Connector Line */}
                {index < nodes.length - 1 && (
                  <div className="w-6 h-[2px] bg-mountainside shrink-0 relative overflow-hidden">
                    {(isCompleted || isCurrent) && (
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                        className="w-full h-full bg-arctic"
                      />
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default LearningPathRoadmap;
