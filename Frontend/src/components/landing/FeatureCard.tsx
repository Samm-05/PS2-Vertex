import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="rounded-xl bg-white/95 dark:bg-secondary-800 border border-secondary-200/70 dark:border-secondary-700 p-6 shadow-soft hover:shadow-medium transition-transform"
      data-reveal
    >
      <div className="w-11 h-11 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 flex items-center justify-center mb-4">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">{title}</h3>
      <p className="mt-3 text-base text-secondary-600 dark:text-secondary-300 leading-relaxed">{description}</p>
    </motion.article>
  );
};

export default FeatureCard;
