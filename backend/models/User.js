const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  expires: Date,
});

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  role: { type: String, enum: ['student', 'admin', 'instructor'], default: 'student' },
  avatar: String,
  institution: String,
  bio: String,
  points: { type: Number, default: 0 },
  badges: [{ id: String, name: String, description: String, icon: String, earnedAt: Date }],
  streak: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
  isEmailVerified: { type: Boolean, default: false },
  settings: {
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    emailNotifications: { type: Boolean, default: true },
    pushNotifications: { type: Boolean, default: true },
    defaultAlgorithmView: { type: String, enum: ['2d', '3d'], default: '2d' },
    animationSpeed: { type: Number, default: 1 },
    showExplanations: { type: Boolean, default: true },
  },
  progress: {
    algorithms: [
      {
        algorithmId: String,
        name: String,
        completed: Boolean,
        score: Number,
        attempts: Number,
        lastPracticed: Date,
        masteryLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'] },
      },
    ],
    totalPracticeTime: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    rank: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    nextLevelExp: { type: Number, default: 0 },
  },
  // tokens stored for refresh
  refreshTokens: [RefreshTokenSchema],
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
}, { timestamps: true });

// hash password before save
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
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour
};

UserSchema.methods.generateEmailVerification = function () {
  this.emailVerificationToken = crypto.randomBytes(20).toString('hex');
};

module.exports = mongoose.model('User', UserSchema);
