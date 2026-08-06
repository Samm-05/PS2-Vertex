const express = require('express');
const router = express.Router();
const practiceController = require('../controllers/practiceController');
const { authenticate } = require('../middleware/auth');

router.get('/categories', authenticate, practiceController.getCategories);
router.get('/quizzes', authenticate, practiceController.getQuizzes);
router.get('/questions', authenticate, practiceController.getQuestions);
router.post('/start', authenticate, practiceController.startQuiz);
router.post('/submit', authenticate, practiceController.submitQuiz);
router.get('/history', authenticate, practiceController.getHistory);
router.get('/stats', authenticate, practiceController.getUserStats);

module.exports = router;
