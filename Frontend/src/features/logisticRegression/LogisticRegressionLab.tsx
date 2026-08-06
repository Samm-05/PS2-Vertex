import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  setViewMode,
  setIsPlaying,
  setCurrentEpoch,
  resetSimulation,
} from './logisticRegressionSlice';
import { ViewMode } from './types';
import LeftPanel from './components/LeftPanel';
import Center3DScene from './components/Center3DScene';
import RightPanel from './components/RightPanel';
import BottomPanel from './components/BottomPanel';
import SigmoidExplorer from './components/SigmoidExplorer';
import ComparisonView from './components/ComparisonView';
import UnderfittingOverfittingView from './components/UnderfittingOverfittingView';
import QuizPanel from './components/QuizPanel';
import PageContainer from '../../components/layout/PageContainer';
import {
  Brain,
  ArrowLeft,
  Sliders,
  Activity,
  Layers,
  HelpCircle,
  Eye,
  BookOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LogisticRegressionLab: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { viewMode, isPlaying, currentEpoch, trajectory } = useAppSelector(
    (state) => state.logisticRegression
  );

  const maxEpoch = trajectory.length > 0 ? trajectory.length - 1 : 0;

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        dispatch(setIsPlaying(!isPlaying));
      } else if (e.code === 'ArrowRight') {
        dispatch(setCurrentEpoch(Math.min(currentEpoch + 1, maxEpoch)));
      } else if (e.code === 'ArrowLeft') {
        dispatch(setCurrentEpoch(Math.max(currentEpoch - 1, 0)));
      } else if (e.code === 'KeyR') {
        dispatch(resetSimulation());
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentEpoch, maxEpoch, dispatch]);

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-4 px-4 space-y-4 font-sans">
      {/* Top Header Bar */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 bg-midnight/90 backdrop-blur-md rounded-3xl border border-apres/30 shadow-2xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-2xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-all"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              <h1 className="text-lg font-bold text-arctic tracking-tight">
                Logistic Regression Playground
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40">
                Flagship Module
              </span>
            </div>
            <p className="text-xs text-apres font-mono">
              Interactive 3D Classification & Decision Boundary Simulator
            </p>
          </div>
        </div>

        {/* View Mode Navigation Tabs */}
        <div className="flex items-center p-1 bg-mountainside/40 rounded-2xl border border-apres/30 overflow-x-auto scrollbar-hide">
          {(
            [
              ['playground', 'Playground', Sliders],
              ['sigmoid', 'Sigmoid Curve', Activity],
              ['comparison', 'Model Compare', Eye],
              ['underfitting', 'Model Fit', Layers],
              ['quiz', 'Quiz', HelpCircle],
            ] as [ViewMode, string, React.ElementType][]
          ).map(([mode, label, Icon]) => (
            <button
              key={mode}
              onClick={() => dispatch(setViewMode(mode))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all whitespace-nowrap ${
                viewMode === mode
                  ? 'bg-arctic text-midnight font-bold shadow-md'
                  : 'text-slopes hover:text-arctic'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Body */}
      <main className="w-full space-y-4">
        {viewMode === 'playground' && (
          <div className="space-y-4">
            {/* 3-Panel Main Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[580px]">
              {/* Left Panel: 3 Columns */}
              <div className="lg:col-span-3 h-full">
                <LeftPanel />
              </div>

              {/* Center Panel: 6 Columns */}
              <div className="lg:col-span-6 h-full">
                <Center3DScene />
              </div>

              {/* Right Panel: 3 Columns */}
              <div className="lg:col-span-3 h-full">
                <RightPanel />
              </div>
            </div>

            {/* Bottom Playback & Metrics Panel */}
            <BottomPanel />
          </div>
        )}

        {viewMode === 'sigmoid' && (
          <div className="max-w-3xl mx-auto py-6 space-y-4">
            <SigmoidExplorer />
          </div>
        )}

        {viewMode === 'comparison' && (
          <div className="w-full py-2">
            <ComparisonView />
          </div>
        )}

        {viewMode === 'underfitting' && (
          <div className="w-full py-2">
            <UnderfittingOverfittingView />
          </div>
        )}

        {viewMode === 'quiz' && (
          <div className="w-full py-4">
            <QuizPanel />
          </div>
        )}
      </main>
    </PageContainer>
  );
};

export default LogisticRegressionLab;
