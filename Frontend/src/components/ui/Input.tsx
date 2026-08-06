import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-xs font-medium text-slopes uppercase tracking-wider mb-1.5">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apres">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 rounded-xl
              bg-mountainside/50
              border border-mountainside
              text-arctic
              placeholder-apres
              focus:outline-none focus:border-slopes focus:ring-1 focus:ring-slopes/50
              transition-all duration-200 text-sm
              ${icon ? 'pl-10' : ''}
              ${error ? 'border-error focus:ring-error/50' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-error font-mono">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;