import { TutorialStep } from '../types';

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: '1. What is Linear Regression?',
    subtitle: 'Fitting a Line to Data Points',
    objective: 'Inspect the 3D data point cloud and the initial random regression line.',
    concept:
      'Linear Regression models the relationship between an independent variable x and a dependent variable y by fitting a straight line ŷ = wx + b through the data.',
    formula: '\\hat{y} = w x + b',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
      datasetSize: 30,
      wInitial: 0.2,
      bInitial: 1.0,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 0,
    hint: 'Rotate the 3D scene. Notice the glowing blue dots (data points) and the initial regression line.',
  },
  {
    id: 2,
    title: '2. Dependent & Independent Variables',
    subtitle: 'Understanding Input Features (X) & Targets (Y)',
    objective: 'Hover over a data point in 3D to view its (X, Y) coordinates.',
    concept:
      'In our 2D/3D space, the horizontal X axis is the feature (e.g. house size) and the vertical Y axis is the target label we want to predict (e.g. house price).',
    formula: 'x \\in \\mathbb{R}, \\quad y \\in \\mathbb{R}',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 0,
    hint: 'Move your mouse over any glowing sphere to inspect its X value, actual Y value, and predicted Ŷ value.',
  },
  {
    id: 3,
    title: '3. The Weight / Slope (w)',
    subtitle: 'Controlling Line Steepness & Direction',
    objective: 'Click play to watch slope w adjust as the line rotates downhill.',
    concept:
      'The weight w determines the slope of the line. Positive slope (w > 0) means y increases with x; negative slope (w < 0) means y decreases as x increases.',
    formula: 'w = \\frac{\\Delta y}{\\Delta x}',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
      wInitial: -1.0,
      bInitial: 2.0,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 3,
    hint: 'Press Play and watch the regression line rotate as gradient descent pushes w toward the true positive slope (~1.5).',
  },
  {
    id: 4,
    title: '4. The Bias / Intercept (b)',
    subtitle: 'Vertical Shift (y-intercept at x = 0)',
    objective: 'Observe how bias b shifts the line vertically up and down.',
    concept:
      'The bias b represents the y-intercept where x = 0. It allows the regression line to move vertically to align with dataset offset.',
    formula: 'b = \\hat{y} \\quad \\text{when } x = 0',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
      wInitial: 1.2,
      bInitial: -3.0,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 3,
    hint: 'Watch how bias b translates the line vertically upwards to match the dataset height.',
  },
  {
    id: 5,
    title: '5. Prediction Equation ŷ = wx + b',
    subtitle: 'Generating Model Estimates for Every Point',
    objective: 'Observe how the model computes predicted ŷ for each x.',
    concept:
      'For every data point x_i, the model evaluates ŷ_i = w x_i + b to project where the line estimates the target value to be.',
    formula: '\\hat{y}_i = w x_i + b',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 1,
    hint: 'Check the Math Panel at the bottom to see live calculations of ŷ for sample points.',
  },
  {
    id: 6,
    title: '6. Understanding Residual Errors',
    subtitle: 'The Gap Between Prediction & Reality (y - ŷ)',
    objective: 'Observe the vertical red/amber lines connecting points to the line.',
    concept:
      'A residual error e_i = y_i - ŷ_i is the vertical distance between an actual data point and the model prediction line. Shorter lines mean better predictions!',
    formula: 'e_i = y_i - \\hat{y}_i',
    presetParams: {
      preset: 'noisy',
      learningRate: 0.03,
      wInitial: 0.1,
      bInitial: 0.5,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 2,
    hint: 'Notice the red vertical lines (residuals). As training progresses, these lines shrink!',
  },
  {
    id: 7,
    title: '7. Mean Squared Error (MSE)',
    subtitle: 'Quantifying Total Model Performance',
    objective: 'Reduce MSE loss below 0.5 during training.',
    concept:
      'MSE averages the squared residuals across all n data points. Minimizing MSE is the main goal of linear regression.',
    formula: 'MSE = \\frac{1}{n} \\sum_{i=1}^n (y_i - \\hat{y}_i)^2',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
      wInitial: 0.1,
      bInitial: 1.0,
    },
    verification: (_params, steps, currentStep) => currentStep > 0 && steps[currentStep]?.mseLoss < 0.5,
    hint: 'Press Play and watch the Loss (MSE) curve drop in the live analytics graphs.',
  },
  {
    id: 8,
    title: '8. Why Square the Residuals?',
    subtitle: 'L2 Loss & Outlier Penalty',
    objective: 'Observe how large residuals are penalized heavily.',
    concept:
      'Squaring ensures negative and positive errors do not cancel each other out, and applies quadratic scaling (an error of 4 contributes 16 to loss, while 2 contributes 4).',
    formula: '(y_i - \\hat{y}_i)^2 \\ge 0',
    presetParams: {
      preset: 'noisy',
      learningRate: 0.03,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 2,
    hint: 'Notice how points farthest from the line produce thick red residual lines!',
  },
  {
    id: 9,
    title: '9. Gradient Descent for Regression',
    subtitle: 'Calculating Partial Derivatives ∂J/∂w and ∂J/∂b',
    objective: 'Watch slope w and bias b update simultaneously every epoch.',
    concept:
      'Gradient descent computes the derivative of MSE loss with respect to w and b, guiding both parameters downhill toward the minimum.',
    formula: '\\frac{\\partial J}{\\partial w} = \\frac{1}{n} \\sum (\\hat{y}_i - y_i) x_i',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 4,
    hint: 'Watch the live formula panel update gradients ∂J/∂w and ∂J/∂b on every iteration.',
  },
  {
    id: 10,
    title: '10. Updating Weight (w)',
    subtitle: 'Adjusting Line Angle (Δw = -α ∂J/∂w)',
    objective: 'Observe w adjust smoothly toward the true slope.',
    concept:
      'If predictions are too low for high X values, ∂J/∂w is negative, causing w to increase and tilting the line upward.',
    formula: 'w^{(t+1)} = w^{(t)} - \\alpha \\frac{\\partial J}{\\partial w}',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 5,
    hint: 'Track the Weight (w) graph in the bottom panel as it approaches stability.',
  },
  {
    id: 11,
    title: '11. Updating Bias (b)',
    subtitle: 'Translating Line Height (Δb = -α ∂J/∂b)',
    objective: 'Observe bias b shift the line vertically.',
    concept:
      'If predictions are systematically lower than actual Y values on average, ∂J/∂b is negative, lifting the entire line upward.',
    formula: 'b^{(t+1)} = b^{(t)} - \\alpha \\frac{\\partial J}{\\partial b}',
    presetParams: {
      preset: 'positive',
      learningRate: 0.03,
    },
    verification: (_params, _steps, currentStep) => currentStep >= 5,
    hint: 'Track the Bias (b) readout in the Live State & Metrics panel.',
  },
  {
    id: 12,
    title: '12. Learning Rate & Stability',
    subtitle: 'Optimal Step Size vs Overshooting',
    objective: 'Compare small vs high learning rates.',
    concept:
      'A small α converges smoothly but slowly; an excessively large α causes the line to spin erratically and diverge.',
    formula: '\\text{If } \\alpha \\text{ too high } \\implies MSE \\to \\infty',
    presetParams: {
      preset: 'positive',
      learningRate: 0.05,
    },
    verification: (params) => params.learningRate > 0,
    hint: 'Try switching between Very Small, Optimal, and Too Large learning rates.',
  },
  {
    id: 13,
    title: '13. Underfitting vs Good Fit',
    subtitle: 'Evaluating Model Capacity',
    objective: 'Train model until residual error lines shrink to minimal lengths.',
    concept:
      'Before training, a line with arbitrary w and b underfits the dataset. After training, the line achieves the optimal global minimum for MSE.',
    formula: '\\min_{w,b} \\frac{1}{n} \\sum (y_i - (w x_i + b))^2',
    presetParams: {
      preset: 'positive',
      learningRate: 0.04,
    },
    verification: (_params, steps, currentStep) => currentStep > 0 && steps[currentStep]?.mseLoss < 0.3,
    hint: 'Run training to completion and verify how thin and transparent the residual lines become.',
  },
  {
    id: 14,
    title: '14. Negative Correlation Datasets',
    subtitle: 'Fitting Downward Sloping Relationships (w < 0)',
    objective: 'Train a regression line on a negative correlation dataset.',
    concept:
      'When feature X and target Y have an inverse relationship (e.g. car age vs price), the optimal slope w will be negative.',
    formula: 'w^* < 0',
    presetParams: {
      preset: 'negative',
      learningRate: 0.03,
      wInitial: 0.5,
      bInitial: 5.0,
    },
    verification: (params) => params.preset === 'negative',
    hint: 'Notice how slope w transitions from positive to negative during training.',
  },
  {
    id: 15,
    title: '15. Master Regression Challenge',
    subtitle: 'Achieve Optimal Fit on Noisy Dataset (MSE < 0.25)',
    objective: 'Achieve MSE < 0.25 in under 30 epochs on noisy data!',
    concept:
      'Combine appropriate learning rate, batch size, and regularization to find the line of best fit on noisy real-world data.',
    formula: 'MSE < 0.25',
    presetParams: {
      preset: 'noisy',
      learningRate: 0.04,
      epochs: 50,
      wInitial: 0.1,
      bInitial: 1.0,
    },
    verification: (_params, steps, currentStep) => currentStep > 0 && steps[currentStep]?.mseLoss < 0.25,
    hint: 'Set Learning Rate to 0.04 and click Play to achieve fast convergence on noisy data!',
  },
];
