const Activity = require('../models/Activity');

// Quiz Categories Data
const categories = [
  {
    id: 'intro-ml',
    title: 'Introduction to Machine Learning',
    topic: 'Introduction to Machine Learning',
    shortDescription: 'Test foundational concepts of Supervised, Unsupervised, and Bias-Variance tradeoffs.',
    iconName: 'brain',
    questionCount: 5,
    difficultyDistribution: { easy: 2, medium: 2, hard: 1 },
    playgroundLabRoute: '/playground/linear-lab',
    recommendedLabTitle: 'Linear Regression Playground',
  },
  {
    id: 'linear-regression',
    title: 'Linear Regression',
    topic: 'Linear Regression',
    shortDescription: 'Master OLS Cost Minimization, MSE derivations, Normal Equation & L1/L2 Regularization.',
    iconName: 'line-chart',
    questionCount: 6,
    difficultyDistribution: { easy: 2, medium: 3, hard: 1 },
    playgroundLabRoute: '/playground/linear-lab',
    recommendedLabTitle: 'Linear Regression Laboratory',
  },
  {
    id: 'gradient-descent',
    title: 'Gradient Descent',
    topic: 'Gradient Descent',
    shortDescription: 'Evaluate SGD, Mini-Batch, Learning Rates, Momentum, and Adam Optimization step mechanics.',
    iconName: 'trending-down',
    questionCount: 6,
    difficultyDistribution: { easy: 2, medium: 3, hard: 1 },
    playgroundLabRoute: '/playground/gd-lab',
    recommendedLabTitle: 'Gradient Descent Laboratory',
  },
  {
    id: 'logistic-regression',
    title: 'Logistic Regression',
    topic: 'Logistic Regression',
    shortDescription: 'Assess Sigmoid activation, Log-Loss cost, Binary Decision Boundaries & Precision/Recall.',
    iconName: 'binary',
    questionCount: 6,
    difficultyDistribution: { easy: 2, medium: 3, hard: 1 },
    playgroundLabRoute: '/playground/logistic-lab',
    recommendedLabTitle: 'Logistic Regression Laboratory',
  },
  {
    id: 'decision-trees',
    title: 'Decision Trees',
    topic: 'Decision Trees',
    shortDescription: 'Examine Entropy, Information Gain, Gini Impurity, and Tree Pruning strategies.',
    iconName: 'git-branch',
    questionCount: 5,
    difficultyDistribution: { easy: 2, medium: 2, hard: 1 },
    playgroundLabRoute: '/playground/overfitting-lab',
    recommendedLabTitle: 'Overfitting & Capacity Laboratory',
  },
  {
    id: 'kmeans-clustering',
    title: 'K-Means Clustering',
    topic: 'K-Means Clustering',
    shortDescription: 'Analyze Unsupervised Centroid updates, Inertia WCSS, Elbow Method & Silhouette Scores.',
    iconName: 'layers',
    questionCount: 5,
    difficultyDistribution: { easy: 2, medium: 2, hard: 1 },
    playgroundLabRoute: '/playground/linear-lab',
    recommendedLabTitle: 'Feature Space Playground',
  },
  {
    id: 'pca',
    title: 'Principal Component Analysis (PCA)',
    topic: 'PCA',
    shortDescription: 'Evaluate Variance Maximization, Eigenvectors, Covariance Matrices & Dimensionality Reduction.',
    iconName: 'shrink',
    questionCount: 5,
    difficultyDistribution: { easy: 2, medium: 2, hard: 1 },
    playgroundLabRoute: '/playground/linear-lab',
    recommendedLabTitle: 'Dimensionality & Feature Space Lab',
  },
  {
    id: 'neural-networks',
    title: 'Neural Networks & Deep Learning',
    topic: 'Neural Networks',
    shortDescription: 'Calculate Forward Propagation, Backpropagation Chain Rule, Activations (ReLU, Softmax) & Dropout.',
    iconName: 'network',
    questionCount: 6,
    difficultyDistribution: { easy: 2, medium: 3, hard: 1 },
    playgroundLabRoute: '/playground/nn-lab',
    recommendedLabTitle: 'Neural Network Laboratory',
  },
  {
    id: 'overfitting-underfitting',
    title: 'Overfitting & Underfitting',
    topic: 'Overfitting',
    shortDescription: 'Diagnose High Bias vs High Variance, Learning Curves, Regularization & Early Stopping.',
    iconName: 'shield-alert',
    questionCount: 6,
    difficultyDistribution: { easy: 2, medium: 3, hard: 1 },
    playgroundLabRoute: '/playground/overfitting-lab',
    recommendedLabTitle: 'Overfitting Laboratory',
  },
  {
    id: 'master-case-study',
    title: 'Cumulative Master Case Study',
    topic: 'Cumulative Case Study',
    shortDescription: 'Multi-topic production scenario integration testing real-world ML deployment choices.',
    iconName: 'award',
    questionCount: 3,
    difficultyDistribution: { easy: 1, medium: 1, hard: 1 },
    playgroundLabRoute: '/playground/nn-lab',
    recommendedLabTitle: 'Neural Network & System Lab',
  },
];

// GET /api/practice/categories
exports.getCategories = async (req, res) => {
  try {
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/practice/quizzes
exports.getQuizzes = async (req, res) => {
  try {
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/practice/questions
exports.getQuestions = async (req, res) => {
  try {
    const { categoryId, difficulty } = req.query;
    res.json([]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/practice/start
exports.startQuiz = async (req, res) => {
  try {
    const { categoryId, difficulty } = req.body;
    res.json({ attemptId: `attempt-${Date.now()}`, categoryId, difficulty, startedAt: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/practice/submit
exports.submitQuiz = async (req, res) => {
  try {
    const { categoryId, categoryTitle, userAnswers, timeTakenSeconds, totalQuestions } = req.body;
    const user = req.user;

    // Calculate score
    const correctCount = userAnswers ? Object.keys(userAnswers).length : 0;
    const accuracyPercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const score = correctCount * 50 + (accuracyPercentage === 100 ? 100 : 0);

    if (user) {
      user.points = (user.points || 0) + score;
      await user.save();

      await Activity.create({
        user: user._id,
        type: 'practice',
        title: `Completed Quiz: ${categoryTitle || categoryId}`,
        description: `Scored ${accuracyPercentage}% (${correctCount}/${totalQuestions} correct) — +${score} XP`,
        timestamp: new Date(),
        score,
        metadata: { categoryId, accuracyPercentage, timeTakenSeconds },
      });
    }

    res.json({
      id: `attempt-${Date.now()}`,
      categoryId,
      categoryTitle,
      score,
      totalQuestions: totalQuestions || 5,
      correctCount,
      accuracyPercentage,
      timeTakenSeconds: timeTakenSeconds || 120,
      completedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Quiz submit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/practice/history
exports.getHistory = async (req, res) => {
  try {
    if (!req.user) return res.json([]);
    const activities = await Activity.find({ user: req.user._id, type: 'practice' })
      .sort({ timestamp: -1 })
      .limit(20);

    const history = activities.map((act) => ({
      id: act._id.toString(),
      categoryId: act.metadata?.categoryId || 'general',
      categoryTitle: act.title.replace('Completed Quiz: ', ''),
      score: act.score || 0,
      totalQuestions: 5,
      correctCount: Math.round(((act.metadata?.accuracyPercentage || 80) / 100) * 5),
      accuracyPercentage: act.metadata?.accuracyPercentage || 80,
      timeTakenSeconds: act.metadata?.timeTakenSeconds || 120,
      completedAt: act.timestamp.toISOString(),
    }));

    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/practice/stats
exports.getUserStats = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.json({ totalQuizzesCompleted: 0, averageAccuracy: 0, totalXP: 0, currentStreak: 0, questionsAnswered: 0, correctAnswered: 0 });
    }

    const activities = await Activity.find({ user: user._id, type: 'practice' });
    const totalQuizzesCompleted = activities.length;
    const totalAccuracySum = activities.reduce((sum, act) => sum + (act.metadata?.accuracyPercentage || 0), 0);
    const averageAccuracy = totalQuizzesCompleted > 0 ? Math.round(totalAccuracySum / totalQuizzesCompleted) : 0;

    res.json({
      totalQuizzesCompleted,
      averageAccuracy,
      totalXP: user.points || 0,
      currentStreak: user.streak || (totalQuizzesCompleted > 0 ? 1 : 0),
      questionsAnswered: totalQuizzesCompleted * 5,
      correctAnswered: Math.round((averageAccuracy / 100) * (totalQuizzesCompleted * 5)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
