const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const expController = require('../controllers/experimentController');

// PDF Report Routes
router.post('/pdf', authenticate, expController.generateReportPDF);

module.exports = router;