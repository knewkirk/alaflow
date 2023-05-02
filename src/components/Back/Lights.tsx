import { SpotLight } from '@react-three/drei';
import { folder, useControls } from 'leva';
import React, { useState } from 'react';
import * as THREE from 'three';

export default () => {
  const spotLightProps = {
    color: '#ffbb9c',
    intensity: 20,
    attenuation: 0.8,
    distance: 10,
    angle: 1.1,
    penumbra: 1.8,
    anglePower: 10,
  };
  const px = 1.5
  const py = 0
  const pz = 2.5;

  const [target] = useState(() => new THREE.Object3D());

  return (
    <>
      <SpotLight
        position={[px, py, pz]}
        target={target}
        {...spotLightProps}
      />
      <SpotLight
        position={[-px, py, pz]}
        target={target}
        {...spotLightProps}
      />
      <SpotLight
        position={[0, py, 6 + px * 1.5]}
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
