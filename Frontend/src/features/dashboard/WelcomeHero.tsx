import React, { useEffect, useRef } from 'react';
import { Flame, Award, BookOpen, Sparkles, Star } from 'lucide-react';
import gsap from 'gsap';

interface WelcomeHeroProps {
  userFirstName?: string | null;
  streak?: number | null;
  completedAlgorithms?: number | null;
  totalPoints?: number | null;
  currentModule?: string | null;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  userFirstName,
  streak,
  completedAlgorithms,
  totalPoints,
  currentModule,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const name = userFirstName || 'Learner';
  const streakVal = streak ?? 5;
  const completedVal = completedAlgorithms ?? 3;
  const pointsVal = totalPoints ?? 450;
  const moduleVal = currentModule || 'Linear Regression';

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-reveal-item',
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const overallProgressPct = Math.min(100, Math.round((completedVal / 6) * 100));
  const strokeDashoffset = 283 - (283 * overallProgressPct) / 100;

  return (
    <div
      ref={containerRef}
      className="relative p-8 rounded-3xl bg-secondary-900/90 border border-mountainside/80 backdrop-blur-2xl shadow-hard overflow-hidden"
    >
      {/* Background Gradient Mesh */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-mountainside/30 blur-[120px] pointer-events-none" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Personalized Greeting & Quotes */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Streak Badge */}
            <div className="hero-reveal-item inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-warning/10 border border-warning/30 text-warning text-xs font-mono font-bold">
              <Flame className="w-4 h-4 fill-warning" />
              <span>{streakVal} Day Streak</span>
            </div>

            {/* Total Points Badge */}
            <div className="hero-reveal-item inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mountainside border border-apres/40 text-arctic text-xs font-mono font-bold">
              <Star className="w-3.5 h-3.5 text-warning fill-warning" />
              <span>{pointsVal} XP</span>
            </div>
          </div>

          <h1 className="hero-reveal-item text-3xl sm:text-4xl font-extrabold text-arctic tracking-tight">
            Welcome back, {name}
          </h1>

          <p className="hero-reveal-item text-sm sm:text-base text-slopes max-w-2xl leading-relaxed">
            Active Module: <span className="font-semibold text-arctic">{moduleVal}</span>. Keep momentum by completing your daily 3D simulation session.
          </p>

          {/* Motivational Quote */}
          <div className="hero-reveal-item pt-2 flex items-start gap-3 p-3.5 rounded-2xl bg-midnight/70 border border-mountainside/60 max-w-xl">
            <Sparkles className="w-4 h-4 text-arctic shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-apres italic">
              "The best way to understand an algorithm is to watch it think in 3D."
            </p>
          </div>
        </div>

        {/* Right Side: Circular Progress Ring & Overview Stats */}
        <div className="hero-reveal-item lg:col-span-4 flex items-center justify-center lg:justify-end">
          <div className="flex items-center gap-6 p-4 rounded-2xl bg-midnight/80 border border-mountainside">
            {/* SVG Circular Ring */}
            <div className="relative w-24 h-24 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="#262E36" strokeWidth="8" fill="none" />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#D3D1CE"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold font-mono text-arctic">{overallProgressPct}%</span>
                <span className="text-[9px] font-mono text-apres uppercase">Path</span>
              </div>
            </div>

            {/* Quick Stat Summary */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slopes">
                <Award className="w-4 h-4 text-arctic" />
                <span>{completedVal} / 6 Algorithms</span>
              </div>
              <div className="flex items-center gap-2 text-slopes">
                <BookOpen className="w-4 h-4 text-arctic" />
                <span>12 Lessons Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;
