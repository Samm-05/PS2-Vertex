import { QuizQuestion } from '../types';

export const logisticQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'What is the output range of the Sigmoid activation function σ(z)?',
    options: ['[-1, 1]', '[0, 1]', '(-∞, +∞)', '[0, +∞)'],
    correctOption: 1,
    explanation: 'The Sigmoid function σ(z) = 1 / (1 + e^-z) maps any real value z into the range (0, 1), representing a valid probability.',
  },
  {
    id: 2,
    question: 'Where is the decision boundary located in terms of z = w1*x1 + w2*x2 + b?',
    options: ['z = 1', 'z = 0', 'z = 0.5', 'z = -1'],
    correctOption: 1,
    explanation: 'At z = 0, σ(z) = 0.5. This equal probability line marks the decision boundary between Class 0 and Class 1.',
  },
  {
    id: 3,
    question: 'Which loss function is used for Binary Logistic Regression?',
    options: ['Mean Squared Error (MSE)', 'Binary Cross-Entropy (Log Loss)', 'Hinge Loss', 'Absolute Error (MAE)'],
    correctOption: 1,
    explanation: 'Binary Cross-Entropy Loss (Log Loss) measures how well predicted probabilities match binary target labels (0 or 1).',
  },
  {
    id: 4,
    question: 'What happens to Precision and Recall when you INCREASE the classification threshold from 0.5 to 0.8?',
    options: [
      'Precision increases, Recall decreases',
      'Precision decreases, Recall increases',
      'Both Precision and Recall increase',
      'Both Precision and Recall decrease',
    ],
    correctOption: 0,
    explanation: 'Increasing threshold requires higher confidence for Class 1. False Positives drop (higher Precision), but True Positives drop too (lower Recall).',
  },
  {
    id: 5,
    question: 'How can linear Logistic Regression classify non-linear circular or XOR datasets?',
    options: [
      'By increasing the learning rate',
      'By using Polynomial Feature Expansion (e.g., x1², x2², x1*x2)',
      'By changing the threshold to 0',
      'Linear models can never separate non-linear data under any circumstances',
    ],
    correctOption: 1,
    explanation: 'Polynomial feature expansion maps 2D points into higher-dimensional feature space where non-linear boundaries become linear planes.',
  },
];
