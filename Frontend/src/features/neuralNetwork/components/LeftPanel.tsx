import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setDatasetType,
  setPoints,
  setSelectedLessonId,
} from '../neuralNetworkSlice';
import { DatasetType, DataPoint2D } from '../types';
import { nnLessons } from '../utils/lessonData';
import Card from '../../../components/ui/Card';
import MathFormulaPanel from './MathFormulaPanel';
import ExplanationPanel from './ExplanationPanel';
import NetworkBuilder from './NetworkBuilder';
import {
  BookOpen,
  Calculator,
  Database,
  Upload,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Layers,
} from 'lucide-react';
import Papa from 'papaparse';

export const LeftPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { config, points, selectedLessonId } = useAppSelector(
    (state) => state.neuralNetwork
  );

  const [activeTab, setActiveTab] = useState<'lesson' | 'math' | 'dataset' | 'builder'>('lesson');
  const currentLesson = nnLessons.find((l) => l.id === selectedLessonId) || nnLessons[0];

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
              x1: Math.max(-4, Math.min(4, x1)),
              x2: Math.max(-4, Math.min(4, x2)),
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

  return (
    <div className="w-full h-full flex flex-col space-y-4">
      {/* Navigation Tab Bar */}
      <div className="flex items-center p-1 bg-midnight/90 backdrop-blur-md rounded-2xl border border-apres/30 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('lesson')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
            activeTab === 'lesson'
              ? 'bg-arctic text-midnight shadow-md font-bold'
              : 'text-slopes hover:text-arctic'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> 25-Lesson
        </button>
        <button
          onClick={() => setActiveTab('builder')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
            activeTab === 'builder'
              ? 'bg-arctic text-midnight shadow-md font-bold'
              : 'text-slopes hover:text-arctic'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Topology
        </button>
        <button
          onClick={() => setActiveTab('math')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
            activeTab === 'math'
              ? 'bg-arctic text-midnight shadow-md font-bold'
              : 'text-slopes hover:text-arctic'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" /> Math & AI
        </button>
        <button
          onClick={() => setActiveTab('dataset')}
          className={`flex-1 py-2 px-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 transition-all whitespace-nowrap ${
            activeTab === 'dataset'
              ? 'bg-arctic text-midnight shadow-md font-bold'
              : 'text-slopes hover:text-arctic'
          }`}
        >
          <Database className="w-3.5 h-3.5" /> Datasets
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
        {activeTab === 'lesson' && (
          <Card className="p-4 space-y-4 bg-midnight/90 border border-apres/30">
            <div className="flex items-center justify-between border-b border-apres/30 pb-3">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-mountainside text-cyan-400 border border-apres/30">
                Step {currentLesson.id} of {nnLessons.length}
              </span>
              <span className="text-xs text-apres font-mono">{currentLesson.category}</span>
            </div>

            <h3 className="text-base font-bold text-arctic tracking-tight">
              {currentLesson.title}
            </h3>

            <p className="text-xs text-slopes leading-relaxed">
              {currentLesson.description}
            </p>

            <div className="p-3 bg-mountainside/40 rounded-xl border border-apres/30 text-xs space-y-1">
              <div className="text-[11px] font-mono font-semibold text-arctic flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Explanation:
              </div>
              <p className="text-apres leading-normal">{currentLesson.explanation}</p>
            </div>

            <div className="p-3 bg-cyan-950/30 border border-cyan-500/30 rounded-xl text-xs text-cyan-300">
              <span className="font-bold">Action Hint:</span> {currentLesson.actionHint}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-apres/30">
              <button
                disabled={selectedLessonId <= 1}
                onClick={() => dispatch(setSelectedLessonId(selectedLessonId - 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-mountainside text-slopes hover:text-arctic disabled:opacity-40 flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button
                disabled={selectedLessonId >= nnLessons.length}
                onClick={() => dispatch(setSelectedLessonId(selectedLessonId + 1))}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-arctic text-midnight hover:bg-slopes flex items-center gap-1"
              >
                Next Step <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
        )}

        {activeTab === 'builder' && <NetworkBuilder />}

        {activeTab === 'math' && (
          <div className="space-y-4">
            <MathFormulaPanel />
            <ExplanationPanel />
          </div>
        )}

        {activeTab === 'dataset' && (
          <Card className="p-4 space-y-4 bg-midnight/90 border border-apres/30">
            <h4 className="text-xs uppercase font-bold tracking-wider text-arctic border-b border-apres/30 pb-2">
              Synthetic Benchmark Datasets
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ['xor', 'XOR Quadrants'],
                  ['circle', 'Concentric Circles'],
                  ['spiral', 'Archimedean Spiral'],
                  ['moons', 'Interlocking Moons'],
                  ['gaussian', 'Gaussian Clusters'],
                ] as [DatasetType, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => dispatch(setDatasetType(key))}
                  className={`p-2.5 text-xs text-left rounded-xl font-medium border transition-all ${
                    config.datasetType === key
                      ? 'bg-arctic text-midnight font-bold border-arctic'
                      : 'bg-mountainside/40 border-apres/30 text-slopes hover:text-arctic'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2 border-t border-apres/30">
              <label className="text-xs text-apres font-mono">Upload Custom CSV Data:</label>
              <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-apres/40 bg-mountainside/30 text-xs text-slopes hover:text-arctic hover:border-arctic cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Choose .csv file (x1, x2, label)</span>
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="text-[11px] text-apres font-mono pt-1">
              Active Points: <span className="text-arctic font-bold">{points.length}</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default LeftPanel;
