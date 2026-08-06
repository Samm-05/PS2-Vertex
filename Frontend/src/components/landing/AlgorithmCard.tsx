import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AlgorithmCardProps {
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  route: string;
}

const difficultyClass: Record<AlgorithmCardProps['difficulty'], string> = {
  Beginner: 'bg-success/10 text-success',
  Intermediate: 'bg-warning/10 text-warning',
  Advanced: 'bg-error/10 text-error',
};

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ name, description, difficulty, route }) => {
  return (
    <motion.article
      whileHover={{ scale: 1.02 }}
      className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6 shadow-soft"
      data-reveal
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">{name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyClass[difficulty]}`}>{difficulty}</span>
      </div>
      <p className="mt-3 text-base text-secondary-600 dark:text-secondary-300">{description}</p>
      <Link
        to={route}
        className="inline-flex mt-5 px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold tracking-wide hover:bg-primary-700 transition-colors"
      >
        Launch Simulator
      </Link>
    </motion.article>
  );
};

export default AlgorithmCard;
