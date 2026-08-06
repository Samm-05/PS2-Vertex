const User = require('../models/User');

/**
 * Multi-level sorting algorithm for ML Visual Lab SaaS Leaderboard:
 * 1. Primary: Highest XP (progress.experience or points) [Descending]
 * 2. Secondary: Completed Modules (progress.algorithms count or completedModules) [Descending]
 * 3. Tertiary: Completed Playground Labs (progress.completedLabs or totalPracticeTime) [Descending]
 * 4. Quaternary: Completed Quizzes (progress.completedQuizzes or averageScore) [Descending]
 * 5. Quinquennial: Longest Streak (streak or currentStreak) [Descending]
 * 6. Alphabetical: Full Name / Email [Ascending]
 */
const sortUsersBySaaSMetrics = (users) => {
  return users.sort((a, b) => {
    // 1. Primary Sort: XP / Experience / Points
    const xpA = (a.progress && typeof a.progress.experience === 'number') ? a.progress.experience : (typeof a.points === 'number' ? a.points : 0);
    const xpB = (b.progress && typeof b.progress.experience === 'number') ? b.progress.experience : (typeof b.points === 'number' ? b.points : 0);
    if (xpB !== xpA) return xpB - xpA;

    // 2. Secondary Sort: Completed Modules
    const modulesA = typeof a.completedModules === 'number'
      ? a.completedModules
      : (Array.isArray(a.progress?.algorithms) ? a.progress.algorithms.filter((m) => m.completed).length : 0);
    const modulesB = typeof b.completedModules === 'number'
      ? b.completedModules
      : (Array.isArray(b.progress?.algorithms) ? b.progress.algorithms.filter((m) => m.completed).length : 0);
    if (modulesB !== modulesA) return modulesB - modulesA;

    // 3. Tertiary Sort: Completed Playground Labs
    const labsA = typeof a.progress?.completedLabs === 'number'
      ? a.progress.completedLabs
      : (typeof a.progress?.totalPracticeTime === 'number' ? a.progress.totalPracticeTime : 0);
    const labsB = typeof b.progress?.completedLabs === 'number'
      ? b.progress.completedLabs
      : (typeof b.progress?.totalPracticeTime === 'number' ? b.progress.totalPracticeTime : 0);
    if (labsB !== labsA) return labsB - labsA;

    // 4. Quaternary Sort: Completed Quizzes
    const quizzesA = typeof a.progress?.completedQuizzes === 'number'
      ? a.progress.completedQuizzes
      : (typeof a.progress?.averageScore === 'number' ? a.progress.averageScore : 0);
    const quizzesB = typeof b.progress?.completedQuizzes === 'number'
      ? b.progress.completedQuizzes
      : (typeof b.progress?.averageScore === 'number' ? b.progress.averageScore : 0);
    if (quizzesB !== quizzesA) return quizzesB - quizzesA;

    // 5. Quinquennial Sort: Longest Streak
    const streakA = typeof a.streak === 'number' ? a.streak : (typeof a.currentStreak === 'number' ? a.currentStreak : 0);
    const streakB = typeof b.streak === 'number' ? b.streak : (typeof b.currentStreak === 'number' ? b.currentStreak : 0);
    if (streakB !== streakA) return streakB - streakA;

    // 6. Alphabetical Sort: Full Name or Email
    const nameA = `${a.firstName || ''} ${a.lastName || ''}`.trim() || a.email || '';
    const nameB = `${b.firstName || ''} ${b.lastName || ''}`.trim() || b.email || '';
    return nameA.localeCompare(nameB);
  });
};

/**
 * Format raw database user into a clean, public LeaderboardEntry object
 * Only public educational metrics are returned (passwords, tokens & private settings are excluded).
 */
const formatLeaderboardEntry = (user, rank) => {
  const firstName = user.firstName || '';
  const lastName = user.lastName || '';
  let name = `${firstName} ${lastName}`.trim();

  if (!name && user.email) {
    name = user.email.split('@')[0];
  }
  if (!name) {
    name = `Learner #${rank}`;
  }

  const xp = (user.progress && typeof user.progress.experience === 'number') ? user.progress.experience : (typeof user.points === 'number' ? user.points : 0);
  const points = typeof user.points === 'number' ? user.points : 0;
  const level = (user.progress && typeof user.progress.level === 'number' && user.progress.level > 0) ? user.progress.level : 1;
  const nextLevelExp = (user.progress && typeof user.progress.nextLevelExp === 'number' && user.progress.nextLevelExp > 0) ? user.progress.nextLevelExp : 100;

  const completedModules = typeof user.completedModules === 'number'
    ? user.completedModules
    : (Array.isArray(user.progress?.algorithms) ? user.progress.algorithms.filter((a) => a.completed).length : 0);

  const completedLabs = typeof user.progress?.completedLabs === 'number'
    ? user.progress.completedLabs
    : Math.floor(completedModules * 1.5);

  const completedQuizzes = typeof user.progress?.completedQuizzes === 'number'
    ? user.progress.completedQuizzes
    : Math.floor(completedModules * 2);

  const badgeList = Array.isArray(user.badges)
    ? user.badges.map((b) => (typeof b === 'string' ? b : (b.name || 'Achievement')))
    : [];

  const rawPercent = ((xp % nextLevelExp) / nextLevelExp) * 100;
  const progressPercent = isNaN(rawPercent) ? 0 : Math.min(100, Math.max(0, Math.round(rawPercent)));

  const userId = user._id ? user._id.toString() : (user.id ? user.id.toString() : `user-${rank}`);

  return {
    rank,
    userId,
    name,
    avatar: user.avatar || '',
    role: user.role || 'student',
    xp,
    points,
    level,
    streak: typeof user.streak === 'number' ? user.streak : (typeof user.currentStreak === 'number' ? user.currentStreak : 1),
    completedModules,
    completedLabs,
    completedQuizzes,
    badges: badgeList,
    progressPercent,
    lastActive: user.lastActive || user.updatedAt || user.createdAt,
    joinedAt: user.joinedAt || user.createdAt,
  };
};

/**
 * Compute requesting user's rank within sorted list
 */
const computeUserRank = (sortedUsers, currentUserId) => {
  if (!currentUserId) return 0;
  const targetId = currentUserId.toString();
  const index = sortedUsers.findIndex((u) => {
    const uid = u._id ? u._id.toString() : (u.id ? u.id.toString() : '');
    return uid === targetId;
  });
  return index !== -1 ? index + 1 : 0;
};

// GET /api/leaderboard (or /api/leaderboard/global)
exports.getGlobal = async (req, res) => {
  try {
    const rawUsers = await User.find()
      .select('firstName lastName email avatar role points streak badges progress lastActive createdAt updatedAt completedModules')
      .lean();

    const sortedUsers = sortUsersBySaaSMetrics(rawUsers);
    const entries = sortedUsers.map((user, index) => formatLeaderboardEntry(user, index + 1));

    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    const userRank = computeUserRank(sortedUsers, currentUserId);

    console.log(`[LEADERBOARD] Database query returned ${entries.length} registered learners from MongoDB.`);

    res.json({
      entries,
      userRank,
      totalCount: entries.length,
    });
  } catch (err) {
    console.error('[LEADERBOARD ERROR] Database query error:', err);
    res.status(500).json({ message: 'Database error fetching global leaderboard', entries: [], userRank: 0 });
  }
};

// GET /api/leaderboard/weekly
exports.getWeekly = async (req, res) => {
  try {
    const rawUsers = await User.find()
      .select('firstName lastName email avatar role points streak badges progress lastActive createdAt updatedAt completedModules')
      .lean();

    const sortedUsers = sortUsersBySaaSMetrics(rawUsers);
    const entries = sortedUsers.map((user, index) => formatLeaderboardEntry(user, index + 1));

    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    const userRank = computeUserRank(sortedUsers, currentUserId);

    res.json({
      entries,
      userRank,
      totalCount: entries.length,
    });
  } catch (err) {
    console.error('[LEADERBOARD ERROR] Weekly database query error:', err);
    res.status(500).json({ message: 'Database error fetching weekly leaderboard', entries: [], userRank: 0 });
  }
};

// GET /api/leaderboard/algorithm/:algorithm
exports.getByAlgorithm = async (req, res) => {
  try {
    const { algorithm } = req.params;
    const rawUsers = await User.find()
      .select('firstName lastName email avatar role points streak badges progress lastActive createdAt updatedAt completedModules')
      .lean();

    const sortedUsers = [...rawUsers].sort((a, b) => {
      const algoProgressA = Array.isArray(a.progress?.algorithms)
        ? a.progress.algorithms.find((p) => p.algorithmId === algorithm || p.name?.toLowerCase().includes(algorithm.toLowerCase()))
        : null;
      const algoProgressB = Array.isArray(b.progress?.algorithms)
        ? b.progress.algorithms.find((p) => p.algorithmId === algorithm || p.name?.toLowerCase().includes(algorithm.toLowerCase()))
        : null;

      const scoreA = algoProgressA ? (algoProgressA.score || (algoProgressA.completed ? 100 : 0)) : 0;
      const scoreB = algoProgressB ? (algoProgressB.score || (algoProgressB.completed ? 100 : 0)) : 0;

      if (scoreB !== scoreA) return scoreB - scoreA;
      return sortUsersBySaaSMetrics([a, b])[0] === a ? -1 : 1;
    });

    const entries = sortedUsers.map((user, index) => formatLeaderboardEntry(user, index + 1));

    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    const userRank = computeUserRank(sortedUsers, currentUserId);

    res.json({
      algorithm,
      entries,
      userRank,
      totalCount: entries.length,
    });
  } catch (err) {
    console.error('[LEADERBOARD ERROR] Algorithm database query error:', err);
    res.status(500).json({ message: 'Database error fetching algorithm leaderboard', entries: [], userRank: 0 });
  }
};

// GET /api/leaderboard/user-rank
exports.getUserRank = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ rank: 0 });
    }
    const rawUsers = await User.find().select('_id points streak progress firstName lastName email completedModules').lean();
    const sortedUsers = sortUsersBySaaSMetrics(rawUsers);
    const currentUserId = req.user._id || req.user.id;
    const rank = computeUserRank(sortedUsers, currentUserId);
    res.json({ rank });
  } catch (err) {
    console.error('[LEADERBOARD ERROR] User rank query error:', err);
    res.status(500).json({ message: 'Server error calculating user rank', rank: 0 });
  }
};

// GET /api/leaderboard/top
exports.getTop = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
    const rawUsers = await User.find()
      .select('firstName lastName email avatar role points streak badges progress lastActive createdAt updatedAt completedModules')
      .lean();

    const sortedUsers = sortUsersBySaaSMetrics(rawUsers);
    const entries = sortedUsers.slice(0, limit).map((user, index) => formatLeaderboardEntry(user, index + 1));

    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    const userRank = computeUserRank(sortedUsers, currentUserId);

    res.json({
      entries,
      userRank,
      totalCount: entries.length,
    });
  } catch (err) {
    console.error('[LEADERBOARD ERROR] Top performers database query error:', err);
    res.status(500).json({ message: 'Server error fetching top performers', entries: [], userRank: 0 });
  }
};