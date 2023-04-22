import React from 'react';
import * as THREE from 'three';
import { Center, Float, Text3D } from '@react-three/drei';
import { folder, useControls } from 'leva';

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
  /****
   *
   *
   *
   * MAKE A `FRONT` FOLDER NOW
   *
   *
   *
   *
   */

  const {
    floatEnabled,
    color,
    rotationIntensity,
    floatIntensity,
    speed,
    font,
    textCaps,
    scale,
  } = useControls(
    'right',
    {
      text: folder(
        {
          color: { value: '#a3ffff' },
          floatEnabled: true,
          floatIntensity: { value: 0.1, min: 0, max: 0.5 },
          rotationIntensity: { value: 0.05, min: 0, max: 0.5 },
          speed: { value: 7, min: 0, max: 10 },
          font: {
            value: 'Nunito Sans ExtraBold_Regular',
            options: [
              'Nunito Sans SemiBold_Regular',
              'Nunito Sans_Bold',
              'Nunito Sans ExtraBold_Regular',
              'Nunito Sans Black_Regular',
            ],
          },
          textCaps: { value: 'none', options: ['all', 'some', 'none'] },
          scale: { value: 0.45, min: 0, max: 1 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const onClick = (url: string) => () => {
    window.open(url, '_blank');
  };

  return (
    <>
      {LINKS.map((l, i) => (
        <Float
          key={i}
          enabled={floatEnabled}
          floatIntensity={floatIntensity}
          rotationIntensity={rotationIntensity}
          speed={speed}
          receiveShadow
          castShadow
        >
          <Center
            position={[6, 2 - i * 0.8, 0]}
            receiveShadow
            castShadow
          >
            <Text3D
              font={`/fonts/${font}.json`}
              rotation={[0, -Math.PI / 2, 0]}
              scale={scale}
              onClick={onClick(l.url)}
              receiveShadow
              castShadow
            >
              {textCaps === 'all'
                ? l.name.toUpperCase()
                : textCaps === 'some'
                ? l.name.charAt(0).toUpperCase() + l.name.substring(1)
                : l.name}
              <meshStandardMaterial
                color={color}
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
