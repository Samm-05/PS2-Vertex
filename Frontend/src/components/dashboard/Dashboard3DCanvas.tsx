import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SubtleNeuralNodes: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const count = 180;

  const [positions, lines] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const linePos: number[] = [];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    for (let i = 0; i < count; i += 3) {
      for (let j = i + 1; j < count; j += 6) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const dist = Math.hypot(dx, dy, dz);
        if (dist < 2.5) {
          linePos.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
          linePos.push(pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]);
        }
      }
    }

    return [pos, new Float32Array(linePos)];
  }, [count]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.04} color="#6C6D74" transparent opacity={0.4} />
      </points>

      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={lines.length / 3} array={lines} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#262E36" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
};

export const Dashboard3DCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-60">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.5} />
        <SubtleNeuralNodes />
      </Canvas>
    </div>
  );
};

export default Dashboard3DCanvas;
