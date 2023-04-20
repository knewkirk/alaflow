import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { OrbitControls } from '@react-three/drei';
import { Leva } from 'leva';

import './index.less';
import Lights from '@components/Lights';
import Logo from '@components/Logo';
import Wordmark from '@components/Wordmark';
import Effects from '@components/Effects';
import Ground from '@components/Ground';

export default () => {
  let devMode = false;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(document.location.search);
    devMode = !!params.get('dev');
  }

  return (
    <>
      <Canvas shadows camera={{ position: [0, 0.5, 6] }}>
        <color attach="background" args={[0x000000]} />
        <ambientLight intensity={0.3} />
        <Lights />
        <Wordmark />
        <Logo />
        <Ground />
        <OrbitControls maxPolarAngle={Math.PI / 2} target={[0, 0.5, 0]} />
        <Effects />
      </Canvas>
      <Leva hidden={PRODUCTION && !devMode} />
    </>
  );
};
