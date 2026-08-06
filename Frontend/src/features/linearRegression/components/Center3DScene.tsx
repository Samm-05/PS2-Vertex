import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { addPoint, deletePoint, setCameraPreset } from '../linearRegressionSlice';
import { Eye, Compass, Layers, Info, HelpCircle, Trash2 } from 'lucide-react';

interface Center3DSceneProps {
  customLearningRate?: number;
  isComparisonView?: boolean;
}

export const Center3DScene: React.FC<Center3DSceneProps> = ({ isComparisonView = false }) => {
  const dispatch = useAppDispatch();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const lrState = useAppSelector((state) => state.linearRegression);

  const params = lrState?.params;
  const points = lrState?.points ?? [];
  const steps = lrState?.steps ?? [];
  const currentStepIndex = lrState?.currentStepIndex ?? 0;
  const cameraPreset = lrState?.cameraPreset ?? 'perspective';

  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const [showLegend, setShowLegend] = useState(true);

  const currentStep = steps[currentStepIndex] || steps[0] || {
    w: 0,
    b: 0,
    mseLoss: 0,
    gradW: 0,
    gradB: 0,
    predictions: [],
  };

  // Camera preset GSAP transitions
  React.useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const targetCam = controls.object;

    let posX = 0;
    let posY = 2;
    let posZ = 12;

    if (cameraPreset === 'flat') {
      posX = 0;
      posY = 0;
      posZ = 14;
    } else if (cameraPreset === 'side') {
      posX = 14;
      posY = 0;
      posZ = 0.01;
    }

    gsap.to(targetCam.position, {
      x: posX,
      y: posY,
      z: posZ,
      duration: 1.2,
      ease: 'power3.inOut',
      onUpdate: () => controls.update(),
    });
  }, [cameraPreset]);

  // Generate line points for 3D Regression Line (y = wx + b)
  const linePoints = useMemo(() => {
    const minX = -6;
    const maxX = 6;
    const startY = currentStep.w * minX + currentStep.b;
    const endY = currentStep.w * maxX + currentStep.b;

    return [new THREE.Vector3(minX, startY, 0), new THREE.Vector3(maxX, endY, 0)];
  }, [currentStep.w, currentStep.b]);

  // Find point with largest residual error to annotate
  const largestResidualPred = useMemo(() => {
    if (!currentStep.predictions || currentStep.predictions.length === 0) return null;
    return [...currentStep.predictions].sort((a, b) => Math.abs(b.residual) - Math.abs(a.residual))[0];
  }, [currentStep.predictions]);

  // Dynamic 3D Educational Callout Card
  const phenomenonCallout = useMemo(() => {
    if (params && params.learningRate >= 0.8) {
      return {
        title: '⚠️ Line Spinning / Overshooting',
        desc: `High learning rate α = ${params.learningRate} is causing slope w to overshoot optimal angle and loss to explode!`,
        bg: 'bg-red-950/95 border-red-500/80 text-red-200',
      };
    }
    if (currentStep.mseLoss < 0.05) {
      return {
        title: '🎯 Line of Best Fit Converged',
        desc: `MSE Loss minimized to ${currentStep.mseLoss.toFixed(4)}. Residual error lines have shrunk down to optimal length!`,
        bg: 'bg-emerald-950/95 border-emerald-500/80 text-emerald-200',
      };
    }
    if (params && params.learningRate <= 0.002) {
      return {
        title: '🐌 Under-stepping / Slow Rotation',
        desc: `Small learning rate α = ${params.learningRate}. Line slope w is taking tiny fraction-degree updates.`,
        bg: 'bg-cyan-950/95 border-cyan-500/80 text-cyan-200',
      };
    }
    return {
      title: '🔄 Line Rotating & Translating',
      desc: `Slope w (${currentStep.w.toFixed(2)}) adjusts line angle; Bias b (${currentStep.b.toFixed(2)}) shifts height up/down.`,
      bg: 'bg-midnight/95 border-amber-500/60 text-amber-200',
    };
  }, [params, currentStep]);

  // Click on background canvas plane to add a new custom point
  const handleCanvasClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.point && !isComparisonView) {
      e.stopPropagation();
      const x = e.point.x;
      const y = e.point.y;
      dispatch(addPoint({ x, y }));
    }
  };

  if (!params) return null;

  return (
    <div className="relative w-full h-[520px] md:h-[640px] rounded-3xl overflow-hidden border border-mountainside bg-midnight shadow-hard group">
      {/* Top Controls Toolbar */}
      {!isComparisonView && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-midnight/90 backdrop-blur-xl border border-mountainside p-1.5 rounded-2xl shadow-soft">
          <button
            type="button"
            onClick={() => dispatch(setCameraPreset('perspective'))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraPreset === 'perspective'
                ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
                : 'text-slopes hover:text-arctic hover:bg-mountainside/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Perspective 3D
          </button>

          <button
            type="button"
            onClick={() => dispatch(setCameraPreset('flat'))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraPreset === 'flat'
                ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
                : 'text-slopes hover:text-arctic hover:bg-mountainside/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            2D Flat View
          </button>

          <button
            type="button"
            onClick={() => dispatch(setCameraPreset('side'))}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              cameraPreset === 'side'
                ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
                : 'text-slopes hover:text-arctic hover:bg-mountainside/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Elevation View
          </button>
        </div>
      )}

      {/* Top Right Legend Toggle & Overlay */}
      {!isComparisonView && (
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-midnight/90 backdrop-blur-xl border border-mountainside text-cyan-400 hover:text-cyan-300 transition-colors shadow-soft"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            {showLegend ? 'Hide Legend' : 'Show Legend'}
          </button>

          {showLegend && (
            <div className="bg-midnight/95 backdrop-blur-xl border border-mountainside/80 p-3 rounded-2xl shadow-2xl text-[11px] font-mono space-y-1.5 text-arctic w-60">
              <div className="font-bold text-cyan-400 text-xs border-b border-mountainside pb-1 mb-1">
                Visual Elements & Errors Key
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0"></span>
                <span>Blue Spheres: Data Points (x, y)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-0.5 bg-amber-400 shrink-0"></span>
                <span>Amber Line: Regression (ŷ = wx+b)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-0.5 bg-red-500 shrink-0"></span>
                <span>Red Lines: Large Residual Errors</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-0.5 bg-emerald-400 shrink-0"></span>
                <span>Green Lines: Small Errors (Goal!)</span>
              </div>
              <div className="text-[10px] text-apres pt-1 italic border-t border-mountainside/60 mt-1">
                Aim: Shrink all vertical lines to minimize MSE!
              </div>
            </div>
          )}
        </div>
      )}

      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [0, 2, 12], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#090F15']} />
        <fog attach="fog" args={['#090F15', 12, 35]} />

        {/* Ambient & Directional Lights */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#38bdf8" />

        {/* Background Clickable Plane for Adding Custom Points */}
        <mesh
          position={[0, 0, -0.05]}
          onClick={handleCanvasClick}
          visible={false}
        >
          <planeGeometry args={[30, 30]} />
          <meshBasicMaterial />
        </mesh>

        {/* 3D Axis Grid */}
        <gridHelper args={[24, 24, '#262E36', '#141A21']} rotation={[Math.PI / 2, 0, 0]} />

        {/* 1. Render Animated 3D Regression Line */}
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(geo) => {
              geo.setFromPoints(linePoints);
            }}
          />
          <lineBasicMaterial attach="material" color="#f59e0b" linewidth={4} />
        </line>

        {/* 3D Live Equation Label Attached Directly onto Regression Line */}
        <Html position={[0, currentStep.b + 0.3, 0]} center distanceFactor={11}>
          <div className="bg-amber-950/90 backdrop-blur-xl border border-amber-500/60 text-amber-300 font-mono text-[11px] px-3 py-1 rounded-xl shadow-hard pointer-events-none whitespace-nowrap font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span>ŷ = {currentStep.w.toFixed(2)}x + {currentStep.b.toFixed(2)}</span>
          </div>
        </Html>

        {/* Dynamic 3D Educational Phenomenon Callout Card */}
        <Html position={[0, currentStep.b + 1.2, 0]} center distanceFactor={10}>
          <div
            className={`backdrop-blur-xl border p-2.5 rounded-2xl shadow-hard pointer-events-none flex flex-col gap-1 w-56 text-left ${phenomenonCallout.bg}`}
          >
            <div className="flex items-center justify-between font-mono font-bold text-xs">
              <span>{phenomenonCallout.title}</span>
              <span className="text-[10px] opacity-80">Epoch {currentStepIndex}</span>
            </div>
            <div className="text-[10px] leading-tight font-sans opacity-95">{phenomenonCallout.desc}</div>
            <div className="pt-1 border-t border-white/10 text-[9px] font-mono flex items-center justify-between opacity-80">
              <span>MSE Loss: <span className="font-bold text-amber-300">{currentStep.mseLoss.toFixed(4)}</span></span>
              <span>w: <span className="font-bold text-cyan-300">{currentStep.w.toFixed(2)}</span></span>
            </div>
          </div>
        </Html>

        {/* 2. Render Data Points & Animated Residual Error Lines */}
        {currentStep.predictions.map((pred) => {
          const ptPos = new THREE.Vector3(pred.x, pred.y, 0);
          const lineProjPos = new THREE.Vector3(pred.x, pred.predicted, 0);
          const isHovered = hoveredPointId === pred.id;
          const residualMag = Math.abs(pred.residual);

          // Line color based on residual error
          const resColor = residualMag > 1.5 ? '#ef4444' : residualMag > 0.6 ? '#f59e0b' : '#10b981';

          return (
            <group key={pred.id}>
              {/* Residual Line connecting point to projected regression line */}
              <line>
                <bufferGeometry
                  attach="geometry"
                  onUpdate={(geo) => {
                    geo.setFromPoints([ptPos, lineProjPos]);
                  }}
                />
                <lineBasicMaterial
                  attach="material"
                  color={resColor}
                  linewidth={isHovered ? 3 : 2}
                  transparent
                  opacity={Math.min(0.9, 0.3 + residualMag * 0.3)}
                />
              </line>

              {/* Data Point Sphere */}
              <mesh
                position={ptPos}
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredPointId(pred.id);
                }}
                onPointerOut={() => setHoveredPointId(null)}
              >
                <sphereGeometry args={[isHovered ? 0.22 : 0.16, 24, 24]} />
                <meshStandardMaterial
                  color={isHovered ? '#38bdf8' : '#0284c7'}
                  emissive={isHovered ? '#38bdf8' : '#0284c7'}
                  emissiveIntensity={isHovered ? 1.5 : 0.6}
                  roughness={0.2}
                />
              </mesh>

              {/* Hover Tooltip over Point */}
              {isHovered && (
                <Html position={[pred.x, pred.y + 0.4, 0]} center distanceFactor={10}>
                  <div className="bg-midnight/95 backdrop-blur-xl border border-cyan-500/50 p-2.5 rounded-2xl shadow-hard text-xs font-mono text-arctic pointer-events-auto flex flex-col gap-1 w-44">
                    <div className="flex items-center justify-between font-bold text-cyan-400 text-[11px] border-b border-mountainside pb-1">
                      <span>Point Data</span>
                      <button
                        type="button"
                        onClick={() => dispatch(deletePoint(pred.id))}
                        className="text-red-400 hover:text-red-300 p-0.5"
                        title="Delete point"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>x: <span className="text-white font-bold">{pred.x.toFixed(2)}</span></div>
                    <div>y (actual): <span className="text-white font-bold">{pred.y.toFixed(2)}</span></div>
                    <div>ŷ (predicted): <span className="text-amber-400 font-bold">{pred.predicted.toFixed(2)}</span></div>
                    <div>Residual: <span className="text-red-400 font-bold">{pred.residual.toFixed(2)}</span></div>
                  </div>
                </Html>
              )}
            </group>
          );
        })}

        {/* 3D Callout Label on Largest Residual Line */}
        {largestResidualPred && Math.abs(largestResidualPred.residual) > 0.8 && (
          <Html position={[largestResidualPred.x + 0.3, (largestResidualPred.y + largestResidualPred.predicted) / 2, 0]} center distanceFactor={12}>
            <div className="bg-red-950/90 border border-red-500/60 text-red-300 font-mono text-[9px] px-2 py-0.5 rounded-md shadow-md pointer-events-none whitespace-nowrap font-bold flex items-center gap-1">
              <span>Residual e = {largestResidualPred.residual.toFixed(2)}</span>
            </div>
          </Html>
        )}

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={4}
          maxDistance={25}
        />
      </Canvas>

      {/* Bottom Live Educational Commentary Banner */}
      {!isComparisonView && (
        <div className="absolute bottom-4 left-4 right-4 z-10 bg-midnight/95 backdrop-blur-xl border border-cyan-500/40 p-3 rounded-2xl shadow-hard flex items-start gap-2.5">
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs text-arctic leading-snug">
            <span className="font-bold text-cyan-300 font-mono">3D/2D Live Explanation: </span>
            {currentStep.explanation.why}
          </div>
        </div>
      )}
    </div>
  );
};
