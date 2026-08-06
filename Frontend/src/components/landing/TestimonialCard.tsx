import React from 'react';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ quote, name, role }) => {
  return (
    <article className="rounded-xl bg-white dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 p-6 shadow-soft" data-reveal>
      <Quote className="w-6 h-6 text-primary-500 mb-4" />
      <p className="text-base text-secondary-700 dark:text-secondary-200 leading-relaxed">{quote}</p>
      <div className="mt-5">
        <h4 className="font-semibold text-secondary-900 dark:text-secondary-50">{name}</h4>
        <p className="text-sm text-secondary-500 dark:text-secondary-400">{role}</p>
      </div>
    </article>
  );
};

export default TestimonialCard;
