import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { togglePlayPause, stepForward, stepBackward, resetPlayback } from './linearRegressionSlice';
import { LeftPanel } from './components/LeftPanel';
import { Center3DScene } from './components/Center3DScene';
import { ComparisonView } from './components/ComparisonView';
import { RightPanel } from './components/RightPanel';
import { TimelineControls } from './components/TimelineControls';
import { LiveGraphsPanel } from './components/LiveGraphsPanel';
import { MathFormulaPanel } from './components/MathFormulaPanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ScrollStorytelling } from './components/ScrollStorytelling';
import { Brain } from 'lucide-react';

const LinearRegressionLab: React.FC = () => {
  const dispatch = useAppDispatch();
  const lrState = useAppSelector((state) => state.linearRegression);
  const comparisonMode = lrState?.comparisonMode ?? false;

  // Keyboard Shortcuts (Space: Play/Pause, Left/Right: Step, R: Reset)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        dispatch(togglePlayPause());
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        dispatch(stepForward());
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        dispatch(stepBackward());
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        dispatch(resetPlayback());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 max-w-[1700px] mx-auto select-none">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-mountainside pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-mountainside border border-apres/40 text-amber-400">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-arctic tracking-tight">
              Linear Regression Laboratory
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              3D Interactive Lab
            </span>
          </div>
          <p className="text-xs md:text-sm text-slopes">
            Experience how linear models fit data points in real time. Rotate slope $w$, shift bias $b$, and watch residual error lines shrink down to the line of best fit.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-apres font-mono hidden lg:block text-right">
            <div>Shortcuts: [Space] Play/Pause</div>
            <div>[Left/Right] Step | [R] Reset</div>
          </div>
        </div>
      </header>

      {/* Main Layout: Left Panel | Center (3D Scene or Dual Comparison) | Right Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Panel */}
        <div className="xl:col-span-3">
          <LeftPanel />
        </div>

        {/* Center Interactive 3D Canvas / Dual Comparison View */}
        <div className="xl:col-span-6 space-y-4">
          {comparisonMode ? <ComparisonView /> : <Center3DScene />}
        </div>

        {/* Right Panel */}
        <div className="xl:col-span-3">
          <RightPanel />
        </div>
      </div>

      {/* Bottom Timeline Controls */}
      <TimelineControls />

      {/* Synchronized Graphs Panel */}
      <LiveGraphsPanel />

      {/* KaTeX Mathematical Panel */}
      <MathFormulaPanel />

      {/* Educational Narrative Explanation Panel */}
      <ExplanationPanel />

      {/* Scroll Storytelling Deep Dive */}
      <ScrollStorytelling />
    </div>
  );
};

export default LinearRegressionLab;
