import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useAppSelector } from '../../../../app/hooks';

interface HoveredEdgeInfo {
  layerIdx: number;
  fromNeuronIdx: number;
  toNeuronIdx: number;
  weight: number;
  gradW: number;
  prevWeight: number;
  deltaW: number;
  position: [number, number, number];
}

const Network3DGraph: React.FC<{
  onHoverEdge: (info: HoveredEdgeInfo | null) => void;
}> = ({ onHoverEdge }) => {
  const { layerSizes, trajectory, currentEpoch, config } = useAppSelector(
    (state) => state.neuralNetwork
  );

  const snapshot = trajectory[currentEpoch];
  const prevSnapshot = trajectory[Math.max(0, currentEpoch - 1)];

  // Calculate 3D layout coordinates for neurons
  const nodePositions = useMemo(() => {
    const coords: [number, number, number][][] = [];
    const numLayers = layerSizes.length;
    const xSpacing = 3.5;

    layerSizes.forEach((count, lIdx) => {
      const layerCoords: [number, number, number][] = [];
      const x = (lIdx - (numLayers - 1) / 2) * xSpacing;
      const ySpacing = 1.2;

      for (let nIdx = 0; nIdx < count; nIdx++) {
        const y = (nIdx - (count - 1) / 2) * ySpacing;
        const z = Math.sin(lIdx + nIdx) * 0.3;
        layerCoords.push([x, y, z]);
      }
      coords.push(layerCoords);
    });

    return coords;
  }, [layerSizes]);

  return (
    <group>
      {/* Render Neurons (Nodes) */}
      {nodePositions.map((layerCoords, lIdx) => {
        const layerData = snapshot?.networkState?.layers[lIdx];
        return layerCoords.map((pos, nIdx) => {
          const neuronData = layerData?.neurons[nIdx];
          const bias = neuronData?.bias ?? 0;
          const color = bias >= 0 ? '#10B981' : '#EF4444';

          return (
            <group key={`node_${lIdx}_${nIdx}`} position={pos}>
              <mesh>
                <sphereGeometry args={[0.22, 24, 24]} />
                <meshStandardMaterial
                  color={color}
                  roughness={0.2}
                  metalness={0.3}
                  emissive={color}
                  emissiveIntensity={0.25}
                />
              </mesh>
              {/* Outer halo */}
              <mesh>
                <sphereGeometry args={[0.28, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.15} />
              </mesh>
            </group>
          );
        });
      })}

      {/* Render Connection Edges */}
      {nodePositions.map((layerCoords, lIdx) => {
        if (lIdx === 0) return null;
        const prevLayerCoords = nodePositions[lIdx - 1];
        const currentLayerData = snapshot?.networkState?.layers[lIdx];
        const prevLayerData = prevSnapshot?.networkState?.layers[lIdx];

        return layerCoords.map((toPos, toIdx) => {
          const neuronData = currentLayerData?.neurons[toIdx];
          const prevNeuronData = prevLayerData?.neurons[toIdx];

          return prevLayerCoords.map((fromPos, fromIdx) => {
            const weight = neuronData?.weights[fromIdx] ?? 0;
            const gradW = neuronData?.gradW[fromIdx] ?? 0;
            const prevWeight = prevNeuronData?.weights[fromIdx] ?? weight;
            const deltaW = -config.learningRate * gradW;

            const edgeColor = weight >= 0 ? '#10B981' : '#EF4444';
            const lineWidth = Math.max(1, Math.min(8, Math.abs(weight) * 3.5));

            const midPoint: [number, number, number] = [
              (fromPos[0] + toPos[0]) / 2,
              (fromPos[1] + toPos[1]) / 2,
              (fromPos[2] + toPos[2]) / 2,
            ];

            return (
              <group key={`edge_${lIdx}_${fromIdx}_${toIdx}`}>
                <line
                  onPointerOver={(e) => {
                    e.stopPropagation();
                    onHoverEdge({
                      layerIdx: lIdx,
                      fromNeuronIdx: fromIdx,
                      toNeuronIdx: toIdx,
                      weight,
                      gradW,
                      prevWeight,
                      deltaW,
                      position: midPoint,
                    });
                  }}
                  onPointerOut={() => onHoverEdge(null)}
                >
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([...fromPos, ...toPos])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial
                    color={edgeColor}
                    linewidth={lineWidth}
                    transparent
                    opacity={Math.min(0.9, Math.max(0.2, Math.abs(weight)))}
                  />
                </line>
              </group>
            );
          });
        });
      })}
    </group>
  );
};

export const WeightBias3DScene: React.FC = () => {
  const [hoveredEdge, setHoveredEdge] = useState<HoveredEdgeInfo | null>(null);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-midnight border border-mountainside shadow-soft min-h-[440px]">
      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-midnight/80 border border-mountainside backdrop-blur-md text-xs font-mono text-arctic flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>3D Weight Dynamics Topology</span>
      </div>

      <Canvas camera={{ position: [0, 0, 8.5], fov: 48 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#090F15']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} color="#D3D1CE" />
        <directionalLight position={[-10, -10, -10]} intensity={0.5} color="#6C6D74" />

        <Network3DGraph onHoverEdge={setHoveredEdge} />
        <Sparkles count={40} scale={10} size={2} speed={0.3} color="#B3B7BA" opacity={0.4} />
        <OrbitControls enablePan enableRotate enableZoom />

        {hoveredEdge && (
          <Html position={hoveredEdge.position} center transform distanceFactor={10}>
            <div className="p-3 rounded-2xl bg-midnight/95 border border-slopes shadow-2xl backdrop-blur-xl font-mono text-xs text-arctic space-y-1.5 select-none min-w-[200px]">
              <div className="text-[10px] text-apres uppercase tracking-wider font-bold">
                Layer {hoveredEdge.layerIdx} Weight (w_{hoveredEdge.fromNeuronIdx + 1}➔{hoveredEdge.toNeuronIdx + 1})
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slopes">Current Weight:</span>
                <span className={`font-bold ${hoveredEdge.weight >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {hoveredEdge.weight.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-apres">Gradient (∂L/∂w):</span>
                <span className="text-amber-400 font-bold">{hoveredEdge.gradW.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-apres">Previous Weight:</span>
                <span className="text-slopes">{hoveredEdge.prevWeight.toFixed(4)}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-mountainside">
                <span className="text-apres">Delta Update (Δw):</span>
                <span className={hoveredEdge.deltaW >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {hoveredEdge.deltaW.toFixed(4)}
                </span>
              </div>
            </div>
          </Html>
        )}
      </Canvas>
    </div>
  );
};

export default WeightBias3DScene;
