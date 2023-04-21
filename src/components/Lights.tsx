import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useControls } from 'leva';

import useAnimation from '@hooks/useAnimation';

export default () => {
  const { lightsColor } = useControls(
    'colors',
    {
      lightsColor: { value: '#ffbb9c' },
    },
    { collapsed: true }
  );
  const { lights } = useControls(
    'animation',
    {
      lights: true,
    },
    { collapsed: true }
  );

  const light1 = useRef<THREE.SpotLight>(new THREE.SpotLight());
  const light2 = useRef<THREE.SpotLight>(new THREE.SpotLight());
  const backlights = useRef<THREE.PointLight[]>([]);

  const params = { amplitude: 3, enabled: lights };
  useAnimation({ ...params, offset: 1 }, (y) => {
    light1.current.intensity = y;
  });
  useAnimation(params, (y) => {
    light2.current.intensity = y;
  });
  useAnimation({ ...params, amplitude: 0.08 }, (y) => {
    backlights.current.forEach((l) => (l.intensity = 0.1 - y));
  });

  const spotLightProps = {
    castShadow: true,
    color: lightsColor,
    penumbra: 0.1,
    intensity: 0,
    angle: Math.PI / 8,
  };

  const [target] = useState(() => new THREE.Object3D())

  return (
    <>
      {[...new Array(5)].map((_, i) => (
        <pointLight
          key={i}
          intensity={0.1}
          position={[-2 + i, 0, -8]}
          ref={(r) => (backlights.current[i] = r)}
        />
      ))}
      <spotLight
        ref={(r) => (light1.current = r)}
        position={[3.5, 3, 0]}
        target={target}
        {...spotLightProps}
      />
      <spotLight
        ref={(r) => (light2.current = r)}
        position={[-3.5, 3, 0]}
        target={target}
        {...spotLightProps}
      />
      <primitive object={target} position={[0, 0.5, -6]} />
    </>
  );
};
