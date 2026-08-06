import React, { useEffect } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { togglePlayPause, stepForward, stepBackward, resetPlayback } from './gradientDescentSlice';
import { LeftPanel } from './components/LeftPanel';
import { Center3DScene } from './components/Center3DScene';
import { RightPanel } from './components/RightPanel';
import { TimelineControls } from './components/TimelineControls';
import { LiveGraphsPanel } from './components/LiveGraphsPanel';
import { MathFormulaPanel } from './components/MathFormulaPanel';
import { ExplanationPanel } from './components/ExplanationPanel';
import { ScrollStorytelling } from './components/ScrollStorytelling';
import { Brain, Sparkles } from 'lucide-react';

const GradientDescentLab: React.FC = () => {
  const dispatch = useAppDispatch();

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
            <div className="p-2 rounded-xl bg-mountainside border border-apres/40 text-cyan-400">
              <Brain className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-arctic tracking-tight">
              Gradient Descent Laboratory
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              3D Interactive Lab
            </span>
          </div>
          <p className="text-xs md:text-sm text-slopes">
            Step inside the 3D optimization landscape. Experience loss minimization, steepest descent vectors, momentum physics, and hyperparameter tuning in real time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-apres font-mono hidden lg:block text-right">
            <div>Shortcuts: [Space] Play/Pause</div>
            <div>[Left/Right] Step | [R] Reset</div>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout: Left (Concept & Tutorial) | Center (3D Scene) | Right (Params & Stats) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Panel */}
        <div className="xl:col-span-3">
          <LeftPanel />
        </div>

        {/* Center Interactive 3D Canvas */}
        <div className="xl:col-span-6 space-y-4">
          <Center3DScene />
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

export default GradientDescentLab;
