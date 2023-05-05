import { Float, Image } from '@react-three/drei';
import { folder, useControls } from 'leva';
import React from 'react';

export default () => {
  const { shifted } = useControls('left', {
    epk: folder({
      shifted: { value: true },
    }),
  });
  const SCALE = 0.3;

  const onClick = () => {
    window.open('/ALAFLOW_EPK_2023.pdf', '_blank');
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
          url={
            shifted ? '/ALAFLOW_EPK_2023_shifted.png' : '/ALAFLOW_EPK_2023.png'
          }
          scale={[8.5 * SCALE, 11 * SCALE]}
          position={[-6, 1.75, 0]}
          rotation={[0, Math.PI / 2, 0]}
          castShadow
        />
      </Float>
    </>
  );
};
