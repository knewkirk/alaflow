import { SpotLight } from '@react-three/drei';
import { folder, useControls } from 'leva';
import React, { useState } from 'react';
import * as THREE from 'three';

export default () => {
  const { x, y, z, ...spotLightProps } = useControls(
    'back',
    {
      lights: folder(
        {
          color: { value: '#ffbb9c' },
          intensity: { value: 20, min: 0, max: 30 },
          attenuation: { value: 0.8, min: 0, max: 2 },
          distance: { value: 10, min: 0, max: 30 },
          angle: { value: 1.1, min: 0, max: Math.PI },
          penumbra: { value: 1.8, min: 0, max: 2 },
          anglePower: { value: 10, min: 0, max: 20 },
          position: folder({
            x: { value: 1.5, min: 0, max: 5 },
            y: { value: 0, min: 0, max: 5 },
            z: { value: 2.5, min: 0, max: 5 },
          }),
          opacity: { value: 0.35, min: 0, max: 1 },
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
        position={[x, y, z]}
        target={target}
        {...spotLightProps}
      />
      <SpotLight
        position={[-x, y, z]}
        target={target}
        {...spotLightProps}
      />
      <SpotLight
        position={[0, y, 6 + x * 1.5]}
        target={target}
        {...spotLightProps}
      />
      <primitive
        object={target}
        position={[0, 2, 6]}
      />
    </>
  );
};
