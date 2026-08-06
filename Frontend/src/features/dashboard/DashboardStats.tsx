import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  Clock,
  Target,
  Star,
  Zap,
} from 'lucide-react';
import Card from '../../components/ui/Card';

interface DashboardStatsProps {
  stats: {
    totalPoints: number;
    completedAlgorithms: number;
    totalPracticeTime: number;
    averageScore: number;
    rank: number;
    streak: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Points',
      value: stats.totalPoints,
      icon: Star,
      tone: 'text-warning bg-warning/10',
      change: '+12%'
    },
    {
      label: 'Algorithms Mastered',
      value: stats.completedAlgorithms,
      icon: Award,
      tone: 'text-accent-600 bg-accent-500/10',
      change: '+3'
    },
    {
      label: 'Practice Time',
      value: `${Math.floor(stats.totalPracticeTime / 60)}h ${stats.totalPracticeTime % 60}m`,
      icon: Clock,
      tone: 'text-primary-600 bg-primary-500/10',
      change: '+2h'
    },
    {
      label: 'Avg. Score',
      value: `${stats.averageScore}%`,
      icon: Target,
      tone: 'text-secondary-600 bg-secondary-500/10',
      change: '+5%'
    },
    {
      label: 'Current Rank',
      value: `#${stats.rank}`,
      icon: TrendingUp,
      tone: 'text-primary-600 bg-primary-500/10',
      change: '+2'
    },
    {
      label: 'Day Streak',
      value: `${stats.streak} days`,
      icon: Zap,
      tone: 'text-orange-500 bg-orange-500/10',
      change: 'On track'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4"
    >
      {statItems.map((item, index) => (
        <motion.div key={index} variants={itemVariants}>
          <Card className="p-4 hover:shadow-medium transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg ${item.tone}`}>
                <item.icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] text-secondary-500 font-medium bg-secondary-100/70 dark:bg-secondary-700/50 px-2 py-1 rounded-full">
                {item.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-secondary-900 dark:text-white mb-1">
              {item.value}
            </p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              {item.label}
            </p>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default DashboardStats;
