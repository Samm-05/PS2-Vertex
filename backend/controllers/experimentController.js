const Experiment = require('../models/Experiment');
const Activity = require('../models/Activity');

// POST /api/experiments/save
exports.saveExperiment = async (req, res) => {
  try {
    const { algorithm, title, parameters, dataset, metrics, visualizationState, chartData } = req.body;

    if (!algorithm || !title) {
      return res.status(400).json({ message: 'Algorithm and title are required.' });
    }

    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;

    const experiment = new Experiment({
      user: req.user._id,
      userName,
      algorithm,
      title,
      parameters: parameters || {},
      dataset: dataset || {},
      metrics: metrics || {},
      visualizationState: visualizationState || {},
      chartData: chartData || {},
    });

    await experiment.save();

    // Award +50 XP and log activity
    req.user.points = (req.user.points || 0) + 50;
    await req.user.save();

    await Activity.create({
      user: req.user._id,
      type: 'simulation',
      title: `Saved Experiment: ${title}`,
      description: `Algorithm: ${algorithm} | Target Loss: ${metrics?.loss?.toFixed?.(4) || metrics?.wcss?.toFixed?.(2) || 'N/A'}`,
      timestamp: new Date(),
    });

    console.log(`[EXPERIMENT SAVED] User ${req.user.email} saved ${algorithm} experiment "${title}".`);
    res.status(201).json(experiment.toJSON ? experiment.toJSON() : experiment);
  } catch (err) {
    console.error('[SAVE EXPERIMENT ERROR]:', err);
    res.status(500).json({ message: 'Server error saving experiment' });
  }
};

// GET /api/experiments/user/:algorithm
exports.getUserExperiments = async (req, res) => {
  try {
    const { algorithm } = req.params;
    const filter = { user: req.user._id };

    if (algorithm && algorithm !== 'all') {
      filter.algorithm = algorithm;
    }

    const experiments = await Experiment.find(filter).sort({ createdAt: -1 });
    res.json(experiments.map((exp) => (exp.toJSON ? exp.toJSON() : exp)));
  } catch (err) {
    console.error('[GET USER EXPERIMENTS ERROR]:', err);
    res.status(500).json({ message: 'Server error fetching experiments' });
  }
};

// GET /api/experiments/:id
exports.getExperimentById = async (req, res) => {
  try {
    const { id } = req.params;
    const experiment = await Experiment.findOne({ _id: id, user: req.user._id });

    if (!experiment) {
      return res.status(404).json({ message: 'Experiment not found' });
    }

    res.json(experiment.toJSON ? experiment.toJSON() : experiment);
  } catch (err) {
    console.error('[GET EXPERIMENT BY ID ERROR]:', err);
    res.status(500).json({ message: 'Server error fetching experiment' });
  }
};

// DELETE /api/experiments/:id
exports.deleteExperiment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Experiment.deleteOne({ _id: id, user: req.user._id });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Experiment not found or unauthorized' });
    }

    res.json({ message: 'Experiment deleted successfully', id });
  } catch (err) {
    console.error('[DELETE EXPERIMENT ERROR]:', err);
    res.status(500).json({ message: 'Server error deleting experiment' });
  }
};

// POST /api/reports/pdf
exports.generateReportPDF = async (req, res) => {
  try {
    const { experimentId, algorithm, parameters, metrics, title } = req.body;
    const userName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;

    const reportData = {
      title: title || `${algorithm} Experiment Report`,
      algorithm: algorithm || 'Machine Learning',
      studentName: userName,
      experimentId: experimentId || `EXP-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      parameters: parameters || {},
      metrics: metrics || {},
      version: 'v2.4.0-SaaS',
    };

    res.json(reportData);
  } catch (err) {
    console.error('[GENERATE REPORT ERROR]:', err);
    res.status(500).json({ message: 'Server error generating PDF report' });
  }
};