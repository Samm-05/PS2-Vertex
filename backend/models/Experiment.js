const mongoose = require('mongoose');

const ExperimentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    userName: { type: String, default: '' },
    algorithm: { type: String, required: true, index: true }, // 'linear-regression', 'logistic-regression', 'gradient-descent', 'kmeans', 'neural-network', 'overfitting'
    title: { type: String, required: true, trim: true },
    parameters: { type: Object, default: {} },
    dataset: { type: Object, default: {} },
    metrics: { type: Object, default: {} },
    visualizationState: { type: Object, default: {} },
    chartData: { type: Object, default: {} },
    pdfUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

ExperimentSchema.index({ user: 1, algorithm: 1, createdAt: -1 });

ExperimentSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id ? ret._id.toString() : undefined;
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('Experiment', ExperimentSchema);