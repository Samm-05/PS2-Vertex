import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, CheckCircle, ChevronRight, HelpCircle, Lightbulb, Target, Sparkles } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setTutorialMode, setTutorialStepIndex, markTutorialCompleted } from '../gradientDescentSlice';
import { TUTORIAL_STEPS } from '../utils/tutorialData';
import { soundFx } from '../utils/soundEffects';

export const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const gdState = useAppSelector((state) => state.gradientDescent);
  const tutorialMode = gdState?.tutorialMode ?? false;
  const currentTutorialStep = gdState?.currentTutorialStep ?? 0;
  const completedTutorialSteps = gdState?.completedTutorialSteps ?? [];
  const params = gdState?.params;
  const steps = gdState?.steps ?? [];
  const currentStepIndex = gdState?.currentStepIndex ?? 0;

  if (!params) return null;

  const activeTutorial = TUTORIAL_STEPS[currentTutorialStep] || TUTORIAL_STEPS[0];
  const isCompleted = completedTutorialSteps.includes(currentTutorialStep);

  const handleNextTutorialStep = () => {
    if (currentTutorialStep < TUTORIAL_STEPS.length - 1) {
      dispatch(markTutorialCompleted(currentTutorialStep));
      dispatch(setTutorialStepIndex(currentTutorialStep + 1));
      soundFx.playConvergenceChime();
    }
  };

  const handlePrevTutorialStep = () => {
    if (currentTutorialStep > 0) {
      dispatch(setTutorialStepIndex(currentTutorialStep - 1));
    }
  };

  // Automated check if current user action meets tutorial objective
  const checkVerification = () => {
    if (activeTutorial.verification(params, steps, currentStepIndex)) {
      if (!isCompleted) {
        dispatch(markTutorialCompleted(currentTutorialStep));
        soundFx.playConvergenceChime();
      }
      return true;
    }
    return false;
  };

  const isVerified = checkVerification();

  return (
    <div className="space-y-5">
      {/* Mode Selector Toggle: Explore vs Guided Tutorial */}
      <div className="bg-midnight border border-mountainside p-1.5 rounded-2xl flex items-center gap-1 shadow-soft">
        <button
          type="button"
          onClick={() => dispatch(setTutorialMode(false))}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            !tutorialMode
              ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
              : 'text-slopes hover:text-arctic hover:bg-mountainside/40'
          }`}
        >
          <BookOpen className="w-4 h-4 text-cyan-400" />
          Free Lab Mode
        </button>

        <button
          type="button"
          onClick={() => dispatch(setTutorialMode(true))}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            tutorialMode
              ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
              : 'text-slopes hover:text-arctic hover:bg-mountainside/40'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          10-Step Guided Tutorial
        </button>
      </div>

      {/* Guided Tutorial Mode Card */}
      {tutorialMode ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-midnight border border-mountainside/80 rounded-2xl p-5 shadow-hard space-y-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              Tutorial Step {currentTutorialStep + 1} / {TUTORIAL_STEPS.length}
            </span>
            {isVerified && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                Verified!
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-arctic tracking-tight">{activeTutorial.title}</h3>
            <p className="text-xs text-slopes font-medium mt-0.5">{activeTutorial.subtitle}</p>
          </div>

          {/* Objective */}
          <div className="bg-mountainside/50 border border-apres/30 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-arctic">
              <Target className="w-4 h-4 text-cyan-400 shrink-0" />
              Objective
            </div>
            <p className="text-xs text-slopes leading-relaxed">{activeTutorial.objective}</p>
          </div>

          {/* Concept Explanation */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-arctic">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              Educational Intuition
            </div>
            <p className="text-xs text-slopes leading-relaxed">{activeTutorial.concept}</p>
          </div>

          {/* Hint */}
          <div className="bg-cyan-950/30 border border-cyan-500/20 p-3 rounded-xl text-xs text-cyan-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-200">Interactive Hint: </span>
              {activeTutorial.hint}
            </div>
          </div>

          {/* Step Navigation Controls */}
          <div className="pt-2 flex items-center justify-between border-t border-mountainside/80">
            <button
              type="button"
              onClick={handlePrevTutorialStep}
              disabled={currentTutorialStep === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slopes hover:text-arctic hover:bg-mountainside/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>

            <button
              type="button"
              onClick={handleNextTutorialStep}
              disabled={currentTutorialStep >= TUTORIAL_STEPS.length - 1}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-arctic text-midnight hover:bg-slopes transition-all shadow-soft flex items-center gap-1 disabled:opacity-50"
            >
              Next Step
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* Free Exploration Mode Cards */
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Concept & Intuition Card */}
            <div className="bg-midnight border border-mountainside rounded-2xl p-5 shadow-hard space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-arctic border-b border-mountainside pb-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                Optimization Concept
              </div>
              <p className="text-xs text-slopes leading-relaxed">
                Gradient Descent is an iterative first-order optimization algorithm used to minimize a loss function $J(\theta)$.
                By calculating the partial derivatives $\nabla J(\theta)$, the algorithm moves model weights in the steepest downhill direction until reaching a minimum.
              </p>
            </div>

            {/* Learning Objectives Card */}
            <div className="bg-midnight border border-mountainside rounded-2xl p-5 shadow-hard space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-arctic border-b border-mountainside pb-2">
                <Target className="w-4 h-4 text-emerald-400" />
                Learning Objectives
              </div>
              <ul className="space-y-2 text-xs text-slopes">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0"></span>
                  Visualize how learning rate $\alpha$ governs step magnitude and convergence stability.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
                  Understand why steep valley walls cause path oscillations and overshooting.
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                  Discover how Momentum ($\beta$) accelerates through flat zero-gradient saddle points.
                </li>
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};
