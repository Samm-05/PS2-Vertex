import { QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: 'In Simple Linear Regression ŷ = wx + b, what does the weight (w) represent?',
    options: [
      'The y-intercept where x = 0',
      'The slope of the regression line (change in y per unit change in x)',
      'The mean squared error of the predictions',
      'The total number of dataset points',
    ],
    correctIndex: 1,
    explanation: 'The weight w represents the slope of the line, determining how much ŷ changes for every unit increase in x.',
  },
  {
    id: 2,
    question: 'What is a residual in linear regression?',
    options: [
      'The sum of all dataset points',
      'The difference between the actual label y and the predicted value ŷ (y - ŷ)',
      'The learning rate multiplier',
      'The initial starting value of weight w',
    ],
    correctIndex: 1,
    explanation: 'A residual is the prediction error e_i = y_i - ŷ_i. In our 3D visualizer, residuals are shown as vertical lines connecting points to the line.',
  },
  {
    id: 3,
    question: 'Why do we square the residual errors in Mean Squared Error (MSE)?',
    options: [
      'To ensure all errors are positive and penalize larger errors more heavily',
      'To make the slope w equal to 0',
      'Because negative errors are ignored in Machine Learning',
      'To double the speed of gradient descent',
    ],
    correctIndex: 0,
    explanation: 'Squaring errors prevents positive and negative residuals from canceling out, and heavily penalizes large outliers due to quadratic scaling.',
  },
  {
    id: 4,
    question: 'What happens to the regression line if the learning rate α is too large (e.g. α = 1.5)?',
    options: [
      'The line converges instantly in 1 epoch',
      'The line overshoots the optimal slope and loss explodes/diverges',
      'The line freezes and stops updating completely',
      'The dataset points disappear from the screen',
    ],
    correctIndex: 1,
    explanation: 'An excessively high learning rate causes gradient descent to overshoot the optimal minimum of the loss curve, leading to oscillating or exploding loss.',
  },
  {
    id: 5,
    question: 'How do slope (w) and bias (b) updates depend on residuals during Gradient Descent?',
    options: [
      'Updates are proportional to the magnitude of residual errors (ŷ - y)',
      'Updates are completely independent of errors',
      'Slope updates only when loss is 0',
      'Bias updates increase as error decreases',
    ],
    correctIndex: 0,
    explanation: 'The gradients ∂J/∂w = (1/n) ∑ (ŷ_i - y_i) x_i and ∂J/∂b = (1/n) ∑ (ŷ_i - y_i) directly scale with prediction errors (ŷ - y).',
  },
];
