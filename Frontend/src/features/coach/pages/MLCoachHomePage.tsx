import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hooks';
import { coachModulesData } from '../coachData';
import PageContainer from '../../../components/layout/PageContainer';
import Card from '../../../components/ui/Card';
import {
  Sparkles,
  TrendingUp,
  Activity,
  Network,
  Target,
  Layers,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { motion } from 'framer-motion';

const getModuleIcon = (iconName: string) => {
  switch (iconName) {
    case 'sparkles':
      return <Sparkles className="w-5 h-5 text-blue-400" />;
    case 'trending-up':
      return <TrendingUp className="w-5 h-5 text-cyan-400" />;
    case 'activity':
      return <Activity className="w-5 h-5 text-emerald-400" />;
    case 'network':
      return <Network className="w-5 h-5 text-purple-400" />;
    case 'target':
      return <Target className="w-5 h-5 text-rose-400" />;
    case 'layers':
      return <Layers className="w-5 h-5 text-amber-400" />;
    default:
      return <BookOpen className="w-5 h-5 text-blue-400" />;
  }
};

export const MLCoachHomePage: React.FC = () => {
  const navigate = useNavigate();
  const { completedModules } = useAppSelector((state) => state.coach);

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-8 px-4 sm:px-6 lg:px-8 space-y-8 font-sans select-none">
      {/* Header Section */}
      <div className="space-y-2 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-arctic font-sans">
          ML Coach
        </h1>
        <p className="text-sm sm:text-base text-slopes font-sans leading-relaxed">
          Welcome back. Select a module to continue your journey through advanced machine learning concepts.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        {coachModulesData.map((module, index) => {
          const isCompleted = completedModules.includes(module.id);

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
            >
              <Card
                className={`p-6 space-y-5 transition-all duration-200 ${
                  isCompleted
                    ? 'bg-midnight/90 border-emerald-500/30 hover:border-emerald-500/50 shadow-soft'
                    : 'bg-midnight/90 border-apres/30 hover:border-apres/60 shadow-soft'
                }`}
              >
                {/* Top Row: Icon & Status Badge */}
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-2xl border ${
                      isCompleted
                        ? 'bg-emerald-950/30 border-emerald-500/40'
                        : 'bg-mountainside/50 border-apres/30'
                    }`}
                  >
                    {getModuleIcon(module.iconName)}
                  </div>

                  {isCompleted && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 text-emerald-400 text-xs font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                {/* Module Details */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-apres uppercase tracking-wider">
                    Module {module.moduleNumber}
                  </div>
                  <h3 className="text-xl font-bold text-arctic tracking-tight">
                    {module.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slopes font-sans leading-relaxed">
                    {module.shortDescription}
                  </p>
                </div>

                {/* Action Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => navigate(`/coach/module/${module.id}`)}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold font-mono transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                      isCompleted
                        ? 'bg-mountainside/60 border border-apres/30 text-slopes hover:text-arctic hover:bg-mountainside/80'
                        : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                    }`}
                  >
                    {isCompleted ? 'Review Module' : '[Start]'}
                  </button>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default MLCoachHomePage;
