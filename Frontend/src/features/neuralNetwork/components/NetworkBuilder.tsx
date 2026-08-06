import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  addLayer,
  removeLayer,
  updateNeuronCount,
} from '../neuralNetworkSlice';
import Card from '../../../components/ui/Card';
import { Plus, Minus, Layers, Trash2 } from 'lucide-react';

export const NetworkBuilder: React.FC = () => {
  const dispatch = useAppDispatch();
  const { layerSizes } = useAppSelector((state) => state.neuralNetwork);

  return (
    <Card className="p-4 space-y-4 bg-midnight/90 border border-apres/30">
      <div className="flex items-center justify-between border-b border-apres/30 pb-2">
        <h4 className="text-xs uppercase font-bold tracking-wider text-arctic flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-cyan-400" /> Interactive Network Topology
        </h4>
        <span className="text-xs font-mono font-bold text-cyan-400">
          {layerSizes.length} Layers
        </span>
      </div>

      {/* Layer Configurator List */}
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 scrollbar-hide">
        {layerSizes.map((count, lIdx) => {
          const isInput = lIdx === 0;
          const isOutput = lIdx === layerSizes.length - 1;
          const isHidden = !isInput && !isOutput;

          return (
            <div
              key={`layer_builder_${lIdx}`}
              className="flex items-center justify-between p-2.5 rounded-xl bg-mountainside/40 border border-apres/20 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isInput ? 'bg-cyan-400' : isOutput ? 'bg-emerald-400' : 'bg-purple-400'
                  }`}
                />
                <span className="text-arctic font-semibold">
                  {isInput
                    ? 'Input Layer'
                    : isOutput
                    ? 'Output Layer'
                    : `Hidden Layer ${lIdx}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-apres text-[11px]">{count} Neurons</span>

                {/* Neuron Count Controls for Hidden Layers */}
                {isHidden && (
                  <div className="flex items-center gap-1 bg-midnight p-1 rounded-lg border border-apres/30">
                    <button
                      onClick={() => dispatch(updateNeuronCount({ layerIndex: lIdx, delta: -1 }))}
                      disabled={count <= 1}
                      className="p-1 rounded text-slopes hover:text-arctic disabled:opacity-30"
                      title="Decrease Neurons"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-arctic">{count}</span>
                    <button
                      onClick={() => dispatch(updateNeuronCount({ layerIndex: lIdx, delta: 1 }))}
                      disabled={count >= 20}
                      className="p-1 rounded text-slopes hover:text-arctic disabled:opacity-30"
                      title="Increase Neurons"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Delete Hidden Layer Button */}
                {isHidden && layerSizes.length > 3 && (
                  <button
                    onClick={() => dispatch(removeLayer(lIdx))}
                    className="p-1.5 text-apres hover:text-red-400 transition-colors"
                    title="Remove Layer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Hidden Layer Button */}
      <button
        onClick={() => dispatch(addLayer())}
        disabled={layerSizes.length >= 8}
        className="w-full py-2 px-3 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-950/20 text-xs font-semibold text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
      >
        <Plus className="w-4 h-4" /> Add Hidden Layer
      </button>
    </Card>
  );
};

export default NetworkBuilder;
