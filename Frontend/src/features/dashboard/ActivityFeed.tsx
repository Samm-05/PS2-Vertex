import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  Brain,
  Trophy,
  Target,
  Award,
  Star,
  TrendingUp,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'practice' | 'simulation' | 'challenge' | 'badge';
  title: string;
  description: string;
  timestamp: string;
  score?: number;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'practice':
        return Brain;
      case 'simulation':
        return TrendingUp;
      case 'challenge':
        return Target;
      case 'badge':
        return Award;
      default:
        return Star;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="w-10 h-10 text-apres mx-auto mb-2" />
        <p className="text-sm font-medium text-slopes">No recent activity logged</p>
        <p className="text-xs text-apres mt-0.5">Start practicing to track your timeline</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = getActivityIcon(activity.type);

        return (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06 }}
            className="flex items-start gap-3 p-3 rounded-xl bg-midnight/60 border border-mountainside/60 hover:border-apres transition-all duration-200"
          >
            <div className="p-2 rounded-lg bg-mountainside border border-apres/40 text-arctic shrink-0">
              <Icon className="w-4 h-4 text-slopes" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-arctic tracking-tight">{activity.title}</p>
              <p className="text-[11px] text-slopes mt-0.5">{activity.description}</p>
              <p className="text-[10px] font-mono text-apres mt-1">
                {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
              </p>
            </div>
            {activity.score && (
              <span className="text-[10px] font-mono font-bold text-arctic bg-mountainside border border-apres/40 px-2 py-0.5 rounded-full shrink-0">
                +{activity.score} XP
              </span>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;
