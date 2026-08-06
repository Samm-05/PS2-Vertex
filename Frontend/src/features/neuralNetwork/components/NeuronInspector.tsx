import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setSelectedNeuron } from '../neuralNetworkSlice';
import Card from '../../../components/ui/Card';
import { X, Search, Activity, Sliders, Zap } from 'lucide-react';

export const NeuronInspector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { selectedNeuron, trajectory, currentEpoch, layerSizes } = useAppSelector(
    (state) => state.neuralNetwork
  );

  if (!selectedNeuron) return null;

  const { layerIndex, neuronIndex } = selectedNeuron;
  const snapshot = trajectory[currentEpoch];
  const neuronData = snapshot?.networkState?.layers[layerIndex]?.neurons[neuronIndex];

  if (!neuronData) return null;

  const isInput = layerIndex === 0;
  const isOutput = layerIndex === layerSizes.length - 1;

  return (
    <Card className="p-4 space-y-3 bg-midnight/95 border border-amber-500/50 shadow-2xl relative font-mono text-xs text-arctic">
      <div className="flex items-center justify-between border-b border-apres/30 pb-2">
        <div className="flex items-center gap-1.5 font-bold text-amber-400">
          <Search className="w-4 h-4" />
          Neuron Inspector (Layer {layerIndex}, Neuron {neuronIndex + 1})
        </div>
        <button
          onClick={() => dispatch(setSelectedNeuron(null))}
          className="p-1 rounded text-slopes hover:text-arctic hover:bg-mountainside/50"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-mountainside/40 p-2 rounded-xl border border-apres/20 space-y-0.5">
          <span className="text-[10px] text-apres">Role</span>
          <div className="font-bold text-cyan-400">
            {isInput ? 'Input Feature' : isOutput ? 'Output Node' : 'Hidden Feature'}
          </div>
        </div>

        <div className="bg-mountainside/40 p-2 rounded-xl border border-apres/20 space-y-0.5">
          <span className="text-[10px] text-apres">Activation Output (a)</span>
          <div className="font-bold text-emerald-400">{neuronData.a.toFixed(4)}</div>
        </div>

        {!isInput && (
          <>
            <div className="bg-mountainside/40 p-2 rounded-xl border border-apres/20 space-y-0.5">
              <span className="text-[10px] text-apres">Weighted Sum (z)</span>
              <div className="font-bold text-yellow-400">{neuronData.z.toFixed(4)}</div>
            </div>

            <div className="bg-mountainside/40 p-2 rounded-xl border border-apres/20 space-y-0.5">
              <span className="text-[10px] text-apres">Bias (b)</span>
              <div className="font-bold text-purple-400">{neuronData.bias.toFixed(4)}</div>
            </div>
          </>
        )}
      </div>

      {/* Incoming Weights & Gradients List */}
      {!isInput && neuronData.weights.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-apres/30">
          <span className="text-[11px] font-bold text-apres flex items-center gap-1">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" /> Incoming Weights & Gradients (∂L/∂w):
          </span>
          <div className="max-h-32 overflow-y-auto space-y-1 pr-1 scrollbar-hide">
            {neuronData.weights.map((w, idx) => {
              const grad = neuronData.gradW[idx] ?? 0;
              return (
                <div
                  key={`weight_inspect_${idx}`}
                  className="flex items-center justify-between p-1.5 rounded-lg bg-mountainside/30 text-[11px] border border-apres/20"
                >
                  <span className="text-slopes">w{idx + 1} ➔ {neuronIndex + 1}:</span>
                  <div className="flex items-center gap-3 font-bold">
                    <span className={w >= 0 ? 'text-cyan-400' : 'text-rose-400'}>
                      w = {w.toFixed(3)}
                    </span>
                    <span className="text-amber-400 text-[10px]">
                      ∂L/∂w = {grad.toFixed(4)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};

export default NeuronInspector;
