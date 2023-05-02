import { Float, Image } from '@react-three/drei';
import React from 'react';
import * as THREE from 'three';

export default () => {
  const SCALE = 0.3;

  const onClick = () => {
    window.open('/ALAFLOW_EPK.pdf', '_blank');
  };

  return (
    <>
      <Float
        speed={7}
        floatIntensity={0.1}
        rotationIntensity={0.05}
      >
        <mesh
          position={[-6.02, 1.75, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <boxGeometry
            args={[8.5 * (SCALE - 0.01), 11 * (SCALE - 0.01), 0.01]}
          />
          <meshBasicMaterial color="#a3ffff" />
        </mesh>
        <Image
          onClick={onClick}
          url="/epk.png"
          scale={[8.5 * SCALE, 11 * SCALE]}
          position={[-6, 1.75, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        />
      </Float>
    </>
  );
};
