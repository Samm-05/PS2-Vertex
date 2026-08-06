import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import { nnQuizQuestions } from '../utils/quizData';
import { HelpCircle, Award, RotateCcw } from 'lucide-react';
import { soundFx } from '../../gradientDescent/utils/soundEffects';

export const QuizPanel: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const handleSubmit = () => {
    let s = 0;
    nnQuizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOption) s += 1;
    });
    setScore(s);
    setIsSubmitted(true);
    if (s >= 4) soundFx.playConvergenceChime();
    else soundFx.playOvershootWarning();
  };

  return (
    <Card className="p-6 space-y-6 bg-midnight/90 border border-apres/30 max-w-3xl mx-auto text-arctic">
      <div className="flex items-center justify-between border-b border-apres/30 pb-3">
        <div className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          Neural Network & Backpropagation Mastery Quiz
        </div>
        {isSubmitted && (
          <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
            <Award className="w-4 h-4 text-emerald-400" /> Score: {score} / {nnQuizQuestions.length}
          </span>
        )}
      </div>

      <div className="space-y-5">
        {nnQuizQuestions.map((q, idx) => (
          <div key={q.id} className="p-4 bg-mountainside/30 rounded-2xl border border-apres/20 space-y-3">
            <h4 className="text-xs font-bold font-mono text-arctic">
              {idx + 1}. {q.question}
            </h4>

            <div className="space-y-2">
              {q.options.map((opt, optIdx) => {
                const isSelected = selectedAnswers[q.id] === optIdx;
                const isCorrect = optIdx === q.correctOption;

                let btnStyle = 'border-apres/30 text-slopes hover:bg-mountainside/60';
                if (isSubmitted) {
                  if (isCorrect) btnStyle = 'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-bold';
                  else if (isSelected && !isCorrect) btnStyle = 'border-red-500 bg-red-950/50 text-red-300';
                } else if (isSelected) {
                  btnStyle = 'border-cyan-400 bg-cyan-950/40 text-arctic font-bold';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => {
                      if (!isSubmitted) setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs border transition-all ${btnStyle}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {isSubmitted && (
              <p className="text-[11px] text-cyan-300 italic pt-1 border-t border-apres/20 font-sans">
                💡 {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {!isSubmitted ? (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(selectedAnswers).length < nnQuizQuestions.length}
          className="w-full py-3 rounded-2xl bg-arctic text-midnight hover:bg-slopes font-bold text-xs transition-all shadow-lg disabled:opacity-50"
        >
          Submit Quiz Answers
        </button>
      ) : (
        <button
          onClick={() => {
            setIsSubmitted(false);
            setSelectedAnswers({});
          }}
          className="w-full py-2.5 rounded-2xl border border-apres/40 text-slopes hover:text-arctic font-mono text-xs transition-all flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" /> Retake Quiz
        </button>
      )}
    </Card>
  );
};

export default QuizPanel;
