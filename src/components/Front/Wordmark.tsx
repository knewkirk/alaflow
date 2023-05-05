import React from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import useSVGShapes from '@hooks/useSVGShapes';
import { folder, useControls } from 'leva';

const SCALE = 0.01;

export default () => {
  const { color, metalness, roughness } = useControls(
    'front',
    {
      wordmark: folder(
        {
          color: { value: '#ffffff' },
          metalness: { value: 1, min: 0, max: 1 },
          roughness: { value: 0.3, min: 0, max: 1 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const svg = useLoader(SVGLoader, '/wordmark-sm.svg');
  const { shapes, centerX, centerY } = useSVGShapes(svg, SCALE);

  return (
    <mesh
      scale={SCALE}
      position={[-centerX, centerY + 0.4, -6]}
      rotation={[Math.PI, 0, 0]}
      castShadow
    >
      <extrudeGeometry args={[shapes, { depth: 20 }]} />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        toneMapped={false}
      />
    </mesh>
  );
};
