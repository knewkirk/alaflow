import React from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

import useSVGShapes from '@hooks/useSVGShapes';
import { Float } from '@react-three/drei';

import { FLOAT_PROPS } from '@lib/constants';
import { folder, useControls } from 'leva';

export enum IconType {
  Instagram = 'instagram',
  Spotify = 'spotify',
  Soundcloud = 'soundcloud',
}

interface IconData {
  src: string;
  scale: number;
  url: string;
  clickTargetScale: [number, number];
}

const ICONS: Record<IconType, IconData> = {
  [IconType.Instagram]: {
    src: '/insta.svg',
    scale: 0.001,
    url: 'https://www.instagram.com/alaflowmusic/',
    clickTargetScale: [1, 1],
  },
  [IconType.Spotify]: {
    src: '/spotify.svg',
    scale: 0.0015,
    url: 'https://open.spotify.com/artist/7EKEo0Ko687KGsqmsuM0T2?si=xvgeGp9iTgKKdCXnsX2HoA',
    clickTargetScale: [1, 1],
  },
  [IconType.Soundcloud]: {
    src: '/soundcloud.svg',
    scale: 0.0015,
    url: 'https://soundcloud.com/alaflow',
    clickTargetScale: [2, 1],
  },
};

interface Props {
  type: IconType;
  position: THREE.Vector3Tuple;
}

export default ({ type, position }: Props) => {
  const { color, roughness, metalness } = useControls('right', {
    material: folder({
      color: { value: '#a3ffff' },
      roughness: { value: 0.5, min: 0, max: 1 },
      metalness: { value: 1, min: 0, max: 1 },
    }, { collapsed: true }),
  });
  const svg = useLoader(SVGLoader, ICONS[type].src);
  const { shapes, centerX, centerY } = useSVGShapes(svg, ICONS[type].scale);

  const onClick = (url: string) => () => {
    window.open(url, '_blank');
  };

  return (
    <Float
      onClick={onClick(ICONS[type].url)}
      {...FLOAT_PROPS}
    >
      <mesh
        rotation={[0, -Math.PI / 2, 0]}
        position={position}
      >
        <planeGeometry args={ICONS[type].clickTargetScale} />
        <meshBasicMaterial
          color="red"
          opacity={0}
          transparent
        />
      </mesh>
      <mesh
        scale={ICONS[type].scale}
        position={[position[0], centerY + position[1], -centerX + position[2]]}
        rotation={[Math.PI, Math.PI / 2, 0]}
        castShadow
      >
        <extrudeGeometry args={[shapes, { depth: 50 }]} />
        <meshStandardMaterial
          color={color}
          roughness={roughness}
          metalness={metalness}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
};
