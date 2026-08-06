import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import { Info, HelpCircle, ArrowRightCircle } from 'lucide-react';

export const ExplanationPanel: React.FC = () => {
  const gdState = useAppSelector((state) => state.gradientDescent);
  const steps = gdState?.steps ?? [];
  const currentStepIndex = gdState?.currentStepIndex ?? 0;

  const currentStep = steps[currentStepIndex] || steps[0] || {
    explanation: {
      what: 'Optimization step initialized.',
      why: 'Starting point placed on the loss landscape.',
      next: 'Calculating first gradient step downhill.',
    },
  };

  const { what, why, next } = currentStep.explanation;

  return (
    <div className="bg-midnight border border-mountainside rounded-3xl p-5 shadow-hard space-y-4">
      <div className="flex items-center gap-2 border-b border-mountainside pb-2 text-sm font-bold text-arctic">
        <Info className="w-4 h-4 text-cyan-400" />
        Step-by-Step Educational Explanation & Optimization Intuition
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* What Happened */}
        <div className="bg-mountainside/30 border border-cyan-500/20 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <Info className="w-4 h-4 shrink-0" />
            1. What Happened
          </div>
          <p className="text-xs text-arctic leading-relaxed">{what}</p>
        </div>

        {/* Why It Happened */}
        <div className="bg-mountainside/30 border border-amber-500/20 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
            <HelpCircle className="w-4 h-4 shrink-0" />
            2. Why It Happened
          </div>
          <p className="text-xs text-arctic leading-relaxed">{why}</p>
        </div>

        {/* What Will Happen Next */}
        <div className="bg-mountainside/30 border border-emerald-500/20 p-4 rounded-2xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <ArrowRightCircle className="w-4 h-4 shrink-0" />
            3. What Will Happen Next
          </div>
          <p className="text-xs text-arctic leading-relaxed">{next}</p>
        </div>
      </div>
    </div>
  );
};
