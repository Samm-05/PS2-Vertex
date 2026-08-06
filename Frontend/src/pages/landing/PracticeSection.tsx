import React, { useRef } from 'react';
import { BarChart3, Target, Trophy } from 'lucide-react';
import { useScrollReveal } from '../../animations/scrollAnimations';

const PracticeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="practice" ref={sectionRef} className="py-20 bg-secondary-50 dark:bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-reveal>
          <h2 className="text-4xl font-semibold text-secondary-900 dark:text-secondary-50">Practice & Leaderboard</h2>
          <p className="mt-4 text-base text-secondary-600 dark:text-secondary-300 max-w-3xl">
            Build confidence with challenge-based learning, competitive rankings, and measurable progress tracking.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <article className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6 shadow-soft" data-reveal>
            <Target className="w-6 h-6 text-primary-600 mb-3" />
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">Practice Challenges</h3>
            <p className="mt-3 text-secondary-600 dark:text-secondary-300">
              Solve algorithm challenges to strengthen understanding and apply concepts through guided tasks.
            </p>
          </article>

          <article id="leaderboard" className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6 shadow-soft" data-reveal>
            <Trophy className="w-6 h-6 text-primary-600 mb-3" />
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">Leaderboard Rankings</h3>
            <p className="mt-3 text-secondary-600 dark:text-secondary-300">
              Compete with other learners, improve your rank, and track your growth over time.
            </p>
          </article>

          <article className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 p-6 shadow-soft" data-reveal>
            <BarChart3 className="w-6 h-6 text-primary-600 mb-3" />
            <h3 className="text-xl font-semibold text-secondary-900 dark:text-secondary-50">Skill Progress Tracking</h3>
            <p className="mt-3 text-secondary-600 dark:text-secondary-300">
              Monitor your algorithm proficiency and identify areas to revisit with personalized feedback.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default PracticeSection;
