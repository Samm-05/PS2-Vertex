import { CoachModule } from './types';

export const coachModulesData: CoachModule[] = [
  // =========================================================================
  // MODULE 1: INTRODUCTION TO MACHINE LEARNING (10 SECTIONS)
  // =========================================================================
  {
    id: 'intro-ml',
    moduleNumber: 1,
    title: 'Introduction to Machine Learning',
    shortDescription: 'Foundations of Supervised, Unsupervised, Bias-Variance & End-to-End ML Pipeline.',
    iconName: 'sparkles',
    sections: [
      {
        id: 'sec-1-1',
        title: '1. Overview & Paradigm Shift: Rules vs Learning',
        paragraphs: [
          'Machine Learning (ML) is a subfield of Artificial Intelligence (AI) focused on building algorithms that infer mathematical functions f(X) ≈ y directly from empirical data without relying on hardcoded, rule-based logic.',
          'In traditional software engineering, developers write explicit rules that convert inputs into outputs: Rules + Data ➔ Answers. In Machine Learning, algorithms infer the underlying rules from examples: Data + Answers ➔ Rules.',
          'This paradigm shift enables computers to solve complex non-linear problems such as computer vision, natural language understanding, autonomous driving, and financial fraud detection where writing explicit manual rules is humanly impossible.',
        ],
        mathFormula: 'f: X \\to Y \\quad \\text{such that} \\quad \\min_{\\theta} \\sum_{i=1}^{m} L\\left( f_\\theta(x^{(i)}), y^{(i)} \\right)',
        bulletPoints: [
          { label: 'Traditional Paradigm', text: 'Hardcoded conditional rules (if/else). Breaks when data complexity or dimension scale grows.' },
          { label: 'Machine Learning Paradigm', text: 'Statistical optimization over parameters θ to minimize prediction loss on empirical data.' },
        ],
      },
      {
        id: 'sec-1-2',
        title: '2. The ML Taxonomy: Supervised, Unsupervised & Reinforcement',
        paragraphs: [
          'Machine Learning algorithms are broadly categorized into four primary paradigms based on the presence and nature of feedback signals during training.',
          'Understanding which paradigm to apply depends on dataset labeling availability, task objectives, and interaction environments.',
        ],
        mathFormula: '\\mathcal{D}_{sup} = \\{(x^{(i)}, y^{(i)})\\}_{i=1}^m, \\quad \\mathcal{D}_{unsup} = \\{x^{(i)}\\}_{i=1}^m',
        bulletPoints: [
          { label: 'Supervised Learning', text: 'Target labels (y) are provided for training features (X). Goals: Regression (continuous y) or Classification (discrete y).' },
          { label: 'Unsupervised Learning', text: 'No target labels provided. Goals: Clustering (K-Means), Dimensionality Reduction (PCA), Anomaly Detection.' },
          { label: 'Semi-Supervised & Self-Supervised', text: 'Leverages small amounts of labeled data with massive unlabeled datasets (e.g., LLM masked pretraining).' },
          { label: 'Reinforcement Learning', text: 'Agents optimize cumulative reward functions through environmental interactions (Markov Decision Processes).' },
        ],
      },
      {
        id: 'sec-1-3',
        title: '3. Supervised Tasks: Regression vs Classification',
        paragraphs: [
          'Supervised tasks depend on the nature of the target variable y. Regression predicts continuous scalar values, whereas classification assigns input vectors to discrete category buckets.',
        ],
        mathFormula: 'y_{reg} \\in \\mathbb{R}, \\quad y_{class} \\in \\{0, 1, \\dots, K-1\\}',
        comparisonTable: {
          title: 'Regression vs Classification Comparison',
          headers: ['Property', 'Regression', 'Classification'],
          rows: [
            { feature: 'Target Output (y)', itemA: 'Continuous Real Number (y ∈ ℝ)', itemB: 'Discrete Class Label (y ∈ {0, 1, ..., K})' },
            { feature: 'Example Target', itemA: 'House Price ($), Temperature (°C)', itemB: 'Spam/Not Spam (0/1), Image Class' },
            { feature: 'Primary Loss', itemA: 'Mean Squared Error (MSE)', itemB: 'Binary / Categorical Cross-Entropy' },
            { feature: 'Primary Evaluation', itemA: 'R², RMSE, MAE', itemB: 'Accuracy, Precision, Recall, F1, ROC-AUC' },
          ],
        },
      },
      {
        id: 'sec-1-4',
        title: '4. The End-to-End ML Engineering Pipeline',
        paragraphs: [
          'Production ML systems follow a strict 6-stage lifecycle: Problem Formulation ➔ Data Ingestion & Cleaning ➔ Feature Engineering ➔ Model Training & Validation ➔ Deployment ➔ Continuous Monitoring.',
        ],
        mathFormula: '\\text{Pipeline}: X_{raw} \\xrightarrow{\\text{Clean}} X_{clean} \\xrightarrow{\\text{Scale}} X_{scaled} \\xrightarrow{\\text{Train}} \\hat{f}_{\\theta}(X)',
        notebookSnippet: {
          title: 'End-to-End Supervised ML Pipeline Notebook',
          filename: 'module_1_pipeline.ipynb',
          code: `import numpy as np
import pandas as pd
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# Generate synthetic dataset
X, y = make_classification(n_samples=500, n_features=4, random_state=42)

# Train/Test Split (80/20)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Feature Scaling
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

print("X_train shape:", X_train_scaled.shape)
print("Scaled Feature Means:", np.round(X_train_scaled.mean(axis=0), 2))`,
        },
      },
      {
        id: 'sec-1-5',
        title: '5. Data Preprocessing: Missing Values & Outliers',
        paragraphs: [
          'Raw real-world data contains missing entries, uncalibrated sensor values, and extreme outliers. Preprocessing cleans numerical tensors prior to model fitting.',
        ],
        mathFormula: 'z_i = \\frac{x_i - \\mu}{\\sigma}, \\quad \\text{Keep point if } |z_i| \\le 3.0',
        bulletPoints: [
          { label: 'Imputation Strategies', text: 'Mean/Median imputation for numerical features; Mode or indicator flags for categorical features.' },
          { label: 'Outlier Filtering', text: 'Z-score thresholding (|z| > 3) or Interquartile Range (IQR = Q3 - Q1).' },
        ],
      },
      {
        id: 'sec-1-6',
        title: '6. Feature Scaling: Standardization vs Normalization',
        paragraphs: [
          'Feature scaling ensures features with large numerical magnitudes (e.g. annual income in $) do not dominate gradient updates or distance calculations over smaller features (e.g. age in years).',
        ],
        mathFormula: 'x_{std} = \\frac{x - \\mu}{\\sigma}, \\quad x_{norm} = \\frac{x - x_{min}}{x_{max} - x_{min}}',
        bulletPoints: [
          { label: 'Standardization (Z-Score)', text: 'Rescales data to zero mean (μ=0) and unit variance (σ=1). Ideal for Gaussian data and gradient descent.' },
          { label: 'Normalization (Min-Max)', text: 'Rescales data strictly to range [0, 1]. Sensitive to extreme outliers.' },
        ],
      },
      {
        id: 'sec-1-7',
        title: '7. Data Splitting & Preventing Data Leakage',
        paragraphs: [
          'Data leakage occurs when information from the test dataset leaks into the training pipeline prior to model evaluation, causing falsely optimistic metrics.',
        ],
        mathFormula: '\\mathcal{D} = \\mathcal{D}_{train} \\cup \\mathcal{D}_{val} \\cup \\mathcal{D}_{test}, \\quad \\mathcal{D}_{train} \\cap \\mathcal{D}_{test} = \\emptyset',
        bulletPoints: [
          { label: 'Golden Rule', text: 'Fit scalers, encoders, and feature selectors ONLY on X_train, then transform X_val and X_test.' },
          { label: 'K-Fold Cross-Validation', text: 'Splits dataset into K equal folds, training K models to evaluate mean performance.' },
        ],
      },
      {
        id: 'sec-1-8',
        title: '8. Mathematical Bias-Variance Tradeoff',
        paragraphs: [
          'Total expected generalization error decomposes into Bias², Variance, and Irreducible Noise (σ²).',
        ],
        mathFormula: '\\mathbb{E}\\left[(y - \\hat{f}(x))^2\\right] = \\text{Bias}\\left[\\hat{f}(x)\\right]^2 + \\text{Var}\\left[\\hat{f}(x)\\right] + \\sigma^2',
        workedExample: {
          title: 'Worked Bias-Variance Error Calculation',
          steps: [
            'True target f(x) = 10.0, Irreducible error σ² = 0.5',
            'Model predictions over 3 seeds: y₁=12.0, y₂=11.0, y₃=13.0 (Mean = 12.0)',
            'Bias = Mean - True = 12.0 - 10.0 = 2.0 (Bias² = 4.0)',
            'Variance = ((12-12)² + (11-12)² + (13-12)²)/3 = 0.67',
            'Total Expected Error = 4.0 + 0.67 + 0.5 = 5.17',
          ],
        },
      },
      {
        id: 'sec-1-9',
        title: '9. Model Overfitting vs Underfitting Diagnostics',
        paragraphs: [
          'Underfitting occurs when a model is too simple (High Bias). Overfitting occurs when a model memorizes training noise (High Variance).',
        ],
        mathFormula: '\\text{Generalization Gap} = \\text{Loss}_{val} - \\text{Loss}_{train} > \\epsilon_{threshold}',
        bulletPoints: [
          { label: 'Underfitting Signs', text: 'High Training Loss and High Validation Loss.' },
          { label: 'Overfitting Signs', text: 'Extremely Low Training Loss but High Validation Loss.' },
        ],
      },
      {
        id: 'sec-1-10',
        title: '10. Evaluation Metrics & Deployment Considerations',
        paragraphs: [
          'Final evaluation must align with business objectives rather than accuracy alone. Production systems monitor prediction latency, memory footprint, and data drift over time.',
        ],
        mathFormula: '\\text{Loss}_{Total} = \\alpha \\cdot \\text{TaskLoss} + (1-\\alpha) \\cdot \\text{LatencyPenalty}',
        practiceQuestions: [
          {
            type: 'conceptual',
            question: 'Why does fitting a StandardScaler on the full dataset before splitting cause data leakage?',
            answer: 'It calculates global mean μ and std σ incorporating test set values, allowing test set distribution information to bleed into training features.',
          },
          {
            type: 'numerical',
            question: 'Given train error = 0.01 and validation error = 0.45, diagnose the model state.',
            answer: 'Severe Overfitting (High Variance). Mitigate with regularization, dropout, or more data.',
          },
          {
            type: 'scenario',
            question: 'Which metric should be optimized for a rare disease diagnosis system (0.1% positive)?',
            answer: 'Optimize Recall for Class 1 to minimize False Negatives (missing a sick patient).',
          },
        ],
        keyTakeaways: [
          'ML infers mapping functions f(X) ≈ y directly from empirical data.',
          'Always scale features AFTER splitting data into Train and Test sets.',
          'Generalization Error = Bias² + Variance + Irreducible Error.',
        ],
      },
    ],
  },

  // =========================================================================
  // MODULE 2: LINEAR REGRESSION (10 SECTIONS)
  // =========================================================================
  {
    id: 'linear-regression',
    moduleNumber: 2,
    title: 'Linear Regression',
    shortDescription: 'OLS Cost Minimization, Derivations, Normal Equations & L1/L2 Regularization.',
    iconName: 'trending-up',
    sections: [
      {
        id: 'sec-2-1',
        title: '1. Introduction to Linear Models & Hypothesis',
        paragraphs: [
          'Linear Regression models target y as a linear combination of input features X plus a bias term b.',
        ],
        mathFormula: 'h_w(x) = w_1 x_1 + w_2 x_2 + \\dots + w_n x_n + b = X w + b',
      },
      {
        id: 'sec-2-2',
        title: '2. Ordinary Least Squares (OLS) Cost Function',
        paragraphs: [
          'OLS minimizes the Mean Squared Error (MSE) cost function J(w, b) measuring vertical residual distances.',
        ],
        mathFormula: 'J(w, b) = \\frac{1}{2m} \\sum_{i=1}^{m} \\left( h_w(x^{(i)}) - y^{(i)} \\right)^2',
      },
      {
        id: 'sec-2-3',
        title: '3. Calculus Derivation of OLS Partial Derivatives',
        paragraphs: [
          'Using the calculus power rule and chain rule, we derive exact partial derivatives for weight updates.',
        ],
        mathFormula: '\\frac{\\partial J}{\\partial w} = \\frac{1}{m} X^T \\left( X w + b - y \\right)',
      },
      {
        id: 'sec-2-4',
        title: '4. Closed-Form Solution: The Normal Equation',
        paragraphs: [
          'Setting partial derivative ∂J/∂θ = 0 yields the exact analytical solution matrix equation.',
        ],
        mathFormula: '\\theta = \\left( X^T X \\right)^{-1} X^T y',
      },
      {
        id: 'sec-2-5',
        title: '5. Multiple Linear Regression Vectorization',
        paragraphs: [
          'Vectorizing operations allows NumPy and linear algebra libraries to run linear models at C-speed.',
        ],
        mathFormula: '\\hat{y} = X w, \\quad \\text{where } X \\in \\mathbb{R}^{m \\times (n+1)}, w \\in \\mathbb{R}^{(n+1) \\times 1}',
        notebookSnippet: {
          title: 'Multiple Linear Regression Notebook',
          filename: 'module_2_linear_regression.ipynb',
          code: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Data generation
X = np.random.rand(100, 2) * 10
y = 3.0 * X[:, 0] - 2.0 * X[:, 1] + 5.0 + np.random.randn(100) * 0.5

# OLS Fit
model = LinearRegression()
model.fit(X, y)

print("Coefficients [w1, w2]:", np.round(model.coef_, 3))
print("Intercept (b):", np.round(model.intercept_, 3))
print("MSE Loss:", np.round(mean_squared_error(y, model.predict(X)), 4))`,
        },
      },
      {
        id: 'sec-2-6',
        title: '6. Polynomial Regression & Non-Linear Mapping',
        paragraphs: [
          'Polynomial features map input X into higher-degree space [X, X², X³] allowing linear models to fit curves.',
        ],
        mathFormula: 'y = w_1 x + w_2 x^2 + w_3 x^3 + b',
      },
      {
        id: 'sec-2-7',
        title: '7. Core Assumptions of OLS Linear Regression',
        paragraphs: [
          'OLS regression assumes: Linearity, Feature Independence (No Multicollinearity), Homoscedasticity, and Normality of Residuals.',
        ],
        mathFormula: '\\epsilon \\sim \\mathcal{N}(0, \\sigma^2 I), \\quad \\text{Var}(\\epsilon_i) = \\sigma^2 \\quad \\forall i',
        bulletPoints: [
          { label: 'Homoscedasticity', text: 'Residual error variance must remain constant across all predicted values.' },
          { label: 'No Multicollinearity', text: 'Input features must not be perfectly correlated (check VIF < 5).' },
        ],
      },
      {
        id: 'sec-2-8',
        title: '8. Ridge Regression (L2 Regularization)',
        paragraphs: [
          'Ridge adds a squared weight penalty ½λ Σw² to loss, shrinking coefficients to prevent multicollinearity explosion.',
        ],
        mathFormula: 'J_{Ridge} = J_{OLS} + \\frac{\\lambda}{2} \\sum_{j=1}^{n} w_j^2',
      },
      {
        id: 'sec-2-9',
        title: '9. Lasso Regression (L1 Regularization)',
        paragraphs: [
          'Lasso adds an absolute weight penalty λ Σ|w|, driving uninformative feature weights strictly to zero.',
        ],
        mathFormula: 'J_{Lasso} = J_{OLS} + \\lambda \\sum_{j=1}^{n} |w_j|',
      },
      {
        id: 'sec-2-10',
        title: '10. Evaluation Metrics: R², Adjusted R², MSE & MAE',
        paragraphs: [
          'R² measures the proportion of variance in target y explained by features X.',
        ],
        mathFormula: 'R^2 = 1 - \\frac{\\sum (y_i - \\hat{y}_i)^2}{\\sum (y_i - \\bar{y})^2}, \\quad R^2_{adj} = 1 - (1-R^2)\\frac{m-1}{m-n-1}',
        workedExample: {
          title: 'Worked OLS Calculation',
          steps: [
            'Points: (1, 2), (2, 4), (3, 5). Means: x̄=2.0, ȳ=3.67',
            'Slope w = Σ(x-x̄)(y-ȳ) / Σ(x-x̄)² = 3.0 / 2.0 = 1.5',
            'Bias b = ȳ - w x̄ = 3.67 - 1.5(2.0) = 0.67',
            'Line: ŷ = 1.5x + 0.67',
          ],
        },
        practiceQuestions: [
          {
            type: 'conceptual',
            question: 'Why does Lasso drive weights to exact zero while Ridge does not?',
            answer: 'Lasso L1 penalty contours have sharp corners at coordinate axes that intersect cost contours first.',
          },
          {
            type: 'numerical',
            question: 'Calculate MSE for line ŷ = 2x + 1 on points (1, 3), (2, 6).',
            answer: 'Point 1: ŷ=3 (err=0). Point 2: ŷ=5 (err=1, sq=1). MSE = (0+1)/2 = 0.5.',
          },
          {
            type: 'scenario',
            question: 'You have 1,000 features and suspect 950 are noise. Which regression model do you use?',
            answer: 'Use Lasso (L1) to zero out the 950 irrelevant features.',
          },
        ],
        keyTakeaways: [
          'OLS minimizes Mean Squared Error residuals.',
          'Normal Equation provides closed-form solution in O(n³) time.',
          'L1 Lasso performs feature selection; L2 Ridge stabilizes multicollinearity.',
        ],
      },
    ],
  },

  // =========================================================================
  // MODULE 3: GRADIENT DESCENT (10 SECTIONS)
  // =========================================================================
  {
    id: 'gradient-descent',
    moduleNumber: 3,
    title: 'Gradient Descent',
    shortDescription: 'Optimization Algorithms: SGD, Mini-Batch, Momentum, RMSProp & Adam.',
    iconName: 'activity',
    sections: [
      {
        id: 'sec-3-1',
        title: '1. Optimization Fundamentals & Loss Surface',
        paragraphs: [
          'Gradient Descent is an iterative optimization algorithm that steps opposite to the gradient vector ∇J(θ) to find cost minima.',
        ],
        mathFormula: '\\theta^{(t+1)} = \\theta^{(t)} - \\alpha \\nabla J(\\theta^{(t)})',
      },
      {
        id: 'sec-3-2',
        title: '2. Gradient Update Derivation & Vector Calculus',
        paragraphs: [
          'The gradient ∇J(θ) is the vector of partial derivatives pointing in the direction of steepest loss ascent.',
        ],
        mathFormula: '\\nabla J(\\theta) = \\left[ \\frac{\\partial J}{\\partial \\theta_1}, \\frac{\\partial J}{\\partial \\theta_2}, \\dots, \\frac{\\partial J}{\\partial \\theta_n} \\right]^T',
      },
      {
        id: 'sec-3-3',
        title: '3. Learning Rate Tuning & Decay Schedules',
        paragraphs: [
          'Learning rate α controls step size. Learning rate schedules decay α over epochs for optimal convergence.',
        ],
        mathFormula: '\\alpha_t = \\frac{\\alpha_0}{1 + k \\cdot t}, \\quad \\alpha_t = \\alpha_0 \\cdot \\gamma^t',
      },
      {
        id: 'sec-3-4',
        title: '4. Batch Gradient Descent',
        paragraphs: [
          'Batch GD computes exact loss gradients across the entire dataset before making a single parameter update.',
        ],
        mathFormula: '\\nabla J(\\theta) = \\frac{1}{m} \\sum_{i=1}^{m} \\nabla J_i(\\theta)',
      },
      {
        id: 'sec-3-5',
        title: '5. Stochastic Gradient Descent (SGD)',
        paragraphs: [
          'SGD updates parameters using 1 random sample at a time, introducing high-variance noisy updates that escape local minima.',
        ],
        mathFormula: '\\theta^{(t+1)} = \\theta^{(t)} - \\alpha \\nabla J_i(\\theta^{(t)})',
      },
      {
        id: 'sec-3-6',
        title: '6. Mini-Batch Gradient Descent',
        paragraphs: [
          'Mini-Batch GD updates parameters using small batches (e.g., 32-512 samples), combining vectorization speed with smooth convergence.',
        ],
        mathFormula: '\\theta^{(t+1)} = \\theta^{(t)} - \\alpha \\cdot \\frac{1}{B} \\sum_{i=1}^{B} \\nabla J_i(\\theta^{(t)})',
        notebookSnippet: {
          title: 'Gradient Descent & Adam Solver Notebook',
          filename: 'module_3_gradient_descent.ipynb',
          code: `import numpy as np

# Loss function f(w) = w^2 - 4w + 5 (Min at w=2.0)
def grad(w): return 2*w - 4

w = 10.0; lr = 0.1
for step in range(20):
    w -= lr * grad(w)

print("Vanilla GD Final w (20 steps):", np.round(w, 4))`,
        },
      },
      {
        id: 'sec-3-7',
        title: '7. Momentum & Nesterov Accelerated Gradient',
        paragraphs: [
          'Momentum accumulates past velocity vectors v_t = β v_{t-1} + α ∇J to accelerate through flat plateaus and damp oscillations.',
        ],
        mathFormula: 'v_t = \\beta v_{t-1} + \\alpha \\nabla J(\\theta), \\quad \\theta_{t+1} = \\theta_t - v_t',
      },
      {
        id: 'sec-3-8',
        title: '8. Adaptive Learning Rates: AdaGrad & RMSProp',
        paragraphs: [
          'RMSProp divides the learning rate by the moving average of squared gradients to scale updates per parameter.',
        ],
        mathFormula: 'v_t = \\beta v_{t-1} + (1-\\beta) g_t^2, \\quad \\theta_{t+1} = \\theta_t - \\frac{\\alpha g_t}{\\sqrt{v_t} + \\epsilon}',
      },
      {
        id: 'sec-3-9',
        title: '9. Adam Optimizer (Adaptive Moment Estimation)',
        paragraphs: [
          'Adam combines First Moment (Momentum) and Second Moment (RMSProp) with bias correction terms.',
        ],
        mathFormula: 'm_t = \\beta_1 m_{t-1} + (1-\\beta_1) g_t, \\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2) g_t^2',
      },
      {
        id: 'sec-3-10',
        title: '10. Non-Convex Landscapes: Saddle Points & Local Minima',
        paragraphs: [
          'In high-dimensional deep learning loss landscapes, saddle points (zero gradient with opposite curvature) are far more common than bad local minima.',
        ],
        mathFormula: '\\det(H) < 0 \\quad \\text{at saddle points where } \\nabla J(\\theta) = 0',
        practiceQuestions: [
          {
            type: 'conceptual',
            question: 'Why does Adam optimizer outperform SGD on sparse gradient landscapes?',
            answer: 'Adam adapts learning rates individually per parameter based on historical gradient moments.',
          },
          {
            type: 'numerical',
            question: 'Starting at x=5 for f(x)=x², update x for 1 step using α=0.1.',
            answer: 'f\'(5)=10. x_new = 5 - 0.1(10) = 4.0.',
          },
          {
            type: 'scenario',
            question: 'Training loss oscillates wildly between 1.0 and 100.0. What fix should be made?',
            answer: 'Reduce learning rate α by an order of magnitude or add gradient clipping.',
          },
        ],
        keyTakeaways: [
          'Gradient Descent steps downhill opposite to ∇J(θ).',
          'Mini-batch GD is standard for deep learning on GPUs.',
          'Adam combines momentum and adaptive per-parameter learning rates.',
        ],
      },
    ],
  },

  // =========================================================================
  // MODULE 4: NEURAL NETWORK FOUNDATIONS (10 SECTIONS)
  // =========================================================================
  {
    id: 'neural-network',
    moduleNumber: 4,
    title: 'Neural Network Foundations',
    shortDescription: 'Perceptrons, Activations, Matrix Forward Pass & Backpropagation Calculus.',
    iconName: 'network',
    sections: [
      {
        id: 'sec-4-1',
        title: '1. The Artificial Neuron (Perceptron Model)',
        paragraphs: [
          'The Perceptron computes a linear combination z = W^T x + b and passes it through an activation function a = f(z).',
        ],
        mathFormula: 'a = f(z) = f\\left( \\sum_{i=1}^{n} w_i x_i + b \\right)',
      },
      {
        id: 'sec-4-2',
        title: '2. Activation Functions: Sigmoid, Tanh, ReLU & Softmax',
        paragraphs: [
          'Activation functions introduce non-linearity, allowing networks to learn complex non-linear decision boundaries.',
        ],
        mathFormula: '\\sigma(z) = \\frac{1}{1 + e^{-z}}, \\quad \\text{ReLU}(z) = \\max(0, z)',
      },
      {
        id: 'sec-4-3',
        title: '3. Multilayer Perceptron Architecture & Layers',
        paragraphs: [
          'An MLP consists of Input, Hidden, and Output layers stacked sequentially to form universal function approximators.',
        ],
        mathFormula: 'a^{(0)} = X, \\quad a^{(l)} = f\\left( W^{(l)} a^{(l-1)} + b^{(l)} \\right)',
      },
      {
        id: 'sec-4-4',
        title: '4. Vectorized Matrix Forward Propagation',
        paragraphs: [
          'Forward propagation computes hidden layer activations sequentially using matrix multiplication.',
        ],
        mathFormula: 'z^{(l)} = W^{(l)} a^{(l-1)} + b^{(l)}, \\quad a^{(l)} = f\\left( z^{(l)} \\right)',
      },
      {
        id: 'sec-4-5',
        title: '5. Deep Learning Loss Functions: MSE vs Cross-Entropy',
        paragraphs: [
          'MSE is used for continuous regression outputs; Cross-Entropy is used for probability classification outputs.',
        ],
        mathFormula: 'L_{CCE} = - \\sum_{k=1}^{K} y_k \\log(\\hat{y}_k)',
      },
      {
        id: 'sec-4-6',
        title: '6. Backpropagation Calculus Chain Rule Derivation',
        paragraphs: [
          'Backprop computes partial derivatives of loss wrt every weight matrix using the multivariable calculus chain rule.',
        ],
        mathFormula: '\\delta^{(l)} = \\left( \\delta^{(l+1)} (W^{(l+1)})^T \\right) \\odot f\'(z^{(l)})',
      },
      {
        id: 'sec-4-7',
        title: '7. Gradient Updates for Weights & Biases',
        paragraphs: [
          'Gradients wrt layer weights are computed as inner products of previous activations and current deltas.',
        ],
        mathFormula: '\\frac{\\partial L}{\\partial W^{(l)}} = (a^{(l-1)})^T \\delta^{(l)}, \\quad \\frac{\\partial L}{\\partial b^{(l)}} = \\sum \\delta^{(l)}',
        notebookSnippet: {
          title: 'NumPy 2-Layer Neural Network Notebook',
          filename: 'module_4_neural_network.ipynb',
          code: `import numpy as np

# Sigmoid & Derivative
def sigmoid(z): return 1 / (1 + np.exp(-z))
def sig_deriv(a): return a * (1 - a)

# XOR Inputs & Labels
X = np.array([[0,0], [0,1], [1,0], [1,1]])
y = np.array([[0], [1], [1], [0]])

# Weights
np.random.seed(42)
W1 = np.random.randn(2, 4); W2 = np.random.randn(4, 1)

# Training loop
for epoch in range(1000):
    a1 = sigmoid(X @ W1)
    a2 = sigmoid(a1 @ W2)
    d2 = (a2 - y) * sig_deriv(a2)
    d1 = (d2 @ W2.T) * sig_deriv(a1)
    W2 -= 0.5 * (a1.T @ d2)
    W1 -= 0.5 * (X.T @ d1)

print("Trained Predictions:\\n", np.round(a2, 3))`,
        },
      },
      {
        id: 'sec-4-8',
        title: '8. Overfitting Mitigation: Dropout Regularization',
        paragraphs: [
          'Dropout randomly zeroes out neuron activations during training with probability p to prevent feature co-adaptation.',
        ],
        mathFormula: 'r_j \\sim \\text{Bernoulli}(1-p), \\quad \\tilde{a}_j = \\frac{r_j \\cdot a_j}{1-p}',
      },
      {
        id: 'sec-4-9',
        title: '9. Batch Normalization Mechanics',
        paragraphs: [
          'Batch Normalization normalizes hidden activations (mean=0, std=1) across mini-batches to stabilize training.',
        ],
        mathFormula: '\\hat{x}^{(l)} = \\frac{x^{(l)} - \\mu_B}{\\sqrt{\\sigma_B^2 + \\epsilon}}, \\quad y^{(l)} = \\gamma \\hat{x}^{(l)} + \\beta',
      },
      {
        id: 'sec-4-10',
        title: '10. Weight Initialization: Glorot & He Schemes',
        paragraphs: [
          'Proper weight initialization prevents initial activation gradients from vanishing or exploding.',
        ],
        mathFormula: 'W \\sim \\mathcal{N}\\left(0, \\sqrt{\\frac{2}{n_{in}}}\\right) \\quad (\\text{He Initialization for ReLU})',
        practiceQuestions: [
          {
            type: 'conceptual',
            question: 'Why does ReLU activation solve vanishing gradients in deep networks?',
            answer: 'ReLU derivative is 1.0 for all positive inputs, preserving gradient signals through arbitrary depth.',
          },
          {
            type: 'numerical',
            question: 'Given input x=2.0, w=0.5, b=0.1, compute z and Sigmoid output a.',
            answer: 'z = 0.5(2.0)+0.1 = 1.1. a = σ(1.1) = 0.7502.',
          },
          {
            type: 'scenario',
            question: 'Gradients in hidden layer 1 vanish to zero. What architecture fixes this?',
            answer: 'Switch to ReLU activations, add Batch Normalization, or use Residual Skip Connections.',
          },
        ],
        keyTakeaways: [
          'Perceptron computes weighted linear sum z followed by non-linear activation f(z).',
          'Backpropagation uses calculus Chain Rule to propagate deltas backwards.',
          'Dropout and Batch Normalization stabilize deep network training.',
        ],
      },
    ],
  },

  // =========================================================================
  // MODULE 5: LOGISTIC REGRESSION (10 SECTIONS)
  // =========================================================================
  {
    id: 'logistic-regression',
    moduleNumber: 5,
    title: 'Logistic Regression',
    shortDescription: 'Binary & Multiclass Classification, Sigmoid Mapping, Log-Loss & ROC Curves.',
    iconName: 'target',
    sections: [
      {
        id: 'sec-5-1',
        title: '1. Binary Classification & Probability Mapping',
        paragraphs: [
          'Logistic Regression maps weighted linear inputs to probability values P(y=1|X) between 0 and 1.',
        ],
        mathFormula: 'P(y=1|X) = \\sigma(z) = \\frac{1}{1 + e^{-(W^T X + b)}}',
      },
      {
        id: 'sec-5-2',
        title: '2. The Sigmoid Function & Mathematical Properties',
        paragraphs: [
          'The Sigmoid curve has derivative σ\'(z) = σ(z)(1 - σ(z)), creating an elegant gradient formula.',
        ],
        mathFormula: '\\frac{d\\sigma(z)}{dz} = \\sigma(z) \\left( 1 - \\sigma(z) \\right)',
      },
      {
        id: 'sec-5-3',
        title: '3. Log-Odds Ratio & Linear Decision Boundaries',
        paragraphs: [
          'The Log-Odds (logit) is a linear function of features: ln(P/(1-P)) = W^T X + b.',
        ],
        mathFormula: '\\ln\\left( \\frac{P(y=1|X)}{1 - P(y=1|X)} \\right) = W^T X + b',
      },
      {
        id: 'sec-5-4',
        title: '4. Binary Cross-Entropy Loss (Log Loss) Derivation',
        paragraphs: [
          'Derived via Maximum Likelihood Estimation (MLE), Log Loss guarantees a strictly convex loss surface.',
        ],
        mathFormula: 'L_{BCE}(y, \\hat{y}) = - \\left[ y \\ln(\\hat{y}) + (1 - y) \\ln(1 - \\hat{y}) \\right]',
      },
      {
        id: 'sec-5-5',
        title: '5. Gradient Descent Update Derivation',
        paragraphs: [
          'The partial derivative wrt weights reduces to the clean error residual form: ∂L/∂w = (1/m) X^T (ŷ - y).',
        ],
        mathFormula: '\\frac{\\partial L_{BCE}}{\\partial w} = \\frac{1}{m} X^T \\left( \\sigma(X w) - y \\right)',
        notebookSnippet: {
          title: 'Logistic Regression Notebook',
          filename: 'module_5_logistic_regression.ipynb',
          code: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, roc_auc_score

X, y = make_classification(n_samples=300, n_features=2, random_state=42)
clf = LogisticRegression()
clf.fit(X, y)

print("Coefficients:", clf.coef_)
print("ROC-AUC Score:", roc_auc_score(y, clf.predict_proba(X)[:, 1]))`,
        },
      },
      {
        id: 'sec-5-6',
        title: '6. Multiclass Classification: One-vs-Rest & One-vs-One',
        paragraphs: [
          'One-vs-Rest trains K binary classifiers; One-vs-One trains K(K-1)/2 pairwise binary classifiers.',
        ],
        mathFormula: '\\text{OvR Classifiers} = K, \\quad \\text{OvO Classifiers} = \\frac{K(K-1)}{2}',
      },
      {
        id: 'sec-5-7',
        title: '7. Softmax Regression & Categorical Cross-Entropy',
        paragraphs: [
          'Softmax generalizes Sigmoid to K classes, producing normalized probability distributions summing to 1.0.',
        ],
        mathFormula: 'P(y=k|X) = \\frac{e^{z_k}}{\\sum_{j=1}^{K} e^{z_j}}',
      },
      {
        id: 'sec-5-8',
        title: '8. Decision Threshold Tuning (τ)',
        paragraphs: [
          'Varying decision threshold τ shifts model operating points along the Precision-Recall curve.',
        ],
        mathFormula: '\\hat{y} = \\begin{cases} 1 & \\text{if } P(y=1|X) \\ge \\tau \\\\ 0 & \\text{if } P(y=1|X) < \\tau \\end{cases}',
      },
      {
        id: 'sec-5-9',
        title: '9. Evaluation Metrics: Confusion Matrix, Precision & Recall',
        paragraphs: [
          'Precision measures positive predictive value; Recall measures sensitivity.',
        ],
        mathFormula: '\\text{Precision} = \\frac{TP}{TP + FP}, \\quad \\text{Recall} = \\frac{TP}{TP + FN}, \\quad F_1 = 2 \\cdot \\frac{P \\cdot R}{P + R}',
      },
      {
        id: 'sec-5-10',
        title: '10. ROC Curves & AUC Score Analysis',
        paragraphs: [
          'ROC-AUC evaluates classification performance across all possible decision thresholds.',
        ],
        mathFormula: '\\text{TPR} = \\frac{TP}{TP+FN}, \\quad \\text{FPR} = \\frac{FP}{FP+TN}, \\quad \\text{AUC} = \\int_0^1 \\text{TPR}(f) \, df',
        practiceQuestions: [
          {
            type: 'conceptual',
            question: 'Why is MSE avoided for training Logistic Regression?',
            answer: 'Squaring Sigmoid outputs creates a non-convex loss surface with bad local minima.',
          },
          {
            type: 'numerical',
            question: 'For TP=80, FP=20, FN=10, compute Precision and Recall.',
            answer: 'Precision = 80/100 = 80%. Recall = 80/90 = 88.89%.',
          },
          {
            type: 'scenario',
            question: 'In email spam detection, should Precision or Recall be prioritized?',
            answer: 'Prioritize Precision to avoid sending important legitimate emails to Spam folder (False Positives).',
          },
        ],
        keyTakeaways: [
          'Sigmoid maps linear inputs to class probabilities between 0 and 1.',
          'Binary Cross-Entropy loss is strictly convex, guaranteeing global convergence.',
          'ROC-AUC evaluates threshold-independent classification quality.',
        ],
      },
    ],
  },

  // =========================================================================
  // MODULE 6: CLUSTERING & UNSUPERVISED LEARNING (10 SECTIONS)
  // =========================================================================
  {
    id: 'clustering',
    moduleNumber: 6,
    title: 'Clustering & Unsupervised Learning',
    shortDescription: 'K-Means, WCSS Inertia, Elbow Method, Silhouette Score & DBSCAN Density Clustering.',
    iconName: 'layers',
    sections: [
      {
        id: 'sec-6-1',
        title: '1. Introduction to Unsupervised Clustering',
        paragraphs: [
          'Clustering partitions unlabeled data points into cohesive groups based on spatial similarity metrics.',
        ],
        mathFormula: '\\min_{C_1, \\dots, C_K} \\sum_{k=1}^{K} \\text{Dissimilarity}(C_k)',
      },
      {
        id: 'sec-6-2',
        title: '2. K-Means Algorithm Fundamentals',
        paragraphs: [
          'K-Means partitions data into K clusters by minimizing Euclidean distance to cluster centroids.',
        ],
        mathFormula: 'd(x^{(i)}, \\mu_k) = ||x^{(i)} - \\mu_k||_2 = \\sqrt{\\sum_{j=1}^n (x_j^{(i)} - \\mu_{kj})^2}',
      },
      {
        id: 'sec-6-3',
        title: '3. Within-Cluster Sum of Squares (WCSS / Inertia)',
        paragraphs: [
          'Inertia measures cluster compactness by summing squared distances from points to their centroids.',
        ],
        mathFormula: 'J_{\\text{Inertia}} = \\sum_{k=1}^{K} \\sum_{i \\in C_k} ||x^{(i)} - \\mu_k||^2',
      },
      {
        id: 'sec-6-4',
        title: '4. Iterative Expectation-Maximization (E-M) Steps',
        paragraphs: [
          'K-Means alternates between Assignment Step (E-step) and Centroid Update Step (M-step) until convergence.',
        ],
        mathFormula: '\\mu_k = \\frac{1}{|C_k|} \\sum_{i \\in C_k} x^{(i)}',
      },
      {
        id: 'sec-6-5',
        title: '5. Centroid Initialization: K-Means++',
        paragraphs: [
          'K-Means++ initializes centroids far apart from each other with probability proportional to D(x)², preventing poor local minima traps.',
        ],
        mathFormula: 'P(x^{(i)}) = \\frac{D(x^{(i)})^2}{\\sum_{j} D(x^{(j)})^2}',
      },
      {
        id: 'sec-6-6',
        title: '6. Finding Optimal K: The Elbow Method',
        paragraphs: [
          'The Elbow Method plots Inertia vs K to find the inflection point where additional clusters yield diminishing returns.',
        ],
        mathFormula: '\\Delta J(K) = J(K) - J(K+1) < \\epsilon_{\\text{threshold}}',
        notebookSnippet: {
          title: 'K-Means & Silhouette Analysis Notebook',
          filename: 'module_6_clustering_kmeans.ipynb',
          code: `import numpy as np
from sklearn.datasets import make_blobs
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=400, centers=4, cluster_std=0.8, random_state=42)

kmeans = KMeans(n_clusters=4, init='k-means++', random_state=42)
labels = kmeans.fit_predict(X)

print("Cluster Centroids:\\n", np.round(kmeans.cluster_centers_, 2))
print("Inertia (WCSS):", np.round(kmeans.inertia_, 2))
print("Silhouette Score:", np.round(silhouette_score(X, labels), 4))`,
        },
      },
      {
        id: 'sec-6-7',
        title: '7. Silhouette Analysis & Silhouette Coefficient',
        paragraphs: [
          'Silhouette coefficient s(i) measures how well a point belongs to its cluster versus neighbor clusters.',
        ],
        mathFormula: 's(i) = \\frac{b(i) - a(i)}{\\max(a(i), b(i))}, \\quad -1 \\le s(i) \\le 1',
      },
      {
        id: 'sec-6-8',
        title: '8. DBSCAN: Density-Based Spatial Clustering',
        paragraphs: [
          'DBSCAN groups dense spatial clusters based on radius (Eps) and minimum points (MinPts), handling arbitrary shapes and noise.',
        ],
        mathFormula: 'N_{\\epsilon}(p) = \\{q \\in D \\mid \\text{dist}(p, q) \\le \\epsilon\\}, \\quad |N_{\\epsilon}(p)| \\ge \\text{MinPts}',
      },
      {
        id: 'sec-6-9',
        title: '9. Hierarchical Agglomerative Clustering & Dendrograms',
        paragraphs: [
          'Agglomerative clustering builds bottom-up cluster trees visualized using dendrogram plots.',
        ],
        mathFormula: 'd_{Ward}(A, B) = \\sqrt{ \\frac{2 |A| |B|}{|A|+|B|} } ||\\mu_A - \\mu_B||_2',
      },
      {
        id: 'sec-6-10',
        title: '10. Dimensionality Reduction Preprocessing: PCA',
        paragraphs: [
          'Principal Component Analysis (PCA) projects high-dimensional data onto orthogonal axes of maximum variance prior to clustering.',
        ],
        mathFormula: '\\Sigma = \\frac{1}{m} X^T X, \\quad \\Sigma v_i = \\lambda_i v_i',
        practiceQuestions: [
          {
            type: 'conceptual',
            question: 'Why does K-Means fail on concentric circular clusters?',
            answer: 'K-Means assumes spherical clusters based on Euclidean distance from centroids.',
          },
          {
            type: 'numerical',
            question: 'For intra-cluster distance a=2.0 and nearest-cluster distance b=2.0, compute Silhouette s(i).',
            answer: 's(i) = (2.0 - 2.0) / max(2.0, 2.0) = 0.0 (point sits on decision boundary).',
          },
          {
            type: 'scenario',
            question: 'You want to discover spatial crime hot-spots while filtering isolated single incidents. Which clustering algorithm should you choose?',
            answer: 'Use DBSCAN to find dense spatial clusters and filter rural isolated points as noise.',
          },
        ],
        keyTakeaways: [
          'K-Means minimizes Inertia by updating centroids iteratively.',
          'Elbow method and Silhouette scores determine optimal cluster count K.',
          'DBSCAN discovers arbitrary non-spherical shapes and filters noise.',
        ],
      },
    ],
  },
];
