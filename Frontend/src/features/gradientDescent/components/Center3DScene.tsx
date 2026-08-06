import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import gsap from 'gsap';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { LossSurfaceMesh } from './LossSurfaceMesh';
import { GradientPoint } from './GradientPoint';
import { setCameraPreset, setInitialPoint } from '../gradientDescentSlice';
import { Eye, Compass, Layers, Info, HelpCircle } from 'lucide-react';
import { LOSS_SURFACES } from '../engine/lossFunctions';

export const Center3DScene: React.FC = () => {
  const dispatch = useAppDispatch();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const gdState = useAppSelector((state) => state.gradientDescent);
  const params = gdState?.params;
  const steps = gdState?.steps ?? [];
  const currentStepIndex = gdState?.currentStepIndex ?? 0;
  const cameraPreset = gdState?.cameraPreset ?? 'perspective';
  const [showLegend, setShowLegend] = useState(true);

  const surfaceDef = params ? (LOSS_SURFACES[params.surfaceType] || LOSS_SURFACES.paraboloid) : LOSS_SURFACES.paraboloid;
  const currentStep = steps[currentStepIndex] || steps[0] || {
    w1: 0,
    w2: 0,
    loss: 0,
    gradNorm: 0,
    stepSize: 0,
  };

  // Smooth camera dolly transition when preset changes using GSAP
  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const targetCam = controls.object;

    let posX = 6;
    let posY = 7;
    let posZ = 8;

    if (cameraPreset === 'top-down') {
      posX = 0.01;
      posY = 10;
      posZ = 0.01;
    } else if (cameraPreset === 'side') {
      posX = 9;
      posY = 1.2;
      posZ = 0;
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

  if (!params) return null;

  // Real-time 3D Scene Explanation Commentary
  const getSceneCommentary = () => {
    if (params.learningRate >= 1.2) {
      return `⚠️ DIVERGENCE WARNING: Learning rate α = ${params.learningRate} is too high! The point is overshooting the loss valley and exploding outward.`;
    }
    if (params.learningRate <= 0.001) {
      return `🐌 SLOW CONVERGENCE: Learning rate α = ${params.learningRate} is very small. The point takes minuscule micro-steps down the ${surfaceDef.name}.`;
    }
    if (params.momentum >= 0.7) {
      return `🚀 MOMENTUM ACCELERATION: Heavy ball momentum β = ${params.momentum} accumulates velocity to carry the point smoothly down slopes and past flat plateaus.`;
    }
    if (params.noise > 0.1) {
      return `🎲 MINI-BATCH NOISE: Stochastic noise σ = ${params.noise} adds random perturbations, simulating mini-batch gradient descent.`;
    }
    if (currentStep.gradNorm < 0.05) {
      return `🎯 CONVERGED: Loss gradient ||∇J|| ≈ 0. Model weights have stabilized at the optimal minimum point.`;
    }
    return `📉 OPTIMIZING: Moving step by step along steepest descent vector -∇J on the ${surfaceDef.name}.`;
  };

  return (
    <div className="relative w-full h-[520px] md:h-[640px] rounded-3xl overflow-hidden border border-mountainside bg-midnight shadow-hard group">
      {/* Top Floating View Preset Toolbar */}
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
          Perspective
        </button>

        <button
          type="button"
          onClick={() => dispatch(setCameraPreset('top-down'))}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            cameraPreset === 'top-down'
              ? 'bg-mountainside text-arctic border border-apres/50 shadow-soft'
              : 'text-slopes hover:text-arctic hover:bg-mountainside/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Contour (Top)
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
          Side Elevation
        </button>
      </div>

      {/* Top Right Legend Toggle & Overlay */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => setShowLegend(!showLegend)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-midnight/90 backdrop-blur-xl border border-mountainside text-cyan-400 hover:text-cyan-300 transition-colors shadow-soft"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          {showLegend ? 'Hide 3D Legend' : 'Show 3D Legend'}
        </button>

        {showLegend && (
          <div className="bg-midnight/95 backdrop-blur-xl border border-mountainside/80 p-3 rounded-2xl shadow-2xl text-[11px] font-mono space-y-1.5 text-arctic w-52">
            <div className="font-bold text-cyan-400 text-xs border-b border-mountainside pb-1 mb-1">
              3D Scene Elements Key
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0"></span>
              <span>Blue Sphere: Current Weights</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
              <span>Green Arrow: -∇J Vector</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"></span>
              <span>Red Flag: Start Position</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
              <span>Green Beacon: Global Min</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-0.5 bg-cyan-400 shrink-0"></span>
              <span>Blue Line: Path Trajectory</span>
            </div>
          </div>
        )}
      </div>

      {/* R3F Canvas */}
      <Canvas
        camera={{ position: [6, 7, 8], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#090F15']} />
        <fog attach="fog" args={['#090F15', 12, 35]} />

        {/* Ambient & Directional Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#38bdf8" />

        {/* 3D Loss Surface Mesh */}
        <LossSurfaceMesh
          surfaceType={params.surfaceType}
          onSelectPoint={(w1, w2) => dispatch(setInitialPoint({ w1, w2 }))}
        />

        {/* Gradient Point, Ribbon Trail, Start Flag, and Vector Arrow */}
        <GradientPoint steps={steps} currentIndex={currentStepIndex} surfaceType={params.surfaceType} />

        {/* Orbit Controls */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2 + 0.05}
          minDistance={3}
          maxDistance={22}
        />
      </Canvas>

      {/* Bottom Floating Live Educational 3D Commentary Banner */}
      <div className="absolute bottom-4 left-4 right-4 z-10 bg-midnight/95 backdrop-blur-xl border border-cyan-500/40 p-3 rounded-2xl shadow-hard flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-arctic leading-snug">
          <span className="font-bold text-cyan-300 font-mono">3D Live Explanation: </span>
          {getSceneCommentary()}
        </div>
      </div>
    </div>
  );
};
