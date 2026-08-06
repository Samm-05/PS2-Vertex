import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import gsap from 'gsap';

export const CTASection: React.FC = () => {
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ctaRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ctaRef.current,
        { scale: 0.96, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: ctaRef.current,
            start: 'top 80%',
          },
        }
      );
    }, ctaRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-secondary-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ctaRef}
          className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-r from-primary-900/80 via-secondary-900 to-accent-950/80 border border-primary-500/40 backdrop-blur-2xl shadow-[0_0_60px_rgba(99,102,241,0.2)] overflow-hidden text-center flex flex-col items-center"
        >
          {/* Glowing Background Radial Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent pointer-events-none" />

          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-900/80 border border-secondary-700 text-xs font-mono text-accent-400 mb-6">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <span>Ready for Machine Learning Mastery?</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-3xl mb-6 leading-tight">
            Start Visualizing Machine Learning Algorithms Today
          </h2>

          <p className="text-secondary-300 text-base sm:text-xl max-w-2xl mb-10 leading-relaxed">
            Join thousands of students and engineers understanding machine learning through interactive 3D simulations.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/signup"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold shadow-lg shadow-primary-600/40 transition-all"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-secondary-900 border border-secondary-700 hover:border-secondary-500 text-white font-semibold transition-all"
              >
                <span>Launch Interactive Studio</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
