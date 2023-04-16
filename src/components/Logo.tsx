import React, { useEffect, useState } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

export default () => {
  const SCALE = 0.001;
  const WPADDING = 0.08;
  const HPADDING = 0.03;
  const svg = useLoader(SVGLoader, '/logo.svg');
  // const [geo, setGeo] = useState(null);
  const [geo, setGeo] = useState(new THREE.BufferGeometry());
  const [didLoad, setDidLoad] = useState(false);

  useEffect(() => {
    if (!svg || didLoad) {
      return;
    }
    setDidLoad(true);
    const _shapes: THREE.Shape[] = [];
    svg.paths.forEach((path, i) => {
      const pShapes = path.toShapes(false);
      pShapes.forEach((s) => {
        _shapes.push(s);
      });
    });

    const geometry = new THREE.ExtrudeGeometry(_shapes, { depth: 10 });
    geometry.scale(SCALE, SCALE, SCALE);
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const box = geometry.boundingBox;
    const center = box.getCenter(new THREE.Vector3());
    geometry.translate(-center.x, -center.y, 0);
    geometry.rotateZ(Math.PI);
    geometry.center();

    const size = box.getSize(new THREE.Vector3());
    const width = size.x;
    const height = size.y;
    const toMerge = [geometry];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const svgCopy = geometry.clone();
        if ((i + j) % 2 === 1) {
          svgCopy.rotateZ(Math.PI / 3);
        }
        svgCopy.center();
        svgCopy.translate(
          i * (width / 2 + WPADDING),
          j * (height + HPADDING),
          0
        );
        toMerge.push(svgCopy);
      }
    }

    const mergedGeo = mergeBufferGeometries(toMerge);
    mergedGeo.center();
    mergedGeo.computeBoundingSphere();
    setGeo(mergedGeo);
  }, [svg]);

  return (
    <mesh position={[0, 0.5, -0.5]} castShadow receiveShadow geometry={geo}>
      <meshStandardMaterial color={0x555555} roughness={0.4} metalness={1} />
    </mesh>
  );
};
