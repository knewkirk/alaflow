import { SpotLight } from '@react-three/drei';
import React, { useMemo, useState } from 'react';
import * as THREE from 'three';

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
      opacity: 0.15,
    }),
    []
  );
  const [target] = useState(() => new THREE.Object3D());

  return (
    <>
      <SpotLight
        position={[-2.5, 2, 1.5]}
        intensity={0.5}
        target={target}
        castShadow
        {...spotLightProps}
      />
      <primitive
        position={[-6, 1.2, 0]}
        object={target}
      />
      <SpotLight
        position={[-2.5, 2, -1.5]}
        intensity={0.5}
        target={target}
        castShadow
        {...spotLightProps}
      />
    </>
  );
};
