import React from 'react';
import { motion } from 'framer-motion';
import {
  Feature3DCanvasIcon,
  FeatureMathIcon,
  FeatureGamifiedIcon,
  FeatureSpeedIcon,
  FeatureZeroCodeIcon,
  FeatureExportIcon,
} from '../../assets/svg/FeatureAssets';

interface FeatureItem {
  title: string;
  description: string;
  icon: React.FC<{ className?: string }>;
  accent: string;
}

const features: FeatureItem[] = [
  {
    title: '3D WebGL Canvas Engine',
    description: 'Rotate, pan, and inspect algorithm spatial vectors, hyperplanes, and clusters in full 360° 3D perspective.',
    icon: Feature3DCanvasIcon,
    accent: 'from-primary-500 to-indigo-600',
  },
  {
    title: 'Mathematical Transparency',
    description: 'Every step displays the exact gradient updates, loss values, and underlying formulas in clear visual panels.',
    icon: FeatureMathIcon,
    accent: 'from-teal-400 to-emerald-600',
  },
  {
    title: 'Gamified Practice & Badges',
    description: 'Earn points, unlock achievement badges, and climb global leaderboards as you solve parameter challenges.',
    icon: FeatureGamifiedIcon,
    accent: 'from-amber-400 to-orange-600',
  },
  {
    title: 'Real-Time Performance',
    description: 'Instant client-side WebGL compilation maintains 60 FPS playback across all dataset sizes.',
    icon: FeatureSpeedIcon,
    accent: 'from-purple-500 to-pink-600',
  },
  {
    title: 'Zero-Code Setup',
    description: 'No Python libraries, Jupyter notebooks, or GPU installations required. Starts directly in your browser.',
    icon: FeatureZeroCodeIcon,
    accent: 'from-sky-400 to-blue-600',
  },
  {
    title: 'Exportable Insights',
    description: 'Export simulation data, parameter histories, and evaluation metrics as JSON or CSV reports.',
    icon: FeatureExportIcon,
    accent: 'from-rose-500 to-red-600',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-secondary-950 text-white relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent-400">
            Engine Capabilities
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
            Built for Modern ML Education
          </h2>
          <p className="mt-4 text-secondary-300 text-base sm:text-lg">
            Everything you need to master machine learning algorithms intuitively.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="group relative p-8 rounded-3xl bg-secondary-900/70 border border-secondary-800 hover:border-primary-500/50 backdrop-blur-xl shadow-xl flex flex-col justify-between overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />

                <div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${item.accent} text-white w-fit mb-6 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-secondary-300 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
