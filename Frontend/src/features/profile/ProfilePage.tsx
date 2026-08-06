import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Building,
  Calendar,
  Award,
  Clock,
  TrendingUp,
  Settings,
  Edit3,
  Save,
  X,
  Camera,
  BadgeCheck,
  Medal,
  Target,
  Brain,
  Layers,
  GitBranch,
  Network,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchProfile,
  fetchSavedSimulations,
  updateProfile,
  uploadAvatar,
  setEditing,
} from './profileSlice';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatDistanceToNow } from 'date-fns';

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { profile, savedSimulations, loading, isEditing } = useAppSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'settings'>('overview');
  const [editedProfile, setEditedProfile] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchProfile());
    dispatch(fetchSavedSimulations());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setEditedProfile(profile);
    }
  }, [profile]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      dispatch(uploadAvatar(file));
    }
  };

  const handleSaveProfile = () => {
    if (editedProfile) {
      dispatch(updateProfile(editedProfile));
    }
  };

  const getAlgorithmIcon = (algorithm: string) => {
    switch (algorithm) {
      case 'linear-regression':
        return Brain;
      case 'kmeans':
        return Layers;
      case 'decision-tree':
        return GitBranch;
      case 'neural-network':
        return Network;
      default:
        return Brain;
    }
  };

  const getMasteryColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'text-accent-500 bg-accent-500/10';
      case 'intermediate':
        return 'text-warning bg-warning/10';
      case 'advanced':
        return 'text-error bg-error/10';
      case 'expert':
        return 'text-purple-500 bg-purple-500/10';
      default:
        return 'text-secondary-500 bg-secondary-500/10';
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <PageContainer>
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center overflow-hidden">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.firstName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl text-white font-bold">
                    {profile.firstName[0]}
                    {profile.lastName[0]}
                  </span>
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-secondary-800 rounded-full shadow-medium flex items-center justify-center cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors border border-secondary-200 dark:border-secondary-700"
              >
                <Camera className="w-4 h-4 text-secondary-600" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      value={editedProfile?.firstName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, firstName: e.target.value })}
                    />
                    <Input
                      label="Last Name"
                      value={editedProfile?.lastName}
                      onChange={(e) => setEditedProfile({ ...editedProfile, lastName: e.target.value })}
                    />
                  </div>
                  <Input
                    label="Institution"
                    value={editedProfile?.institution || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, institution: e.target.value })}
                  />
                  <Input
                    label="Bio"
                    value={editedProfile?.bio || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                  />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-1 text-secondary-600 dark:text-secondary-400">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{profile.email}</span>
                    </div>
                    {profile.institution && (
                      <div className="flex items-center space-x-1 text-secondary-600 dark:text-secondary-400">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">{profile.institution}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1 text-secondary-600 dark:text-secondary-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">
                        Joined {formatDistanceToNow(new Date(profile.joinedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  {profile.bio && (
                    <p className="mt-4 text-secondary-600 dark:text-secondary-400">
                      {profile.bio}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    variant="primary"
                    onClick={handleSaveProfile}
                    icon={<Save className="w-4 h-4" />}
                  >
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => dispatch(setEditing(false))}
                    icon={<X className="w-4 h-4" />}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => dispatch(setEditing(true))}
                  icon={<Edit3 className="w-4 h-4" />}
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Award className="w-5 h-5 text-warning" />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Points</span>
              </div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {profile.points.toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <BadgeCheck className="w-5 h-5 text-accent-500" />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Badges</span>
              </div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {profile.badges.length}
              </p>
            </div>
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <TrendingUp className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Streak</span>
              </div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                {profile.streak} days
              </p>
            </div>
            <div className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl">
              <div className="flex items-center space-x-3 mb-2">
                <Medal className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Rank</span>
              </div>
              <p className="text-2xl font-bold text-secondary-900 dark:text-white">
                #{profile.progress.rank}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'overview'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'progress'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
          }`}
        >
          Progress
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 rounded-xl font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-primary-600 text-white'
              : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-700'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Badges */}
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Earned Badges
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {profile.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 bg-secondary-50 dark:bg-secondary-900 rounded-xl text-center group hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-secondary-900 dark:text-white mb-1">
                    {badge.name}
                  </h3>
                  <p className="text-xs text-secondary-500">
                    {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Simulations */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Saved Simulations
            </h2>
            <div className="space-y-3">
              {savedSimulations.slice(0, 5).map((sim) => {
                const Icon = getAlgorithmIcon(sim.algorithm);
                return (
                  <div
                    key={sim.id}
                    className="p-3 bg-secondary-50 dark:bg-secondary-900 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                        <Icon className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-secondary-900 dark:text-white">
                          {sim.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          {formatDistanceToNow(new Date(sim.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'progress' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {/* Algorithm Progress */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-4">
              Algorithm Mastery
            </h2>
            <div className="space-y-4">
              {profile.progress.algorithms.map((algo) => {
                const Icon = getAlgorithmIcon(algo.algorithmId);
                return (
                  <div key={algo.algorithmId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getMasteryColor(algo.masteryLevel)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-white">
                          {algo.name}
                        </p>
                        <p className="text-xs text-secondary-500">
                          Last practiced {formatDistanceToNow(new Date(algo.lastPracticed), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-white">
                            {algo.score}%
                          </p>
                          <p className="text-xs text-secondary-500">Score</p>
                        </div>
                        <div className="w-24">
                          <div className="h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-600 rounded-full"
                              style={{ width: `${algo.score}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Level Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-secondary-900 dark:text-white">
                Level Progress
              </h2>
              <span className="text-sm text-secondary-500">
                Level {profile.progress.level}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600 dark:text-secondary-400">
                  Experience
                </span>
                <span className="text-secondary-900 dark:text-white font-medium">
                  {profile.progress.experience} / {profile.progress.nextLevelExp} XP
                </span>
              </div>
              <div className="h-3 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                  style={{
                    width: `${(profile.progress.experience / profile.progress.nextLevelExp) * 100}%`,
                  }}
                />
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'settings' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-secondary-900 dark:text-white mb-6">
              Application Settings
            </h2>
            
            <div className="space-y-6">
              {/* Theme */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Theme
                </label>
                <select
                  value={profile.settings.theme}
                  onChange={(e) => dispatch(updateSettings({ theme: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-xl"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Notifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profile.settings.emailNotifications}
                      onChange={(e) => dispatch(updateSettings({ emailNotifications: e.target.checked }))}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      Email notifications
                    </span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profile.settings.pushNotifications}
                      onChange={(e) => dispatch(updateSettings({ pushNotifications: e.target.checked }))}
                      className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">
                      Push notifications
                    </span>
                  </label>
                </div>
              </div>

              {/* Simulation Settings */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Default Algorithm View
                </label>
                <select
                  value={profile.settings.defaultAlgorithmView}
                  onChange={(e) => dispatch(updateSettings({ defaultAlgorithmView: e.target.value as any }))}
                  className="w-full px-4 py-2 bg-secondary-50 dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-xl"
                >
                  <option value="2d">2D</option>
                  <option value="3d">3D</option>
                </select>
              </div>

              {/* Animation Speed */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                  Animation Speed: {profile.settings.animationSpeed}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={profile.settings.animationSpeed}
                  onChange={(e) => dispatch(updateSettings({ animationSpeed: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              {/* Show Explanations */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={profile.settings.showExplanations}
                  onChange={(e) => dispatch(updateSettings({ showExplanations: e.target.checked }))}
                  className="rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-secondary-600 dark:text-secondary-400">
                  Show step-by-step explanations
                </span>
              </label>
            </div>
          </Card>
        </motion.div>
      )}
    </PageContainer>
  );
};

export default ProfilePage;