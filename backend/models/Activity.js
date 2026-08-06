const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['practice', 'simulation', 'challenge', 'badge', 'achievement'], required: true },
  title: String,
  description: String,
  timestamp: { type: Date, default: Date.now },
  score: Number,
  metadata: mongoose.Schema.Types.Mixed,
});

module.exports = mongoose.model('Activity', ActivitySchema);
