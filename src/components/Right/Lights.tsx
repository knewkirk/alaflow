import React, { useMemo } from 'react';
import * as THREE from 'three';
import { SpotLight } from '@react-three/drei';
import { useState } from 'react';

export default () => {
  const spotLightProps = useMemo(
    () => ({
      color: '#a3ffff',
      attenuation: 0.8,
      distance: 10,
      angle: 0.9,
      penumbra: 1.8,
      anglePower: 10,
      intensity: 0.7,
    }),
    []
  );

  const [target1] = useState(() => new THREE.Object3D());
  const [target2] = useState(() => new THREE.Object3D());

  return (
    <>
      <SpotLight
        position={[2.5, 2, 1.5]}
        target={target1}
        castShadow
        {...spotLightProps}
      />
      <primitive
        object={target1}
        position={[6, 0, 0]}
      />
      <SpotLight
        position={[2.5, 2, -1.5]}
        target={target2}
        {...spotLightProps}
      />
      <primitive
        object={target2}
        position={[6, 0, 0]}
      />
    </>
  );
};
