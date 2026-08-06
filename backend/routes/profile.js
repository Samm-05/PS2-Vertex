const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const multer = require('multer');
const path = require('path');

// configure multer for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

router.get('/', authenticate, profileController.getProfile);
router.put('/', authenticate, profileController.updateProfile);
router.post('/avatar', authenticate, upload.single('avatar'), profileController.uploadAvatar);
router.get('/simulations', authenticate, profileController.getSavedSimulations);
router.post('/simulations/:id', authenticate, profileController.saveSimulation);
router.delete('/simulations/:id', authenticate, profileController.removeSimulation);
router.get('/achievements', authenticate, profileController.getAchievements);
router.put('/settings', authenticate, profileController.updateSettings);
router.get('/progress', authenticate, profileController.getProgress);
router.get('/activity', authenticate, profileController.getActivity);
router.post('/change-password', authenticate, profileController.changePassword);
router.delete('/account', authenticate, profileController.deleteAccount);
router.get('/export', authenticate, profileController.exportData);

module.exports = router;