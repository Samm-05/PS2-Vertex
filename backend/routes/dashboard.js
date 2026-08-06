const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router.get('/stats', authenticate, dashboardController.getStats);
router.get('/activity', authenticate, dashboardController.getRecentActivity);

module.exports = router;