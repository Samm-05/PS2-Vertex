import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useAppSelector } from '../../../app/hooks';
import { LOSS_SURFACES } from '../engine/lossFunctions';
import { Sigma } from 'lucide-react';

export const MathFormulaPanel: React.FC = () => {
  const gdState = useAppSelector((state) => state.gradientDescent);
  const params = gdState?.params;
  const steps = gdState?.steps ?? [];
  const currentStepIndex = gdState?.currentStepIndex ?? 0;

  if (!params) return null;

  const surfaceDef = LOSS_SURFACES[params.surfaceType] || LOSS_SURFACES.paraboloid;

  const currentStep = steps[currentStepIndex] || steps[0] || {
    w1: 0,
    w2: 0,
    loss: 0,
    gradW1: 0,
    gradW2: 0,
    gradNorm: 0,
    stepSize: 0,
    velocityW1: 0,
    velocityW2: 0,
  };

  const updateFormulaRef = useRef<HTMLDivElement>(null);
  const lossFormulaRef = useRef<HTMLDivElement>(null);
  const substFormulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. General Update Formula (Momentum vs Standard GD)
    const gdTex = params.momentum > 0
      ? `v^{(t+1)} = \\beta v^{(t)} + \\alpha \\nabla J(\\theta), \\quad \\theta^{(t+1)} = \\theta^{(t)} - v^{(t+1)}`
      : `\\theta_{t+1} = \\theta_t - \\alpha \\nabla J(\\theta_t)`;

    if (updateFormulaRef.current) {
      katex.render(gdTex, updateFormulaRef.current, { throwOnError: false, displayMode: true });
    }

    // 2. Selected Loss Surface Formula
    if (lossFormulaRef.current) {
      katex.render(surfaceDef.formulaTex, lossFormulaRef.current, { throwOnError: false, displayMode: true });
    }

    // 3. Dynamic Real-time Numerical Substitution for current frame
    const substTex = `\\begin{bmatrix} w_1^{(t+1)} \\\\ w_2^{(t+1)} \\end{bmatrix} = \\begin{bmatrix} ${currentStep.w1.toFixed(
      3
    )} \\\\ ${currentStep.w2.toFixed(3)} \\end{bmatrix} - ${params.learningRate} \\cdot \\begin{bmatrix} ${currentStep.gradW1.toFixed(
      3
    )} \\\\ ${currentStep.gradW2.toFixed(3)} \\end{bmatrix}`;

    if (substFormulaRef.current) {
      katex.render(substTex, substFormulaRef.current, { throwOnError: false, displayMode: true });
    }
  }, [params.momentum, params.learningRate, surfaceDef.formulaTex, currentStep]);

  return (
    <div className="bg-midnight border border-mountainside rounded-3xl p-5 shadow-hard space-y-4">
      <div className="flex items-center gap-2 border-b border-mountainside pb-2 text-sm font-bold text-arctic">
        <Sigma className="w-4 h-4 text-cyan-400" />
        Mathematical Formulation & Real-Time Substitutions
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Loss Surface Equation */}
        <div className="bg-mountainside/40 border border-apres/30 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider">
            1. Loss Function J(w₁, w₂)
          </div>
          <div ref={lossFormulaRef} className="py-2 overflow-x-auto text-arctic" />
          <p className="text-[10px] text-apres italic">{surfaceDef.name}</p>
        </div>

        {/* Weight Update Rule */}
        <div className="bg-mountainside/40 border border-apres/30 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
            2. Gradient Update Rule
          </div>
          <div ref={updateFormulaRef} className="py-2 overflow-x-auto text-arctic" />
          <p className="text-[10px] text-apres italic">
            {params.momentum > 0 ? `Heavy Ball Physics (β = ${params.momentum})` : `Standard First-Order GD (α = ${params.learningRate})`}
          </p>
        </div>

        {/* Real-time Variable Substitutions */}
        <div className="bg-mountainside/40 border border-apres/30 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">
              3. Live Iteration {currentStepIndex}
            </span>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          </div>
          <div ref={substFormulaRef} className="py-2 overflow-x-auto text-arctic" />
          <p className="text-[10px] text-apres italic">Calculated live at frame {currentStepIndex}</p>
        </div>
      </div>
    </div>
  );
};
