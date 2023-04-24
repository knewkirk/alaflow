import { SpotLight } from '@react-three/drei';
import { folder, useControls } from 'leva';
import React, { useState } from 'react';
import * as THREE from 'three';

export default () => {
  const spotLightProps = useControls(
    'left',
    {
      lights: folder(
        {
          color: { value: '#a3ffff' },
          attenuation: { value: 0.8, min: 0, max: 20 },
          distance: { value: 10, min: 0, max: 30 },
          angle: { value: 0.9, min: 0, max: Math.PI },
          penumbra: { value: 1.8, min: 0, max: Math.PI },
          anglePower: { value: 10, min: 0, max: 10 },
          intensity: { value: 0.7, min: 0, max: 3 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
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
