import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Html } from '@react-three/drei';
import * as THREE from 'three';

// Micro-interactive Equation Badge inside the 3D Viewport
const FloatingEquationNode: React.FC<{
  position: [number, number, number];
  formula: string;
  subtext: string;
}> = ({ position, formula, subtext }) => {
  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={0.6} position={position}>
      <Html center transform distanceFactor={9}>
        <div className="group px-3 py-2 rounded-xl bg-midnight/90 backdrop-blur-xl border border-mountainside/80 shadow-medium hover:border-slopes transition-all duration-300 select-none">
          <p className="font-mono text-xs font-bold text-arctic tracking-wide whitespace-nowrap">{formula}</p>
          <p className="text-[9px] font-mono text-apres uppercase tracking-wider">{subtext}</p>
        </div>
      </Html>
    </Float>
  );
};

// Elegant Scientific 3D Neural Wireframe & Point Cloud
const Scientific3DMesh: React.FC = () => {
  const meshRef = useRef<THREE.Group>(null);
  const count = 400;

  const [positions, linePositions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const lines: number[] = [];

    // Generate structured 3D loss surface & node cloud
    for (let i = 0; i < count; i++) {
      const u = (Math.random() - 0.5) * 6;
      const v = (Math.random() - 0.5) * 6;
      const w = Math.sin(u) * Math.cos(v) * 0.8;

      pos[i * 3] = u;
      pos[i * 3 + 1] = w;
      pos[i * 3 + 2] = v;
    }

    // Generate connecting lines between nearby points
    for (let i = 0; i < count; i += 4) {
      for (let j = i + 1; j < count; j += 8) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.hypot(dx, dy, dz);
        if (dist < 1.4) {
          lines.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          lines.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }

    return [pos, new Float32Array(lines)];
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.04) * 0.08;
    }
  });

  return (
    <group ref={meshRef}>
      {/* Point Cloud Nodes */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#D3D1CE" transparent opacity={0.9} />
      </points>

      {/* Network Connections */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={linePositions.length / 3} array={linePositions} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#6C6D74" transparent opacity={0.35} />
      </lineSegments>
    </group>
  );
};

// Smooth Camera Rig
const CameraRig: React.FC = () => {
  useFrame((state) => {
    const mouseX = state.pointer.x * 0.8;
    const mouseY = state.pointer.y * 0.8;
    state.camera.position.x += (mouseX - state.camera.position.x) * 0.04;
    state.camera.position.y += (-mouseY - state.camera.position.y) * 0.04;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
};

export const Hero3DCanvas: React.FC = () => {
  return (
    <div className="w-full h-full relative overflow-hidden pointer-events-auto">
      <Canvas
        camera={{ position: [0, 1.2, 5.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#090F15']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} color="#D3D1CE" />

        <CameraRig />
        <Scientific3DMesh />

        {/* Ambient Sparkles */}
        <Sparkles count={40} scale={6} size={1.8} speed={0.3} opacity={0.5} color="#B3B7BA" />

        {/* Floating Equation Nodes Containment */}
        <FloatingEquationNode position={[-1.8, 1.4, 0.5]} formula="J(w,b) = ½m ∑(h-y)²" subtext="MSE Loss" />
        <FloatingEquationNode position={[1.9, 1.2, -0.5]} formula="σ(z) = 1 / (1 + e⁻ᶻ)" subtext="Sigmoid" />
        <FloatingEquationNode position={[-1.6, -1.3, 0.8]} formula="w := w - α∇J(w)" subtext="Gradient" />
        <FloatingEquationNode position={[1.8, -1.4, 0.4]} formula="Gini = 1 - ∑pᵢ²" subtext="Tree Split" />
      </Canvas>
    </div>
  );
};

export default Hero3DCanvas;
