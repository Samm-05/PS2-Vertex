const Simulation = require('../models/Simulation');
const Activity = require('../models/Activity');

exports.getStats = async (req, res) => {
  try {
    const user = req.user;
    const totalPoints = user.points;
    const completedAlgorithms = user.progress.algorithms.filter(a => a.completed).length;
    const totalPracticeTime = user.progress.totalPracticeTime;
    const averageScore = user.progress.averageScore;
    const rank = user.progress.rank;
    const streak = user.streak;

    res.json({ totalPoints, completedAlgorithms, totalPracticeTime, averageScore, rank, streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user._id }).sort({ timestamp: -1 }).limit(20);
    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
