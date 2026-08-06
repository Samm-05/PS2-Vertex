import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  addPoint,
  setSelectedNeuron,
  setHoveredNeuron,
} from '../neuralNetworkSlice';
import { Eye, RotateCcw, Plus, Activity, HelpCircle, X, Info } from 'lucide-react';

// Framed 2D Feature Decision Space & Probability Heatmap Board
const BackgroundHeatmapPlane: React.FC = () => {
  const { trajectory, currentEpoch } = useAppSelector((state) => state.neuralNetwork);
  const meshRef = useRef<THREE.Mesh>(null);

  const decisionGrid = trajectory[currentEpoch]?.decisionGrid || [];

  const texture = useMemo(() => {
    const size = decisionGrid.length || 25;
    const data = new Uint8Array(size * size * 4);

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const val = decisionGrid[r]?.[c] ?? 0.5;
        const idx = (r * size + c) * 4;
        const byteVal = Math.floor(val * 255);
        data[idx] = byteVal;
        data[idx + 1] = byteVal;
        data[idx + 2] = byteVal;
        data[idx + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }, [decisionGrid]);

  return (
    <group position={[0, 0, -1.8]}>
      {/* Framed Heatmap Plane Mesh */}
      <mesh ref={meshRef}>
        <planeGeometry args={[13.5, 9.2]} />
        <meshBasicMaterial map={texture} transparent opacity={0.45} />
      </mesh>

      {/* Axis Lines for (X1, X2) Feature Space */}
      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(geo) => {
            geo.setFromPoints([new THREE.Vector3(-6.75, 0, 0.01), new THREE.Vector3(6.75, 0, 0.01)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#334155" linewidth={1} transparent opacity={0.6} />
      </line>

      <line>
        <bufferGeometry
          attach="geometry"
          onUpdate={(geo) => {
            geo.setFromPoints([new THREE.Vector3(0, -4.6, 0.01), new THREE.Vector3(0, 4.6, 0.01)]);
          }}
        />
        <lineBasicMaterial attach="material" color="#334155" linewidth={1} transparent opacity={0.6} />
      </line>

      {/* Top 3D Header Tag on Decision Space - Centered at Y = 5.2 */}
      <Html position={[0, 5.2, 0.02]} center distanceFactor={11}>
        <div className="bg-midnight/95 backdrop-blur-xl border border-cyan-500/40 text-cyan-300 font-mono text-[10px] px-3 py-1 rounded-xl shadow-2xl pointer-events-none font-bold whitespace-nowrap flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          <span>🗺️ 2D Decision Space (x₁, x₂ Feature Map)</span>
        </div>
      </Html>
    </group>
  );
};

// Animated Flow Pulses along Connection Lines
const SignalPulseParticle: React.FC<{
  startPos: [number, number, number];
  endPos: [number, number, number];
  isBackprop: boolean;
  color: string;
}> = ({ startPos, endPos, isBackprop, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const progressRef = useRef(Math.random());

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const speed = isBackprop ? -0.8 : 0.8;
    progressRef.current = (progressRef.current + speed * delta) % 1.0;
    if (progressRef.current < 0) progressRef.current += 1.0;

    const t = progressRef.current;
    meshRef.current.position.x = startPos[0] + (endPos[0] - startPos[0]) * t;
    meshRef.current.position.y = startPos[1] + (endPos[1] - startPos[1]) * t;
    meshRef.current.position.z = startPos[2] + (endPos[2] - startPos[2]) * t;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.045, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

// 3D Neural Network Graph (Neurons & Connections)
const NetworkGraph3D: React.FC = () => {
  const dispatch = useAppDispatch();
  const { layerSizes, trajectory, currentEpoch, isPlaying, selectedNeuron, hoveredNeuron } =
    useAppSelector((state) => state.neuralNetwork);

  const snapshot = trajectory[currentEpoch];
  const networkState = snapshot?.networkState;

  // Calculate 3D positions for each neuron in layer columns
  const layerPositions = useMemo(() => {
    const numLayers = layerSizes.length;
    const layerSpacing = 11 / Math.max(1, numLayers - 1);
    const startX = -5.5;

    return layerSizes.map((size, lIdx) => {
      const x = startX + lIdx * layerSpacing;
      const height = Math.min(7.0, size * 0.95);
      const startY = height / 2;
      const stepY = size > 1 ? height / (size - 1) : 0;

      return Array.from({ length: size }, (_, nIdx) => {
        const y = size === 1 ? 0 : startY - nIdx * stepY;
        return new THREE.Vector3(x, y, 0);
      });
    });
  }, [layerSizes]);

  if (!networkState) return null;

  return (
    <group>
      {/* 3D Column Header Badges aligned consistently along a single horizontal baseline at Y = 4.2 */}
      {layerPositions.map((layerPos, lIdx) => {
        const topNeuron = layerPos[0];
        const isInput = lIdx === 0;
        const isOutput = lIdx === layerSizes.length - 1;

        let layerTitle = isInput
          ? 'Input Layer'
          : isOutput
          ? 'Output Layer'
          : `Hidden ${lIdx}`;

        let layerBadgeStyle = isInput
          ? 'border-sky-500/50 text-sky-300 bg-sky-950/80'
          : isOutput
          ? 'border-emerald-500/50 text-emerald-300 bg-emerald-950/80'
          : 'border-purple-500/50 text-purple-300 bg-purple-950/80';

        return (
          <Html
            key={`layer_header_${lIdx}`}
            position={[topNeuron.x, 4.2, 0.1]}
            center
            distanceFactor={11}
          >
            <div
              className={`backdrop-blur-xl border ${layerBadgeStyle} text-[10px] font-mono px-2.5 py-1 rounded-xl shadow-2xl font-bold whitespace-nowrap pointer-events-none flex flex-col items-center gap-0.5`}
            >
              <span>{layerTitle}</span>
              <span className="text-[9px] opacity-75 font-normal">
                {layerSizes[lIdx]} {layerSizes[lIdx] === 1 ? 'Neuron' : 'Neurons'}
              </span>
            </div>
          </Html>
        );
      })}

      {/* 1. Render Connection Lines & Pulse Particles between adjacent layers */}
      {layerPositions.map((currLayerPos, lIdx) => {
        if (lIdx === 0) return null;
        const prevLayerPos = layerPositions[lIdx - 1];

        return currLayerPos.map((posCurr, currNIdx) => {
          const neuronData = networkState.layers[lIdx]?.neurons[currNIdx];
          const weights = neuronData?.weights || [];

          return prevLayerPos.map((posPrev, prevNIdx) => {
            const wVal = weights[prevNIdx] ?? 0;
            const absW = Math.abs(wVal);
            const isPositive = wVal >= 0;
            const lineColor = isPositive ? '#06b6d4' : '#f43f5e';
            const lineThickness = Math.max(0.5, Math.min(4, absW * 2.2));

            const points = [posPrev, posCurr];
            const isConnectedToSelected =
              selectedNeuron &&
              ((selectedNeuron.layerIndex === lIdx && selectedNeuron.neuronIndex === currNIdx) ||
                (selectedNeuron.layerIndex === lIdx - 1 && selectedNeuron.neuronIndex === prevNIdx));

            return (
              <group key={`conn_${lIdx}_${currNIdx}_${prevNIdx}`}>
                {/* Connection Line */}
                <line>
                  <bufferGeometry
                    attach="geometry"
                    onUpdate={(geo) => {
                      geo.setFromPoints(points);
                    }}
                  />
                  <lineBasicMaterial
                    attach="material"
                    color={lineColor}
                    linewidth={lineThickness}
                    transparent
                    opacity={isConnectedToSelected ? 0.95 : 0.35}
                  />
                </line>

                {/* Animated Signal Particle Flowing on Active Training */}
                {isPlaying && (
                  <SignalPulseParticle
                    startPos={[posPrev.x, posPrev.y, posPrev.z]}
                    endPos={[posCurr.x, posCurr.y, posCurr.z]}
                    isBackprop={currentEpoch % 2 === 1}
                    color={lineColor}
                  />
                )}
              </group>
            );
          });
        });
      })}

      {/* 2. Render Glowing Neuron Spheres */}
      {layerPositions.map((layerPos, lIdx) =>
        layerPos.map((pos, nIdx) => {
          const neuronData = networkState.layers[lIdx]?.neurons[nIdx];
          const activationVal = neuronData?.a ?? 0.5;
          const isSelected =
            selectedNeuron?.layerIndex === lIdx && selectedNeuron?.neuronIndex === nIdx;
          const isHovered =
            hoveredNeuron?.layerIndex === lIdx && hoveredNeuron?.neuronIndex === nIdx;

          // Color based on layer: Input (Sky Blue), Hidden (Purple), Output (Emerald)
          let neuronColor = '#8b5cf6'; // Hidden default
          if (lIdx === 0) neuronColor = '#38bdf8'; // Input
          else if (lIdx === layerSizes.length - 1) neuronColor = '#10b981'; // Output

          return (
            <group key={`neuron_${lIdx}_${nIdx}`} position={pos}>
              {/* Glow Ring for Selected / Hovered Neuron */}
              {(isSelected || isHovered) && (
                <mesh position={[0, 0, -0.02]}>
                  <ringGeometry args={[0.28, 0.36, 32]} />
                  <meshBasicMaterial color="#f59e0b" transparent opacity={0.85} />
                </mesh>
              )}

              {/* Neuron Sphere Mesh */}
              <mesh
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(setSelectedNeuron({ layerIndex: lIdx, neuronIndex: nIdx }));
                }}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  dispatch(setHoveredNeuron({ layerIndex: lIdx, neuronIndex: nIdx }));
                }}
                onPointerOut={() => dispatch(setHoveredNeuron(null))}
              >
                <sphereGeometry args={[isSelected ? 0.25 : 0.2, 24, 24]} />
                <meshStandardMaterial
                  color={neuronColor}
                  emissive={neuronColor}
                  emissiveIntensity={0.25 + activationVal * 0.75}
                  roughness={0.2}
                />
              </mesh>

              {/* Neuron Label Overlay */}
              <Html distanceFactor={10} position={[0, 0.32, 0.1]}>
                <div className="bg-midnight/90 backdrop-blur-md text-[10px] font-mono text-arctic px-1.5 py-0.5 rounded border border-apres/40 shadow-md whitespace-nowrap pointer-events-none font-bold">
                  {lIdx === 0
                    ? `x${nIdx + 1}`
                    : lIdx === layerSizes.length - 1
                    ? `ŷ`
                    : `a${nIdx + 1}`}
                </div>
              </Html>
            </group>
          );
        })
      )}
    </group>
  );
};

// 2D Dataset Points Overlay cleanly scaled on 2D Decision Space Plane
const DatasetPoints3D: React.FC<{ addClassLabel: 0 | 1 }> = ({ addClassLabel }) => {
  const dispatch = useAppDispatch();
  const { points } = useAppSelector((state) => state.neuralNetwork);

  const handlePlaneClick = (e: any) => {
    if (e.intersections && e.intersections.length > 0) {
      const pt = e.intersections[0].point;
      const x1 = Math.max(-3.8, Math.min(3.8, pt.x));
      const x2 = Math.max(-3.8, Math.min(3.8, pt.y));
      dispatch(addPoint({ x1, x2, label: addClassLabel }));
    }
  };

  return (
    <group>
      {/* Clickable plane for adding custom points */}
      <mesh position={[0, 0, -1.75]} onClick={handlePlaneClick} visible={false}>
        <planeGeometry args={[13.5, 9.2]} />
        <meshBasicMaterial />
      </mesh>

      {/* Render Dataset Points mapped onto background plane */}
      {points.map((pt) => {
        const color = pt.label === 1 ? '#ef4444' : '#3b82f6';
        return (
          <mesh key={pt.id} position={[pt.x1, pt.x2, -1.7]}>
            <sphereGeometry args={[0.09, 16, 16]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
          </mesh>
        );
      })}
    </group>
  );
};

export const Center3DScene: React.FC = () => {
  const [addClassLabel, setAddClassLabel] = useState<0 | 1>(1);
  const [is3D, setIs3D] = useState(true);
  const [showKeyPopover, setShowKeyPopover] = useState(false);
  const controlsRef = useRef<any>(null);

  const { trajectory, currentEpoch } = useAppSelector((state) => state.neuralNetwork);
  const snapshot = trajectory[currentEpoch];
  const vanishingStatus = snapshot?.vanishingExplodingStatus || 'normal';

  const handleResetCamera = () => {
    if (controlsRef.current) controlsRef.current.reset();
  };

  return (
    <div className="relative w-full h-full min-h-[540px] bg-midnight rounded-3xl overflow-hidden border border-apres/30 shadow-2xl flex flex-col group">
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-auto">
        {/* Class Selector for Click-to-add */}
        <div className="flex items-center gap-2 bg-midnight/90 backdrop-blur-md p-1.5 rounded-2xl border border-apres/40 shadow-lg">
          <span className="text-xs text-apres px-2 font-mono flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Point:
          </span>
          <button
            type="button"
            onClick={() => setAddClassLabel(0)}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
              addClassLabel === 0
                ? 'bg-blue-500 text-white shadow-md'
                : 'text-slopes hover:text-arctic'
            }`}
          >
            Class 0 (Blue)
          </button>
          <button
            type="button"
            onClick={() => setAddClassLabel(1)}
            className={`px-3 py-1 text-xs font-semibold rounded-xl transition-all ${
              addClassLabel === 1
                ? 'bg-red-500 text-white shadow-md'
                : 'text-slopes hover:text-arctic'
            }`}
          >
            Class 1 (Red)
          </button>
        </div>

        {/* View Controls & Key Tooltip Popover Trigger */}
        <div className="relative flex items-center gap-2 bg-midnight/90 backdrop-blur-md p-1.5 rounded-2xl border border-apres/40 shadow-lg">
          <button
            type="button"
            onClick={() => setShowKeyPopover(!showKeyPopover)}
            className={`flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-mono font-semibold transition-all ${
              showKeyPopover
                ? 'bg-cyan-500 text-midnight font-bold shadow-md'
                : 'text-cyan-400 hover:text-cyan-300 hover:bg-mountainside/50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Key & Flow</span>
          </button>

          <button
            type="button"
            onClick={() => setIs3D(!is3D)}
            className="p-1.5 rounded-xl text-slopes hover:text-arctic hover:bg-mountainside/50 transition-all flex items-center gap-1 text-xs font-mono"
            title="Toggle 2D/3D View"
          >
            <Eye className="w-4 h-4" /> {is3D ? '3D View' : '2D View'}
          </button>

          <button
            type="button"
            onClick={handleResetCamera}
            className="p-1.5 rounded-xl text-slopes hover:text-arctic hover:bg-mountainside/50 transition-all"
            title="Reset Camera"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Clean, Non-overlapping Popover Card for Key & Flow */}
          {showKeyPopover && (
            <div className="absolute top-12 right-0 z-50 w-56 p-3 bg-midnight/95 backdrop-blur-2xl border border-cyan-500/50 rounded-2xl shadow-2xl text-[11px] font-mono space-y-2 text-arctic animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-apres/30 pb-1.5">
                <span className="font-bold text-cyan-400 text-xs flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Visual Key & Flow
                </span>
                <button
                  onClick={() => setShowKeyPopover(false)}
                  className="p-0.5 rounded text-apres hover:text-arctic"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                  <span>🔵 Class 0 (y=0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
                  <span>🔴 Class 1 (y=1)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0"></span>
                  <span>🩵 Positive weight (+w)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0"></span>
                  <span>🩷 Negative weight (-w)</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-apres pt-1 border-t border-apres/20">
                  <span>➔ Forward pass | 🠔 Backprop</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Warning Overlay Banner for Vanishing/Exploding Gradients */}
      {vanishingStatus !== 'normal' && (
        <div className="absolute top-16 left-4 z-20 pointer-events-none max-w-md">
          <div
            className={`p-3 rounded-2xl border backdrop-blur-md text-xs font-mono flex items-center justify-between shadow-2xl ${
              vanishingStatus === 'vanishing'
                ? 'bg-amber-950/90 border-amber-500/80 text-amber-200'
                : 'bg-red-950/90 border-red-500/80 text-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              <span>
                {vanishingStatus === 'vanishing'
                  ? '⚠️ Warning: Vanishing Gradient (||∇W|| < 0.0001)'
                  : '🚨 Alert: Exploding Gradient (||∇W|| > 15.0)'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* R3F Three.js Canvas */}
      <Canvas
        camera={{
          position: is3D ? [0, -4, 11] : [0, 0, 11],
          fov: 45,
        }}
        className="w-full h-full cursor-pointer"
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={1.2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.4} color="#38bdf8" />

        <OrbitControls
          ref={controlsRef}
          enableRotate={is3D}
          enablePan={true}
          enableZoom={true}
          maxPolarAngle={Math.PI / 2 - 0.05}
        />

        {/* 2D Background Decision Boundary Heatmap */}
        <BackgroundHeatmapPlane />

        {/* 3D Neural Network Architecture Graph */}
        <NetworkGraph3D />

        {/* 2D Dataset Points Overlay */}
        <DatasetPoints3D addClassLabel={addClassLabel} />
      </Canvas>

      {/* Bottom Live Educational Commentary Banner */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-midnight/95 backdrop-blur-xl border border-cyan-500/40 p-3 rounded-2xl shadow-hard flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-arctic leading-snug">
          <span className="font-bold text-cyan-300 font-mono">3D Live Explanation: </span>
          <span>
            Forward Propagation flows features (x₁, x₂) through hidden layers to compute output ŷ.
            Backpropagation propagates error signals (δ) backwards to update weights (w) and curve the decision boundary!
          </span>
        </div>
      </div>
    </div>
  );
};

export default Center3DScene;
