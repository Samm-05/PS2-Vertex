const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

// Profile & Settings Base Routes
router.get('/', authenticate, profileController.getProfile);
router.put('/', authenticate, profileController.updateProfile);
router.post('/avatar', authenticate, upload.single('avatar'), profileController.uploadAvatar);

// Specific Settings Sub-Endpoints
router.put('/settings', authenticate, profileController.updateSettings);
router.patch('/preferences', authenticate, profileController.updatePreferences);
router.patch('/notifications', authenticate, profileController.updateNotifications);
router.patch('/theme', authenticate, profileController.updateTheme);
router.patch('/security', authenticate, profileController.updateSecurity);

// Account, Security & Progress Actions
router.post('/change-password', authenticate, profileController.changePassword);
router.delete('/account', authenticate, profileController.deleteAccount);
router.get('/export', authenticate, profileController.exportData);
router.get('/simulations', authenticate, profileController.getSavedSimulations);
router.post('/simulations/:id', authenticate, profileController.saveSimulation);
router.delete('/simulations/:id', authenticate, profileController.removeSimulation);
router.get('/achievements', authenticate, profileController.getAchievements);
router.get('/progress', authenticate, profileController.getProgress);
router.get('/activity', authenticate, profileController.getActivity);

module.exports = router;