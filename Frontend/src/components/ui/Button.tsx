import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 select-none border shadow-soft';

  const variants = {
    primary:
      'bg-arctic text-midnight border-arctic hover:bg-slopes hover:border-slopes active:bg-apres active:text-white disabled:bg-mountainside disabled:text-apres disabled:border-mountainside',
    secondary:
      'bg-mountainside text-arctic border-secondary-700 hover:bg-secondary-700 hover:border-apres active:bg-secondary-800 disabled:opacity-50',
    outline:
      'bg-transparent border-apres text-slopes hover:bg-mountainside hover:text-arctic hover:border-slopes active:bg-secondary-800',
    ghost:
      'bg-transparent border-transparent text-slopes hover:bg-mountainside/50 hover:text-arctic active:bg-mountainside',
    danger:
      'bg-error/20 text-error border-error/30 hover:bg-error/30 hover:border-error/50 active:bg-error/40',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isLoading || disabled ? 'cursor-not-allowed opacity-60' : ''}
        ${className}
      `}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {iconPosition === 'left' && icon}
          {children}
          {iconPosition === 'right' && icon}
        </>
      )}
    </motion.button>
  );
};

export default Button;