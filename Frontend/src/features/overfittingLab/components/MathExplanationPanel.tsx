import React, { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import { BookOpen, Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';

export const MathExplanationPanel: React.FC = () => {
  const { config, result } = useAppSelector((state) => state.overfitting);

  const polyRef = useRef<HTMLDivElement>(null);
  const lossRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (polyRef.current) {
      katex.render(
        `f(x) = \\sum_{k=0}^{${config.degree}} w_k x^k`,
        polyRef.current,
        { throwOnError: false }
      );
    }
    if (lossRef.current) {
      katex.render(
        `L(w) = \\frac{1}{N} \\sum_{i=1}^{N} (y_i - f(x_i))^2 + ${config.lambda.toFixed(3)} \\sum_{k=1}^{${config.degree}} w_k^2`,
        lossRef.current,
        { throwOnError: false }
      );
    }
  }, [config.degree, config.lambda]);

  const regimeInfo = {
    underfitting: {
      title: 'High Bias (Underfitting)',
      badge: 'bg-blue-950 text-blue-400 border-blue-500/40',
      icon: AlertTriangle,
      text: 'The model is too simple (low complexity degree d) to capture the underlying non-linear pattern. Both training error and validation error are high.',
      remedy: 'Increase polynomial degree d or add polynomial features.',
    },
    good_fit: {
      title: 'Optimal Balance (Good Fit)',
      badge: 'bg-emerald-950 text-emerald-400 border-emerald-500/40',
      icon: CheckCircle2,
      text: 'The model hits the sweet spot of the Bias-Variance tradeoff. Training loss and validation loss are both minimized without overfitting noise.',
      remedy: 'Model is well-tuned. Keep regularization λ and complexity balanced.',
    },
    overfitting: {
      title: 'High Variance (Overfitting)',
      badge: 'bg-rose-950 text-rose-400 border-rose-500/40',
      icon: AlertTriangle,
      text: 'The model is overly complex (high degree d, low regularization λ). It memorizes random noise in the training set, causing validation error to explode.',
      remedy: 'Increase L2 regularization λ or increase dataset size N.',
    },
  }[result.regime];

  const Icon = regimeInfo.icon;

  return (
    <Card className="p-5 space-y-4 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <BookOpen className="w-4 h-4 text-slopes" />
          </div>
          <h3 className="text-sm font-bold text-arctic tracking-tight">Mathematical Formulation & Guidance</h3>
        </div>
        <span className={`text-xs font-mono px-3 py-1 rounded-full border font-bold ${regimeInfo.badge}`}>
          {regimeInfo.title}
        </span>
      </div>

      {/* KaTeX Equations Grid */}
      <div className="grid sm:grid-cols-2 gap-3 p-3 rounded-2xl bg-midnight border border-mountainside font-mono text-xs text-arctic">
        <div className="space-y-1">
          <span className="text-[10px] text-apres">Polynomial Model:</span>
          <div ref={polyRef} className="text-sm text-cyan-400" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-apres">L2 Ridge Loss Function:</span>
          <div ref={lossRef} className="text-sm text-emerald-400" />
        </div>
      </div>

      {/* Dynamic Regime Explanation */}
      <div className="p-3.5 rounded-xl bg-midnight/80 border border-mountainside text-xs font-mono text-slopes space-y-1.5">
        <div className="flex items-center gap-1.5 font-bold text-arctic">
          <Icon className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{regimeInfo.title}</span>
        </div>
        <p className="text-[11px] text-apres leading-relaxed">{regimeInfo.text}</p>
        <div className="pt-1.5 border-t border-mountainside/50 flex items-center gap-1.5 text-[11px] text-arctic font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Recommended Fix: {regimeInfo.remedy}</span>
        </div>
      </div>
    </Card>
  );
};

export default MathExplanationPanel;
