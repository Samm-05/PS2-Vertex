import React, { useRef } from 'react';
import { BookOpenCheck, BrainCircuit, Network } from 'lucide-react';
import { useScrollReveal } from '../../animations/scrollAnimations';

const AboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-white dark:bg-secondary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div data-reveal>
          <h2 className="text-4xl font-semibold text-secondary-900 dark:text-secondary-50">About ML Visual Lab</h2>
          <p className="mt-5 text-base text-secondary-600 dark:text-secondary-300 leading-relaxed">
            ML Visual Lab is an interactive platform designed to help learners understand machine learning algorithms
            through visual simulations, step-by-step explanations, and hands-on experimentation.
          </p>
          <div className="mt-7 grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg p-4 bg-secondary-100 dark:bg-secondary-700/70" data-reveal>
              <BookOpenCheck className="w-5 h-5 text-primary-600 mb-2" />
              <p className="text-sm text-secondary-700 dark:text-secondary-200">Structured learning paths</p>
            </div>
            <div className="rounded-lg p-4 bg-secondary-100 dark:bg-secondary-700/70" data-reveal>
              <BrainCircuit className="w-5 h-5 text-primary-600 mb-2" />
              <p className="text-sm text-secondary-700 dark:text-secondary-200">Algorithm-first pedagogy</p>
            </div>
            <div className="rounded-lg p-4 bg-secondary-100 dark:bg-secondary-700/70" data-reveal>
              <Network className="w-5 h-5 text-primary-600 mb-2" />
              <p className="text-sm text-secondary-700 dark:text-secondary-200">Practical skill transfer</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-secondary-200 dark:border-secondary-700 bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-700 p-8 min-h-[320px]" data-reveal>
          <div className="h-full rounded-xl border border-primary-200/60 dark:border-secondary-600 p-6 bg-white/80 dark:bg-secondary-800/80 backdrop-blur">
            <h3 className="text-2xl font-semibold text-secondary-900 dark:text-secondary-50">Visual-First ML Education</h3>
            <p className="mt-4 text-secondary-600 dark:text-secondary-300">
              Instead of memorizing formulas, learners build intuition by seeing every update, split, and cluster in motion.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-primary-100 dark:bg-primary-900/30 p-4">
                <p className="text-3xl font-bold text-primary-700 dark:text-primary-300">25+</p>
                <p className="text-sm text-secondary-600 dark:text-secondary-300">Simulation scenarios</p>
              </div>
              <div className="rounded-lg bg-accent-500/10 p-4">
                <p className="text-3xl font-bold text-accent-600">100%</p>
                <p className="text-sm text-secondary-600 dark:text-secondary-300">Hands-on workflow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
