import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DatasetIcon,
  TrainingIcon,
  GradientDescentIcon,
  WeightUpdateIcon,
  PredictionIcon,
  EvaluationIcon,
} from '../../assets/svg/MLPipelineAssets';

interface PipelineStep {
  id: string;
  name: string;
  subtitle: string;
  icon: React.FC<{ className?: string }>;
  formula: string;
  description: string;
  details: string[];
}

const pipelineSteps: PipelineStep[] = [
  {
    id: 'dataset',
    name: '1. Dataset',
    subtitle: 'Feature Ingestion',
    icon: DatasetIcon,
    formula: 'X ∈ ℝᵐˣⁿ, y ∈ ℝᵐ',
    description: 'Raw data points, features, and target labels are loaded into matrix structures for training.',
    details: [
      'Normalizes feature scaling to prevent gradient distortion.',
      'Splits dataset into training, validation, and test sets.',
      'Handles missing values and categorical encoding.',
    ],
  },
  {
    id: 'training',
    name: '2. Training',
    subtitle: 'Model Initialization',
    icon: TrainingIcon,
    formula: 'ŷ = W · X + b',
    description: 'Weights (W) and bias (b) vector parameters are initialized randomly or with Xavier distribution.',
    details: [
      'Sets initial hypothesis boundary prior to learning.',
      'Configures learning rate hyperparameter α.',
      'Prepares forward pass compute graph.',
    ],
  },
  {
    id: 'gradient-descent',
    name: '3. Gradient Descent',
    subtitle: 'Loss Optimization',
    icon: GradientDescentIcon,
    formula: '∇J(W) = ∂J / ∂W',
    description: 'Computes partial derivatives of the loss function J(W) with respect to model parameters.',
    details: [
      'Evaluates direction of steepest slope on the error surface.',
      'Supports Batch, Mini-batch, and Stochastic gradient descent.',
      'Visualizes 3D loss landscape in real time.',
    ],
  },
  {
    id: 'weight-update',
    name: '4. Weight Update',
    subtitle: 'Parameter Adjustment',
    icon: WeightUpdateIcon,
    formula: 'W := W - α · ∇J(W)',
    description: 'Adjusts parameter values in the opposite direction of the gradient to shrink total loss.',
    details: [
      'Steps down the error contour toward global minimum.',
      'Applies L1 / L2 regularization penalty terms.',
      'Dynamic learning rate decay prevents overshoot.',
    ],
  },
  {
    id: 'prediction',
    name: '5. Prediction',
    subtitle: 'Inference Step',
    icon: PredictionIcon,
    formula: 'ŷ_test = σ(W · X_test + b)',
    description: 'Passes unseen validation samples through optimized parameters to produce outputs.',
    details: [
      'Computes continuous regression values or probability scores.',
      'Applies classification decision thresholds (e.g. 0.5).',
      'Renders predictions on interactive canvas.',
    ],
  },
  {
    id: 'evaluation',
    name: '6. Evaluation',
    subtitle: 'Metrics Benchmark',
    icon: EvaluationIcon,
    formula: 'Accuracy = (TP + TN) / Total',
    description: 'Calculates performance metrics such as MSE, R² score, Precision, Recall, and Confusion Matrix.',
    details: [
      'Measures how well model generalizes to new data.',
      'Identifies potential overfitting or underfitting.',
      'Updates global leaderboard leaderboard score.',
    ],
  },
];

export const PipelineSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<PipelineStep>(pipelineSteps[0]);

  return (
    <section id="pipeline" className="py-24 bg-secondary-950 text-white relative overflow-hidden">
      {/* Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[20rem] rounded-full bg-primary-600/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-accent-400">
            Interactive Architecture
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mt-2">
            The Live Machine Learning Pipeline
          </h2>
          <p className="mt-4 text-secondary-400 text-base sm:text-lg">
            Hover over any pipeline node to inspect the exact mathematical computations happening under the hood.
          </p>
        </div>

        {/* Pipeline Nodes Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {pipelineSteps.map((step, index) => {
            const Icon = step.icon;
            const isSelected = activeStep.id === step.id;

            return (
              <motion.button
                key={step.id}
                type="button"
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActiveStep(step)}
                onMouseEnter={() => setActiveStep(step)}
                className={`relative p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-secondary-900 border-primary-500 shadow-[0_0_25px_rgba(99,102,241,0.3)] ring-1 ring-primary-500'
                    : 'bg-secondary-900/60 border-secondary-800 hover:border-secondary-600'
                }`}
              >
                {/* Node Step Header */}
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-2.5 rounded-xl ${
                      isSelected
                        ? 'bg-primary-600 text-white'
                        : 'bg-secondary-800 text-secondary-400'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-secondary-800 text-secondary-400">
                    Step 0{index + 1}
                  </span>
                </div>

                {/* Node Title */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5">{step.name}</h3>
                  <p className="text-xs text-secondary-400 font-medium">{step.subtitle}</p>
                </div>

                {/* Pulsing Active Indicator Line */}
                {isSelected && (
                  <motion.div
                    layoutId="pipeline-active"
                    className="absolute bottom-0 left-4 right-4 h-1 rounded-full bg-gradient-to-r from-primary-500 to-accent-400"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Detailed Explanation Modal Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="rounded-3xl border border-secondary-800 bg-secondary-900/80 backdrop-blur-xl p-8 shadow-2xl grid lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-primary-500/10 border border-primary-500/30 text-primary-300 text-xs font-mono">
                <span>Phase Math Definition</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                {activeStep.name} — {activeStep.subtitle}
              </h3>
              <p className="text-secondary-300 text-base leading-relaxed">
                {activeStep.description}
              </p>

              <div className="pt-2">
                <h4 className="text-xs font-mono uppercase tracking-wider text-secondary-400 mb-3">
                  Key Computational Operations
                </h4>
                <ul className="space-y-2">
                  {activeStep.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-secondary-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Formula Preview Box */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-secondary-950 border border-secondary-800 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-mono text-secondary-500 uppercase tracking-widest mb-3">
                Mathematical Model Formula
              </span>
              <div className="p-4 rounded-xl bg-secondary-900 border border-secondary-800 w-full mb-4">
                <code className="text-xl sm:text-2xl font-mono font-bold text-primary-300">
                  {activeStep.formula}
                </code>
              </div>
              <p className="text-xs text-secondary-400">
                Executed live in browser memory during simulation steps.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default PipelineSection;
