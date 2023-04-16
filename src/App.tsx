import React from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { MeshReflectorMaterial, OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

import './index.less';
import Logo from '@components/Logo';
import Wordmark from '@components/Wordmark';

export default () => {
  const { blurx, blury, ...props } = useControls(
    'mirror',
    {
      blurx: { value: 1, min: 0, max: 1 },
      blury: { value: 1, min: 0, max: 1 },
      mixBlur: { value: 0.5, min: 0, max: 1 },
      mixStrength: { value: 0.1, min: 0, max: 1 },
      mixContrast: { value: 0.5, min: 0, max: 1 },
      resolution: { value: 1024, min: 256, max: 2048 },
      mirror: { value: 1, min: 0, max: 1 },
      depthScale: { value: 0, min: 0, max: 1 },
      minDepthThreshold: { value: 0, min: 0, max: 1 },
      maxDepthThreshold: { value: 0, min: 0, max: 1 },
      depthToBlurRatioBias: { value: 0, min: 0, max: 1 },
      distortion: { value: 0, min: 0, max: 1 },
      debug: { value: 0, min: 0, max: 5, step: 1 },
      reflectorOffset: { value: 0, min: 0, max: 1 },
    },
    { collapsed: true }
  );

  const spotLightProps = {
    castShadow: true,
    color: 'white',
    penumbra: 0.1,
    intensity: 2,
    angle: Math.PI / 8,
  };

  return (
    <Canvas shadows camera={{ position: [0, 0.5, 6] }}>
      <color attach="background" args={[0x333333]} />
      <ambientLight intensity={0.3} />
      <spotLight position={[3.5, 3, 4]} {...spotLightProps} />
      <spotLight position={[-3.5, 3, 4]} {...spotLightProps} />
      <Wordmark />
      <Logo />
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <MeshReflectorMaterial blur={[blurx, blury]} {...props} />
      </mesh>
      <OrbitControls maxPolarAngle={Math.PI / 2} target={[0, 0.5, 0]} />
    </Canvas>
  );
};
