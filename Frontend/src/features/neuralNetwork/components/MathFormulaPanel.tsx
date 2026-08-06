import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import { Sigma } from 'lucide-react';

export const MathFormulaPanel: React.FC = () => {
  const { config, trajectory, currentEpoch } = useAppSelector((state) => state.neuralNetwork);
  const snapshot = trajectory[currentEpoch];

  const forwardRef = useRef<HTMLDivElement>(null);
  const backpropRef = useRef<HTMLDivElement>(null);
  const updateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Forward Propagation Equation
    const forwardTex = `z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}, \\quad a^{(l)} = ${config.activation}(z^{(l)})`;
    if (forwardRef.current) {
      katex.render(forwardTex, forwardRef.current, { throwOnError: false, displayMode: true });
    }

    // 2. Backpropagation Chain Rule Equation
    const backpropTex = `\\delta^{(l)} = \\left( \\delta^{(l+1)} (W^{(l+1)})^T \\right) \\odot f'(z^{(l)}), \\quad \\frac{\\partial L}{\\partial W^{(l)}} = \\delta^{(l)} (a^{(l-1)})^T`;
    if (backpropRef.current) {
      katex.render(backpropTex, backpropRef.current, { throwOnError: false, displayMode: true });
    }

    // 3. Weight Update Equation with current Learning Rate & Loss
    const lossVal = snapshot?.loss.toFixed(4) || '0.0000';
    const gradVal = snapshot?.gradientNorm.toFixed(3) || '0.000';
    const updateTex = `W^{(l)} \\leftarrow W^{(l)} - ${config.learningRate} \\cdot \\frac{\\partial L}{\\partial W^{(l)}}, \\quad \\text{Loss}_{BCE} = ${lossVal}, \\; ||\\nabla W|| = ${gradVal}`;
    if (updateRef.current) {
      katex.render(updateTex, updateRef.current, { throwOnError: false, displayMode: true });
    }
  }, [config, snapshot]);

  return (
    <Card className="p-4 space-y-3 bg-midnight/90 border border-apres/30">
      <div className="flex items-center gap-1.5 border-b border-apres/30 pb-2 text-xs font-bold text-arctic uppercase font-mono">
        <Sigma className="w-4 h-4 text-cyan-400" />
        Mathematical Formulation & Live Substitutions
      </div>

      <div className="space-y-3 font-mono text-xs">
        {/* Forward Propagation */}
        <div className="bg-mountainside/30 p-2.5 rounded-xl border border-apres/20 space-y-1">
          <span className="text-[10px] text-cyan-400 font-bold uppercase">1. Forward Propagation</span>
          <div ref={forwardRef} className="overflow-x-auto py-1 text-arctic" />
        </div>

        {/* Backpropagation */}
        <div className="bg-mountainside/30 p-2.5 rounded-xl border border-apres/20 space-y-1">
          <span className="text-[10px] text-amber-400 font-bold uppercase">2. Backpropagation Chain Rule</span>
          <div ref={backpropRef} className="overflow-x-auto py-1 text-arctic" />
        </div>

        {/* Gradient Update */}
        <div className="bg-mountainside/30 p-2.5 rounded-xl border border-apres/20 space-y-1">
          <span className="text-[10px] text-emerald-400 font-bold uppercase">3. Weight Update & Live Loss</span>
          <div ref={updateRef} className="overflow-x-auto py-1 text-arctic" />
        </div>
      </div>
    </Card>
  );
};

export default MathFormulaPanel;
