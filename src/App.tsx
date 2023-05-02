import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls, Stats } from '@react-three/drei';
import { Leva, useControls } from 'leva';

import './index.less';
import Front from '@components/Front';
import Effects from '@components/Effects';
import Ground from '@components/Ground';
import Sparkles from '@components/Sparkles';
import Right from '@components/Right';
import Left from '@components/Left';
import Back from '@components/Back';
import { Physics } from '@react-three/rapier';
import Ball from '@components/Ball';
import Blob from '@components/Blob';

const POLAR_ANGLE_JUST_GT_HORIZ = 6 * Math.PI / 11;

export default () => {
  let devMode = false;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(document.location.search);
    devMode = !!params.get('dev');
  }

  const { reverseOrbit, lookAtRight, lookAtLeft, lookAtBack } = useControls(
    'camera',
    {
      reverseOrbit: true,
      lookAtRight: false,
      lookAtLeft: false,
      lookAtBack: false,
    },
    { collapsed: true }
  );

  const [minAngle, setMinAngle] = useState(POLAR_ANGLE_JUST_GT_HORIZ);
  const [target, setTarget] = useState(new THREE.Vector3());
  useEffect(() => {
    let x = 0;
    let y = 0.5;
    let z = 0;
    if (reverseOrbit) {
      setMinAngle(POLAR_ANGLE_JUST_GT_HORIZ);
      y = 0.501;
      if (lookAtRight) {
        x = 0.01;
      } else if (lookAtLeft) {
        x = -0.01;
      } else if (lookAtBack) {
        z = 0.01;
      } else {
        z = -0.01;
      }
    } else {
      setMinAngle(0);
      if (lookAtRight) {
        x = 6;
      } else if (lookAtLeft) {
        x = -6;
      } else if (lookAtBack) {
        z = 6;
      } else {
        z = -6;
      }
    }
    setTarget(new THREE.Vector3(x, y, z));
  }, [reverseOrbit, lookAtRight, lookAtLeft]);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 0] }}
        dpr={[1, 2]}
      >
        <Suspense>
          <Physics
            gravity={[0, -3, 0]}
            interpolate={false}
            colliders={false}
            debug={false}
          >
            <color
              attach="background"
              args={[0x000000]}
            />
            <ambientLight intensity={0.3} />
            <Ground />
            <Ball position={[6, 1, -6]} />
            <Ball position={[-6, 1, -6]} />
            <Blob position={[6, 1.5, 6]} />
            <Blob position={[-6, 1.5, 6]} />
            <Front />
            <Right />
            <Left />
            <Back />
            <Sparkles />
            <OrbitControls
              target={target}
              reverseOrbit={reverseOrbit}
              dampingFactor={0.1}
              minPolarAngle={minAngle}
            />
            <Effects />
          </Physics>
        </Suspense>
      </Canvas>
      <Leva hidden={PRODUCTION && !devMode} collapsed/>
      {(!PRODUCTION || devMode) && <Stats />}
    </>
  );
};
