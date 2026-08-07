import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setConfig } from './overfittingSlice';
import PageContainer from '../../components/layout/PageContainer';
import Overfitting3DScene from './components/Overfitting3DScene';
import PredictionCurveCanvas from './components/PredictionCurveCanvas';
import TrainingValidationChart from './components/TrainingValidationChart';
import BiasVarianceChart from './components/BiasVarianceChart';
import ControlPanel from './components/ControlPanel';
import MathExplanationPanel from './components/MathExplanationPanel';
import GuidedStepsPanel from './components/GuidedStepsPanel';
import RecentExperimentsPanel from '../../components/experiments/RecentExperimentsPanel';
import { SavedExperiment } from '../../services/experimentService';
import { Brain, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';

export const OverfittingLab: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { result, config } = useAppSelector((state) => state.overfitting);
  const headerRef = useRef<HTMLDivElement>(null);

  const trainLoss = typeof result?.trainLoss === 'number' && !isNaN(result.trainLoss) ? result.trainLoss : 0;
  const valLoss = typeof result?.valLoss === 'number' && !isNaN(result.valLoss)
    ? result.valLoss
    : (typeof (result as any)?.testLoss === 'number' ? (result as any).testLoss : 0);

  const handleLoadExperiment = (exp: SavedExperiment) => {
    if (exp.parameters) {
      dispatch(setConfig(exp.parameters));
    }
  };

  useEffect(() => {
    if (!headerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.lab-reveal',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      );
    }, headerRef);
    return () => ctx.revert();
  }, []);

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-4 px-4 space-y-5 font-sans select-none">
      {/* Header */}
      <header
        ref={headerRef}
        className="flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 bg-midnight/90 backdrop-blur-md rounded-3xl border border-apres/30 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2.5 rounded-2xl bg-mountainside/50 text-slopes hover:text-arctic hover:bg-mountainside border border-apres/30 transition-all cursor-pointer"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-400" />
              <h1 className="text-lg font-bold text-arctic tracking-tight">
                Overfitting vs Underfitting Laboratory
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-500/40">
                Bias-Variance Studio
              </span>
            </div>
            <p className="text-xs text-apres font-mono">
              Visualizing Polynomial Complexity, Regularization, and Model Generalization
            </p>
          </div>
        </div>

        {/* Current Metrics Header Bar */}
        <div className="lab-reveal flex items-center gap-3 font-mono text-xs">
          <div className="px-3 py-1.5 rounded-2xl bg-mountainside/50 border border-apres/30 flex items-center gap-2">
            <span className="text-apres">Train Loss:</span>
            <span className="text-emerald-400 font-bold">{trainLoss.toFixed(4)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-mountainside/50 border border-apres/30 flex items-center gap-2">
            <span className="text-apres">Val Loss:</span>
            <span className="text-amber-400 font-bold">{valLoss.toFixed(4)}</span>
          </div>
        </div>
      </header>

      {/* Main Layout Grid */}
      <main className="space-y-6">
        {/* Step-by-Step Guided Walkthrough & Verification Card */}
        <GuidedStepsPanel />

        {/* Top 3D & 2D Model Visualization Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-[500px]">
          {/* Left 3D Loss Surface Scene (7 cols) */}
          <div className="lg:col-span-7 h-full">
            <Overfitting3DScene />
          </div>

          {/* Right 2D Prediction Curve Canvas (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <PredictionCurveCanvas />
          </div>
        </div>

        {/* Middle Hyperparameter Control & Math Explanation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Hyperparameter Slider Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <ControlPanel />
          </div>

          {/* Right Math & Regime Explanation (7 cols) */}
          <div className="lg:col-span-7">
            <MathExplanationPanel />
          </div>
        </div>

        {/* Bottom Dual Graphs: Training vs Validation Curve & Bias-Variance Tradeoff */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TrainingValidationChart />
          <BiasVarianceChart />
        </div>

        {/* Recent Experiments Panel */}
        <RecentExperimentsPanel algorithm="overfitting" onLoadExperiment={handleLoadExperiment} />
      </main>
    </PageContainer>
  );
};

export default OverfittingLab;