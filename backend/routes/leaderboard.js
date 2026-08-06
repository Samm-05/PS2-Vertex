const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const lb = require('../controllers/leaderboardController');

router.get('/global', authenticate, lb.getGlobal);
router.get('/weekly', authenticate, lb.getWeekly);
router.get('/algorithm/:algorithm', authenticate, lb.getByAlgorithm);
router.get('/user-rank', authenticate, lb.getUserRank);
router.get('/top', authenticate, lb.getTop);

module.exports = router;
