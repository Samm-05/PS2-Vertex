import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useAppSelector } from '../../../app/hooks';

// 3D Loss-Complexity Manifold Surface
const LossComplexitySurface: React.FC = () => {
  const { config, result } = useAppSelector((state) => state.overfitting);
  const meshRef = useRef<THREE.Mesh>(null);

  const gridRes = 30;

  const [geometry, colors] = useMemo(() => {
    const geo = new THREE.PlaneGeometry(6, 6, gridRes, gridRes);
    const pos = geo.attributes.position;
    const cols = new Float32Array(pos.count * 3);

    const colorGood = new THREE.Color('#10B981'); // Emerald
    const colorUnder = new THREE.Color('#3B82F6'); // Blue
    const colorOver = new THREE.Color('#EF4444'); // Red

    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i); // Represents Polynomial Degree (-3 to 3)
      const v = pos.getY(i); // Represents Regularization (-3 to 3)

      const deg = ((u + 3) / 6) * 12 + 1;
      const lambda = Math.max(0, ((v + 3) / 6) * 0.1);

      // Compute synthetic 3D loss surface elevation z = bias^2 + variance
      const biasSq = 1.2 / Math.pow(deg, 1.2);
      const variance = 0.02 * Math.pow(deg, 1.6) * (1 / (1 + lambda * 20));
      const z = Math.min(2.5, biasSq + variance);

      pos.setZ(i, z * 0.8 - 1.0);

      // Color mapping
      let c = colorGood;
      if (deg < 3) c = colorUnder;
      else if (deg > 7 && lambda < 0.01) c = colorOver;

      cols[i * 3] = c.r;
      cols[i * 3 + 1] = c.g;
      cols[i * 3 + 2] = c.b;
    }

    geo.computeVertexNormals();
    return [geo, cols];
  }, [gridRes]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.05) * 0.05;
    }
  });

  // Current model position marker on the 3D surface
  const currentMarkerPos = useMemo(() => {
    const u = ((config.degree - 1) / 12) * 6 - 3;
    const v = (config.lambda / 0.1) * 6 - 3;
    const z = Math.min(2.5, result.valLoss) * 0.8 - 1.0;
    return [u, v, z + 0.2] as [number, number, number];
  }, [config.degree, config.lambda, result.valLoss]);

  return (
    <group rotation={[-Math.PI / 3, 0, 0]}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          wireframe
          vertexColors
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Current Model Operating Point Marker */}
      <mesh position={currentMarkerPos}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial
          color={
            result.regime === 'good_fit'
              ? '#10B981'
              : result.regime === 'underfitting'
              ? '#3B82F6'
              : '#EF4444'
          }
          emissive="#D3D1CE"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
};

export const Overfitting3DScene: React.FC = () => {
  const { result } = useAppSelector((state) => state.overfitting);

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-midnight border border-mountainside shadow-soft">
      <div className="absolute top-3 left-3 z-10 px-3 py-1.5 rounded-xl bg-midnight/80 border border-mountainside backdrop-blur-md text-xs font-mono text-arctic flex items-center gap-2">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            result.regime === 'good_fit'
              ? 'bg-emerald-400'
              : result.regime === 'underfitting'
              ? 'bg-blue-400'
              : 'bg-rose-400 animate-pulse'
          }`}
        />
        <span>3D Loss-Complexity Surface</span>
      </div>

      <Canvas camera={{ position: [0, -5, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={['#090F15']} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[8, 12, 10]} intensity={1.2} color="#D3D1CE" />
        <LossComplexitySurface />
        <Sparkles count={40} scale={8} size={1.8} speed={0.3} color="#B3B7BA" opacity={0.4} />
        <OrbitControls enablePan enableRotate enableZoom />
      </Canvas>
    </div>
  );
};

export default Overfitting3DScene;
