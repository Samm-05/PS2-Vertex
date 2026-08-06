import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import { logisticQuizQuestions } from '../utils/quizData';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export const QuizPanel: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  const handleSelect = (questionId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [questionId]: optionIdx });
  };

  const calculateScore = () => {
    let score = 0;
    logisticQuizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOption) {
        score++;
      }
    });
    return score;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 font-mono">
      <div className="p-4 bg-midnight/90 rounded-2xl border border-apres/30 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-arctic tracking-tight flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" /> Logistic Regression Mastery Quiz
          </h3>
          <p className="text-xs text-apres">
            Test your intuition on Binary Classification, Decision Boundaries, and Metrics.
          </p>
        </div>

        {showResults && (
          <div className="text-right">
            <div className="text-xl font-bold text-emerald-400">
              Score: {calculateScore()} / {logisticQuizQuestions.length}
            </div>
            <button
              onClick={() => {
                setSelectedAnswers({});
                setShowResults(false);
              }}
              className="text-xs text-slopes hover:text-arctic flex items-center gap-1 mt-1 justify-end"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Quiz
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        {logisticQuizQuestions.map((q) => {
          const userAns = selectedAnswers[q.id];
          const isCorrect = userAns === q.correctOption;

          return (
            <Card key={q.id} className="p-5 bg-midnight/90 border border-apres/30 space-y-3">
              <h4 className="text-sm font-bold text-arctic flex items-start gap-2">
                <span className="text-cyan-400">Q{q.id}.</span> {q.question}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, idx) => {
                  const isSelected = userAns === idx;
                  let btnStyle = 'bg-mountainside/40 border-apres/30 text-slopes hover:text-arctic';

                  if (showResults) {
                    if (idx === q.correctOption) {
                      btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'bg-red-950/60 border-red-500 text-red-300 font-bold';
                    }
                  } else if (isSelected) {
                    btnStyle = 'bg-arctic text-midnight font-bold border-arctic';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelect(q.id, idx)}
                      className={`p-3 text-xs text-left rounded-xl border transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {showResults && idx === q.correctOption && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                      )}
                      {showResults && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className="p-3 bg-mountainside/30 rounded-xl border border-apres/20 text-xs text-apres">
                  <span className="font-bold text-arctic">Explanation:</span> {q.explanation}
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {!showResults && (
        <div className="flex justify-end pt-2">
          <button
            disabled={Object.keys(selectedAnswers).length < logisticQuizQuestions.length}
            onClick={() => setShowResults(true)}
            className="px-6 py-3 bg-arctic text-midnight font-bold rounded-xl text-xs hover:bg-slopes disabled:opacity-40 shadow-lg transition-all"
          >
            Submit Answers
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizPanel;
