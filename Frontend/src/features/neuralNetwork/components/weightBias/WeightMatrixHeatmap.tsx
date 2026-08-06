import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../../../app/hooks';
import Card from '../../../../components/ui/Card';
import { Grid } from 'lucide-react';

export const WeightMatrixHeatmap: React.FC = () => {
  const { layerSizes, trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.neuralNetwork
  );
  const [selectedLayerIdx, setSelectedLayerIdx] = useState<number>(1);
  const [hoveredCell, setHoveredCell] = useState<{ from: number; to: number } | null>(null);

  const snapshot = trajectory[currentEpoch];
  const prevSnapshot = trajectory[Math.max(0, currentEpoch - 1)];

  const currentLayerData = snapshot?.networkState?.layers[selectedLayerIdx];
  const prevLayerData = prevSnapshot?.networkState?.layers[selectedLayerIdx];

  const prevLayerSize = layerSizes[selectedLayerIdx - 1] ?? 0;
  const currentLayerSize = layerSizes[selectedLayerIdx] ?? 0;

  return (
    <Card className="p-5 space-y-4 bg-secondary-900/90 border border-mountainside backdrop-blur-xl shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-mountainside text-arctic border border-apres/40">
            <Grid className="w-4 h-4 text-slopes" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-arctic tracking-tight">Weight Matrix Heatmap (W^{`[${selectedLayerIdx}]`})</h3>
            <p className="text-[10px] font-mono text-apres">Layer {selectedLayerIdx - 1} ➔ Layer {selectedLayerIdx}</p>
          </div>
        </div>

        {/* Layer Selector */}
        <div className="flex items-center gap-1 bg-midnight p-1 rounded-xl border border-mountainside">
          {layerSizes.map((_, idx) => {
            if (idx === 0) return null;
            return (
              <button
                key={`layer_btn_${idx}`}
                onClick={() => setSelectedLayerIdx(idx)}
                className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                  selectedLayerIdx === idx
                    ? 'bg-arctic text-midnight font-bold'
                    : 'text-slopes hover:text-arctic'
                }`}
              >
                L{idx}
              </button>
            );
          })}
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="relative overflow-x-auto scrollbar-hide py-2">
        <div className="min-w-[280px]">
          {/* Header Row */}
          <div className="flex items-center gap-1 mb-1.5 ml-12">
            {Array.from({ length: prevLayerSize }).map((_, fromIdx) => (
              <div key={`head_${fromIdx}`} className="flex-1 text-center font-mono text-[10px] text-apres">
                n_{fromIdx + 1}
              </div>
            ))}
          </div>

          {/* Matrix Rows */}
          <div className="space-y-1.5">
            {Array.from({ length: currentLayerSize }).map((_, toIdx) => {
              const neuronData = currentLayerData?.neurons[toIdx];

              return (
                <div key={`row_${toIdx}`} className="flex items-center gap-1">
                  <span className="w-10 font-mono text-[10px] text-apres text-right pr-2">
                    n_{toIdx + 1}
                  </span>
                  {Array.from({ length: prevLayerSize }).map((_, fromIdx) => {
                    const weight = neuronData?.weights[fromIdx] ?? 0;
                    const absVal = Math.min(1, Math.abs(weight));
                    const isPositive = weight >= 0;
                    const bgColor = isPositive
                      ? `rgba(16, 185, 129, ${0.15 + absVal * 0.7})`
                      : `rgba(239, 68, 68, ${0.15 + absVal * 0.7})`;

                    const isHovered = hoveredCell?.from === fromIdx && hoveredCell?.to === toIdx;

                    return (
                      <motion.div
                        key={`cell_${toIdx}_${fromIdx}`}
                        whileHover={{ scale: 1.08 }}
                        onHoverStart={() => setHoveredCell({ from: fromIdx, to: toIdx })}
                        onHoverEnd={() => setHoveredCell(null)}
                        className={`flex-1 h-9 rounded-lg border transition-all flex flex-col items-center justify-center cursor-pointer relative ${
                          isHovered ? 'border-arctic ring-2 ring-arctic/20 shadow-md z-10' : 'border-mountainside/50'
                        }`}
                        style={{ backgroundColor: bgColor }}
                      >
                        <span className="font-mono text-[10px] font-bold text-white">
                          {weight.toFixed(2)}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Hovered Cell Detail Info */}
      {hoveredCell && (() => {
        const neuronData = currentLayerData?.neurons[hoveredCell.to];
        const prevNeuronData = prevLayerData?.neurons[hoveredCell.to];
        const weight = neuronData?.weights[hoveredCell.from] ?? 0;
        const gradW = neuronData?.gradW[hoveredCell.from] ?? 0;
        const prevWeight = prevNeuronData?.weights[hoveredCell.from] ?? weight;
        const deltaW = -config.learningRate * gradW;

        return (
          <div className="p-3 rounded-xl bg-midnight border border-mountainside text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <span className="text-[10px] text-apres">Weight w:</span>
              <p className={`font-bold ${weight >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {weight.toFixed(4)}
              </p>
            </div>
            <div>
              <span className="text-[10px] text-apres">Gradient ∂L/∂w:</span>
              <p className="text-amber-400 font-bold">{gradW.toFixed(4)}</p>
            </div>
            <div>
              <span className="text-[10px] text-apres">Previous Weight:</span>
              <p className="text-slopes">{prevWeight.toFixed(4)}</p>
            </div>
            <div>
              <span className="text-[10px] text-apres">Delta Update Δw:</span>
              <p className={deltaW >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{deltaW.toFixed(4)}</p>
            </div>
          </div>
        );
      })()}
    </Card>
  );
};

export default WeightMatrixHeatmap;
