import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { OptimizationStep, LossSurfaceType } from '../types';
import { LOSS_SURFACES } from '../engine/lossFunctions';
import { useAppSelector } from '../../../app/hooks';

interface GradientPointProps {
  steps: OptimizationStep[];
  currentIndex: number;
  surfaceType: LossSurfaceType;
}

export const GradientPoint: React.FC<GradientPointProps> = ({ steps, currentIndex, surfaceType }) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const surfaceDef = LOSS_SURFACES[surfaceType] || LOSS_SURFACES.paraboloid;
  const bounds = surfaceDef.domain;

  const gdState = useAppSelector((state) => state.gradientDescent);
  const params = gdState?.params;

  const currentStep = steps[currentIndex] || steps[0] || {
    w1: 0,
    w2: 0,
    loss: 0,
    gradW1: 0,
    gradW2: 0,
    gradNorm: 0,
    stepSize: 0,
  };

  const firstStep = steps[0] || currentStep;

  // Convert 2D weights (w1, w2) and Loss to 3D Scene coordinates (X, Y, Z)
  const calculate3DPos = (w1: number, w2: number, lossVal: number): [number, number, number] => {
    const clampedLoss = Math.min(Math.max(lossVal, 0), bounds.maxLoss);
    const heightY = (clampedLoss / bounds.maxLoss) * 3.5;
    return [w1, heightY + 0.08, w2];
  };

  const currentPos = calculate3DPos(currentStep.w1, currentStep.w2, currentStep.loss);
  const startPos = calculate3DPos(firstStep.w1, firstStep.w2, firstStep.loss);

  // Path History points up to currentIndex
  const trajectoryPoints = useMemo(() => {
    if (!steps || steps.length === 0) return [];
    const activeSteps = steps.slice(0, currentIndex + 1);
    return activeSteps.map((s) => {
      const pos = calculate3DPos(s.w1, s.w2, s.loss);
      return new THREE.Vector3(pos[0], pos[1] + 0.02, pos[2]);
    });
  }, [steps, currentIndex, bounds.maxLoss]);

  // Arrow Helper parameters for Gradient Vector -\nabla J
  const vectorDirAndLength = useMemo(() => {
    const dx = -currentStep.gradW1;
    const dz = -currentStep.gradW2;
    const len = Math.sqrt(dx * dx + dz * dz);
    if (len < 0.001) {
      return { dir: new THREE.Vector3(0, -1, 0), length: 0.1 };
    }

    const nextW1 = currentStep.w1 + dx * 0.1;
    const nextW2 = currentStep.w2 + dz * 0.1;
    const nextLoss = surfaceDef.compute(nextW1, nextW2);
    const nextPos = calculate3DPos(nextW1, nextW2, nextLoss);

    const dir = new THREE.Vector3(
      nextPos[0] - currentPos[0],
      nextPos[1] - currentPos[1],
      nextPos[2] - currentPos[2]
    ).normalize();

    const visualLength = Math.min(Math.max(len * 0.4, 0.4), 2.5);
    return { dir, length: visualLength };
  }, [currentStep, currentPos, surfaceDef]);

  // Pulsing animation for optimization sphere
  useFrame(({ clock }) => {
    if (sphereRef.current) {
      const t = clock.getElapsedTime();
      const pulse = 1 + Math.sin(t * 6) * 0.08;
      sphereRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  // Dynamic 3D Phenomenon Callout Title & Explanation
  const phenomenonCallout = useMemo(() => {
    if (currentIndex > 0) {
      const prevStep = steps[currentIndex - 1];
      if (prevStep && currentStep.loss > prevStep.loss + 0.3) {
        return {
          title: '⚠️ Overshooting / Bouncing',
          desc: `Learning rate α = ${params?.learningRate} is too large! Step size (${currentStep.stepSize.toFixed(
            3
          )}) jumped across valley walls, increasing loss.`,
          bg: 'bg-red-950/90 border-red-500/80 text-red-200',
        };
      }
    }

    if (currentStep.gradNorm < 0.05) {
      return {
        title: '🎯 Converged at Minimum',
        desc: `Gradient norm ||∇J|| ≈ 0 (${currentStep.gradNorm.toFixed(
          4
        )}). Model weights reached optimal loss state!`,
        bg: 'bg-emerald-950/90 border-emerald-500/80 text-emerald-200',
      };
    }

    if (params && params.learningRate <= 0.001) {
      return {
        title: '🐌 Under-stepping / Slow Crawl',
        desc: `Very small learning rate (α = ${params.learningRate}). Step magnitude Δw = ${currentStep.stepSize.toFixed(
          4
        )} is taking micro-steps.`,
        bg: 'bg-cyan-950/90 border-cyan-500/80 text-cyan-200',
      };
    }

    if (params && params.momentum >= 0.5 && Math.abs(currentStep.velocityW1) > Math.abs(currentStep.gradW1 * 0.01)) {
      return {
        title: '🚀 Momentum Velocity Boost',
        desc: `Momentum (β = ${params.momentum}) is carrying kinetic energy forward past flat gradients.`,
        bg: 'bg-amber-950/90 border-amber-500/80 text-amber-200',
      };
    }

    if (params && params.noise > 0.1) {
      return {
        title: '🎲 Mini-Batch Stochastic Noise',
        desc: `Noise (σ = ${params.noise}) adds random gradient perturbations to explore local landscape.`,
        bg: 'bg-purple-950/90 border-purple-500/80 text-purple-200',
      };
    }

    return {
      title: `📉 Downhill Step along -∇J`,
      desc: `Steepest descent vector -∇J points downhill with step size Δw = ${currentStep.stepSize.toFixed(4)}.`,
      bg: 'bg-midnight/95 border-cyan-500/60 text-cyan-200',
    };
  }, [currentIndex, currentStep, steps, params]);

  return (
    <group>
      {/* 1. Initial Start Point Marker (Flag) */}
      <group position={startPos}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <mesh position={[0.15, 0.35, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.1, 0.3, 3]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <Html position={[0, 0.55, 0]} center distanceFactor={12}>
          <div className="bg-red-950/90 border border-red-500/60 text-red-300 font-mono text-[10px] px-2 py-0.5 rounded-full shadow-lg pointer-events-none flex items-center gap-1 font-bold whitespace-nowrap">
            🚩 Start: ({firstStep.w1.toFixed(2)}, {firstStep.w2.toFixed(2)})
          </div>
        </Html>
      </group>

      {/* 2. Dynamic Trajectory Ribbon / Line */}
      {trajectoryPoints.length > 1 && (
        <line>
          <bufferGeometry
            attach="geometry"
            onUpdate={(geo) => {
              geo.setFromPoints(trajectoryPoints);
            }}
          />
          <lineBasicMaterial attach="material" color="#38bdf8" linewidth={3} transparent opacity={0.85} />
        </line>
      )}

      {/* Trajectory Step Nodes (dots for past steps) */}
      {trajectoryPoints.map((pt, idx) => (
        <mesh key={idx} position={pt}>
          <sphereGeometry args={[0.04, 12, 12]} />
          <meshBasicMaterial
            color={idx === currentIndex ? '#38bdf8' : '#0284c7'}
            transparent
            opacity={0.4 + (idx / trajectoryPoints.length) * 0.6}
          />
        </mesh>
      ))}

      {/* 3. Main Glowing Optimization Point */}
      <group position={currentPos}>
        <mesh ref={sphereRef}>
          <sphereGeometry args={[0.18, 32, 32]} />
          <meshStandardMaterial
            color="#38bdf8"
            emissive="#0284c7"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        {/* Outer Glow Halo */}
        <pointLight color="#38bdf8" intensity={2} distance={3} />

        {/* Gradient Vector Arrow (-\nabla J) */}
        <primitive
          object={
            new THREE.ArrowHelper(
              vectorDirAndLength.dir,
              new THREE.Vector3(0, 0, 0),
              vectorDirAndLength.length,
              0x10b981,
              0.25,
              0.15
            )
          }
        />

        {/* 3D Label attached directly onto $-\nabla J$ Arrow */}
        <Html position={[vectorDirAndLength.dir.x * 0.8, 0.3, vectorDirAndLength.dir.z * 0.8]} center distanceFactor={11}>
          <div className="bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 font-mono text-[9px] px-2 py-0.5 rounded-md shadow-md pointer-events-none whitespace-nowrap font-bold flex items-center gap-1">
            <span>-∇J Vector</span>
            <span className="text-emerald-200">({currentStep.gradNorm.toFixed(2)})</span>
          </div>
        </Html>

        {/* Dynamic 3D Phenomenon Callout Card */}
        <Html position={[0, 0.8, 0]} center distanceFactor={10}>
          <div
            className={`backdrop-blur-xl border p-2.5 rounded-2xl shadow-hard pointer-events-none flex flex-col gap-1 w-52 text-left ${phenomenonCallout.bg}`}
          >
            <div className="flex items-center justify-between font-mono font-bold text-xs">
              <span>{phenomenonCallout.title}</span>
              <span className="text-[10px] opacity-80">Iter {currentIndex}</span>
            </div>
            <div className="text-[10px] leading-tight font-sans opacity-95">{phenomenonCallout.desc}</div>
            <div className="pt-1 border-t border-white/10 text-[9px] font-mono flex items-center justify-between opacity-80">
              <span>Loss J: <span className="font-bold text-amber-300">{currentStep.loss.toFixed(4)}</span></span>
              <span>Δw: <span className="font-bold text-cyan-300">{currentStep.stepSize.toFixed(4)}</span></span>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
};
