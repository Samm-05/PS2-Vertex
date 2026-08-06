import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Terminal } from 'lucide-react';
import gsap from 'gsap';
import Hero3DCanvas from '../../components/landing/Hero3DCanvas';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hero-reveal',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center bg-midnight text-arctic overflow-hidden pt-20 pb-16"
    >
      {/* Background Subtle Gradient Blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-mountainside/30 blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 rounded-full bg-apres/10 blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div ref={contentRef} className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column — Typography & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow Badge */}
            <div className="hero-reveal inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-mountainside/80 border border-apres/40 text-xs font-mono text-slopes">
              <Sparkles className="w-3.5 h-3.5 text-arctic" />
              <span className="uppercase tracking-widest text-[11px] font-semibold text-arctic">
                Interactive 3D Visual Lab
              </span>
            </div>

            {/* Main Title */}
            <h1 className="hero-reveal text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Learn Machine Learning{' '}
              <span className="block mt-1 text-slopes font-bold">
                Inside the Algorithm
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-reveal text-base sm:text-lg text-slopes font-normal leading-relaxed max-w-xl">
              Watch algorithms think. See every weight update. Understand every decision. No coding required.
            </p>

            {/* CTA Buttons */}
            <div className="hero-reveal pt-2 flex flex-wrap items-center gap-4">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-arctic text-midnight font-semibold text-sm hover:bg-slopes transition-all shadow-soft"
                >
                  <span>Start Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <a
                  href="#pipeline"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-mountainside/60 border border-apres/40 hover:border-slopes text-slopes hover:text-arctic font-medium text-sm transition-all"
                >
                  <Play className="w-4 h-4" />
                  <span>Explore Algorithms</span>
                </a>
              </motion.div>
            </div>

            {/* System Status Footnote */}
            <div className="hero-reveal pt-4 flex items-center gap-3 text-xs font-mono text-apres">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-mountainside/50 border border-mountainside">
                <Terminal className="w-3.5 h-3.5 text-slopes" />
                <span>WebGL 2.0 Realtime Engine</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              <span>Zero-Setup Browser Sandbox</span>
            </div>
          </div>

          {/* Right Column — 3D Scientific Viewport Card */}
          <div className="hero-reveal lg:col-span-6">
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-apres/40 via-mountainside/80 to-midnight shadow-hard">
              <div className="relative h-[380px] sm:h-[450px] rounded-[22px] overflow-hidden bg-midnight border border-mountainside/80">
                
                {/* Viewport Header Bar */}
                <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 bg-midnight/80 border-b border-mountainside/60 backdrop-blur-md flex items-center justify-between pointer-events-none select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-mountainside border border-apres/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-mountainside border border-apres/40" />
                    <span className="w-2.5 h-2.5 rounded-full bg-mountainside border border-apres/40" />
                    <span className="ml-2 text-[11px] font-mono text-apres tracking-wider uppercase">
                      Interactive 3D Manifold
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-mountainside text-slopes">
                    60 FPS
                  </span>
                </div>

                {/* R3F 3D Canvas Container */}
                <Hero3DCanvas />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
