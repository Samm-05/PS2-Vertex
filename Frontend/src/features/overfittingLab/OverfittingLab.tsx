import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import PageContainer from '../../components/layout/PageContainer';
import Overfitting3DScene from './components/Overfitting3DScene';
import PredictionCurveCanvas from './components/PredictionCurveCanvas';
import TrainingValidationChart from './components/TrainingValidationChart';
import BiasVarianceChart from './components/BiasVarianceChart';
import ControlPanel from './components/ControlPanel';
import MathExplanationPanel from './components/MathExplanationPanel';
import { Brain, ArrowLeft, Activity, Sliders, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';

export const OverfittingLab: React.FC = () => {
  const navigate = useNavigate();
  const { result } = useAppSelector((state) => state.overfitting);
  const headerRef = useRef<HTMLDivElement>(null);

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
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-4 px-4 space-y-4 font-sans select-none">
      {/* Header */}
      <header
        ref={headerRef}
        className="flex flex-col md:flex-row items-center justify-between gap-4 p-3.5 bg-midnight/90 backdrop-blur-md rounded-3xl border border-apres/30 shadow-2xl"
      >
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
            <span className="text-emerald-400 font-bold">{result.trainLoss.toFixed(4)}</span>
          </div>
          <div className="px-3 py-1.5 rounded-2xl bg-mountainside/50 border border-apres/30 flex items-center gap-2">
            <span className="text-apres">Val Loss:</span>
            <span className="text-amber-400 font-bold">{result.valLoss.toFixed(4)}</span>
          </div>
        </div>
      </header>

      {/* Main Body 3-Panel Layout */}
      <main className="w-full space-y-4">
        {/* Top 3D Viewport & Prediction Curve Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[480px]">
          {/* Left Column: 3D Surface */}
          <div className="lg:col-span-6 h-full min-h-[400px]">
            <Overfitting3DScene />
          </div>

          {/* Right Column: 2D Prediction Curve Plot */}
          <div className="lg:col-span-6 h-full">
            <PredictionCurveCanvas />
          </div>
        </div>

        {/* Middle Row: Control Panel & Math Formulation */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <ControlPanel />
          </div>
          <div className="lg:col-span-6">
            <MathExplanationPanel />
          </div>
        </div>

        {/* Bottom Row: Loss Trajectory & Bias-Variance Tradeoff Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6">
            <TrainingValidationChart />
          </div>
          <div className="lg:col-span-6">
            <BiasVarianceChart />
          </div>
        </div>
      </main>
    </PageContainer>
  );
};

export default OverfittingLab;
