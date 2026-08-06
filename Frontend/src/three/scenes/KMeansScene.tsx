import React, { memo } from 'react';
import { Sphere } from '@react-three/drei';
import { SimulationStep } from '../../algorithms/types';

interface KMeansSceneProps {
  step: SimulationStep;
}

// Scientific Palette: Slopes, Apres Ski, Muted Emerald, Muted Blue, Muted Amber, Arctic
const clusterColors = ['#B3B7BA', '#10B981', '#3B82F6', '#F59E0B', '#6C6D74', '#D3D1CE'];

const KMeansScene: React.FC<KMeansSceneProps> = ({ step }) => {
  return (
    <>
      {step.points.map((point) => {
        const clusterIdx = point.cluster !== undefined && point.cluster >= 0 ? point.cluster : 0;
        const color = clusterColors[clusterIdx % clusterColors.length];

        return (
          <Sphere key={point.id} position={[point.x, point.y, point.z]} args={[0.08, 12, 12]}>
            <meshStandardMaterial color={color} roughness={0.4} />
          </Sphere>
        );
      })}
      {step.centroids?.map((centroid, index) => (
        <Sphere key={`centroid-${index}`} position={[centroid.x, centroid.y, centroid.z]} args={[0.2, 20, 20]}>
          <meshStandardMaterial
            color={clusterColors[index % clusterColors.length]}
            emissive="#D3D1CE"
            emissiveIntensity={0.3}
            roughness={0.2}
          />
        </Sphere>
      ))}
    </>
  );
};

export default memo(KMeansScene);
