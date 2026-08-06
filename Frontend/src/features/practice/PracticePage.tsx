import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Clock,
  Star,
  Trophy,
  Brain,
  Filter,
  Search,
  ChevronRight,
  Award,
  TrendingUp,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchChallenges,
  fetchUserStats,
  setCurrentChallenge,
} from './practiceSlice';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import ChallengeCard from './ChallengeCard';
import Input from '../../components/ui/Input';

const PracticePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { challenges, userStats, loading } = useAppSelector((state) => state.practice);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchChallenges());
    dispatch(fetchUserStats());
  }, [dispatch]);

  const filteredChallenges = challenges.filter((challenge) => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty;
    const matchesAlgorithm = selectedAlgorithm === 'all' || challenge.algorithm === selectedAlgorithm;
    
    return matchesSearch && matchesDifficulty && matchesAlgorithm;
  });

  const difficulties = [
    { value: 'all', label: 'All Levels', color: 'bg-secondary-500' },
    { value: 'beginner', label: 'Beginner', color: 'bg-accent-500' },
    { value: 'intermediate', label: 'Intermediate', color: 'bg-warning' },
    { value: 'advanced', label: 'Advanced', color: 'bg-error' },
  ];

  const algorithms = [
    { value: 'all', label: 'All Algorithms' },
    { value: 'linear-regression', label: 'Linear Regression' },
    { value: 'kmeans', label: 'K-Means' },
    { value: 'decision-tree', label: 'Decision Tree' },
    { value: 'neural-network', label: 'Neural Network' },
  ];

  const handleStartChallenge = (challenge: any) => {
    dispatch(setCurrentChallenge(challenge));
    navigate(`/${challenge.algorithm}?challenge=${challenge.id}`);
  };

  return (
    <PageContainer>
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Total Points
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {userStats.totalPoints}
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl">
                <Star className="w-6 h-6 text-warning" />
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
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Completed
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {userStats.completedChallenges}
                </p>
              </div>
              <div className="p-3 bg-accent-500/10 rounded-xl">
                <Trophy className="w-6 h-6 text-accent-500" />
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
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Avg. Score
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {userStats.averageScore}%
                </p>
              </div>
              <div className="p-3 bg-primary-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-primary-500" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Current Streak
                </p>
                <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                  {userStats.streak} days
                </p>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-xl">
                <Award className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <Card className="p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search challenges..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-5 h-5" />}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-4 py-2 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {difficulties.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
            <select
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value)}
              className="px-4 py-2 bg-secondary-50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              {algorithms.map((a) => (
                <option key={a.value} value={a.value}>{a.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Challenges Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredChallenges.map((challenge, index) => (
            <motion.div
              key={challenge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ChallengeCard
                challenge={challenge}
                onStart={() => handleStartChallenge(challenge)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {filteredChallenges.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Target className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
            No challenges found
          </h3>
          <p className="text-secondary-500 dark:text-secondary-400">
            Try adjusting your filters or check back later for new challenges.
          </p>
        </Card>
      )}
    </PageContainer>
  );
};

export default PracticePage;