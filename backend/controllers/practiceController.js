const Activity = require('../models/Activity');

const challenges = [
  {
    id: 'lr-1',
    title: 'Optimal Learning Rate Tuning',
    description: 'Tune the learning rate hyperparameter on Linear Regression to converge without divergence.',
    algorithm: 'linear-regression',
    difficulty: 'beginner',
    points: 50,
    timeEstimate: 10,
    completed: false,
  },
  {
    id: 'km-1',
    title: 'Cluster Centroid Discovery',
    description: 'Identify optimal K clusters for Gaussian blobs using minimum sum-of-squares inertia.',
    algorithm: 'kmeans',
    difficulty: 'intermediate',
    points: 75,
    timeEstimate: 15,
    completed: false,
  },
  {
    id: 'dt-1',
    title: 'Tree Depth Pruning',
    description: 'Adjust maximum tree depth and sample split count to prevent overfitting on non-linear datasets.',
    algorithm: 'decision-tree',
    difficulty: 'advanced',
    points: 100,
    timeEstimate: 20,
    completed: false,
  },
  {
    id: 'log-1',
    title: 'Sigmoid Decision Boundary',
    description: 'Separate two overlapping binary classes with log-loss regularization.',
    algorithm: 'logistic-regression',
    difficulty: 'intermediate',
    points: 80,
    timeEstimate: 15,
    completed: false,
  },
];

exports.getChallenges = async (req, res) => {
  try {
    res.json(challenges);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.submitChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = challenges.find((c) => c.id === id) || { id, points: 50 };
    
    if (req.user) {
      req.user.points = (req.user.points || 0) + challenge.points;
      await req.user.save();

      await Activity.create({
        user: req.user._id,
        type: 'challenge',
        title: `Completed Challenge: ${challenge.title || id}`,
        description: `Earned +${challenge.points} points`,
        timestamp: new Date(),
        score: challenge.points,
      });
    }

    res.json({ id, points: challenge.points, completed: true, completedAt: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.json({ totalPoints: 0, completedChallenges: 0, averageScore: 0, rank: 1, streak: 0 });
    }
    const completedChallenges = user.progress?.algorithms?.filter((a) => a.completed)?.length || 0;
    res.json({
      totalPoints: user.points || 0,
      completedChallenges,
      averageScore: user.progress?.averageScore || 85,
      rank: user.progress?.rank || 1,
      streak: user.streak || 1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
