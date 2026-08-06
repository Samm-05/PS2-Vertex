import { QuizQuestion } from '../types';

export const nnQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Why are non-linear activation functions (e.g. ReLU, Tanh) essential in deep neural networks?',
    options: [
      'They speed up data loading from CSV files',
      'Without non-linear activations, stacking multiple layers collapses mathematically into a single linear transformation',
      'They force all weights to remain positive numbers',
      'They automatically double the dataset size',
    ],
    correctOption: 1,
    explanation: 'Linear combinations of linear functions are always linear. Non-linear activation functions allow multi-layer networks to approximate arbitrary complex decision boundaries.',
  },
  {
    id: 2,
    question: 'What mathematical rule forms the core engine of Backpropagation?',
    options: [
      'Pythagorean Theorem',
      'Calculus Chain Rule (dz/dx = dz/dy · dy/dx)',
      'Bayes Theorem',
      'Fourier Transform',
    ],
    correctOption: 1,
    explanation: 'Backpropagation relies on the calculus Chain Rule to compute partial derivatives of total loss with respect to every weight across deep layers.',
  },
  {
    id: 3,
    question: 'What causes the Vanishing Gradient Problem in deep neural networks using Sigmoid activations?',
    options: [
      'Sigmoid derivative σ\'(z) = σ(z)(1-σ(z)) has a max value of 0.25, causing gradients to shrink exponentially when multiplied across deep layers',
      'Learning rate is set to 1.0',
      'Dataset has too many training points',
      'Biases are initialized to 0',
    ],
    correctOption: 0,
    explanation: 'Because Sigmoid derivatives max out at 0.25, chain-multiplying factors < 0.25 across many layers causes gradients to collapse to near zero in early layers.',
  },
  {
    id: 4,
    question: 'How does the Adam optimizer improve upon basic Gradient Descent (SGD)?',
    options: [
      'It removes backpropagation completely',
      'It combines Momentum (first moment) and RMSProp (adaptive second moment) for fast, smooth parameter updates',
      'It restricts networks to single-layer architectures',
      'It eliminates the need for activation functions',
    ],
    correctOption: 1,
    explanation: 'Adam computes exponentially decaying averages of past gradients (momentum) and past squared gradients (adaptive learning rates) for state-of-the-art optimization.',
  },
  {
    id: 5,
    question: 'Why is a single Perceptron unable to classify the 2D XOR dataset?',
    options: [
      'XOR has no mathematical solution',
      'XOR requires non-linear separation because positive and negative points cannot be split by a single straight line',
      'Perceptrons cannot process negative inputs',
      'Perceptrons do not support bias terms',
    ],
    correctOption: 1,
    explanation: 'XOR classes are diagonally opposite each other. A single linear decision boundary cannot separate them without at least 1 hidden layer of non-linear neurons.',
  },
];
