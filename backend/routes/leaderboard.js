const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const lb = require('../controllers/leaderboardController');

// Optional Authentication Middleware: populates req.user if token provided, but lets guests proceed smoothly
const optionalAuthenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const secret = process.env.ACCESS_TOKEN_SECRET || 'supersecretaccesstoken';
        const payload = jwt.verify(token, secret);
        if (payload && payload.id) {
          const user = await User.findById(payload.id).select('_id firstName lastName email role');
          if (user) {
            req.user = user;
          }
        }
      }
    }
  } catch (err) {
    // Ignore invalid/expired token for optional reading endpoints
  }
  next();
};

// Root route and global routes
router.get('/', optionalAuthenticate, lb.getGlobal);
router.get('/global', optionalAuthenticate, lb.getGlobal);
router.get('/weekly', optionalAuthenticate, lb.getWeekly);
router.get('/algorithm/:algorithm', optionalAuthenticate, lb.getByAlgorithm);
router.get('/user-rank', optionalAuthenticate, lb.getUserRank);
router.get('/top', optionalAuthenticate, lb.getTop);

module.exports = router;