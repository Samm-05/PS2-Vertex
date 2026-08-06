const User = require('../models/User');
const Simulation = require('../models/Simulation');
const mongoose = require('mongoose');

// compute global leaderboard by points
exports.getGlobal = async (req, res) => {
  try {
    const top = await User.find().sort({ points: -1 }).limit(100).select('firstName lastName points');
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// weekly leaderboard (points earned in last 7 days) using simulation results
exports.getWeekly = async (req, res) => {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const agg = await Simulation.aggregate([
      { $match: { createdAt: { $gte: oneWeekAgo } } },
      { $group: { _id: '$user', points: { $sum: '$results.accuracy' } } },
      { $sort: { points: -1 } },
      { $limit: 100 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $project: { points: 1, 'user.firstName': 1, 'user.lastName': 1 } },
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// by algorithm
exports.getByAlgorithm = async (req, res) => {
  try {
    const { algorithm } = req.params;
    const agg = await Simulation.aggregate([
      { $match: { algorithm } },
      { $group: { _id: '$user', points: { $sum: '$results.accuracy' } } },
      { $sort: { points: -1 } },
      { $limit: 100 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      { $project: { points: 1, 'user.firstName': 1, 'user.lastName': 1 } },
    ]);
    res.json(agg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// user rank
exports.getUserRank = async (req, res) => {
  try {
    const users = await User.find().sort({ points: -1 }).select('_id');
    const index = users.findIndex(u => u._id.toString() === req.user._id.toString());
    res.json({ rank: index + 1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// top N
exports.getTop = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const top = await User.find().sort({ points: -1 }).limit(limit).select('firstName lastName points');
    res.json(top);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
