import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import Card from '../../components/ui/Card';

interface ProgressAnalyticsProps {
  stats?: {
    totalPoints: number;
    completedAlgorithms: number;
    totalPracticeTime: number;
    averageScore: number;
    rank: number;
    streak: number;
  } | null;
}

export const ProgressAnalytics: React.FC<ProgressAnalyticsProps> = ({ stats }) => {
  const safeStats = stats || {
    totalPoints: 450,
    completedAlgorithms: 3,
    totalPracticeTime: 180,
    averageScore: 88,
    rank: 1,
    streak: 5,
  };

  const skills = [
    { name: 'Supervised Learning', level: 85, color: 'bg-arctic' },
    { name: 'Unsupervised Clustering', level: 62, color: 'bg-slopes' },
    { name: 'Model Optimization', level: 78, color: 'bg-arctic' },
    { name: 'Neural Architectures', level: 35, color: 'bg-apres' },
  ];

  // 14-Day Activity Heatmap Data
  const heatmap = [
    { day: 'M', active: true, count: 4 },
    { day: 'T', active: true, count: 6 },
    { day: 'W', active: true, count: 2 },
    { day: 'T', active: true, count: 8 },
    { day: 'F', active: true, count: 5 },
    { day: 'S', active: false, count: 0 },
    { day: 'S', active: true, count: 3 },
    { day: 'M', active: true, count: 7 },
    { day: 'T', active: true, count: 4 },
    { day: 'W', active: true, count: 9 },
    { day: 'T', active: true, count: 6 },
    { day: 'F', active: true, count: 5 },
    { day: 'S', active: true, count: 2 },
    { day: 'Today', active: true, count: 4 },
  ];

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-arctic tracking-tight">Learning Progress Analytics</h3>
          <p className="text-xs font-mono text-apres">Skill Mastery & Active Habits</p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded-full bg-mountainside text-arctic border border-apres/40">
          Rank #{safeStats.rank} Global
        </span>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Left Side: Skill Radar Proficiency Bars */}
        <div className="md:col-span-7 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-widest text-slopes">Skill Proficiency Breakdown</h4>
          <div className="space-y-3">
            {skills.map((skill, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-arctic font-medium">{skill.name}</span>
                  <span className="text-slopes font-bold">{skill.level}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-midnight border border-mountainside overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ delay: index * 0.1, duration: 0.8, ease: 'easeOut' }}
                    className={`h-full ${skill.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Learning Activity Heatmap Grid */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono uppercase tracking-widest text-slopes flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              14-Day Activity Heatmap
            </h4>
            <span className="text-[10px] font-mono text-apres">{safeStats.streak} Day Streak</span>
          </div>

          <div className="grid grid-cols-7 gap-2 p-3 rounded-2xl bg-midnight/80 border border-mountainside">
            {heatmap.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-lg border transition-all flex items-center justify-center text-[10px] font-mono
                    ${item.active ? 'bg-mountainside border-apres/60 text-arctic shadow-soft' : 'bg-midnight border-mountainside/40 text-apres'}
                  `}
                >
                  {item.count > 0 ? item.count : ''}
                </div>
                <span className="text-[9px] font-mono text-apres">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressAnalytics;
