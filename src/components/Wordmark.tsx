import React, { useEffect, useRef, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

const SCALE = 0.01;

export default () => {
  const svg = useLoader(SVGLoader, '/wordmark-sm.svg');
  const [shapes, setShapes] = useState([]);
  const [centerX, setCenterX] = useState(0);
  const [centerY, setCenterY] = useState(0);

  useEffect(() => {
    if (!svg || shapes.length > 0) {
      return;
    }
    const _shapes: THREE.Shape[] = [];
    svg.paths.forEach((path, i) => {
      const pShapes = path.toShapes(false);
      pShapes.forEach((s) => {
        _shapes.push(s);
      });
    });

    const geometry = new THREE.ExtrudeGeometry(_shapes);
    geometry.scale(SCALE, SCALE, SCALE);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const center = box.getCenter(new THREE.Vector3());
    setCenterX(center.x);
    setCenterY(center.y);
    setShapes(_shapes);
  }, [svg]);

  return (
    <mesh
      scale={SCALE}
      position={[-centerX, centerY + 0.4, 0]}
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
