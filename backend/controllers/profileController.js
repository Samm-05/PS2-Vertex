const User = require('../models/User');
const Simulation = require('../models/Simulation');
const Activity = require('../models/Activity');
const path = require('path');
const fs = require('fs');

// get profile, requires authenticated user; user loaded earlier in middleware
exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// update profile
exports.updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const updates = req.body;
    Object.assign(user, updates);
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// upload avatar
exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    // save path
    req.user.avatar = `/uploads/${req.file.filename}`;
    await req.user.save();
    res.json({ avatarUrl: req.user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// saved simulations
exports.getSavedSimulations = async (req, res) => {
  try {
    const sims = await Simulation.find({ user: req.user._id });
    res.json(sims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.saveSimulation = async (req, res) => {
  try {
    const { id } = req.body;
    // this is demo; id refers to existing simulation
    const sim = await Simulation.findById(id);
    if (!sim || sim.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Simulation not found' });
    }
    // nothing to do as we store all sim under user by default
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeSimulation = async (req, res) => {
  try {
    const { id } = req.params;
    await Simulation.deleteOne({ _id: id, user: req.user._id });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// achievements
exports.getAchievements = async (req, res) => {
  try {
    res.json(req.user.badges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// settings
exports.updateSettings = async (req, res) => {
  try {
    const settings = req.body;
    Object.assign(req.user.settings, settings);
    await req.user.save();
    res.json(req.user.settings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// progress
exports.getProgress = async (req, res) => {
  try {
    res.json(req.user.progress);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// activity
exports.getActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const activities = await Activity.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(limit);
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = req.user;
    const match = await user.comparePassword(currentPassword);
    if (!match) return res.status(400).json({ message: 'Current password incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password changed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// delete account
exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const user = req.user;
    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ message: 'Password incorrect' });
    await User.deleteOne({ _id: user._id });
    res.json({ message: 'Account deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// export data
exports.exportData = async (req, res) => {
  try {
    const user = req.user.toObject();
    const sims = await Simulation.find({ user: user._id });
    const activities = await Activity.find({ user: user._id });

    const data = { profile: user, simulations: sims, activities };
    res.setHeader('Content-Disposition', 'attachment; filename="export.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
