import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  institution: string;
  avatar: string;
  stars: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: 'ML Visual Lab helped me finally grasp how gradient descent updates weight vectors in 3D space. The visual feedback makes mathematical intuition instant.',
    name: 'Aarav Sharma',
    role: 'Computer Science Student',
    institution: 'IIT Bombay',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    stars: 5,
  },
  {
    id: 2,
    quote: 'Using ML Visual Lab in my data science bootcamp completely transformed student engagement. Instead of staring at static slides, students experiment with hyperparameters live.',
    name: 'Dr. Riya Mehta',
    role: 'Lead ML Educator',
    institution: 'Tech Academy Global',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    stars: 5,
  },
  {
    id: 3,
    quote: 'The K-Means and Decision Tree step-by-step simulations are incredible. You can see centroids shift and branches split frame by frame.',
    name: 'Neel Patel',
    role: 'AI Researcher',
    institution: 'Stanford University',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    stars: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const active = testimonials[currentIndex];

  return (
    <section className="py-24 bg-secondary-950 text-white relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[25rem] rounded-full bg-accent-500/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent-400">
            Learner Community
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
            Trusted by Students & Educators
          </h2>
          <p className="mt-4 text-secondary-300 text-base sm:text-lg">
            See how ML Visual Lab empowers thousands of learners worldwide.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.35 }}
              className="p-8 sm:p-12 rounded-3xl bg-secondary-900/90 border border-secondary-800 backdrop-blur-2xl shadow-2xl relative overflow-hidden flex flex-col justify-between"
            >
              {/* Quote Icon Background */}
              <Quote className="absolute top-6 right-8 w-24 h-24 text-secondary-800/40 pointer-events-none" />

              <div>
                {/* Stars Row */}
                <div className="flex gap-1 mb-6 text-amber-400">
                  {Array.from({ length: active.stars }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                </div>

                {/* Quote Text */}
                <p className="text-lg sm:text-2xl font-medium text-white leading-relaxed mb-8 relative z-10 italic">
                  "{active.quote}"
                </p>
              </div>

              {/* Author Details */}
              <div className="flex items-center gap-4 pt-6 border-t border-secondary-800">
                <img
                  src={active.avatar}
                  alt={active.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-500"
                />
                <div>
                  <h4 className="text-lg font-bold text-white">{active.name}</h4>
                  <p className="text-xs text-primary-400 font-mono">{active.role} • {active.institution}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'w-8 bg-primary-500' : 'w-2 bg-secondary-800 hover:bg-secondary-700'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handlePrev}
                className="p-3 rounded-full bg-secondary-900 border border-secondary-800 hover:border-primary-500 text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-3 rounded-full bg-secondary-900 border border-secondary-800 hover:border-primary-500 text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
