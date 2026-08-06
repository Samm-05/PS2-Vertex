import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Target,
  Sparkles,
  Plus,
  FileSpreadsheet,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setTutorialMode,
  setTutorialStepIndex,
  markTutorialCompleted,
  setDatasetPreset,
  addPoint,
} from '../linearRegressionSlice';
import { TUTORIAL_STEPS } from '../utils/tutorialData';
import { soundFx } from '../../gradientDescent/utils/soundEffects';
import { DatasetPresetType } from '../types';

export const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const lrState = useAppSelector((state) => state.linearRegression);

  const tutorialMode = lrState?.tutorialMode ?? false;
  const currentTutorialStep = lrState?.currentTutorialStep ?? 0;
  const completedTutorialSteps = lrState?.completedTutorialSteps ?? [];
  const params = lrState?.params;
  const points = lrState?.points ?? [];

  const [newX, setNewX] = useState('2.0');
  const [newY, setNewY] = useState('3.5');

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

  const handleAddCustomPoint = (e: React.FormEvent) => {
    e.preventDefault();
    const x = parseFloat(newX);
    const y = parseFloat(newY);
    if (!isNaN(x) && !isNaN(y)) {
      dispatch(addPoint({ x, y }));
      setNewX('');
      setNewY('');
      soundFx.playStepSound();
    }
  };

  return (
    <div className="space-y-5">
      {/* Mode Selector Toggle: Free Lab Mode vs 15-Step Guided Tutorial */}
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
          15-Step Tutorial
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
              Lesson {currentTutorialStep + 1} / {TUTORIAL_STEPS.length}
            </span>
            {isCompleted && (
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                <CheckCircle className="w-3.5 h-3.5" />
                Completed
              </span>
            )}
          </div>

          <div>
            <h3 className="text-base font-bold text-arctic tracking-tight">{activeTutorial.title}</h3>
            <p className="text-xs text-slopes font-medium mt-0.5">{activeTutorial.subtitle}</p>
          </div>

          <div className="bg-mountainside/50 border border-apres/30 p-3 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-arctic">
              <Target className="w-4 h-4 text-cyan-400 shrink-0" />
              Objective
            </div>
            <p className="text-xs text-slopes leading-relaxed">{activeTutorial.objective}</p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-arctic">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
              Educational Concept
            </div>
            <p className="text-xs text-slopes leading-relaxed">{activeTutorial.concept}</p>
          </div>

          <div className="bg-cyan-950/30 border border-cyan-500/20 p-3 rounded-xl text-xs text-cyan-300 flex items-start gap-2">
            <HelpCircle className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <div>
              <span className="font-semibold text-cyan-200">Interactive Hint: </span>
              {activeTutorial.hint}
            </div>
          </div>

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
              Next Lesson
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ) : (
        /* Free Lab Mode: Dataset Generator & Custom Point Editor */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-midnight border border-mountainside rounded-2xl p-5 shadow-hard space-y-4"
        >
          <div className="flex items-center justify-between border-b border-mountainside pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-arctic">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              Dataset Generator & Point Editor
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">{points.length} Points</span>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-arctic">Synthetic Dataset Presets</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(
                [
                  { id: 'positive', label: 'Positive Trend' },
                  { id: 'negative', label: 'Negative Trend' },
                  { id: 'noisy', label: 'High Noise' },
                  { id: 'perfect-line', label: 'Perfect Line' },
                  { id: 'random', label: 'Random Scatter' },
                ] as { id: DatasetPresetType; label: string }[]
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => dispatch(setDatasetPreset(p.id))}
                  className={`py-1.5 px-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    params.preset === p.id
                      ? 'bg-mountainside text-arctic border-cyan-400/80 font-bold'
                      : 'bg-mountainside/40 text-slopes border-transparent hover:bg-mountainside/80'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Add Custom Point Form */}
          <form onSubmit={handleAddCustomPoint} className="space-y-2 pt-2 border-t border-mountainside">
            <label className="text-xs font-semibold text-arctic">Add Custom Point (x, y)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="X"
                value={newX}
                onChange={(e) => setNewX(e.target.value)}
                className="w-full bg-mountainside border border-apres/40 text-arctic text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Y"
                value={newY}
                onChange={(e) => setNewY(e.target.value)}
                className="w-full bg-mountainside border border-apres/40 text-arctic text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-cyan-500 text-midnight font-bold hover:bg-cyan-400 transition-colors"
                title="Add point"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </div>
  );
};
