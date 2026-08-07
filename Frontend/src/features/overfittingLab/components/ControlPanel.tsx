import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  setConfig,
  setPresetRegime,
  reseedDataset,
} from '../overfittingSlice';
import Card from '../../../components/ui/Card';
import { Sliders, RefreshCw, Save, FileText } from 'lucide-react';
import { FitRegime } from '../types';
import { experimentService } from '../../../services/experimentService';
import { toast } from 'react-hot-toast';
import Button from '../../../components/ui/Button';
import { UniversalReportModal } from '../../../components/reports/UniversalReportModal';

export const ControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { config, result } = useAppSelector((state) => state.overfitting);
  const [saving, setSaving] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const rawLambda = config?.lambda ?? (config as any)?.lambdaReg ?? 0.001;
  const lambdaVal = typeof rawLambda === 'number' && !isNaN(rawLambda) ? rawLambda : 0.001;
  const degreeVal = typeof config?.degree === 'number' ? config.degree : 3;

  const handleSaveExperiment = async () => {
    setSaving(true);
    const toastId = toast.loading('Saving Overfitting Lab experiment...');
    try {
      await experimentService.saveExperiment({
        algorithm: 'overfitting',
        title: `Overfitting Lab (Degree=${degreeVal}, λ=${lambdaVal})`,
        parameters: config || {},
        metrics: result || {},
      });
      toast.success('Overfitting Lab experiment saved to MongoDB! +50 XP', { id: toastId });
    } catch (err: any) {
      toast.error('Failed to save experiment', { id: toastId });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="p-5 space-y-4 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft font-sans select-none">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <Sliders className="w-4 h-4 text-slopes" />
          </div>
          <h3 className="text-sm font-bold text-arctic tracking-tight">Hyperparameters & Regime Config</h3>
        </div>

        {/* Reseed Dataset Button */}
        <button
          onClick={() => dispatch(reseedDataset())}
          className="p-2 rounded-xl bg-midnight text-slopes hover:text-arctic border border-mountainside hover:border-slopes transition-all cursor-pointer"
          title="Reseed Data Points"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Preset Regime Shortcut Buttons */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-apres">Quick Regime Presets:</span>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['underfitting', 'Underfitting', 'bg-blue-950/60 border-blue-500/40 text-blue-400'],
              ['good_fit', 'Good Fit', 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'],
              ['overfitting', 'Overfitting', 'bg-rose-950/60 border-rose-500/40 text-rose-400'],
            ] as [FitRegime, string, string][]
          ).map(([regime, label, style]) => (
            <button
              key={regime}
              onClick={() => dispatch(setPresetRegime(regime))}
              className={`px-3 py-2 text-xs font-mono font-bold rounded-xl border transition-all text-center cursor-pointer ${style} ${
                result?.regime === regime ? 'ring-2 ring-arctic/30 shadow-md' : 'opacity-80 hover:opacity-100'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Polynomial Degree Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-arctic">Polynomial Degree (D):</label>
          <span className="font-mono text-cyan-400 font-bold">{degreeVal}</span>
        </div>
        <input
          type="range"
          min="1"
          max="12"
          step="1"
          value={degreeVal}
          onChange={(e) => dispatch(setConfig({ degree: parseInt(e.target.value, 10) }))}
          className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* L2 Regularization Lambda Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-arctic">L2 Regularization (λ):</label>
          <span className="font-mono text-amber-400 font-bold">{lambdaVal.toFixed(3)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="0.5"
          step="0.005"
          value={lambdaVal}
          onChange={(e) => dispatch(setConfig({ lambda: parseFloat(e.target.value) }))}
          className="w-full h-1.5 bg-mountainside rounded-lg appearance-none cursor-pointer accent-amber-400"
        />
      </div>

      {/* Action Section: Save Experiment & Download PDF Report */}
      <div className="pt-3 border-t border-mountainside space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
            <Save className="w-3.5 h-3.5" /> Experiment Actions
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            +50 XP
          </span>
        </div>

        <div className="space-y-2">
          <Button
            variant="primary"
            onClick={handleSaveExperiment}
            isLoading={saving}
            className="w-full justify-center bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs py-2.5 shadow-soft cursor-pointer"
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
      </div>

      {/* Universal Detailed Report Modal */}
      {showReportModal && (
        <UniversalReportModal algorithm="overfitting" onClose={() => setShowReportModal(false)} />
      )}
    </Card>
  );
};

export default ControlPanel;