import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Clock, Star, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';

export const DailyChallengeCard: React.FC = () => {
  const navigate = useNavigate();

  // Simulated countdown timer: 23 hours, 45 minutes, 30 seconds
  const [timeLeft, setTimeLeft] = useState(85530);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 86400));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <Card hoverable className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-warning/10 text-warning border border-warning/30">
            <Zap className="w-4 h-4 fill-warning" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-warning font-bold">
            Daily Challenge
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-mountainside text-arctic border border-apres/40 text-xs font-mono">
          <Star className="w-3.5 h-3.5 text-warning fill-warning" />
          <span>+100 XP</span>
        </div>
      </div>

      <h3 className="text-xl font-bold text-arctic mb-1">
        Overfitting Prevention Challenge
      </h3>
      <p className="text-xs text-slopes mb-4">
        Prune decision tree depth to achieve &gt;88% accuracy on noisy test data.
      </p>

      {/* Countdown Timer Bar */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-midnight/80 border border-mountainside mb-6">
        <span className="text-xs font-mono text-apres flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slopes" />
          Resets in
        </span>
        <div className="flex items-center gap-1 font-mono text-sm font-bold text-arctic">
          <span className="px-2 py-0.5 rounded bg-mountainside border border-apres/40">
            {String(hours).padStart(2, '0')}h
          </span>
          <span>:</span>
          <span className="px-2 py-0.5 rounded bg-mountainside border border-apres/40">
            {String(minutes).padStart(2, '0')}m
          </span>
          <span>:</span>
          <span className="px-2 py-0.5 rounded bg-mountainside border border-apres/40 text-warning">
            {String(seconds).padStart(2, '0')}s
          </span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/practice')}
        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-warning/20 text-warning border border-warning/30 font-bold text-xs hover:bg-warning/30 transition-all"
      >
        <span>Start Daily Challenge</span>
        <ArrowRight className="w-4 h-4" />
      </motion.button>
    </Card>
  );
};

export default DailyChallengeCard;
