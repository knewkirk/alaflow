import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { SVGResult } from 'three/examples/jsm/loaders/SVGLoader';

export default (svg: SVGResult, scale: number) => {
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
    geometry.scale(scale, scale, scale);
    geometry.computeBoundingBox();
    const box = geometry.boundingBox;
    const center = box.getCenter(new THREE.Vector3());
    setCenterX(center.x);
    setCenterY(center.y);
    setShapes(_shapes);
  }, [svg]);

  return {
    shapes,
    centerX,
    centerY,
  };
};
