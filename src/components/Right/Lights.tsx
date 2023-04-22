import React from 'react';
import * as THREE from 'three';
import { SpotLight } from '@react-three/drei';
import { folder, useControls } from 'leva';
import { useState } from 'react';

export default () => {
  const spotLightProps = useControls(
    'right',
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
