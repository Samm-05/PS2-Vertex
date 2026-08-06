const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practiceController');
const { authenticate } = require('../middleware/auth');

router.get('/challenges', authenticate, practiceController.getChallenges);
router.post('/challenges/:id/submit', authenticate, practiceController.submitChallenge);
router.get('/stats', authenticate, practiceController.getUserStats);

module.exports = router;
