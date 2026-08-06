import React from 'react';
import { motion } from 'framer-motion';
import { Medal, Award, TrendingUp, Star } from 'lucide-react';
import Card from '../../components/ui/Card';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  algorithmsCompleted: number;
  streak: number;
  badges: string[];
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({ entries, currentUserId }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Medal className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-secondary-500 font-medium">#{rank}</span>;
    }
  };

  const getRankBackground = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 2:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800';
      case 3:
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      default:
        return '';
    }
  };

  if (!entries || entries.length === 0) {
    return (
      <Card className="p-12 text-center">
        <TrendingUp className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
          No rankings yet
        </h3>
        <p className="text-secondary-500 dark:text-secondary-400">
          Complete challenges to appear on the leaderboard
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-secondary-50 dark:bg-secondary-800/50">
              <th className="px-6 py-4 text-left text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Rank
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Learner
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Points
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Algorithms
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Streak
              </th>
              <th className="px-6 py-4 text-center text-sm font-medium text-secondary-500 dark:text-secondary-400">
                Badges
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-secondary-200 dark:divide-secondary-700">
            {entries.map((entry, index) => (
              <motion.tr
                key={entry.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors
                  ${entry.userId === currentUserId ? 'bg-primary-50 dark:bg-primary-900/20' : ''}
                  ${getRankBackground(entry.rank)}
                `}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    {getRankIcon(entry.rank)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    {entry.avatar ? (
                      <img
                        src={entry.avatar}
                        alt={entry.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {entry.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-secondary-900 dark:text-white">
                        {entry.name}
                        {entry.userId === currentUserId && (
                          <span className="ml-2 text-xs text-primary-600">(You)</span>
                        )}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="font-bold text-secondary-900 dark:text-white">
                    {entry.points.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-secondary-600 dark:text-secondary-400">
                    {entry.algorithmsCompleted}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-accent-500" />
                    <span className="text-secondary-600 dark:text-secondary-400">
                      {entry.streak}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-1">
                    {entry.badges.slice(0, 3).map((badge, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-accent-100 dark:bg-accent-900/20 flex items-center justify-center"
                        title={badge}
                      >
                        <Award className="w-4 h-4 text-accent-600" />
                      </div>
                    ))}
                    {entry.badges.length > 3 && (
                      <span className="text-xs text-secondary-500">
                        +{entry.badges.length - 3}
                      </span>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LeaderboardTable;