export interface ScoringParams {
  accuracy: number;
  timeSpent: number;
  attempts: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  perfectScore: number;
}

export const calculateScore = (params: ScoringParams): number => {
  const { accuracy, timeSpent, attempts, difficulty, perfectScore } = params;

  // Base score from accuracy
  let score = accuracy * perfectScore;

  // Time bonus (faster = more points)
  const expectedTime = {
    beginner: 300,
    intermediate: 600,
    advanced: 900,
  }[difficulty];
  
  const timeRatio = Math.min(1, expectedTime / Math.max(timeSpent, 1));
  const timeBonus = timeRatio * perfectScore * 0.2;
  score += timeBonus;

  // Attempts penalty
  const attemptPenalty = Math.min(perfectScore * 0.15, (attempts - 1) * perfectScore * 0.05);
  score -= attemptPenalty;

  // Difficulty multiplier
  const difficultyMultiplier = {
    beginner: 1,
    intermediate: 1.5,
    advanced: 2,
  }[difficulty];

  return Math.round(Math.max(0, score * difficultyMultiplier));
};

export const calculateAccuracy = (predictions: number[], actual: number[]): number => {
  if (!predictions.length || !actual.length) return 0;
  const correct = predictions.reduce((acc, pred, idx) => 
    acc + (pred === actual[idx] ? 1 : 0), 0);
  return correct / predictions.length;
};

export const calculateRMSE = (predictions: number[], actual: number[]): number => {
  if (!predictions.length) return Infinity;
  const squaredErrors = predictions.reduce((acc, pred, idx) => 
    acc + Math.pow(pred - actual[idx], 2), 0);
  return Math.sqrt(squaredErrors / predictions.length);
};