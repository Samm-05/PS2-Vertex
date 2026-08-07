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

interface LearningPathRoadmapProps {
  completedModules?: string[];
}

const curriculumModules = [
  { id: 'intro-ml', title: 'Intro to ML', category: 'Fundamentals', path: '/coach/module/intro-ml' },
  { id: 'linear-regression', title: 'Linear Regression', category: 'Supervised', path: '/coach/module/linear-regression' },
  { id: 'gradient-descent', title: 'Gradient Descent', category: 'Optimization', path: '/coach/module/gradient-descent' },
  { id: 'neural-network', title: 'Neural Networks', category: 'Deep Learning', path: '/coach/module/neural-network' },
  { id: 'logistic-regression', title: 'Logistic Regression', category: 'Classification', path: '/coach/module/logistic-regression' },
  { id: 'clustering', title: 'Clustering', category: 'Unsupervised', path: '/coach/module/clustering' },
  { id: 'practice', title: 'Practice Quizzes', category: 'Mastery', path: '/practice' },
];

export const LearningPathRoadmap: React.FC<LearningPathRoadmapProps> = ({ completedModules = [] }) => {
  const navigate = useNavigate();

  // Find index of first uncompleted module
  const firstUncompletedIndex = curriculumModules.findIndex((m) => !completedModules.includes(m.id));

  const nodes: PathNode[] = curriculumModules.map((module, idx) => {
    const isCompleted = completedModules.includes(module.id);
    let status: 'completed' | 'current' | 'unlocked' | 'locked' = 'unlocked';

    if (isCompleted) {
      status = 'completed';
    } else if (idx === firstUncompletedIndex || (firstUncompletedIndex === -1 && idx === curriculumModules.length - 1)) {
      status = 'current';
    } else {
      status = 'unlocked';
    }

    return {
      ...module,
      status,
    };
  });

  const completedCount = completedModules.length;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-arctic tracking-tight">Interactive Learning Path</h3>
          <p className="text-xs font-mono text-apres">Sequential Mastery Curriculum</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-mountainside text-cyan-400 border border-apres/40 font-semibold">
          {completedCount} / 6 Modules Completed
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
                    ${isCompleted ? 'bg-emerald-950/40 border-emerald-500/50 text-arctic shadow-soft' : ''}
                    ${isCurrent ? 'bg-secondary-900 border-cyan-400 shadow-medium ring-2 ring-cyan-400/30' : ''}
                    ${isUnlocked ? 'bg-mountainside/40 border-mountainside text-slopes hover:border-slopes' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-apres uppercase tracking-wider">
                      {node.category}
                    </span>
                    {isCompleted && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                    {isCurrent && (
                      <span className="w-5 h-5 rounded-full bg-cyan-400 text-midnight flex items-center justify-center animate-pulse">
                        <Play className="w-2.5 h-2.5 fill-midnight" />
                      </span>
                    )}
                    {isUnlocked && (
                      <span className="w-5 h-5 rounded-full bg-mountainside text-slopes flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
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
                    {isCompleted ? 'Mastered' : isCurrent ? 'Active Now' : isUnlocked ? 'Ready' : 'Locked'}
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
                        className="w-full h-full bg-cyan-400"
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