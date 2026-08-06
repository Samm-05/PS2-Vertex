import React, { memo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { SimulationStep } from '../../algorithms/types';

interface PCASceneProps {
  step: SimulationStep;
}

const PCAScene: React.FC<PCASceneProps> = ({ step }) => {
  return (
    <>
      {step.points.map((point) => (
        <Sphere key={point.id} position={[point.x, point.y, point.z]} args={[0.08, 10, 10]}>
          <meshStandardMaterial color="#B3B7BA" roughness={0.3} />
        </Sphere>
      ))}
      {step.vectors?.map((vector, idx) => (
        <Line key={`vec-${idx}`} points={[vector.start, vector.end]} color="#D3D1CE" lineWidth={2.5} />
      ))}
    </>
  );
};

export default memo(PCAScene);
