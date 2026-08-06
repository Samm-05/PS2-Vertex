const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const sendEmail = require('../utils/sendEmail');

// Register new user
exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    let existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const user = new User({
      email: normalizedEmail,
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      isEmailVerified: true, // Default to true so users can immediately log in across environments
    });

    user.generateEmailVerification();
    await user.save();

    // Optionally attempt email verification send
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
      const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${user.emailVerificationToken}`;
      try {
        await sendEmail({
          to: normalizedEmail,
          subject: 'Verify your ML Visual Lab account',
          text: `Click the following link to verify your account: ${verifyUrl}`,
        });
      } catch (mailErr) {
        console.warn('⚠️ Verification email send skipped/failed:', mailErr.message);
      }
    }

    // Issue access and refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
    user.refreshTokens.push({ token: refreshToken, expires: new Date(Date.now() + 7 * 24 * 3600 * 1000) });
    await user.save();

    console.log(`[AUTH] User registered successfully: ${user.email} (${user._id})`);

    const userObject = user.toObject();

    res.status(201).json({
      message: 'Account created successfully',
      user: userObject,
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error('[AUTH ERROR] Registration failed:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email is already registered' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update lastActive timestamp
    user.lastActive = new Date();

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
    user.refreshTokens.push({ token: refreshToken, expires: new Date(Date.now() + 7 * 24 * 3600 * 1000) });
    await user.save();

    console.log(`[AUTH] User logged in: ${user.email} (${user._id})`);

    const userObject = user.toObject();

    res.json({
      message: 'Login successful',
      user: userObject,
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error('[AUTH ERROR] Login failed:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || 'supersecretrefreshtoken';
    const payload = require('jsonwebtoken').verify(refreshToken, secret);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    const stored = user.refreshTokens.find((rt) => rt.token === refreshToken);
    if (!stored) return res.status(401).json({ message: 'Refresh token not found in user sessions' });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    console.error('[AUTH ERROR] Refresh token verification failed:', err.message);
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};

// Logout
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(204);
  try {
    const secret = process.env.REFRESH_TOKEN_SECRET || 'supersecretrefreshtoken';
    const payload = require('jsonwebtoken').decode(refreshToken);
    if (payload && payload.id) {
      const user = await User.findById(payload.id);
      if (user && Array.isArray(user.refreshTokens)) {
        user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
        await user.save();
      }
    }
    res.sendStatus(204);
  } catch (err) {
    console.error('[AUTH ERROR] Logout error:', err.message);
    res.sendStatus(204);
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link will be sent' });

    user.generatePasswordReset();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${user.passwordResetToken}`;
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
      try {
        await sendEmail({
          to: normalizedEmail,
          subject: 'Password Reset Request',
          text: `Reset your password by clicking here: ${resetUrl}`,
        });
      } catch (mailErr) {
        console.warn('Password reset email skipped/failed:', mailErr.message);
      }
    }

    res.json({ message: 'Password reset link sent' });
  } catch (err) {
    console.error('[AUTH ERROR] Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) return res.status(400).json({ message: 'Token and new password required' });

  try {
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('[AUTH ERROR] Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid verification token' });

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    console.error('[AUTH ERROR] Verify email error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};