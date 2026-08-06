import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Layers, TrendingUp, GitBranch, PieChart, Activity } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface StoryStep {
  id: string;
  title: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  mathLatex: string;
  description: string;
  gradient: string;
  visualSnippet: React.FC;
}

const MathFormula: React.FC<{ latex: string }> = ({ latex }) => {
  const containerRef = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (containerRef.current) {
      katex.render(latex, containerRef.current, { throwOnError: false });
    }
  }, [latex]);
  return <span ref={containerRef} className="font-mono text-cyan-300" />;
};

const storySteps: StoryStep[] = [
  {
    id: 'gradient-descent',
    title: '1. Gradient Descent Optimization',
    subtitle: 'Navigating Loss Surfaces',
    icon: TrendingUp,
    mathLatex: 'w_{t+1} = w_t - \\alpha \\nabla J(w_t)',
    description: 'Calculates the negative gradient vector at current parameter coordinates and steps iteratively down the loss basin to find global cost minima.',
    gradient: 'from-cyan-500 to-blue-600',
    visualSnippet: () => (
      <div className="w-full h-56 rounded-2xl bg-midnight/95 p-4 border border-mountainside/80 flex flex-col justify-between items-center relative overflow-hidden shadow-inner select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
        <svg className="w-full h-36" viewBox="0 0 300 130">
          <path d="M 20 20 Q 150 130 280 20" stroke="#06B6D4" strokeWidth="3" fill="none" strokeDasharray="4 2" />
          <path d="M 30 30 Q 150 120 270 30" stroke="rgba(6, 182, 212, 0.4)" strokeWidth="1.5" fill="none" />
          <circle cx="45" cy="38" r="4" fill="#64748b" />
          <circle cx="75" cy="62" r="5" fill="#38bdf8" />
          <circle cx="115" cy="85" r="6" fill="#06B6D4" />
          <circle cx="150" cy="92" r="8" fill="#10B981" className="animate-ping opacity-75" />
          <circle cx="150" cy="92" r="7" fill="#10B981" />
          <line x1="115" y1="85" x2="145" y2="92" stroke="#10B981" strokeWidth="2.5" />
        </svg>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slopes bg-midnight/80 px-3 py-1 rounded-lg border border-mountainside">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Convergence Path: η = 0.05 • Loss J(w) → 0.001</span>
        </div>
      </div>
    ),
  },
  {
    id: 'decision-boundary',
    title: '2. Logistic Decision Boundaries',
    subtitle: 'Hyperplane Class Separation',
    icon: Activity,
    mathLatex: 'w_1 x_1 + w_2 x_2 + b = 0',
    description: 'Finds an optimal linear or non-linear hyperplane boundary that separates feature data into discrete target classification decision regions.',
    gradient: 'from-purple-500 to-indigo-600',
    visualSnippet: () => (
      <div className="w-full h-56 rounded-2xl bg-midnight/95 p-4 border border-mountainside/80 flex flex-col justify-between items-center relative overflow-hidden shadow-inner select-none">
        <svg className="w-full h-36" viewBox="0 0 300 130">
          <circle cx="50" cy="35" r="5" fill="#38bdf8" />
          <circle cx="75" cy="25" r="5" fill="#38bdf8" />
          <circle cx="95" cy="55" r="5" fill="#38bdf8" />
          <circle cx="110" cy="30" r="5" fill="#38bdf8" />
          <circle cx="170" cy="85" r="5" fill="#f43f5e" />
          <circle cx="195" cy="105" r="5" fill="#f43f5e" />
          <circle cx="225" cy="75" r="5" fill="#f43f5e" />
          <circle cx="245" cy="95" r="5" fill="#f43f5e" />
          <line x1="30" y1="110" x2="270" y2="15" stroke="#a855f7" strokeWidth="3" />
          <line x1="30" y1="110" x2="270" y2="15" stroke="#a855f7" strokeWidth="8" strokeOpacity="0.2" />
        </svg>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slopes bg-midnight/80 px-3 py-1 rounded-lg border border-mountainside">
          <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>Sigmoid Margin Confidence: P(y=1|x) = 99.4%</span>
        </div>
      </div>
    ),
  },
  {
    id: 'clusters',
    title: '3. Spatial Clustering (K-Means)',
    subtitle: 'Centroid Voronoi Tesselation',
    icon: Layers,
    mathLatex: '\\min \\sum_{k=1}^K \\sum_{x \\in S_k} ||x - \\mu_k||^2',
    description: 'Groups unlabeled data points around dynamic centroid anchors by iteratively updating mean cluster coordinates.',
    gradient: 'from-teal-400 to-emerald-600',
    visualSnippet: () => (
      <div className="w-full h-56 rounded-2xl bg-midnight/95 p-4 border border-mountainside/80 flex flex-col justify-between items-center relative overflow-hidden shadow-inner select-none">
        <svg className="w-full h-36" viewBox="0 0 300 130">
          <circle cx="85" cy="55" r="28" fill="#10b981" fillOpacity="0.12" stroke="#10b981" strokeDasharray="3 3" />
          <circle cx="85" cy="55" r="5" fill="#10b981" />
          <circle cx="65" cy="45" r="3.5" fill="#34d399" />
          <circle cx="100" cy="40" r="3.5" fill="#34d399" />
          <circle cx="95" cy="70" r="3.5" fill="#34d399" />
          <circle cx="215" cy="70" r="32" fill="#38bdf8" fillOpacity="0.12" stroke="#38bdf8" strokeDasharray="3 3" />
          <circle cx="215" cy="70" r="5" fill="#38bdf8" />
          <circle cx="195" cy="55" r="3.5" fill="#60a5fa" />
          <circle cx="235" cy="85" r="3.5" fill="#60a5fa" />
          <circle cx="220" cy="50" r="3.5" fill="#60a5fa" />
        </svg>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slopes bg-midnight/80 px-3 py-1 rounded-lg border border-mountainside">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          <span>Iterative Centroid Update: K = 2 Clusters</span>
        </div>
      </div>
    ),
  },
  {
    id: 'tree-growth',
    title: '4. Decision Tree Splitting',
    subtitle: 'Recursive Information Gain',
    icon: GitBranch,
    mathLatex: '\\text{Gain}(S, A) = H(S) - \\sum_{v \\in \\text{Values}(A)} \\frac{|S_v|}{|S|} H(S_v)',
    description: 'Recursively partitions dataset based on maximum information gain or Gini impurity reduction thresholds.',
    gradient: 'from-amber-400 to-orange-600',
    visualSnippet: () => (
      <div className="w-full h-56 rounded-2xl bg-midnight/95 p-4 border border-mountainside/80 flex flex-col justify-between items-center relative overflow-hidden shadow-inner select-none">
        <svg className="w-full h-36" viewBox="0 0 300 130">
          <line x1="150" y1="25" x2="85" y2="65" stroke="#f59e0b" strokeWidth="2" />
          <line x1="150" y1="25" x2="215" y2="65" stroke="#f59e0b" strokeWidth="2" />
          <line x1="85" y1="65" x2="50" y2="105" stroke="#64748b" strokeWidth="1.5" />
          <line x1="85" y1="65" x2="115" y2="105" stroke="#64748b" strokeWidth="1.5" />
          <circle cx="150" cy="25" r="7" fill="#f59e0b" />
          <circle cx="85" cy="65" r="6" fill="#fbbf24" />
          <circle cx="215" cy="65" r="6" fill="#fbbf24" />
          <circle cx="50" cy="105" r="4.5" fill="#10b981" />
          <circle cx="115" cy="105" r="4.5" fill="#ef4444" />
        </svg>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slopes bg-midnight/80 px-3 py-1 rounded-lg border border-mountainside">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Max Information Gain: ΔH = 0.42 Bits</span>
        </div>
      </div>
    ),
  },
  {
    id: 'pca',
    title: '5. PCA Dimensionality Reduction',
    subtitle: 'Principal Axis Variance Alignment',
    icon: PieChart,
    mathLatex: '\\Sigma v_i = \\lambda_i v_i',
    description: 'Identifies orthogonal directions of maximum variance to compress high-dimensional feature spaces into lower dimensions.',
    gradient: 'from-sky-400 to-blue-600',
    visualSnippet: () => (
      <div className="w-full h-56 rounded-2xl bg-midnight/95 p-4 border border-mountainside/80 flex flex-col justify-between items-center relative overflow-hidden shadow-inner select-none">
        <svg className="w-full h-36" viewBox="0 0 300 130">
          <line x1="40" y1="110" x2="260" y2="20" stroke="#38bdf8" strokeWidth="3" />
          <line x1="110" y1="25" x2="190" y2="105" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="75" cy="95" r="4" fill="#38bdf8" />
          <circle cx="120" cy="77" r="4" fill="#38bdf8" />
          <circle cx="180" cy="52" r="4" fill="#38bdf8" />
          <circle cx="225" cy="34" r="4" fill="#38bdf8" />
        </svg>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slopes bg-midnight/80 px-3 py-1 rounded-lg border border-mountainside">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>Explained Variance Ratio: PC1 = 88.2%</span>
        </div>
      </div>
    ),
  },
];

export const ScrollStorySection: React.FC = () => {
  return (
    <section className="py-24 bg-midnight text-arctic relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest uppercase text-slopes">
            Visual Storytelling
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-arctic mt-2">
            Watch How Algorithms Think
          </h2>
          <p className="mt-4 text-apres text-base sm:text-lg font-sans">
            Explore how raw mathematical equations convert into real-time geometric visual updates.
          </p>
        </div>

        <div className="space-y-8">
          {storySteps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="p-6 sm:p-8 rounded-3xl bg-mountainside/40 border border-mountainside/80 backdrop-blur-xl shadow-hard grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden group hover:border-slopes/60 transition-all"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${step.gradient} opacity-80 group-hover:opacity-100 transition-opacity`} />

                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${step.gradient} text-white shadow-md shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slopes uppercase tracking-widest block">
                        {step.subtitle}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-arctic">{step.title}</h3>
                    </div>
                  </div>

                  <p className="text-apres text-sm sm:text-base leading-relaxed font-sans max-w-2xl">
                    {step.description}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-midnight border border-mountainside/90 text-sm inline-block overflow-x-auto scrollbar-hide">
                    <span className="text-xs font-mono text-apres uppercase tracking-wider block mb-1">
                      Mathematical Engine:
                    </span>
                    <MathFormula latex={step.mathLatex} />
                  </div>
                </div>

                <div className="lg:col-span-5 w-full">
                  <div className="flex items-center justify-between mb-2 px-1">
                    <span className="text-[11px] font-mono font-bold text-slopes uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Live Geometry Engine
                    </span>
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-midnight text-slopes border border-mountainside">
                      Module 0{index + 1} / 05
                    </span>
                  </div>
                  <step.visualSnippet />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ScrollStorySection;
