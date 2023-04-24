import { Float, Image } from '@react-three/drei';
import { folder, useControls } from 'leva';
import React from 'react';
import * as THREE from 'three';

export default () => {
  const { scale, posY } = useControls(
    'left',
    {
      epk: folder(
        {
          scale: { value: 0.3, min: 0, max: 1 },
          posY: { value: 1.75, min: 1, max: 3 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

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
          position={[-6.02, posY, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        >
          <boxGeometry
            args={[8.5 * (scale - 0.01), 11 * (scale - 0.01), 0.01]}
          />
          <meshBasicMaterial color="#a3ffff" />
        </mesh>
        <Image
          onClick={onClick}
          url="/epk.png"
          scale={[8.5 * scale, 11 * scale]}
          position={[-6, posY, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        />
      </Float>
    </>
  );
};
