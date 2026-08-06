import React from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Star,
  ChevronRight,
  CheckCircle2,
  Lock,
  Brain,
  Layers,
  GitBranch,
  Network,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ChallengeCardProps {
  challenge: {
    id: string;
    title: string;
    description: string;
    algorithm: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    points: number;
    timeEstimate: number;
    completed: boolean;
    completedAt?: string;
    score?: number;
  };
  onStart: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onStart }) => {
  const getAlgorithmIcon = () => {
    switch (challenge.algorithm) {
      case 'linear-regression':
        return Brain;
      case 'kmeans':
        return Layers;
      case 'decision-tree':
        return GitBranch;
      case 'neural-network':
        return Network;
      default:
        return Brain;
    }
  };

  const getDifficultyColor = () => {
    switch (challenge.difficulty) {
      case 'beginner':
        return 'bg-accent-500';
      case 'intermediate':
        return 'bg-warning';
      case 'advanced':
        return 'bg-error';
      default:
        return 'bg-secondary-500';
    }
  };

  const getDifficultyLabel = () => {
    switch (challenge.difficulty) {
      case 'beginner':
        return 'Beginner';
      case 'intermediate':
        return 'Intermediate';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Unknown';
    }
  };

  const Icon = getAlgorithmIcon();

  return (
    <Card className="p-6 hover:shadow-medium transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 bg-opacity-10`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs text-white rounded-full ${getDifficultyColor()}`}>
            {getDifficultyLabel()}
          </span>
          {challenge.completed && (
            <span className="px-2 py-1 text-xs bg-accent-500 text-white rounded-full flex items-center">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completed
            </span>
          )}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-secondary-900 dark:text-white mb-2">
        {challenge.title}
      </h3>
      <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-4">
        {challenge.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              {challenge.points} pts
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-secondary-400" />
            <span className="text-sm text-secondary-600 dark:text-secondary-400">
              {challenge.timeEstimate} min
            </span>
          </div>
        </div>
      </div>

      {challenge.completed && challenge.score && (
        <div className="mb-4 p-3 bg-accent-50 dark:bg-accent-900/20 rounded-lg">
          <p className="text-sm text-accent-600 dark:text-accent-400">
            Your score: {challenge.score}%
          </p>
        </div>
      )}

      <Button
        variant={challenge.completed ? 'outline' : 'primary'}
        fullWidth
        onClick={onStart}
        icon={<ChevronRight className="w-4 h-4" />}
        iconPosition="right"
      >
        {challenge.completed ? 'Practice Again' : 'Start Challenge'}
      </Button>
    </Card>
  );
};

export default ChallengeCard;