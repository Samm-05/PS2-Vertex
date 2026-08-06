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

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { stats, recentActivity } = useAppSelector((state) => state.dashboard);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchRecentActivity());
  }, [dispatch]);

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
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-6 space-y-8">
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
            streak={stats?.streak ?? 5}
            completedAlgorithms={stats?.completedAlgorithms ?? 3}
            totalPoints={stats?.totalPoints ?? 450}
            currentModule="Linear Regression"
          />
        </motion.div>

        {/* SECTION 2: CONTINUE LEARNING */}
        <motion.div variants={itemVariants}>
          <ContinueLearningCard
            algorithmId="linear-regression"
            title="Linear Regression & Cost Minimization"
            progressPct={85}
            timeRemaining="12 mins remaining"
          />
        </motion.div>

        {/* SECTION 3: LEARNING PATH ROADMAP */}
        <motion.div variants={itemVariants}>
          <LearningPathRoadmap />
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
