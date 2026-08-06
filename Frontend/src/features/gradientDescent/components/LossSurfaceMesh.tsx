import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { LOSS_SURFACES } from '../engine/lossFunctions';
import { LossSurfaceType } from '../types';

interface LossSurfaceMeshProps {
  surfaceType: LossSurfaceType;
  onSelectPoint?: (w1: number, w2: number) => void;
}

export const LossSurfaceMesh: React.FC<LossSurfaceMeshProps> = ({ surfaceType, onSelectPoint }) => {
  const surfaceDef = LOSS_SURFACES[surfaceType] || LOSS_SURFACES.paraboloid;
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hoverPos, setHoverPos] = useState<{ x: number; y: number; z: number; w1: number; w2: number; loss: number } | null>(null);

  const GRID_SIZE = 90;
  const bounds = surfaceDef.domain;

  const { geometry, wireframeGeometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(
      bounds.maxW1 - bounds.minW1,
      bounds.maxW2 - bounds.minW2,
      GRID_SIZE,
      GRID_SIZE
    );
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position;
    const colors: number[] = [];

    // Color gradient palette: Blue -> Cyan -> Green -> Yellow -> Red
    const cMin = new THREE.Color('#06b6d4'); // Cyan
    const cMid = new THREE.Color('#10b981'); // Emerald
    const cHigh = new THREE.Color('#f59e0b'); // Amber
    const cPeak = new THREE.Color('#ec4899'); // Pink/Magenta

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);

      // Map plane (x, z) to weight space (w1, w2)
      const w1 = x;
      const w2 = z;

      let loss = surfaceDef.compute(w1, w2);
      if (isNaN(loss) || !isFinite(loss)) loss = bounds.maxLoss;
      const clampedLoss = Math.min(Math.max(loss, 0), bounds.maxLoss);

      // Height Y = Loss scaled down visually
      const heightY = (clampedLoss / bounds.maxLoss) * 3.5;
      pos.setY(i, heightY);

      // Color mapping based on height ratio
      const ratio = clampedLoss / bounds.maxLoss;
      const vertColor = new THREE.Color();
      if (ratio < 0.25) {
        vertColor.lerpColors(cMin, cMid, ratio / 0.25);
      } else if (ratio < 0.6) {
        vertColor.lerpColors(cMid, cHigh, (ratio - 0.25) / 0.35);
      } else {
        vertColor.lerpColors(cHigh, cPeak, (ratio - 0.6) / 0.4);
      }

      colors.push(vertColor.r, vertColor.g, vertColor.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();

    const wireGeo = new THREE.WireframeGeometry(geo);

    return { geometry: geo, wireframeGeometry: wireGeo };
  }, [surfaceDef, bounds, GRID_SIZE]);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const time = clock.getElapsedTime();
      const scale = 1 + Math.sin(time * 3) * 0.15;
      glowRef.current.scale.set(scale, 1, scale);
    }
  });

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (e.point) {
      const w1 = e.point.x;
      const w2 = e.point.z;
      const loss = surfaceDef.compute(w1, w2);
      setHoverPos({
        x: e.point.x,
        y: e.point.y,
        z: e.point.z,
        w1,
        w2,
        loss,
      });
    }
  };

  const handlePointerOut = () => {
    setHoverPos(null);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.point && onSelectPoint) {
      onSelectPoint(e.point.x, e.point.z);
    }
  };

  const minPoint = surfaceDef.globalMinimum;
  const minHeightY = (Math.max(0, minPoint.loss) / bounds.maxLoss) * 3.5;

  return (
    <group>
      {/* Base Solid Mesh */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          vertexColors
          roughness={0.35}
          metalness={0.2}
          side={THREE.DoubleSide}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Subtle Wireframe Overlay */}
      <lineSegments geometry={wireframeGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.12} />
      </lineSegments>

      {/* Global Minimum Beacon / Glow */}
      <group position={[minPoint.w1, minHeightY, minPoint.w2]}>
        <mesh ref={glowRef}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
          <meshBasicMaterial color="#10b981" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0, 0.4, 0]}>
          <octahedronGeometry args={[0.15]} />
          <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.8} />
        </mesh>
        <Html position={[0, 0.8, 0]} center distanceFactor={12}>
          <div className="bg-secondary-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-[10px] font-mono px-2 py-0.5 rounded-full shadow-lg pointer-events-none flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            Min: ({minPoint.w1.toFixed(1)}, {minPoint.w2.toFixed(1)})
          </div>
        </Html>
      </group>

      {/* Hover Coordinates Tooltip */}
      {hoverPos && (
        <Html position={[hoverPos.x, hoverPos.y + 0.3, hoverPos.z]} center distanceFactor={10}>
          <div className="bg-midnight/95 backdrop-blur-xl border border-slopes/30 px-3 py-1.5 rounded-xl shadow-2xl text-xs font-mono text-arctic pointer-events-none space-y-0.5 whitespace-nowrap">
            <div className="text-cyan-400 font-bold text-[11px]">Hover Inspection</div>
            <div>w₁: <span className="text-white">{hoverPos.w1.toFixed(3)}</span></div>
            <div>w₂: <span className="text-white">{hoverPos.w2.toFixed(3)}</span></div>
            <div>Loss J: <span className="text-amber-400 font-semibold">{hoverPos.loss.toFixed(4)}</span></div>
            <div className="text-[9px] text-apres italic">Click to set start point</div>
          </div>
        </Html>
      )}
    </group>
  );
};
