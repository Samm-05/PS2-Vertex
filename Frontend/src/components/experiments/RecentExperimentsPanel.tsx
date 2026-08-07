import React, { useEffect, useState } from 'react';
import { experimentService, SavedExperiment } from '../../services/experimentService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { toast } from 'react-hot-toast';
import {
  History,
  FileText,
  Trash2,
  RotateCcw,
  Sparkles,
  Clock,
  ChevronRight,
  Database,
} from 'lucide-react';
import { PDFReportModal } from './PDFReportModal';

interface Props {
  algorithm: string;
  onLoadExperiment?: (experiment: SavedExperiment) => void;
}

export const RecentExperimentsPanel: React.FC<Props> = ({ algorithm, onLoadExperiment }) => {
  const [experiments, setExperiments] = useState<SavedExperiment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<SavedExperiment | null>(null);

  const fetchExperiments = async () => {
    setLoading(true);
    try {
      const res = await experimentService.getUserExperiments(algorithm);
      setExperiments(res.data || []);
    } catch (err) {
      console.warn('[RECENT EXPERIMENTS] Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
  }, [algorithm]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const toastId = toast.loading('Deleting experiment record...');
    try {
      await experimentService.deleteExperiment(id);
      setExperiments((prev) => prev.filter((exp) => exp.id !== id));
      toast.success('Experiment deleted from history.', { id: toastId });
    } catch (err) {
      toast.error('Failed to delete experiment', { id: toastId });
    }
  };

  const algorithmTitle = algorithm
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  return (
    <Card className="p-5 border-mountainside bg-midnight/90 backdrop-blur-xl shadow-hard space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-mountainside pb-3">
        <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Recent Experiments ({algorithmTitle})</span>
        </div>
        <button
          onClick={fetchExperiments}
          className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
        >
          Refresh History
        </button>
      </div>

      {/* Experiment List */}
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
        {loading ? (
          <div className="p-6 text-center text-xs text-apres">Loading experiment history...</div>
        ) : experiments.length > 0 ? (
          experiments.map((exp) => {
            const dateStr = new Date(exp.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={exp.id}
                className="p-3.5 rounded-xl bg-mountainside/30 border border-mountainside hover:border-indigo-500/40 transition-all space-y-2 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-arctic group-hover:text-indigo-300 transition-colors">
                      {exp.title}
                    </h4>
                    <p className="text-[10px] text-apres flex items-center gap-1 mt-0.5 font-mono">
                      <Clock className="w-3 h-3 text-apres" />
                      <span>{dateStr}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-1">
                    {onLoadExperiment && (
                      <button
                        onClick={() => {
                          onLoadExperiment(exp);
                          toast.success(`Loaded "${exp.title}" configuration into lab.`);
                        }}
                        title="Load Experiment State"
                        className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-semibold flex items-center space-x-1 border border-indigo-500/20 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Load</span>
                      </button>
                    )}

                    <button
                      onClick={() => setSelectedReport(exp)}
                      title="Generate PDF Report"
                      className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold flex items-center space-x-1 border border-cyan-500/20 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">PDF</span>
                    </button>

                    <button
                      onClick={(e) => handleDelete(exp.id, e)}
                      title="Delete Experiment"
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold border border-rose-500/20 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Hyperparameter Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {Object.entries(exp.parameters || {})
                    .slice(0, 4)
                    .map(([key, val]) => (
                      <span
                        key={key}
                        className="px-2 py-0.5 rounded-md bg-midnight/80 border border-mountainside text-[10px] font-mono text-slopes"
                      >
                        {key}: <strong className="text-arctic">{String(val)}</strong>
                      </span>
                    ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center border border-dashed border-mountainside/60 rounded-xl space-y-1">
            <Database className="w-8 h-8 text-apres mx-auto opacity-40 mb-1" />
            <p className="text-xs font-semibold text-slopes">No saved experiments yet.</p>
            <p className="text-[10px] text-apres">
              Click "Save Experiment" in the lab to store reproducible hyperparameter runs.
            </p>
          </div>
        )}
      </div>

      {/* PDF Report Modal Component */}
      {selectedReport && (
        <PDFReportModal experiment={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </Card>
  );
};

export default RecentExperimentsPanel;