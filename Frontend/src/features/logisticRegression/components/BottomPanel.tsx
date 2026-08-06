import React from 'react';
import { useAppSelector } from '../../../app/hooks';
import Card from '../../../components/ui/Card';
import TimelineControls from './TimelineControls';
import LiveGraphsPanel from './LiveGraphsPanel';
import { Grid } from 'lucide-react';

export const ConfusionMatrixCard: React.FC = () => {
  const { trajectory, currentEpoch, points } = useAppSelector(
    (state) => state.logisticRegression
  );

  const cm = trajectory[currentEpoch]?.confusionMatrix || {
    tp: 0,
    fp: 0,
    tn: 0,
    fn: 0,
  };

  const total = points.length || 1;
  const tpPct = ((cm.tp / total) * 100).toFixed(0);
  const fpPct = ((cm.fp / total) * 100).toFixed(0);
  const tnPct = ((cm.tn / total) * 100).toFixed(0);
  const fnPct = ((cm.fn / total) * 100).toFixed(0);

  return (
    <Card className="p-3 bg-midnight/90 border border-apres/30 space-y-2 min-w-[280px]">
      <div className="flex items-center justify-between text-xs font-mono border-b border-apres/30 pb-1.5">
        <span className="font-bold text-arctic flex items-center gap-1.5">
          <Grid className="w-3.5 h-3.5 text-cyan-400" /> Confusion Matrix
        </span>
        <span className="text-[10px] text-apres">N = {points.length}</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
        {/* True Positives (TP) */}
        <div className="relative group p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-center text-[10px] text-emerald-400 font-semibold">
            <span>TP (True Pos)</span>
            <span>{tpPct}%</span>
          </div>
          <div className="text-lg font-bold text-emerald-400">{cm.tp}</div>
          <div className="absolute inset-0 p-2 bg-midnight/95 backdrop-blur-md rounded-xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-arctic border border-emerald-500/50 flex items-center">
            Actual Red (1), Correctly Predicted Red (1)
          </div>
        </div>

        {/* False Positives (FP) */}
        <div className="relative group p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-center text-[10px] text-amber-400 font-semibold">
            <span>FP (False Pos)</span>
            <span>{fpPct}%</span>
          </div>
          <div className="text-lg font-bold text-amber-400">{cm.fp}</div>
          <div className="absolute inset-0 p-2 bg-midnight/95 backdrop-blur-md rounded-xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-arctic border border-amber-500/50 flex items-center">
            Actual Blue (0), Incorrectly Predicted Red (1) [Type I Error]
          </div>
        </div>

        {/* False Negatives (FN) */}
        <div className="relative group p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-center text-[10px] text-red-400 font-semibold">
            <span>FN (False Neg)</span>
            <span>{fnPct}%</span>
          </div>
          <div className="text-lg font-bold text-red-400">{cm.fn}</div>
          <div className="absolute inset-0 p-2 bg-midnight/95 backdrop-blur-md rounded-xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-arctic border border-red-500/50 flex items-center">
            Actual Red (1), Incorrectly Predicted Blue (0) [Type II Error]
          </div>
        </div>

        {/* True Negatives (TN) */}
        <div className="relative group p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 transition-all hover:scale-[1.02]">
          <div className="flex justify-between items-center text-[10px] text-blue-400 font-semibold">
            <span>TN (True Neg)</span>
            <span>{tnPct}%</span>
          </div>
          <div className="text-lg font-bold text-blue-400">{cm.tn}</div>
          <div className="absolute inset-0 p-2 bg-midnight/95 backdrop-blur-md rounded-xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-arctic border border-blue-500/50 flex items-center">
            Actual Blue (0), Correctly Predicted Blue (0)
          </div>
        </div>
      </div>
    </Card>
  );
};

export const BottomPanel: React.FC = () => {
  return (
    <div className="w-full space-y-3">
      <TimelineControls />

      <div className="flex flex-col lg:flex-row items-stretch gap-3">
        <div className="flex-1">
          <LiveGraphsPanel />
        </div>
        <div className="w-full lg:w-80">
          <ConfusionMatrixCard />
        </div>
      </div>
    </div>
  );
};

export default BottomPanel;
