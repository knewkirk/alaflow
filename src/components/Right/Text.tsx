import React from 'react';
import * as THREE from 'three';
import { Center, Float, Text3D } from '@react-three/drei';

const LINKS = [
  {
    name: 'spotify',
    url: 'https://open.spotify.com/artist/7EKEo0Ko687KGsqmsuM0T2?si=xvgeGp9iTgKKdCXnsX2HoA',
  },
  {
    name: 'soundcloud',
    url: 'https://soundcloud.com/alaflow',
  },
  {
    name: 'instagram',
    url: 'https://www.instagram.com/alaflowmusic/',
  },
];

export default () => {
  const onClick = (url: string) => () => {
    window.open(url, '_blank');
  };

  return (
    <>
      {LINKS.map((l, i) => (
        <Float
          key={i}
          floatIntensity={0.1}
          rotationIntensity={0.05}
          speed={7}
          receiveShadow
          castShadow
          onClick={onClick(l.url)}
        >
          <mesh
            rotation={[0, -Math.PI / 2, 0]}
            position={[6, 2 - i * 0.8, 0]}
          >
            <planeGeometry args={[3.5]} />
            <meshBasicMaterial
              color="red"
              transparent
              opacity={0}
            />
          </mesh>
          <Center
            position={[6, 2 - i * 0.8, 0]}
            receiveShadow
            castShadow
          >
            <Text3D
              font={`/fonts/Nunito Sans ExtraBold_Regular.json`}
              rotation={[0, -Math.PI / 2, 0]}
              scale={0.45}
              receiveShadow
              castShadow
            >
              {l.name}
              <meshStandardMaterial
                color={'#a3ffff'}
                roughness={0.5}
                metalness={1}
                toneMapped={false}
              />
            </Text3D>
          </Center>
        </Float>
      ))}
    </>
  );
};
