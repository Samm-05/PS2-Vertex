const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/token');
const sendEmail = require('../utils/sendEmail');

// register
exports.register = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  
  // Validate input
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim();
    
    let user = await User.findOne({ email: normalizedEmail });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    user = new User({ 
      email: normalizedEmail, 
      password, 
      firstName: firstName.trim(), 
      lastName: lastName.trim() 
    });
    user.generateEmailVerification();
    await user.save();

    // send verification email (simple link)
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email/${user.emailVerificationToken}`;
    let verificationEmailSent = true;
    try {
      await sendEmail({
        to: normalizedEmail,
        subject: 'Verify your email',
        text: `Please verify your email by clicking the following link: ${verifyUrl}`,
      });
    } catch (mailErr) {
      // Do not fail registration when SMTP is unavailable in local/dev setup.
      verificationEmailSent = false;
      console.error('Verification email send failed:', mailErr.message);
    }

    if (!verificationEmailSent && process.env.NODE_ENV !== 'production') {
      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();
    }

    // issue tokens on registration as well (frontend expects user and tokens)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
    user.refreshTokens.push({ token: refreshToken, expires: Date.now() + 7 * 24 * 3600 * 1000 });
    await user.save();
    res.status(201).json({
      message: 'User registered. Please verify your email.',
      user: user.toObject ? user.toObject() : user,
      tokens: { accessToken, refreshToken },
    });
  } catch (err) {
    console.error('Registration error:', err);
    // Provide more detailed error messages
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // store refresh token in DB
    if (!Array.isArray(user.refreshTokens)) user.refreshTokens = [];
    user.refreshTokens.push({ token: refreshToken, expires: Date.now() + 7 * 24 * 3600 * 1000 });
    await user.save();

    res.json({ user: user.toObject ? user.toObject() : user, tokens: { accessToken, refreshToken } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
  }
};

// refresh token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

  try {
    const payload = require('jsonwebtoken').verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid token' });

    const stored = user.refreshTokens.find(rt => rt.token === refreshToken);
    if (!stored) return res.status(401).json({ message: 'Refresh token not found' });

    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token expired or invalid' });
  }
};

// logout
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(204);
  try {
    const payload = require('jsonwebtoken').decode(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) return res.sendStatus(204);
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.sendStatus(204);
  }
};

// forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If the email exists, a reset link will be sent' });

    user.generatePasswordReset();
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${user.passwordResetToken}`;
    try {
      await sendEmail({
        to: email,
        subject: 'Password Reset',
        text: `Reset your password: ${resetUrl}`,
      });
    } catch (mailErr) {
      console.error('Password reset email send failed:', mailErr.message);
    }

    res.json({ message: 'Password reset link sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// verify email
exports.verifyEmail = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({ emailVerificationToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
