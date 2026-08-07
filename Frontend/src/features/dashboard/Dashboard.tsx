import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchDashboardStats, fetchRecentActivity } from './dashboardSlice';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Dashboard3DCanvas from '../../components/dashboard/Dashboard3DCanvas';
import WelcomeHero from './WelcomeHero';
import ContinueLearningCard from './ContinueLearningCard';
import LearningPathRoadmap from './LearningPathRoadmap';
import RecommendedModuleCard from './RecommendedModuleCard';
import DailyChallengeCard from './DailyChallengeCard';
import ProgressAnalytics from './ProgressAnalytics';
import ActivityFeed from './ActivityFeed';
import QuickActionsGrid from './QuickActionsGrid';
import UpcomingModulesGrid from './UpcomingModulesGrid';

const curriculumSequence = [
  { id: 'intro-ml', title: 'Intro to Machine Learning', subtitle: 'Paradigm Shift & End-to-End Pipeline', path: '/coach/module/intro-ml' },
  { id: 'linear-regression', title: 'Linear Regression & Cost Minimization', subtitle: 'OLS Cost Function, Derivation & Regularization', path: '/coach/module/linear-regression' },
  { id: 'gradient-descent', title: 'Gradient Descent & Optimization', subtitle: 'SGD, Mini-Batch, Momentum & Adam Solvers', path: '/coach/module/gradient-descent' },
  { id: 'neural-network', title: 'Neural Network Foundations', subtitle: 'Perceptrons, Activations & Backpropagation', path: '/coach/module/neural-network' },
  { id: 'logistic-regression', title: 'Logistic Regression & Classification', subtitle: 'Sigmoid Mapping, Log-Loss & ROC Curves', path: '/coach/module/logistic-regression' },
  { id: 'clustering', title: 'Clustering & Unsupervised Learning', subtitle: 'K-Means, WCSS Inertia & DBSCAN Density', path: '/coach/module/clustering' },
];

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, recentActivity } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);
  const { completedModules } = useAppSelector((state) => state.coach);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  const completedList = Array.isArray(completedModules) ? completedModules : [];
  const completedCount = completedList.length;

  // Active module is the first uncompleted module in sequence
  const activeModule = curriculumSequence.find((m) => !completedList.includes(m.id)) || curriculumSequence[curriculumSequence.length - 1];

  const totalXP = (stats?.totalPoints && stats.totalPoints > 0)
    ? stats.totalPoints
    : completedCount * 150 + (user?.points || 0);

  const streak = (typeof stats?.streak === 'number' && stats.streak > 0)
    ? stats.streak
    : (typeof user?.streak === 'number' ? user.streak : (completedCount > 0 ? 1 : 0));

  const progressPct = Math.min(100, Math.round((completedCount / 6) * 100));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-6 space-y-8 select-none">
      {/* Subtle R3F 3D Background Canvas */}
      <Dashboard3DCanvas />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 space-y-8 max-w-7xl mx-auto"
      >
        {/* SECTION 1: WELCOME HERO */}
        <motion.div variants={itemVariants}>
          <WelcomeHero
            userFirstName={user?.firstName}
            streak={streak}
            completedAlgorithms={completedCount}
            totalPoints={totalXP}
            currentModule={activeModule.title}
          />
        </motion.div>

        {/* SECTION 2: CONTINUE LEARNING */}
        <motion.div variants={itemVariants}>
          <ContinueLearningCard
            algorithmId={activeModule.id}
            title={activeModule.title}
            subtitle={activeModule.subtitle}
            progressPct={progressPct}
            timeRemaining={`${Math.max(5, (6 - completedCount) * 15)} mins remaining`}
            targetPath={activeModule.path}
          />
        </motion.div>

        {/* SECTION 3: LEARNING PATH ROADMAP */}
        <motion.div variants={itemVariants}>
          <LearningPathRoadmap completedModules={completedList} />
        </motion.div>

        {/* SECTION 4 & SECTION 5: RECOMMENDED MODULE & DAILY CHALLENGE */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-2 gap-6">
          <RecommendedModuleCard />
          <DailyChallengeCard />
        </motion.div>

        {/* SECTION 6: PROGRESS ANALYTICS & RECENT ACTIVITY */}
        <motion.div variants={itemVariants} className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <ProgressAnalytics stats={stats} />
          </div>
          <div className="lg:col-span-4">
            <Card className="p-6 h-full flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-arctic tracking-tight">Recent Activity</h3>
                  <span className="text-[10px] font-mono text-apres">Timeline Feed</span>
                </div>
                <ActivityFeed activities={recentActivity} />
              </div>
            </Card>
          </div>
        </motion.div>

        {/* SECTION 8: QUICK ACTIONS */}
        <motion.div variants={itemVariants}>
          <QuickActionsGrid />
        </motion.div>

        {/* SECTION 9: UPCOMING MODULES */}
        <motion.div variants={itemVariants}>
          <UpcomingModulesGrid />
        </motion.div>
      </motion.div>
    </PageContainer>
  );
};

export default Dashboard;