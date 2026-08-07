import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setDatasetType,
  setPoints,
  setSelectedLessonId,
  removePoint,
} from '../logisticRegressionSlice';
import { DatasetType, DataPoint2D } from '../types';
import { logisticLessons } from '../utils/lessonData';
import Card from '../../../components/ui/Card';
import MathFormulaPanel from './MathFormulaPanel';
import ExplanationPanel from './ExplanationPanel';
import {
  BookOpen,
  Calculator,
  Database,
  Upload,
  ChevronRight,
  ChevronLeft,
  Trash2,
  Sparkles,
  Save,
  FileText,
} from 'lucide-react';
import Papa from 'papaparse';
import { experimentService } from '../../../services/experimentService';
import { toast } from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import { UniversalReportModal } from '../../../components/reports/UniversalReportModal';

export const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { datasetType, points, selectedLessonId, config, trajectory, currentEpoch } = useAppSelector(
    (state) => state.logisticRegression
  );

  const [activeTab, setActiveTab] = useState<'lesson' | 'math' | 'dataset'>('lesson');
  const [saving, setSaving] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const currentLesson = logisticLessons.find((l) => l.id === selectedLessonId) || logisticLessons[0];
  const currentSnapshot = trajectory[currentEpoch] || trajectory[0] || {};

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedPoints: DataPoint2D[] = [];
        results.data.forEach((row: any, idx: number) => {
          const x1 = parseFloat(row.x1 ?? row.X1 ?? row.x ?? 0);
          const x2 = parseFloat(row.x2 ?? row.X2 ?? row.y ?? 0);
          const label = parseInt(row.label ?? row.y ?? row.class ?? 0, 10) === 1 ? 1 : 0;
          if (!isNaN(x1) && !isNaN(x2)) {
            parsedPoints.push({
              id: `csv_${idx}_${Date.now()}`,
              x1: Math.max(-5, Math.min(5, x1)),
              x2: Math.max(-5, Math.min(5, x2)),
              label,
            });
          }
        });
        if (parsedPoints.length > 0) {
          dispatch(setPoints(parsedPoints));
          dispatch(setDatasetType('custom'));
        }
      },
    });
  };

  const handleSaveExperiment = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving Logistic Regression experiment...');
    try {
      await experimentService.saveExperiment({
        algorithm: 'logistic-regression',
        title: `Logistic Regression (α=${config.learningRate}, Threshold=${config.threshold})`,
        parameters: config,
        dataset: { count: points.length },
        metrics: currentSnapshot,
      });
      toast.success('Logistic Regression experiment saved to MongoDB! +50 XP', { id: toastId });
    } catch (err: any) {
      toast.error('Failed to save experiment', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 select-none">
      {/* Navigation Tabs */}
      <div className="flex items-center p-1 bg-midnight border border-mountainside rounded-2xl shadow-soft">
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'lesson'
              ? 'bg-mountainside text-arctic border border-apres/40 font-bold shadow-sm'
              : 'text-slopes hover:text-arctic'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          Guided Lessons
        </button>

        <button
          onClick={() => setActiveTab('math')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'math'
              ? 'bg-mountainside text-arctic border border-apres/40 font-bold shadow-sm'
              : 'text-slopes hover:text-arctic'
          }`}
        >
          <Calculator className="w-3.5 h-3.5 text-amber-400" />
          Math Formula
        </button>

        <button
          onClick={() => setActiveTab('dataset')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'dataset'
              ? 'bg-mountainside text-arctic border border-apres/40 font-bold shadow-sm'
              : 'text-slopes hover:text-arctic'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          Datasets ({points.length})
        </button>
      </div>

      {/* Tab 1: Guided Lessons */}
      {activeTab === 'lesson' && (
        <div className="space-y-3">
          <Card className="bg-midnight border-mountainside p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Lesson {currentLesson.id} of {logisticLessons.length}
              </span>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                +{currentLesson.xpReward} XP
              </span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-arctic">{currentLesson.title}</h3>
              <p className="text-xs text-slopes mt-0.5">{currentLesson.subtitle}</p>
            </div>

            <div className="p-3 bg-mountainside/50 rounded-xl border border-apres/20 space-y-1">
              <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase block">Objective</span>
              <p className="text-xs text-arctic leading-relaxed">{currentLesson.objective}</p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-mountainside">
              <button
                onClick={() => dispatch(setSelectedLessonId(Math.max(1, selectedLessonId - 1)))}
                disabled={selectedLessonId <= 1}
                className="px-2.5 py-1 text-xs font-medium text-slopes hover:text-arctic disabled:opacity-40 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>

              <button
                onClick={() => dispatch(setSelectedLessonId(Math.min(logisticLessons.length, selectedLessonId + 1)))}
                disabled={selectedLessonId >= logisticLessons.length}
                className="px-3 py-1.5 text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-midnight rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
              >
                Next Lesson <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

          <ExplanationPanel />
        </div>
      )}

      {/* Tab 2: Math Formula */}
      {activeTab === 'math' && <MathFormulaPanel />}

      {/* Tab 3: Dataset Presets & Custom CSV Editor */}
      {activeTab === 'dataset' && (
        <Card className="bg-midnight border-mountainside p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-mountainside pb-2">
            <span className="text-xs font-bold text-arctic flex items-center gap-1.5">
              <Database className="w-4 h-4 text-emerald-400" />
              Dataset Presets
            </span>
            <span className="text-xs font-mono text-cyan-400 font-bold">{points.length} Points</span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {(
              [
                ['linearly-separable', 'Linearly Separable'],
                ['overlapping', 'Overlapping Noise'],
                ['concentric-circles', 'Concentric Rings'],
                ['unbalanced', 'Imbalanced Ratio'],
              ] as [DatasetType, string][]
            ).map(([type, label]) => (
              <button
                key={type}
                onClick={() => dispatch(setDatasetType(type))}
                className={`py-2 px-2.5 text-xs font-medium rounded-xl border text-left transition-all cursor-pointer ${
                  datasetType === type
                    ? 'bg-mountainside text-arctic border-cyan-400 font-bold'
                    : 'bg-mountainside/30 text-slopes border-transparent hover:bg-mountainside/60'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Custom CSV File Upload */}
          <div className="pt-2 border-t border-mountainside space-y-2">
            <label className="text-xs font-semibold text-arctic block">Upload Custom CSV</label>
            <div className="relative">
              <input
                type="file"
                accept=".csv"
                onChange={handleCsvUpload}
                className="hidden"
                id="csv-upload-input"
              />
              <label
                htmlFor="csv-upload-input"
                className="w-full py-2 px-3 rounded-xl bg-mountainside/40 border border-apres/30 hover:border-cyan-400 text-slopes hover:text-arctic text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                Upload CSV File (x1, x2, label)
              </label>
            </div>
          </div>
        </Card>
      )}

      {/* Action Card: Save Experiment & Download PDF Report */}
      <Card className="bg-midnight border-mountainside p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-mountainside pb-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Save className="w-4 h-4" />
            Experiment & Report Actions
          </div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            +50 XP
          </span>
        </div>

        <div className="space-y-2">
          <Button
            variant="primary"
            onClick={handleSaveExperiment}
            isLoading={saving}
            className="w-full justify-center bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs py-2.5 shadow-soft cursor-pointer"
            icon={<Save className="w-4 h-4" />}
          >
            Save Experiment to MongoDB
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowReportModal(true)}
            className="w-full justify-center text-xs font-bold py-2.5 border-mountainside text-arctic hover:bg-mountainside/60 cursor-pointer"
            icon={<FileText className="w-4 h-4 text-cyan-400" />}
          >
            Download Detailed Report (PDF) 📄
          </Button>
        </div>
      </Card>

      {/* Universal Detailed Report Modal */}
      {showReportModal && (
        <UniversalReportModal algorithm="logistic-regression" onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
};

export default LeftPanel;