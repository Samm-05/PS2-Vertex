import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
}) => {
  return (
    <motion.div
      whileHover={hoverable ? { y: -3 } : {}}
      className={`
        bg-secondary-900/90
        rounded-2xl shadow-soft
        border border-mountainside/80
        backdrop-blur-xl
        transition-all duration-200
        ${hoverable ? 'cursor-pointer hover:border-apres hover:shadow-medium' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default Card;