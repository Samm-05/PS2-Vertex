const User = require('../models/User');
const Simulation = require('../models/Simulation');
const Activity = require('../models/Activity');

// Get Profile & Settings
exports.getProfile = async (req, res) => {
  try {
    const user = req.user.toObject ? req.user.toObject() : req.user;
    res.json(user);
  } catch (err) {
    console.error('[PROFILE CONTROLLER] Error getting profile:', err);
    res.status(500).json({ message: 'Server error loading profile' });
  }
};

// Update General & Profile Info
exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const {
      firstName,
      lastName,
      username,
      bio,
      college,
      university,
      country,
      institution,
      github,
      linkedin,
      portfolio,
      skills,
      interests,
    } = req.body;

    if (firstName !== undefined) user.firstName = firstName.trim();
    if (lastName !== undefined) user.lastName = lastName.trim();
    if (username !== undefined) user.username = username.trim();
    if (bio !== undefined) user.bio = bio;
    if (college !== undefined) user.college = college;
    if (university !== undefined) user.university = university;
    if (country !== undefined) user.country = country;
    if (institution !== undefined) user.institution = institution;
    if (github !== undefined) user.github = github.trim();
    if (linkedin !== undefined) user.linkedin = linkedin.trim();
    if (portfolio !== undefined) user.portfolio = portfolio.trim();
    if (Array.isArray(skills)) user.skills = skills;
    if (Array.isArray(interests)) user.interests = interests;

    user.lastActive = new Date();
    await user.save();

    console.log(`[PROFILE UPDATE] User ${user.email} updated profile successfully.`);
    res.json(user.toObject());
  } catch (err) {
    console.error('[PROFILE UPDATE ERROR]:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// Upload Avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No image file uploaded' });
    req.user.avatar = `/uploads/${req.file.filename}`;
    await req.user.save();
    res.json({ avatarUrl: req.user.avatar, user: req.user.toObject() });
  } catch (err) {
    console.error('[AVATAR UPLOAD ERROR]:', err);
    res.status(500).json({ message: 'Server error uploading avatar' });
  }
};

// Update Settings
exports.updateSettings = async (req, res) => {
  try {
    const user = req.user;
    if (!user.settings) user.settings = {};

    Object.assign(user.settings, req.body);
    user.markModified('settings');
    await user.save();

    res.json(user.settings);
  } catch (err) {
    console.error('[SETTINGS UPDATE ERROR]:', err);
    res.status(500).json({ message: 'Server error updating settings' });
  }
};

// Update Learning Preferences
exports.updatePreferences = async (req, res) => {
  try {
    const user = req.user;
    if (!user.settings) user.settings = {};

    const {
      learningMode,
      autoPlaySimulations,
      simulationSpeed,
      defaultPlayground,
      mathRendering,
      autoResume,
      language,
      difficultyLevel,
    } = req.body;

    if (learningMode !== undefined) user.settings.learningMode = learningMode;
    if (autoPlaySimulations !== undefined) user.settings.autoPlaySimulations = autoPlaySimulations;
    if (simulationSpeed !== undefined) user.settings.simulationSpeed = simulationSpeed;
    if (defaultPlayground !== undefined) user.settings.defaultPlayground = defaultPlayground;
    if (mathRendering !== undefined) user.settings.mathRendering = mathRendering;
    if (autoResume !== undefined) user.settings.autoResume = autoResume;
    if (language !== undefined) user.settings.language = language;
    if (difficultyLevel !== undefined) user.settings.difficultyLevel = difficultyLevel;

    user.markModified('settings');
    await user.save();

    res.json(user.settings);
  } catch (err) {
    console.error('[PREFERENCES UPDATE ERROR]:', err);
    res.status(500).json({ message: 'Server error updating learning preferences' });
  }
};

// Update Notifications
exports.updateNotifications = async (req, res) => {
  try {
    const user = req.user;
    if (!user.settings) user.settings = {};
    if (!user.settings.notifications) user.settings.notifications = {};

    Object.assign(user.settings.notifications, req.body);
    user.markModified('settings');
    await user.save();

    res.json(user.settings.notifications);
  } catch (err) {
    console.error('[NOTIFICATIONS UPDATE ERROR]:', err);
    res.status(500).json({ message: 'Server error updating notification settings' });
  }
};

// Update Appearance & Theme
exports.updateTheme = async (req, res) => {
  try {
    const user = req.user;
    if (!user.settings) user.settings = {};

    const { theme, accentColor, animationIntensity, reduceMotion, compactMode } = req.body;

    if (theme !== undefined) user.settings.theme = theme;
    if (accentColor !== undefined) user.settings.accentColor = accentColor;
    if (animationIntensity !== undefined) user.settings.animationIntensity = animationIntensity;
    if (reduceMotion !== undefined) user.settings.reduceMotion = reduceMotion;
    if (compactMode !== undefined) user.settings.compactMode = compactMode;

    user.markModified('settings');
    await user.save();

    res.json(user.settings);
  } catch (err) {
    console.error('[THEME UPDATE ERROR]:', err);
    res.status(500).json({ message: 'Server error updating appearance' });
  }
};

// Update Security Settings
exports.updateSecurity = async (req, res) => {
  try {
    const user = req.user;
    const { twoFactorEnabled, isEmailVerified } = req.body;

    if (twoFactorEnabled !== undefined) user.twoFactorEnabled = twoFactorEnabled;
    if (isEmailVerified !== undefined) user.isEmailVerified = isEmailVerified;

    await user.save();
    res.json({ twoFactorEnabled: user.twoFactorEnabled, isEmailVerified: user.isEmailVerified });
  } catch (err) {
    console.error('[SECURITY UPDATE ERROR]:', err);
    res.status(500).json({ message: 'Server error updating security settings' });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Both current and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }

    const user = req.user;
    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('[CHANGE PASSWORD ERROR]:', err);
    res.status(500).json({ message: 'Server error changing password' });
  }
};

// Delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password is required to delete account' });

    const user = req.user;
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Password is incorrect' });

    await User.deleteOne({ _id: user._id });
    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('[DELETE ACCOUNT ERROR]:', err);
    res.status(500).json({ message: 'Server error deleting account' });
  }
};

// Export Data
exports.exportData = async (req, res) => {
  try {
    const user = req.user.toObject();
    const sims = await Simulation.find({ user: user._id });
    const activities = await Activity.find({ user: user._id });

    const data = { profile: user, simulations: sims, activities, exportedAt: new Date().toISOString() };
    res.setHeader('Content-Disposition', 'attachment; filename="ml_visual_lab_data.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[EXPORT DATA ERROR]:', err);
    res.status(500).json({ message: 'Server error exporting user data' });
  }
};

// Saved Simulations & Achievements & Activity
exports.getSavedSimulations = async (req, res) => {
  try {
    const sims = await Simulation.find({ user: req.user._id });
    res.json(sims);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveSimulation = async (req, res) => {
  try {
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeSimulation = async (req, res) => {
  try {
    await Simulation.deleteOne({ _id: req.params.id, user: req.user._id });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAchievements = async (req, res) => {
  try {
    res.json(req.user.badges);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProgress = async (req, res) => {
  try {
    res.json(req.user.progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const activities = await Activity.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(limit);
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};