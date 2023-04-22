import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';

import './index.less';
// import Lights from '@components/Lights';
// import Logo from '@components/Front/Logo';
// import Wordmark from '@components/Wordmark';
import Front from '@components/Front';
import Effects from '@components/Effects';
import Ground from '@components/Ground';
import Sparkles from '@components/Sparkles';
import Right from '@components/Right';

export default () => {
  let devMode = false;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(document.location.search);
    devMode = !!params.get('dev');
  }

  const { reverseOrbit, lookAtRight } = useControls(
    'camera',
    {
      reverseOrbit: true,
      lookAtRight: false,
    },
    { collapsed: true }
  );

  const [target, setTarget] = useState(new THREE.Vector3());
  useEffect(() => {
    let x = 0;
    let y = 0.5;
    let z = 0;
    if (reverseOrbit) {
      y = 0.501;
      if (lookAtRight) {
        x = 0.01;
      } else {
        z = -0.01;
      }
    } else {
      if (lookAtRight) {
        x = 6;
      } else {
        z = -6;
      }
    }
    setTarget(new THREE.Vector3(x, y, z));
  }, [reverseOrbit, lookAtRight]);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 0] }}
        dpr={window.devicePixelRatio}
      >
        <color
          attach="background"
          args={[0x000000]}
        />
        <ambientLight intensity={0.3} />
        <Ground />
        <Front />
        <Right />
        <Sparkles />
        <OrbitControls
          target={target}
          reverseOrbit={reverseOrbit}
          dampingFactor={0.1}
        />
        <Effects />
      </Canvas>
      <Leva hidden={PRODUCTION && !devMode} />
    </>
  );
};
