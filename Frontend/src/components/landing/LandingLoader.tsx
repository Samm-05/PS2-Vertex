import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Brain, Sparkles } from 'lucide-react';

interface LandingLoaderProps {
  onComplete: () => void;
}

export const LandingLoader: React.FC<LandingLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const minTime = 1400; // between 1200ms and 2500ms
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / minTime) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(interval);
        
        // Trigger smooth GSAP exit timeline
        const tl = gsap.timeline({
          onComplete: () => {
            onComplete();
          },
        });

        tl.to(logoRef.current, { scale: 1.1, opacity: 0, duration: 0.4, ease: 'power2.in' })
          .to(textRef.current, { opacity: 0, y: -10, duration: 0.3 }, '-=0.3')
          .to(progressBarRef.current, { opacity: 0, duration: 0.3 }, '-=0.3')
          .to(containerRef.current, { opacity: 0, duration: 0.5, ease: 'power3.inOut' });
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-secondary-950 text-white select-none overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-900/30 via-secondary-950 to-secondary-950 pointer-events-none" />

      {/* Floating Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-accent-500/10 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-sm px-6 text-center">
        {/* Animated Glowing Logo */}
        <div ref={logoRef} className="relative flex items-center justify-center w-24 h-24 mb-6">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-primary-600 to-accent-500 opacity-80 blur-lg animate-pulse" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary-900 border border-secondary-700 shadow-2xl">
            <Brain className="w-10 h-10 text-primary-400 animate-bounce" />
          </div>
        </div>

        {/* Brand Heading & Status */}
        <h2 className="text-2xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-2">
          <span>ML Visual Lab</span>
          <Sparkles className="w-4 h-4 text-accent-400 animate-spin" />
        </h2>
        <p ref={textRef} className="text-xs tracking-widest uppercase font-mono text-secondary-400 mb-8">
          Initializing WebGL Simulation Engine...
        </p>

        {/* Progress Bar Container */}
        <div ref={progressBarRef} className="w-full">
          <div className="flex justify-between items-center text-xs font-mono text-secondary-400 mb-2">
            <span>Loading Neural Graphs</span>
            <span className="text-primary-400 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary-800 border border-secondary-700 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 via-accent-400 to-primary-400 transition-all duration-75 ease-out shadow-[0_0_12px_rgba(99,102,241,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingLoader;
