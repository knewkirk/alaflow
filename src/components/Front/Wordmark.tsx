import React from 'react';
import { useLoader } from '@react-three/fiber';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import useSVGShapes from '@hooks/useSVGShapes';

const SCALE = 0.01;

export default () => {
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
        color={0xffffff}
        roughness={0.3}
        metalness={1}
        toneMapped={false}
      />
    </mesh>
  );
};
