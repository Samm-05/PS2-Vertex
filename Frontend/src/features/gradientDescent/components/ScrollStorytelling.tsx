import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Compass, Zap, Layers, RefreshCw, Sparkles } from 'lucide-react';

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
          How Gradient Descent Powers Modern AI
        </h2>
        <p className="text-sm text-slopes max-w-2xl mx-auto">
          Explore the fundamental physics, mathematics, and numerical mechanics behind neural network training.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1 */}
        <div className="story-card bg-midnight border border-mountainside p-6 rounded-3xl space-y-3 shadow-hard">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-arctic">1. The High-Dimensional Loss Landscape</h3>
          <p className="text-xs text-slopes leading-relaxed">
            In deep neural networks with billions of parameters, loss surfaces are complex, non-convex manifolds filled with valleys, plateaus, and saddle points. Understanding 2D loss surfaces provides immediate intuition for higher-dimensional loss geometries.
          </p>
        </div>

        {/* Card 2 */}
        <div className="story-card bg-midnight border border-mountainside p-6 rounded-3xl space-y-3 shadow-hard">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-arctic">2. Steepest Descent & Vector Calculus</h3>
          <p className="text-xs text-slopes leading-relaxed">
            The gradient vector ∇J(θ) represents the direction of maximum loss increase. Moving in the opposite vector direction -∇J(θ) yields the steepest possible loss decrease per unit step.
          </p>
        </div>

        {/* Card 3 */}
        <div className="story-card bg-midnight border border-mountainside p-6 rounded-3xl space-y-3 shadow-hard">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-arctic">3. Learning Rate Hyperparameter Tuning</h3>
          <p className="text-xs text-slopes leading-relaxed">
            Learning rate α scales the step size. A small α causes slow under-stepping; a large α causes overshooting and chaotic divergence. Finding the optimal learning rate is critical to fast model convergence.
          </p>
        </div>

        {/* Card 4 */}
        <div className="story-card bg-midnight border border-mountainside p-6 rounded-3xl space-y-3 shadow-hard">
          <div className="w-10 h-10 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-arctic">4. Momentum & Heavy-Ball Acceleration</h3>
          <p className="text-xs text-slopes leading-relaxed">
            Standard gradient descent struggles on flat plateaus and saddle points where gradients collapse to zero. Momentum (β) simulates physical kinetic energy, allowing the optimizer to push through flat regions efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};
