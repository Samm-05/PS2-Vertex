const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const notifController = require('../controllers/notificationController');

router.get('/', authenticate, notifController.getNotifications);
router.patch('/read-all', authenticate, notifController.markAllAsRead);
router.patch('/:id/read', authenticate, notifController.markAsRead);

module.exports = router;