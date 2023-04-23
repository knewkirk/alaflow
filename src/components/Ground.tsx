import React, { useRef } from 'react';
import * as THREE from 'three';
import { MeshReflectorMaterial } from '@react-three/drei';
import { useControls } from 'leva';
import { RigidBody } from '@react-three/rapier';

export default () => {
  const { blurx, blury, ...props } = useControls(
    'ground',
    {
      blurx: { value: 1, min: 0, max: 1 },
      blury: { value: 1, min: 0, max: 1 },
      mixBlur: { value: 0.5, min: 0, max: 1 },
      mixStrength: { value: 0.1, min: 0, max: 1 },
      mixContrast: { value: 0.5, min: 0, max: 1 },
      resolution: { value: 1024, min: 256, max: 2048 },
      mirror: { value: 1, min: 0, max: 1 },
      depthScale: { value: 0, min: 0, max: 1 },
      minDepthThreshold: { value: 0, min: 0, max: 1 },
      maxDepthThreshold: { value: 0, min: 0, max: 1 },
      depthToBlurRatioBias: { value: 0, min: 0, max: 1 },
      distortion: { value: 0, min: 0, max: 1 },
      debug: { value: 0, min: 0, max: 5, step: 1 },
      reflectorOffset: { value: 0, min: 0, max: 1 },
    },
    { collapsed: true }
  );

  return (
    <RigidBody colliders="cuboid">
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial
          blur={[blurx, blury]}
          {...props}
        />
      </mesh>
    </RigidBody>
  );
};
