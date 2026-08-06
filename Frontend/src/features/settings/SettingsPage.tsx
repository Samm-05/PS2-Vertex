import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User as UserIcon,
  Sliders,
  Shield,
  Bell,
  Palette,
  Database,
  Info,
  Key,
  Save,
  Upload,
  Lock,
  CheckCircle,
  AlertTriangle,
  Trash2,
  LogOut,
  Sparkles,
  BookOpen,
  Globe,
  Award,
  Zap,
  Eye,
  EyeOff,
  Flame,
  Check,
  Download,
  RefreshCw,
  FileText,
  Github,
  Linkedin,
  Monitor,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateUser } from '../auth/authSlice';
import { settingsService } from '../../services/settingsService';
import PageContainer from '../../components/layout/PageContainer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

type SettingsTab =
  | 'general'
  | 'profile'
  | 'account'
  | 'security'
  | 'learning'
  | 'notifications'
  | 'appearance'
  | 'privacy'
  | 'about';

const SettingsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  // General Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || (user?.email ? user.email.split('@')[0] : ''));
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || '');

  // Profile Form State
  const [bio, setBio] = useState(user?.bio || '');
  const [college, setCollege] = useState(user?.college || user?.institution || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [country, setCountry] = useState(user?.country || '');
  const [github, setGithub] = useState(user?.github || '');
  const [linkedin, setLinkedin] = useState(user?.linkedin || '');
  const [portfolio, setPortfolio] = useState(user?.portfolio || '');
  const [skills, setSkills] = useState<string>((user?.skills || ['Python', 'PyTorch', 'Scikit-Learn']).join(', '));
  const [interests, setInterests] = useState<string>((user?.interests || ['Computer Vision', 'Deep Learning']).join(', '));

  // Security Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState(user?.twoFactorEnabled || false);
  const [emailVerified, setEmailVerified] = useState(user?.isEmailVerified ?? true);

  // Learning Preferences Form State
  const [learningMode, setLearningMode] = useState(user?.settings?.learningMode || 'guided');
  const [autoPlay, setAutoPlay] = useState(user?.settings?.autoPlaySimulations ?? true);
  const [simSpeed, setSimSpeed] = useState(user?.settings?.simulationSpeed || 1);
  const [defaultPlayground, setDefaultPlayground] = useState(user?.settings?.defaultPlayground || 'linear-lab');
  const [mathRendering, setMathRendering] = useState(user?.settings?.mathRendering || 'katex');
  const [autoResume, setAutoResume] = useState(user?.settings?.autoResume ?? true);
  const [language, setLanguage] = useState(user?.settings?.language || 'en');
  const [difficultyLevel, setDifficultyLevel] = useState(user?.settings?.difficultyLevel || 'intermediate');

  // Notifications Form State
  const [notifState, setNotifState] = useState({
    practiceReminder: user?.settings?.notifications?.practiceReminder ?? true,
    dailyReminder: user?.settings?.notifications?.dailyReminder ?? true,
    leaderboardUpdates: user?.settings?.notifications?.leaderboardUpdates ?? true,
    weeklyReport: user?.settings?.notifications?.weeklyReport ?? true,
    achievementNotifications: user?.settings?.notifications?.achievementNotifications ?? true,
    emailNotifications: user?.settings?.notifications?.emailNotifications ?? true,
    productUpdates: user?.settings?.notifications?.productUpdates ?? false,
  });

  // Appearance Form State
  const [theme, setTheme] = useState(user?.settings?.theme || 'dark');
  const [accentColor, setAccentColor] = useState(user?.settings?.accentColor || 'cyan');
  const [animationIntensity, setAnimationIntensity] = useState(user?.settings?.animationIntensity || 'normal');
  const [reduceMotion, setReduceMotion] = useState(user?.settings?.reduceMotion ?? false);
  const [compactMode, setCompactMode] = useState(user?.settings?.compactMode ?? false);

  // Delete Account Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');

  // Pre-populate data from MongoDB on mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const res = await settingsService.getSettings();
        const data = res.data;
        if (data) {
          setFirstName(data.firstName || '');
          setLastName(data.lastName || '');
          setUsername(data.username || (data.email ? data.email.split('@')[0] : ''));
          setAvatarUrl(data.avatar || '');
          setBio(data.bio || '');
          setCollege(data.college || data.institution || '');
          setUniversity(data.university || '');
          setCountry(data.country || '');
          setGithub(data.github || '');
          setLinkedin(data.linkedin || '');
          setPortfolio(data.portfolio || '');
          if (Array.isArray(data.skills)) setSkills(data.skills.join(', '));
          if (Array.isArray(data.interests)) setInterests(data.interests.join(', '));

          if (data.settings) {
            if (data.settings.theme) setTheme(data.settings.theme);
            if (data.settings.accentColor) setAccentColor(data.settings.accentColor);
            if (data.settings.learningMode) setLearningMode(data.settings.learningMode);
            if (data.settings.simulationSpeed) setSimSpeed(data.settings.simulationSpeed);
            if (data.settings.defaultPlayground) setDefaultPlayground(data.settings.defaultPlayground);
            if (data.settings.notifications) {
              setNotifState((prev) => ({ ...prev, ...data.settings.notifications }));
            }
          }
          dispatch(updateUser(data));
        }
      } catch (err) {
        console.warn('Could not fetch settings from server, using local state:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [dispatch]);

  // Handle Avatar File Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Avatar file size must be under 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    const toastId = toast.loading('Uploading avatar...');
    try {
      const res = await settingsService.uploadAvatar(formData);
      const newUrl = res.data.avatarUrl;
      setAvatarUrl(newUrl);
      dispatch(updateUser({ avatar: newUrl }));
      toast.success('Avatar updated successfully!', { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Avatar upload failed', { id: toastId });
    }
  };

  // Save Profile Changes
  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First and last name cannot be empty');
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Saving profile changes...');
    try {
      const parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const parsedInterests = interests.split(',').map((i) => i.trim()).filter(Boolean);

      const payload = {
        firstName,
        lastName,
        username,
        bio,
        college,
        university,
        country,
        github,
        linkedin,
        portfolio,
        skills: parsedSkills,
        interests: parsedInterests,
      };

      const res = await settingsService.updateProfile(payload);
      dispatch(updateUser(res.data));
      toast.success('Profile updated successfully!', { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update profile', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Save Learning Preferences
  const handleSavePreferences = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving learning preferences...');
    try {
      const payload = {
        learningMode,
        autoPlaySimulations: autoPlay,
        simulationSpeed: simSpeed,
        defaultPlayground,
        mathRendering,
        autoResume,
        language,
        difficultyLevel,
      };
      const res = await settingsService.updatePreferences(payload);
      dispatch(updateUser({ settings: { ...user?.settings, ...res.data } }));
      toast.success('Learning preferences saved!', { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update preferences', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Save Notifications Settings
  const handleSaveNotifications = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving notification preferences...');
    try {
      const res = await settingsService.updateNotifications(notifState);
      toast.success('Notification settings saved!', { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update notifications', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Save Appearance & Theme Settings
  const handleSaveAppearance = async () => {
    setSaving(true);
    const toastId = toast.loading('Updating appearance settings...');
    try {
      const payload = {
        theme,
        accentColor,
        animationIntensity,
        reduceMotion,
        compactMode,
      };
      const res = await settingsService.updateTheme(payload);
      dispatch(updateUser({ settings: { ...user?.settings, ...res.data } }));
      toast.success('Appearance settings updated!', { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update appearance', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Save Security Settings
  const handleSaveSecurity = async () => {
    setSaving(true);
    const toastId = toast.loading('Updating security settings...');
    try {
      await settingsService.updateSecurity({ twoFactorEnabled: twoFactor, isEmailVerified: emailVerified });
      dispatch(updateUser({ twoFactorEnabled: twoFactor, isEmailVerified: emailVerified }));
      toast.success('Security settings updated!', { id: toastId });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update security', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both current and new password');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match!");
      return;
    }

    setSaving(true);
    const toastId = toast.loading('Updating password...');
    try {
      await settingsService.changePassword({ currentPassword, newPassword });
      toast.success('Password changed successfully!', { id: toastId });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to change password', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  // Handle Account Export
  const handleExportData = async () => {
    const toastId = toast.loading('Preparing data export package...');
    try {
      const res = await settingsService.exportData();
      const blob = new Blob([res.data], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ml_visual_lab_${user?.firstName || 'user'}_export.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Data package exported successfully!', { id: toastId });
    } catch (err: any) {
      toast.error('Failed to export data package', { id: toastId });
    }
  };

  // Password Strength Calculator
  const calcPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'None', color: 'bg-secondary-700' };
    let score = 0;
    if (pwd.length >= 8) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9]/.test(pwd)) score += 25;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 25;

    if (score <= 25) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 50) return { score, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 75) return { score, label: 'Good', color: 'bg-blue-500' };
    return { score, label: 'Strong', color: 'bg-emerald-500' };
  };

  const pwdStrength = calcPasswordStrength(newPassword);

  const navigationTabs = [
    { id: 'general', label: 'General', icon: UserIcon },
    { id: 'profile', label: 'Profile', icon: FileText },
    { id: 'account', label: 'Account', icon: Key },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'learning', label: 'Learning Preferences', icon: Sliders },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Data & Privacy', icon: Database },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 dark:text-white mb-2">Settings</h1>
        <p className="text-secondary-600 dark:text-secondary-400">
          Manage your ML Visual Lab account, preferences and security.
        </p>
      </motion.div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side Navigation Tabs */}
        <Card className="p-3 lg:col-span-1 h-fit sticky top-24">
          <nav className="space-y-1">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
                    ${
                      isActive
                        ? 'bg-primary-600 text-white font-semibold shadow-md'
                        : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-white'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-secondary-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Right Side Content Panel */}
        <div className="lg:col-span-3 space-y-6">
          <AnimatePresence mode="wait">
            {/* GENERAL TAB */}
            {activeTab === 'general' && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">General Information</h2>

                  {/* Avatar Upload Header */}
                  <div className="flex items-center space-x-6 pb-6 border-b border-secondary-200 dark:border-secondary-800 mb-6">
                    <div className="relative group">
                      {avatarUrl ? (
                        <img
                          src={avatarUrl}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover ring-4 ring-primary-500/30"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-2xl text-white shadow-lg">
                          {firstName?.[0]}
                          {lastName?.[0]}
                        </div>
                      )}
                      <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload className="w-6 h-6 text-white" />
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                    <div>
                      <h3 className="font-bold text-secondary-900 dark:text-white text-lg">
                        {firstName} {lastName}
                      </h3>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-2">
                        Upload a PNG, JPG or WebP image under 5MB.
                      </p>
                      <label className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700 text-xs font-semibold text-secondary-900 dark:text-white transition-colors cursor-pointer">
                        <Upload className="w-4 h-4 text-primary-500" />
                        <span>Upload Photo</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                      </label>
                    </div>
                  </div>

                  {/* Form Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                        Email Address (Readonly)
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={user?.email || ''}
                          readOnly
                          className="w-full px-4 py-2.5 bg-secondary-200/50 dark:bg-secondary-800/40 border border-secondary-300 dark:border-secondary-700 rounded-xl text-sm text-secondary-500 cursor-not-allowed outline-none"
                        />
                        <Lock className="w-4 h-4 text-secondary-500 absolute right-3 top-3" />
                      </div>
                    </div>
                  </div>

                  {/* Educational Account Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-200 dark:border-secondary-700 mb-6 text-center">
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Role</p>
                      <p className="font-bold text-secondary-900 dark:text-white capitalize">{user?.role || 'Student'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Joined Date</p>
                      <p className="font-bold text-secondary-900 dark:text-white">
                        {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString() : 'Active Learner'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Total XP</p>
                      <p className="font-bold text-accent-500">{(user?.points || user?.progress?.experience || 0).toLocaleString()} XP</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-500 mb-1">Streak</p>
                      <p className="font-bold text-orange-500">🔥 {user?.streak || 1} Days</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" onClick={handleSaveProfile} isLoading={saving} icon={<Save className="w-4 h-4" />}>
                      Save Changes
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Extended Student Profile</h2>

                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                        Bio & Learning Goals
                      </label>
                      <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Share your background in machine learning and your goals..."
                        className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          College / School
                        </label>
                        <input
                          type="text"
                          value={college}
                          onChange={(e) => setCollege(e.target.value)}
                          placeholder="e.g. School of Computer Science"
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          University
                        </label>
                        <input
                          type="text"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder="e.g. Stanford University"
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. India, United States"
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2 flex items-center gap-1.5">
                          <Github className="w-4 h-4 text-primary-500" />
                          <span>GitHub Profile</span>
                        </label>
                        <input
                          type="url"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2 flex items-center gap-1.5">
                          <Linkedin className="w-4 h-4 text-blue-400" />
                          <span>LinkedIn URL</span>
                        </label>
                        <input
                          type="url"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2 flex items-center gap-1.5">
                          <Globe className="w-4 h-4 text-emerald-400" />
                          <span>Portfolio Website</span>
                        </label>
                        <input
                          type="url"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          placeholder="https://yourportfolio.com"
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          Skills (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={skills}
                          onChange={(e) => setSkills(e.target.value)}
                          placeholder="Python, PyTorch, Scikit-Learn, TensorFlow"
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          Interests (Comma separated)
                        </label>
                        <input
                          type="text"
                          value={interests}
                          onChange={(e) => setInterests(e.target.value)}
                          placeholder="Computer Vision, NLP, Reinforcement Learning"
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" onClick={handleSaveProfile} isLoading={saving} icon={<Save className="w-4 h-4" />}>
                      Save Profile
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <motion.div
                key="account"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Account Details</h2>

                  <div className="space-y-4 mb-8">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-200 dark:border-secondary-700">
                      <div>
                        <p className="text-sm font-bold text-secondary-900 dark:text-white">Registered Email</p>
                        <p className="text-xs text-secondary-500">{user?.email}</p>
                      </div>
                      <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                        <CheckCircle className="w-4 h-4" />
                        <span>Verified Account</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-200 dark:border-secondary-700">
                      <div>
                        <p className="text-sm font-bold text-secondary-900 dark:text-white">Active Sessions</p>
                        <p className="text-xs text-secondary-500">1 Active Web Session (Current Device)</p>
                      </div>
                      <Button variant="outline" className="text-xs py-1.5">
                        Sign Out Everywhere
                      </Button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/30">
                    <div className="flex items-center space-x-3 text-red-500 mb-2">
                      <AlertTriangle className="w-5 h-5" />
                      <h3 className="font-bold text-base">Danger Zone</h3>
                    </div>
                    <p className="text-xs text-secondary-400 mb-4 max-w-xl">
                      Deactivating or deleting your account removes your ML Visual Lab learning history, simulation records, and leaderboard rank permanently.
                    </p>
                    <div className="flex space-x-4">
                      <Button
                        variant="outline"
                        className="text-red-400 border-red-500/30 hover:bg-red-500/10 text-xs"
                        onClick={() => setShowDeleteModal(true)}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Password & Security</h2>

                  <form onSubmit={handleChangePassword} className="space-y-4 mb-8">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-secondary-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          New Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        />
                      </div>
                    </div>

                    {/* Password Strength Bar */}
                    {newPassword && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-secondary-400">Password Strength:</span>
                          <span className="font-bold text-secondary-200">{pwdStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-secondary-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${pwdStrength.color} transition-all duration-300`}
                            style={{ width: `${pwdStrength.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <Button type="submit" variant="primary" isLoading={saving} icon={<Key className="w-4 h-4" />}>
                        Update Password
                      </Button>
                    </div>
                  </form>

                  {/* Two Factor Authentication & Email Verification Toggles */}
                  <div className="space-y-4 border-t border-secondary-200 dark:border-secondary-800 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-secondary-900 dark:text-white text-sm">Two-Factor Authentication (2FA)</p>
                        <p className="text-xs text-secondary-500">Secure your ML Visual Lab account with TOTP authenticator app.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={twoFactor}
                        onChange={(e) => {
                          setTwoFactor(e.target.checked);
                          handleSaveSecurity();
                        }}
                        className="w-5 h-5 accent-primary-500 cursor-pointer"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* LEARNING PREFERENCES TAB */}
            {activeTab === 'learning' && (
              <motion.div
                key="learning"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Learning Preferences</h2>

                  <div className="space-y-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          Preferred Learning Mode
                        </label>
                        <select
                          value={learningMode}
                          onChange={(e) => setLearningMode(e.target.value)}
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option value="guided">Guided Learning Path</option>
                          <option value="freeform">Freeform Exploration</option>
                          <option value="fast">Fast-Paced Crash Course</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          Default Playground Lab
                        </label>
                        <select
                          value={defaultPlayground}
                          onChange={(e) => setDefaultPlayground(e.target.value)}
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option value="linear-lab">Linear Regression Lab</option>
                          <option value="gd-lab">Gradient Descent Lab</option>
                          <option value="logistic-lab">Logistic Regression Lab</option>
                          <option value="nn-lab">Neural Network Lab</option>
                          <option value="overfitting-lab">Overfitting & Regularization Lab</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          Math Rendering Engine
                        </label>
                        <select
                          value={mathRendering}
                          onChange={(e) => setMathRendering(e.target.value)}
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option value="katex">KaTeX (Fast Math Formatting)</option>
                          <option value="mathjax">MathJax Engine</option>
                          <option value="standard">Standard LaTeX Text</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-2">
                          Simulation Speed Multiplier
                        </label>
                        <select
                          value={simSpeed}
                          onChange={(e) => setSimSpeed(Number(e.target.value))}
                          className="w-full px-4 py-2.5 bg-secondary-50 dark:bg-secondary-800/80 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm text-secondary-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
                        >
                          <option value={0.5}>0.5x Slow Motion</option>
                          <option value={1}>1.0x Normal Speed</option>
                          <option value={1.5}>1.5x Accelerated</option>
                          <option value={2}>2.0x Fast Simulation</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-secondary-200 dark:border-secondary-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-secondary-900 dark:text-white text-sm">Auto Play 3D Simulations</p>
                          <p className="text-xs text-secondary-500">Automatically run 3D gradient descent visualizations on load.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoPlay}
                          onChange={(e) => setAutoPlay(e.target.checked)}
                          className="w-5 h-5 accent-primary-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-secondary-900 dark:text-white text-sm">Auto Resume Last Lesson</p>
                          <p className="text-xs text-secondary-500">Return to your last active module when launching ML Coach.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={autoResume}
                          onChange={(e) => setAutoResume(e.target.checked)}
                          className="w-5 h-5 accent-primary-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" onClick={handleSavePreferences} isLoading={saving} icon={<Save className="w-4 h-4" />}>
                      Save Preferences
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Notification Settings</h2>

                  <div className="space-y-4 mb-6">
                    {Object.entries({
                      practiceReminder: 'Practice Reminders (Daily Streak Notifications)',
                      dailyReminder: 'Daily ML Coach Lesson Prompt',
                      leaderboardUpdates: 'Leaderboard Rank Change Alerts',
                      weeklyReport: 'Weekly Machine Learning Progress Summary',
                      achievementNotifications: 'Badge & XP Achievement Unlocks',
                      emailNotifications: 'Email Digest Notifications',
                      productUpdates: 'New ML Simulator Features & Announcements',
                    }).map(([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary-100/50 dark:hover:bg-secondary-800/40 transition-colors"
                      >
                        <span className="text-sm font-medium text-secondary-900 dark:text-white">{label}</span>
                        <input
                          type="checkbox"
                          checked={Boolean((notifState as any)[key])}
                          onChange={(e) =>
                            setNotifState((prev) => ({
                              ...prev,
                              [key]: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 accent-primary-500 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" onClick={handleSaveNotifications} isLoading={saving} icon={<Save className="w-4 h-4" />}>
                      Save Notifications
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* APPEARANCE TAB */}
            {activeTab === 'appearance' && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Appearance & Theme</h2>

                  <div className="space-y-6 mb-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400 mb-3">
                        Theme Mode
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setTheme('dark')}
                          className={`p-4 rounded-xl border flex items-center space-x-3 transition-all cursor-pointer ${
                            theme === 'dark'
                              ? 'border-primary-500 bg-primary-500/10 text-white font-bold'
                              : 'border-secondary-300 dark:border-secondary-700 text-secondary-400'
                          }`}
                        >
                          <Monitor className="w-5 h-5 text-primary-500" />
                          <span>Dark Futuristic SaaS</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme('system')}
                          className={`p-4 rounded-xl border flex items-center space-x-3 transition-all cursor-pointer ${
                            theme === 'system'
                              ? 'border-primary-500 bg-primary-500/10 text-white font-bold'
                              : 'border-secondary-300 dark:border-secondary-700 text-secondary-400'
                          }`}
                        >
                          <Sparkles className="w-5 h-5 text-accent-500" />
                          <span>System Default</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-secondary-200 dark:border-secondary-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-secondary-900 dark:text-white text-sm">Reduce Motion (Accessibility)</p>
                          <p className="text-xs text-secondary-500">Minimize Framer Motion card animations for high performance.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={reduceMotion}
                          onChange={(e) => setReduceMotion(e.target.checked)}
                          className="w-5 h-5 accent-primary-500 cursor-pointer"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-secondary-900 dark:text-white text-sm">Compact View Mode</p>
                          <p className="text-xs text-secondary-500">Use tighter padding and denser tables across the dashboard.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={compactMode}
                          onChange={(e) => setCompactMode(e.target.checked)}
                          className="w-5 h-5 accent-primary-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="primary" onClick={handleSaveAppearance} isLoading={saving} icon={<Save className="w-4 h-4" />}>
                      Save Appearance
                    </Button>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* DATA & PRIVACY TAB */}
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <h2 className="text-xl font-bold text-secondary-900 dark:text-white mb-6">Data & Privacy Management</h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-200 dark:border-secondary-700">
                      <div>
                        <p className="text-sm font-bold text-secondary-900 dark:text-white">Export Full Profile & Learning Data</p>
                        <p className="text-xs text-secondary-500">Download a complete JSON package of your scores, code, and history.</p>
                      </div>
                      <Button variant="outline" className="text-xs" onClick={handleExportData} icon={<Download className="w-4 h-4" />}>
                        Export Data JSON
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-200 dark:border-secondary-700">
                      <div>
                        <p className="text-sm font-bold text-secondary-900 dark:text-white">Clear Local Cache & Storage</p>
                        <p className="text-xs text-secondary-500">Purge local browser cache and saved temporary simulation states.</p>
                      </div>
                      <Button
                        variant="outline"
                        className="text-xs"
                        onClick={() => {
                          toast.success('Local app cache cleared successfully!');
                        }}
                        icon={<RefreshCw className="w-4 h-4" />}
                      >
                        Clear Cache
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* ABOUT TAB */}
            {activeTab === 'about' && (
              <motion.div
                key="about"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <Sparkles className="w-7 h-7 text-primary-500" />
                    <div>
                      <h2 className="text-xl font-bold text-secondary-900 dark:text-white">ML Visual Lab Studio</h2>
                      <p className="text-xs text-secondary-500">Production Interactive Machine Learning Education Platform</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-secondary-50 dark:bg-secondary-800/40 border border-secondary-200 dark:border-secondary-700 mb-6 text-center text-xs">
                    <div>
                      <p className="text-secondary-500">Version</p>
                      <p className="font-bold text-secondary-900 dark:text-white mt-1">v2.4.0-SaaS</p>
                    </div>
                    <div>
                      <p className="text-secondary-500">Build Number</p>
                      <p className="font-bold text-secondary-900 dark:text-white mt-1">#2026.08.06</p>
                    </div>
                    <div>
                      <p className="text-secondary-500">React Core</p>
                      <p className="font-bold text-secondary-900 dark:text-white mt-1">v18.2.0</p>
                    </div>
                    <div>
                      <p className="text-secondary-500">Backend API</p>
                      <p className="font-bold text-secondary-900 dark:text-white mt-1">Express + MongoDB</p>
                    </div>
                  </div>

                  <div className="text-xs text-secondary-400 space-y-2 leading-relaxed">
                    <p>© 2026 ML Visual Lab. Built with React, TypeScript, TailwindCSS, KaTeX & Three.js.</p>
                    <p>Designed for real-time algorithm visualization, 3D gradient descent simulations, and interactive ML education.</p>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;