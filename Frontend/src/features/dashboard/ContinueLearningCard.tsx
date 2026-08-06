import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';

interface ContinueLearningCardProps {
  algorithmId?: string;
  title?: string;
  progressPct?: number;
  timeRemaining?: string;
}

export const ContinueLearningCard: React.FC<ContinueLearningCardProps> = ({
  algorithmId = 'linear-regression',
  title = 'Linear Regression & Cost Minimization',
  progressPct = 85,
  timeRemaining = '12 mins remaining',
}) => {
  const navigate = useNavigate();

  return (
    <Card hoverable className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-4 rounded-2xl bg-mountainside border border-apres/40 text-arctic shadow-soft">
            <TrendingUp className="w-7 h-7 text-slopes" />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-mountainside text-slopes uppercase tracking-wider">
                Resume Lesson
              </span>
              <span className="text-xs font-mono text-apres flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeRemaining}
              </span>
            </div>

            <h3 className="text-xl font-bold text-arctic tracking-tight">{title}</h3>

            {/* Step Progress Bar */}
            <div className="w-full max-w-md pt-2 space-y-1">
              <div className="flex justify-between text-xs font-mono text-apres">
                <span>Completion Status</span>
                <span className="text-arctic font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-midnight border border-mountainside overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-arctic rounded-full"
                />
              </div>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate(`/${algorithmId}`)}
          className="w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-arctic text-midnight font-bold text-sm hover:bg-slopes transition-all shadow-soft shrink-0"
        >
          <Play className="w-4 h-4 fill-midnight" />
          <span>Resume Session</span>
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>
    </Card>
  );
};

export default ContinueLearningCard;
