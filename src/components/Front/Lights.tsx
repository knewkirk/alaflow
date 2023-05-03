import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { folder, useControls } from 'leva';

import useWaveform from '@hooks/useWaveform';
import { SpotLight } from '@react-three/drei';

export default () => {
  const backlightProps = useControls(
    'front',
    {
      backlights: folder(
        {
          color: { value: '#ffffff' },
          attenuation: { value: 5, min: 0, max: 20 },
          distance: { value: 10, min: 0, max: 30 },
          angle: { value: 1, min: 0, max: Math.PI },
          penumbra: { value: 1.5, min: 0, max: Math.PI },
          anglePower: { value: 10, min: 0, max: 10 },
          intensity: { value: 0.1, min: 0, max: 3 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const { x, y, z, animate, ...spotLightProps } = useControls(
    'front',
    {
      lights: folder(
        {
          animate: true,
          color: { value: '#ffbb9c' },
          attenuation: { value: 0.8, min: 0, max: 2 },
          distance: { value: 10, min: 0, max: 30 },
          angle: { value: 0.9, min: 0, max: Math.PI },
          penumbra: { value: 1.8, min: 0, max: 2 },
          anglePower: { value: 10, min: 0, max: 20 },
          position: folder({
            x: { value: 1.5, min: 0, max: 5 },
            y: { value: 2, min: 0, max: 5 },
            z: { value: 2.5, min: 0, max: 5 },
          }),
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const light1 = useRef(null);
  const light2 = useRef(null);
  const backlights = useRef([]);
  const blockerRef1 = useRef(null);
  const blockerRef2 = useRef(null);
  const [backlightsTarget] = useState(() => new THREE.Object3D());
  const [mainTarget] = useState(() => new THREE.Object3D());

  const waveParams = { amplitude: 3, enabled: animate };
  useWaveform({ ...waveParams, offset: 1 }, (y) => {
    light1.current.intensity = y;
    blockerRef1.current.opacity = 1 - y / 3;
  });
  useWaveform(waveParams, (y) => {
    light2.current.intensity = y;
    blockerRef2.current.opacity = 1 - y / 3;
  });
  useWaveform({ ...waveParams, amplitude: 0.3 }, (y) => {
    const _y = Math.min(y, 0.18);
    const intensity = 0.2 - _y;
    backlights.current.forEach((l) => (l.intensity = intensity));
  });

  return (
    <>
      <Blocker
        position={[x - 0.3, y - 0.3, -z + 0.1]}
        refFn={(r) => (blockerRef1.current = r)}
      />
      <Blocker
        position={[-x + 0.3, y - 0.3, -z + 0.1]}
        refFn={(r) => (blockerRef2.current = r)}
      />
      {[...new Array(5)].map((_, i) => (
        <SpotLight
          key={i}
          position={[-4 + i * 2, 0, -8]}
          ref={(r) => (backlights.current[i] = r)}
          target={backlightsTarget}
          {...backlightProps}
        />
      ))}
      <primitive
        object={backlightsTarget}
        position={[0, 1, -5]}
      />
      <SpotLight
        ref={(r) => (light1.current = r)}
        position={[x, y, -z]}
        target={mainTarget}
        {...spotLightProps}
      />
      <SpotLight
        ref={(r) => (light2.current = r)}
        position={[-x, y, -z]}
        target={mainTarget}
        {...spotLightProps}
      />
      <primitive
        object={mainTarget}
        position={[0, 0, -6]}
      />
    </>
  );
};

interface BlockerProps {
  position: [number, number, number];
  refFn: (r: THREE.Material) => void;
}

const Blocker = ({ position, refFn }: BlockerProps) => (
  <mesh
    rotation={[0, 0, 0]}
    position={position}
  >
    <circleGeometry args={[0.6, 32]} />
    <meshPhongMaterial
      color="black"
      transparent
      ref={refFn}
    />
  </mesh>
);
