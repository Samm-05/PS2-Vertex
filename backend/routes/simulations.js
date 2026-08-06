const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const sim = require('../controllers/simulationController');

router.post('/run', authenticate, sim.run);
router.post('/save', authenticate, sim.save);
router.get('/:id', authenticate, sim.getById);
router.get('/user', authenticate, sim.getUser);
router.delete('/:id', authenticate, sim.delete);
router.post('/compare', authenticate, sim.compare);

module.exports = router;