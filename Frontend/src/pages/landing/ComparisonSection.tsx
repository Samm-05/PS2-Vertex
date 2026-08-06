import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { PassiveLearningDiagram, ActiveLearningDiagram } from '../../assets/svg/ComparisonAssets';

export const ComparisonSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'compare' | 'visual'>('compare');

  return (
    <section className="py-24 bg-secondary-900 text-white relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-error/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 -right-32 w-96 h-96 rounded-full bg-accent-500/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-primary-400">
            Pedagogical Innovation
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
            Why Traditional ML Education Fails
          </h2>
          <p className="mt-4 text-secondary-300 text-base sm:text-lg">
            Static equations and slide decks create abstract confusion. ML Visual Lab replaces memorization with active 3D experimentation.
          </p>
        </div>

        {/* Comparison Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Traditional Method Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-secondary-950/70 border border-error/30 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-error/20 border-b border-l border-error/30 text-error text-xs font-mono font-bold rounded-bl-xl">
              Traditional Passive Learning
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-error/10 text-error">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Passive Equations</h3>
                  <p className="text-xs text-secondary-400 font-mono">Abstract & Unintuitive</p>
                </div>
              </div>

              {/* Workflow Chain */}
              <div className="space-y-3 mb-8">
                {['Complex Equations', 'Static Powerpoint Slides', 'Rote Memorization', 'Cognitive Overload & Confusion'].map(
                  (step, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-secondary-900/80 border border-secondary-800 text-sm text-secondary-300">
                      <span className="w-6 h-6 rounded-full bg-error/20 text-error flex items-center justify-center text-xs font-mono font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <PassiveLearningDiagram className="w-full h-auto rounded-xl border border-secondary-800" />
          </motion.div>

          {/* ML Visual Lab Card */}
          <motion.div
            whileHover={{ y: -4 }}
            className="p-8 rounded-3xl bg-secondary-950/90 border border-primary-500/50 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-[0_0_40px_rgba(99,102,241,0.15)]"
          >
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-primary-500/20 border-b border-l border-primary-500/40 text-primary-300 text-xs font-mono font-bold rounded-bl-xl">
              ML Visual Lab Solution
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-primary-500/20 text-primary-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Active 3D Exploration</h3>
                  <p className="text-xs text-accent-400 font-mono">Intuitive & Interactive</p>
                </div>
              </div>

              {/* Workflow Chain */}
              <div className="space-y-3 mb-8">
                {['Real-Time 3D Visualization', 'Interactive Parameter Tuning', 'Step-by-Step Experimentation', 'Deep Intuitive Comprehension'].map(
                  (step, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-secondary-900 border border-primary-500/30 text-sm text-white font-medium">
                      <span className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-mono font-bold">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <ActiveLearningDiagram className="w-full h-auto rounded-xl border border-primary-500/30" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ComparisonSection;
