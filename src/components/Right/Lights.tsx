import React from 'react';
import * as THREE from 'three';
import { SpotLight } from '@react-three/drei';
import { useState } from 'react';
import { folder, useControls } from 'leva';

export default () => {
  const { posX, posY,posZ, ...spotLightProps } = useControls(
    'right',
    {
      lights: folder(
        {
          color: { value: '#a3ffff' },
          attenuation: { value: 0.8, min: 0, max: 2 },
          distance: { value: 10, min: 0, max: 50 },
          angle: { value: 0.9, min: 0, max: 3 },
          penumbra: { value: Math.PI / 2, min: 0, max: 3 },
          anglePower: { value: 10, min: 0, max: 20 },
          intensity: { value: 0.6, min: 0, max: 1 },
          posX: { value: 2.5, min: 0, max: 6 },
          posY: { value: 2, min: 0, max: 4 },
          posZ: { value: 1.5, min: 0, max: 4 },
          opacity: { value: 0.15, min: 0, max: 1 },
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
        position={[posX, posY, posZ]}
        castShadow
        target={target}
        {...spotLightProps}
      />
      <SpotLight
        position={[posX, posY, -posZ]}
        castShadow
        target={target}
        {...spotLightProps}
      />
      <primitive
        object={target}
        position={[6, 1, 0]}
      />
    </>
  );
};
