import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader, Stats } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Leva } from 'leva';

import './index.less';
import Orbit from '@components/Orbit';
import Effects from '@components/Effects';
import Ground from '@components/Ground';
import Sparkles from '@components/Sparkles';
import Front from '@components/Front';
import Right from '@components/Right';
import Left from '@components/Left';
import Back from '@components/Back';
import Ball from '@components/Ball';
import Blob from '@components/Blob';

export default () => {
  let devMode = false;
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(document.location.search);
    devMode = !!params.get('dev');
  }

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [0, 0.5, 0] }}
        dpr={[1, 2]}
      >
        <Orbit />
        <Suspense fallback={null}>
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
            <Effects />
          </Physics>
        </Suspense>
      </Canvas>
      <Leva
        hidden={PRODUCTION && !devMode}
        collapsed={true}
      />
      {(!PRODUCTION || devMode) && <Stats />}
      <Loader />
    </>
  );
};
