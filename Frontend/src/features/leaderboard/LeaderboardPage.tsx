import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  TrendingUp,
  Users,
  Calendar,
  Filter,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchGlobalLeaderboard,
  fetchWeeklyLeaderboard,
  fetchAlgorithmLeaderboard,
} from './leaderboardSlice';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import LeaderboardTable from './LeaderboardTable';

const LeaderboardPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { global, weekly, byAlgorithm, userRank, loading } = useAppSelector((state) => state.leaderboard);
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState<'global' | 'weekly' | 'algorithms'>('global');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('linear-regression');

  useEffect(() => {
    dispatch(fetchGlobalLeaderboard());
    dispatch(fetchWeeklyLeaderboard());
  }, [dispatch]);

  useEffect(() => {
    if (activeTab === 'algorithms') {
      dispatch(fetchAlgorithmLeaderboard(selectedAlgorithm));
    }
  }, [activeTab, selectedAlgorithm, dispatch]);

  const algorithms = [
    { value: 'linear-regression', label: 'Linear Regression' },
    { value: 'kmeans', label: 'K-Means' },
    { value: 'decision-tree', label: 'Decision Tree' },
    { value: 'neural-network', label: 'Neural Network' },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">
          Leaderboard
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Compete with other learners and climb the ranks
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                  Global Rank
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                  #{userRank.global}
                </p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-xl">
                <Trophy className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                  Weekly Rank
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                  #{userRank.weekly}
                </p>
              </div>
              <div className="p-3 bg-accent-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-accent-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-1">
                  Total Learners
                </p>
                <p className="text-3xl font-bold text-secondary-900 dark:text-white">
                  {global.length}+
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl">
                <Users className="w-6 h-6 text-warning" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Card className="p-6 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('global')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'global'
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            <Trophy className="w-5 h-5 inline-block mr-2" />
            Global Rankings
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'weekly'
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            <Calendar className="w-5 h-5 inline-block mr-2" />
            This Week
          </button>
          <button
            onClick={() => setActiveTab('algorithms')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              activeTab === 'algorithms'
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
            }`}
          >
            <Award className="w-5 h-5 inline-block mr-2" />
            By Algorithm
          </button>
        </div>
      </Card>

      {/* Algorithm Filter (for algorithms tab) */}
      {activeTab === 'algorithms' && (
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-secondary-400" />
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="flex-1 px-4 py-2 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {algorithms.map((algo) => (
                <option key={algo.value} value={algo.value}>
                  {algo.label}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* Leaderboard Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <LeaderboardTable
          entries={
            activeTab === 'global'
              ? global
              : activeTab === 'weekly'
              ? weekly
              : (selectedAlgorithm && byAlgorithm[selectedAlgorithm]) || []
          }
          currentUserId={user?.id}
        />
      )}
    </PageContainer>
  );
};

export default LeaderboardPage;
