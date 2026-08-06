import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, Target, Trophy, Bookmark, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';

export const QuickActionsGrid: React.FC = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: '3D Lab Workspaces',
      description: 'Run interactive models & adjust weights in real-time',
      icon: Brain,
      path: '/linear-regression',
      badge: 'Interactive',
    },
    {
      title: 'Practice Challenges',
      description: 'Solve hyperparameter optimization puzzles & earn XP',
      icon: Target,
      path: '/practice',
      badge: '+100 XP',
    },
    {
      title: 'Global Leaderboard',
      description: 'Compare your mastery score against top learners',
      icon: Trophy,
      path: '/leaderboard',
      badge: 'Rank #1',
    },
    {
      title: 'Saved Experiments',
      description: 'Review your saved simulation snapshots & parameter states',
      icon: Bookmark,
      path: '/profile',
      badge: '4 Saved',
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-arctic tracking-tight">Quick Actions</h3>
          <p className="text-xs font-mono text-apres">Direct Workspace Shortcuts</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(action.path)}
            className="group p-4 rounded-2xl bg-midnight/80 border border-mountainside hover:border-slopes transition-all duration-200 cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-mountainside border border-apres/40 text-arctic group-hover:border-slopes transition-colors">
                  <action.icon className="w-5 h-5 text-slopes group-hover:text-arctic transition-colors" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mountainside text-slopes">
                  {action.badge}
                </span>
              </div>
              <h4 className="text-sm font-bold text-arctic tracking-tight group-hover:text-white transition-colors">
                {action.title}
              </h4>
              <p className="text-xs text-apres mt-1 leading-relaxed">{action.description}</p>
            </div>

            <div className="mt-4 pt-2 border-t border-mountainside/50 flex items-center justify-between text-xs font-mono text-slopes group-hover:text-arctic transition-colors">
              <span>Open</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionsGrid;
