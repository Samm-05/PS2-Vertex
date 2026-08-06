import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../app/hooks';
import { markModuleCompleted } from '../coachSlice';
import { coachModulesData } from '../coachData';
import PageContainer from '../../../components/layout/PageContainer';
import Card from '../../../components/ui/Card';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ChevronRight as BreadcrumbChevron,
  Calculator,
  Table,
  HelpCircle,
  Award,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dedicated KaTeX Math Renderer component to guarantee flawless rendering on Next/Previous navigation
const MathFormulaBlock: React.FC<{ formula: string }> = ({ formula }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        containerRef.current.innerHTML = '';
        katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: true,
        });
      } catch (err) {
        console.error('KaTeX rendering error:', err);
      }
    }
  }, [formula]);

  return (
    <div
      ref={containerRef}
      className="text-emerald-300 font-mono text-lg sm:text-2xl py-2 px-4 tracking-wide overflow-x-auto"
    />
  );
};

export const ModuleLessonPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(null);

  const moduleData = coachModulesData.find((m) => m.id === moduleId);

  // If module not found, redirect to /coach
  useEffect(() => {
    if (!moduleData) {
      navigate('/coach', { replace: true });
    }
  }, [moduleData, navigate]);

  if (!moduleData) return null;

  const currentSection = moduleData.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === moduleData.sections.length - 1;

  const handleNext = () => {
    setOpenQuestionIndex(null);
    if (isLastSection) {
      // Mark as completed and return to ML Coach Home Page
      dispatch(markModuleCompleted(moduleData.id));
      navigate('/coach');
    } else {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setOpenQuestionIndex(null);
    if (!isFirstSection) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  return (
    <PageContainer className="relative min-h-screen bg-midnight text-arctic py-8 px-4 sm:px-6 lg:px-8 space-y-6 font-sans select-none">
      {/* Top Breadcrumb & Header */}
      <div className="space-y-3 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-apres">
          <button
            type="button"
            onClick={() => navigate('/coach')}
            className="hover:text-arctic transition-colors cursor-pointer"
          >
            ML Coach
          </button>
          <BreadcrumbChevron className="w-3.5 h-3.5 text-apres/60" />
          <span className="text-arctic font-medium">{moduleData.title}</span>
        </nav>

        {/* Large Module Title & Subtitle */}
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-arctic font-sans">
            {moduleData.title}
          </h1>
          <p className="text-sm text-slopes font-mono">
            Module {moduleData.moduleNumber}: {moduleData.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Reading Area Card */}
      <div className="max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection.id}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 sm:p-8 space-y-7 bg-midnight/90 border border-apres/30 shadow-2xl rounded-2xl">
              {/* Section Header */}
              <div className="flex items-center justify-between border-b border-apres/20 pb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-arctic tracking-tight">
                  {currentSection.title}
                </h2>
                <span className="text-xs font-mono px-3 py-1 rounded-full bg-mountainside text-cyan-400 border border-apres/30">
                  Section {currentSectionIndex + 1} of {moduleData.sections.length}
                </span>
              </div>

              {/* Section Paragraphs (Theoretical Explanation) */}
              <div className="space-y-4 text-sm sm:text-base text-slopes leading-relaxed font-sans">
                {currentSection.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {/* Mathematical Foundation Box (Hyper-Prominent & Rendered) */}
              {currentSection.mathFormula && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <div className="p-1 rounded bg-emerald-500/20 border border-emerald-500/40">
                      <Calculator className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span>The Mathematical Foundation & Formula</span>
                  </div>
                  
                  <div className="p-6 bg-gradient-to-r from-emerald-950/60 via-midnight to-mountainside/80 border border-emerald-500/50 shadow-xl rounded-2xl space-y-4">
                    {/* KaTeX Rendered Latex Block Component */}
                    <div className="p-4 bg-midnight/80 border border-emerald-500/30 rounded-xl shadow-inner flex items-center justify-center">
                      <MathFormulaBlock formula={currentSection.mathFormula} />
                    </div>

                    {/* Raw Latex Formula Text Banner */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 rounded-lg bg-emerald-950/70 border border-emerald-500/30 font-mono text-xs text-emerald-300">
                      <span className="text-apres font-medium">LaTeX Formula Expression:</span>
                      <code className="text-emerald-400 font-bold text-sm tracking-wide break-all">{currentSection.mathFormula}</code>
                    </div>
                  </div>
                </div>
              )}

              {/* Worked Numerical Example Box */}
              {currentSection.workedExample && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono font-semibold text-arctic uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {currentSection.workedExample.title}
                  </div>
                  <div className="p-4 bg-amber-950/20 border border-amber-500/40 rounded-xl space-y-2 text-xs sm:text-sm font-mono text-amber-200">
                    {currentSection.workedExample.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">Step {sIdx + 1}:</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bullet Points List */}
              {currentSection.bulletPoints && currentSection.bulletPoints.length > 0 && (
                <ul className="space-y-2.5 pt-2 text-sm text-slopes font-sans">
                  {currentSection.bulletPoints.map((item, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <span className="text-cyan-400 font-bold">•</span>
                      <div>
                        {item.label && (
                          <strong className="text-arctic font-mono mr-1.5">{item.label}:</strong>
                        )}
                        <span>{item.text}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Code Snippet Box */}
              {currentSection.codeSnippet && (
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono font-semibold text-arctic uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-cyan-400" />
                    Implementation in Python
                  </div>
                  <div className="p-4 bg-[#080c10] border border-apres/30 rounded-xl font-mono text-xs text-arctic overflow-x-auto leading-relaxed shadow-inner">
                    <pre className="text-cyan-300 whitespace-pre">
                      <code>{currentSection.codeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Complete Production ML Notebook Card */}
              {currentSection.notebookSnippet && (
                <div className="space-y-2 pt-3">
                  <div className="flex items-center justify-between text-xs font-mono font-semibold text-arctic uppercase tracking-wider">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      {currentSection.notebookSnippet.title}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono">
                      📓 {currentSection.notebookSnippet.filename}
                    </span>
                  </div>
                  <div className="p-4 bg-[#070a0e] border border-amber-500/30 rounded-xl font-mono text-xs text-arctic overflow-x-auto leading-relaxed shadow-hard">
                    <pre className="text-emerald-300 whitespace-pre">
                      <code>{currentSection.notebookSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              {currentSection.comparisonTable && (
                <div className="space-y-2 pt-3">
                  <div className="text-xs font-mono font-semibold text-arctic uppercase tracking-wider flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-purple-400" />
                    {currentSection.comparisonTable.title}
                  </div>
                  <div className="overflow-x-auto rounded-xl border border-apres/30">
                    <table className="w-full text-xs font-mono text-left">
                      <thead className="bg-mountainside text-arctic uppercase border-b border-apres/30">
                        <tr>
                          {currentSection.comparisonTable.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 font-bold">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-apres/20 bg-midnight/60">
                        {currentSection.comparisonTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-mountainside/30 transition-colors">
                            <td className="p-3 font-bold text-cyan-300">{row.feature}</td>
                            <td className="p-3 text-slopes">{row.itemA}</td>
                            <td className="p-3 text-slopes">{row.itemB}</td>
                            {row.itemC && <td className="p-3 text-slopes">{row.itemC}</td>}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Practice Questions */}
              {currentSection.practiceQuestions && currentSection.practiceQuestions.length > 0 && (
                <div className="space-y-3 pt-3">
                  <div className="text-xs font-mono font-semibold text-arctic uppercase tracking-wider flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    Exam & Interview Practice Questions
                  </div>
                  <div className="space-y-2.5">
                    {currentSection.practiceQuestions.map((q, qIdx) => {
                      const isOpen = openQuestionIndex === qIdx;
                      return (
                        <div
                          key={qIdx}
                          className="p-4 rounded-xl bg-mountainside/40 border border-apres/30 space-y-2 text-xs sm:text-sm font-sans"
                        >
                          <div className="flex items-center justify-between gap-2 font-mono">
                            <span className="font-bold text-cyan-300">
                              Q{qIdx + 1} [{q.type.toUpperCase()}]:
                            </span>
                            <button
                              type="button"
                              onClick={() => setOpenQuestionIndex(isOpen ? null : qIdx)}
                              className="text-[11px] text-apres hover:text-arctic underline cursor-pointer"
                            >
                              {isOpen ? 'Hide Solution' : 'Reveal Solution'}
                            </button>
                          </div>
                          <p className="text-arctic font-medium">{q.question}</p>
                          {isOpen && (
                            <div className="p-3 bg-cyan-950/40 border border-cyan-500/40 rounded-lg text-cyan-200 text-xs font-mono leading-relaxed">
                              💡 <strong>Solution:</strong> {q.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              {currentSection.keyTakeaways && currentSection.keyTakeaways.length > 0 && (
                <div className="space-y-2 pt-3">
                  <div className="text-xs font-mono font-semibold text-arctic uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-400" />
                    Key Takeaways for Last-Minute Revision
                  </div>
                  <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl space-y-2 text-xs sm:text-sm font-sans text-emerald-200">
                    {currentSection.keyTakeaways.map((takeaway, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">✓</span>
                        <span>{takeaway}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="max-w-4xl flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isFirstSection}
          className="px-5 py-2.5 rounded-xl bg-mountainside/60 border border-apres/30 text-xs sm:text-sm font-semibold font-mono text-slopes hover:text-arctic hover:bg-mountainside/80 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-mono transition-all flex items-center gap-2 shadow-md cursor-pointer ${
            isLastSection
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
        >
          <span>{isLastSection ? 'Finish Module' : 'Next'}</span>
          {isLastSection ? (
            <CheckCircle2 className="w-4 h-4 text-white" />
          ) : (
            <ChevronRight className="w-4 h-4 text-white" />
          )}
        </button>
      </div>
    </PageContainer>
  );
};

export default ModuleLessonPage;
