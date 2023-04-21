import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls } from '@react-three/drei';
import { Leva, useControls } from 'leva';

import './index.less';
import Lights from '@components/Lights';
import Logo from '@components/Logo';
import Wordmark from '@components/Wordmark';
import Effects from '@components/Effects';
import Ground from '@components/Ground';
import Sparkles from '@components/Sparkles';

export default () => {
  let devMode = false;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(document.location.search);
    devMode = !!params.get('dev');
  }

  const { reverseOrbit } = useControls(
    'animation',
    {
      reverseOrbit: true,
    },
    { collapsed: true }
  );

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 0] }}
        dpr={window.devicePixelRatio}
      >
        <color attach="background" args={[0x000000]} />
        <ambientLight intensity={0.3} />
        <Lights />
        <Wordmark />
        <Logo />
        <Ground />
        <Sparkles />
        <OrbitControls
          target={[0, 0.501, -0.01]}
          reverseOrbit={reverseOrbit}
          dampingFactor={0.1}
        />
        <Effects />
      </Canvas>
      <Leva hidden={PRODUCTION && !devMode} />
    </>
  );
};
