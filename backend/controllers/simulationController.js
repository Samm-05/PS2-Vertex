const Simulation = require('../models/Simulation');
const User = require('../models/User');
const Activity = require('../models/Activity');

// Stub algorithms for backend simulation requests
const algorithms = {
  'linear-regression': (params) => {
    const { epochs = 50 } = params || {};
    const lossHistory = [];
    let loss = Math.random();
    for (let i = 0; i < epochs; i++) {
      loss *= 0.95;
      lossHistory.push(loss);
    }
    return { data: null, lossHistory, parameters: params, results: { accuracy: 0.7 + Math.random() * 0.3 } };
  },
  kmeans: (params) => {
    const { maxIterations = 100 } = params || {};
    const lossHistory = [];
    let loss = Math.random();
    for (let i = 0; i < maxIterations; i++) {
      loss *= 0.98;
      lossHistory.push(loss);
    }
    return { data: null, lossHistory, parameters: params, results: { accuracy: 0.5 + Math.random() * 0.5 } };
  },
  'decision-tree': (params) => {
    return { data: null, lossHistory: [], parameters: params, results: { accuracy: 0.6 + Math.random() * 0.4 } };
  },
  'logistic-regression': (params) => {
    return { data: null, lossHistory: [], parameters: params, results: { accuracy: 0.65 + Math.random() * 0.35 } };
  },
  pca: (params) => {
    return { data: null, lossHistory: [], parameters: params, results: { accuracy: 0.8 + Math.random() * 0.2 } };
  },
};

exports.run = async (req, res) => {
  try {
    const { algorithm, parameters } = req.body;
    if (!algorithms[algorithm]) {
      return res.status(400).json({ message: 'Unknown algorithm' });
    }

    const out = algorithms[algorithm](parameters);

    // Update user metrics if user is authenticated
    const user = req.user;
    if (user && out.results && out.results.accuracy != null) {
      const earned = Math.floor(out.results.accuracy * 100);
      user.points = (user.points || 0) + earned;

      if (!user.progress) {
        user.progress = { algorithms: [], totalPracticeTime: 0, averageScore: 0, rank: 0, level: 1, experience: 0 };
      }
      if (!Array.isArray(user.progress.algorithms)) {
        user.progress.algorithms = [];
      }

      const prog = user.progress.algorithms.find((a) => a.algorithmId === algorithm);
      if (prog) {
        prog.attempts = (prog.attempts || 0) + 1;
        prog.score = out.results.accuracy * 100;
        prog.lastPracticed = new Date();
        prog.completed = true;
        if (prog.score > 90) prog.masteryLevel = 'expert';
        else if (prog.score > 75) prog.masteryLevel = 'advanced';
        else if (prog.score > 50) prog.masteryLevel = 'intermediate';
        else prog.masteryLevel = 'beginner';
      } else {
        user.progress.algorithms.push({
          algorithmId: algorithm,
          name: algorithm,
          completed: true,
          score: out.results.accuracy * 100,
          attempts: 1,
          lastPracticed: new Date(),
          masteryLevel: 'beginner',
        });
      }

      await user.save();

      // Log user activity
      await Activity.create({
        user: user._id,
        type: 'simulation',
        title: `Ran simulation (${algorithm})`,
        description: `Accuracy: ${(out.results.accuracy * 100).toFixed(1)}%`,
        timestamp: new Date(),
        score: out.results.accuracy,
      });
    }

    res.json(out);
  } catch (err) {
    console.error('Simulation execution error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.save = async (req, res) => {
  try {
    const data = req.body;
    const sim = new Simulation({ ...data, user: req.user._id });
    await sim.save();
    res.status(201).json(sim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getById = async (req, res) => {
  try {
    const sim = await Simulation.findById(req.params.id);
    if (!sim) return res.status(404).json({ message: 'Not found' });
    res.json(sim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const sims = await Simulation.find({ user: req.user._id });
    res.json(sims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.delete = async (req, res) => {
  try {
    await Simulation.deleteOne({ _id: req.params.id, user: req.user._id });
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.compare = async (req, res) => {
  try {
    const { ids } = req.body;
    const sims = await Simulation.find({ _id: { $in: ids }, user: req.user._id });
    res.json(sims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
