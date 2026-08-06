import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useAppSelector } from '../../../app/hooks';
import { Sigma } from 'lucide-react';

export const MathFormulaPanel: React.FC = () => {
  const lrState = useAppSelector((state) => state.linearRegression);

  const params = lrState?.params;
  const steps = lrState?.steps ?? [];
  const currentStepIndex = lrState?.currentStepIndex ?? 0;

  const currentStep = steps[currentStepIndex] || steps[0] || {
    w: 0,
    b: 0,
    mseLoss: 0,
    gradW: 0,
    gradB: 0,
  };

  const predFormulaRef = useRef<HTMLDivElement>(null);
  const mseFormulaRef = useRef<HTMLDivElement>(null);
  const gradFormulaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Prediction Equation ŷ = wx + b with current parameters
    const predTex = `\\hat{y} = (${currentStep.w.toFixed(2)}) \\cdot x + (${currentStep.b.toFixed(2)})`;
    if (predFormulaRef.current) {
      katex.render(predTex, predFormulaRef.current, { throwOnError: false, displayMode: true });
    }

    // 2. Mean Squared Error (MSE) Cost Function
    const mseTex = `J(w, b) = \\frac{1}{2n} \\sum_{i=1}^n (\\hat{y}_i - y_i)^2 = ${currentStep.mseLoss.toFixed(4)}`;
    if (mseFormulaRef.current) {
      katex.render(mseTex, mseFormulaRef.current, { throwOnError: false, displayMode: true });
    }

    // 3. Gradient Updates
    const gradTex = `\\begin{bmatrix} \\frac{\\partial J}{\\partial w} \\\\ \\frac{\\partial J}{\\partial b} \\end{bmatrix} = \\begin{bmatrix} ${currentStep.gradW.toFixed(
      3
    )} \\\\ ${currentStep.gradB.toFixed(3)} \\end{bmatrix}, \\quad \\begin{bmatrix} w^{(t+1)} \\\\ b^{(t+1)} \\end{bmatrix} = \\begin{bmatrix} ${currentStep.w.toFixed(
      3
    )} \\\\ ${currentStep.b.toFixed(3)} \\end{bmatrix} - ${params?.learningRate} \\cdot \\begin{bmatrix} ${currentStep.gradW.toFixed(
      3
    )} \\\\ ${currentStep.gradB.toFixed(3)} \\end{bmatrix}`;

    if (gradFormulaRef.current) {
      katex.render(gradTex, gradFormulaRef.current, { throwOnError: false, displayMode: true });
    }
  }, [currentStep, params?.learningRate]);

  if (!params) return null;

  return (
    <div className="bg-midnight border border-mountainside rounded-3xl p-5 shadow-hard space-y-4">
      <div className="flex items-center gap-2 border-b border-mountainside pb-2 text-sm font-bold text-arctic">
        <Sigma className="w-4 h-4 text-cyan-400" />
        Mathematical Formulation & Real-Time Substitutions
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prediction Equation */}
        <div className="bg-mountainside/40 border border-apres/30 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider">
            1. Model Prediction Line
          </div>
          <div ref={predFormulaRef} className="py-2 overflow-x-auto text-arctic" />
          <p className="text-[10px] text-apres italic">Calculates estimated ŷ for every x</p>
        </div>

        {/* MSE Loss Formula */}
        <div className="bg-mountainside/40 border border-apres/30 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">
            2. Mean Squared Error (L2 Loss)
          </div>
          <div ref={mseFormulaRef} className="py-2 overflow-x-auto text-arctic" />
          <p className="text-[10px] text-apres italic">Averages squared residuals across dataset</p>
        </div>

        {/* Gradient Update Substitutions */}
        <div className="bg-mountainside/40 border border-apres/30 p-4 rounded-2xl space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">
              3. Live Gradient Updates
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          </div>
          <div ref={gradFormulaRef} className="py-2 overflow-x-auto text-arctic" />
          <p className="text-[10px] text-apres italic">Updates slope w and bias b every epoch</p>
        </div>
      </div>
    </div>
  );
};
