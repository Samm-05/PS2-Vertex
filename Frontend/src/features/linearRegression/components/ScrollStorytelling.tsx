import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Zap, Layers, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const ScrollStorytelling: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll('.story-card');
    cards.forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="py-12 border-t border-mountainside/80 space-y-10 max-w-5xl mx-auto">
      <div className="text-center space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
          Educational Deep Dive
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-arctic tracking-tight">
          How Linear Regression Learns From Data
        </h2>
        <p className="text-sm text-slopes max-w-2xl mx-auto">
          Explore how linear regression combines geometric projection, residual error minimization, and gradient descent optimization.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="story-card bg-midnight border border-mountainside p-6 rounded-3xl space-y-3 shadow-hard">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-arctic">1. The Prediction Line (ŷ = wx + b)</h3>
          <p className="text-xs text-slopes leading-relaxed">
            Linear Regression models continuous targets by finding a hyperplane (a straight line in 2D) parameterized by weight slope w and bias intercept b. Every input feature xᵢ produces an estimated target ŷᵢ.
          </p>
        </div>

        {/* Card 2 */}
        <div className="story-card bg-midnight border border-mountainside p-6 rounded-3xl space-y-3 shadow-hard">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-arctic">2. Minimizing Residual Error Lines</h3>
          <p className="text-xs text-slopes leading-relaxed">
            The difference between actual label yᵢ and prediction ŷᵢ is the residual error eᵢ = yᵢ - ŷᵢ. In 3D space, these errors form vertical lines connecting dataset points to the regression line. Shrinking these lines minimizes total model loss.
          </p>
        </div>

        {/* Card 3 */}
        <div className="story-card bg-midnight border border-mountainside p-6 rounded-3xl space-y-3 shadow-hard">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-arctic">3. Gradient Descent Optimization</h3>
          <p className="text-xs text-slopes leading-relaxed">
            Rather than solving matrix inversion directly, gradient descent iteratively computes partial derivatives ∂J/∂w and ∂J/∂b, rotating and translating the line downhill toward the global MSE minimum.
          </p>
        </div>

        {/* Card 4 */}
        <div className="story-card bg-midnight border border-mountainside p-6 rounded-3xl space-y-3 shadow-hard">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-arctic">4. Ordinary Least Squares (OLS) Benchmark</h3>
          <p className="text-xs text-slopes leading-relaxed">
            In 2D simple linear regression, the closed-form analytical solution w* = Cov(X,Y) / Var(X) yields the exact theoretical line of best fit, serving as the benchmark target that gradient descent converges toward.
          </p>
        </div>
      </div>
    </div>
  );
};
