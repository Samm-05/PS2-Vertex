const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  expires: Date,
});

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true, required: true },
    username: { type: String, trim: true, default: '' },
    password: { type: String, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['student', 'admin', 'instructor'], default: 'student' },
    avatar: { type: String, default: '' },
    institution: { type: String, default: '' },
    college: { type: String, default: '' },
    university: { type: String, default: '' },
    country: { type: String, default: '' },
    bio: { type: String, default: '' },
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    skills: [{ type: String }],
    interests: [{ type: String }],
    points: { type: Number, default: 0 },
    badges: [
      {
        id: String,
        name: String,
        description: String,
        icon: String,
        earnedAt: { type: Date, default: Date.now },
      },
    ],
    streak: { type: Number, default: 1 },
    joinedAt: { type: Date, default: Date.now },
    lastActive: { type: Date, default: Date.now },
    isEmailVerified: { type: Boolean, default: true },
    twoFactorEnabled: { type: Boolean, default: false },
    settings: {
      theme: { type: String, enum: ['light', 'dark', 'system'], default: 'dark' },
      accentColor: { type: String, default: 'cyan' },
      animationIntensity: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
      reduceMotion: { type: Boolean, default: false },
      compactMode: { type: Boolean, default: false },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: true },
      defaultAlgorithmView: { type: String, enum: ['2d', '3d'], default: '2d' },
      animationSpeed: { type: Number, default: 1 },
      showExplanations: { type: Boolean, default: true },
      learningMode: { type: String, enum: ['guided', 'freeform', 'fast'], default: 'guided' },
      autoPlaySimulations: { type: Boolean, default: true },
      simulationSpeed: { type: Number, default: 1 },
      defaultPlayground: { type: String, default: 'linear-lab' },
      mathRendering: { type: String, enum: ['katex', 'mathjax', 'standard'], default: 'katex' },
      autoResume: { type: Boolean, default: true },
      language: { type: String, default: 'en' },
      difficultyLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
      notifications: {
        practiceReminder: { type: Boolean, default: true },
        dailyReminder: { type: Boolean, default: true },
        leaderboardUpdates: { type: Boolean, default: true },
        weeklyReport: { type: Boolean, default: true },
        achievementNotifications: { type: Boolean, default: true },
        emailNotifications: { type: Boolean, default: true },
        productUpdates: { type: Boolean, default: false },
      },
    },
    progress: {
      algorithms: [
        {
          algorithmId: String,
          name: String,
          completed: { type: Boolean, default: false },
          score: { type: Number, default: 0 },
          attempts: { type: Number, default: 0 },
          lastPracticed: Date,
          masteryLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'beginner' },
        },
      ],
      totalPracticeTime: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      rank: { type: Number, default: 0 },
      level: { type: Number, default: 1 },
      experience: { type: Number, default: 0 },
      nextLevelExp: { type: Number, default: 100 },
    },
    refreshTokens: [RefreshTokenSchema],
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
  },
  { timestamps: true }
);

UserSchema.index({ points: -1 });
UserSchema.index({ createdAt: -1 });

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.generatePasswordReset = function () {
  this.passwordResetToken = crypto.randomBytes(20).toString('hex');
  this.passwordResetExpires = Date.now() + 3600000;
};

UserSchema.methods.generateEmailVerification = function () {
  this.emailVerificationToken = crypto.randomBytes(20).toString('hex');
};

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : undefined;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationToken;
    return ret;
  },
});

UserSchema.set('toObject', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : undefined;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    delete ret.emailVerificationToken;
    return ret;
  },
});

module.exports = mongoose.model('User', UserSchema);