const mongoose = require('mongoose');

const SimulationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: 'Untitled Simulation' },
  algorithm: { type: String, required: true },
  parameters: { type: mongoose.Schema.Types.Mixed, default: {} },
  results: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Simulation', SimulationSchema);
