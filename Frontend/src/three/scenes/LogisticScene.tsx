import React, { memo } from 'react';
import { Line, Sphere } from '@react-three/drei';
import { SimulationStep } from '../../algorithms/types';

interface LogisticSceneProps {
  step: SimulationStep;
}

const LogisticScene: React.FC<LogisticSceneProps> = ({ step }) => {
  return (
    <>
      {step.points.map((point) => (
        <Sphere key={point.id} position={[point.x, point.y, point.z]} args={[0.09, 12, 12]}>
          <meshStandardMaterial color={point.label === 1 ? '#EF4444' : '#10B981'} roughness={0.4} />
        </Sphere>
      ))}
      {step.regressionLine && (
        <Line points={[step.regressionLine.start, step.regressionLine.end]} color="#D3D1CE" lineWidth={2.5} />
      )}
    </>
  );
};

export default memo(LogisticScene);
