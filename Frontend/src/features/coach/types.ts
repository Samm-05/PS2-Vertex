export interface ComparisonRow {
  feature: string;
  itemA: string;
  itemB: string;
  itemC?: string;
}

export interface PracticeQuestionItem {
  type: 'conceptual' | 'numerical' | 'scenario';
  question: string;
  answer: string;
}

export interface LessonSection {
  id: string;
  title: string;
  paragraphs: string[];
  mathFormula?: string;
  bulletPoints?: { label?: string; text: string }[];
  codeSnippet?: {
    language: string;
    code: string;
  };
  notebookSnippet?: {
    title: string;
    filename: string;
    code: string;
  };
  workedExample?: {
    title: string;
    steps: string[];
  };
  comparisonTable?: {
    title: string;
    headers: string[];
    rows: ComparisonRow[];
  };
  practiceQuestions?: PracticeQuestionItem[];
  keyTakeaways?: string[];
}

export interface CoachModule {
  id: string;
  moduleNumber: number;
  title: string;
  shortDescription: string;
  iconName: 'sparkles' | 'trending-up' | 'activity' | 'network' | 'target' | 'layers';
  sections: LessonSection[];
}

export interface CoachState {
  completedModules: string[]; // array of module IDs (e.g. ['intro-ml', 'linear-regression'])
}
