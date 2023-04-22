import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { SVGResult } from 'three/examples/jsm/loaders/SVGLoader';

import * as c from './constants';

export default (svg: SVGResult) => {
  const [geometry, setGeometry] = useState<THREE.ExtrudeGeometry>(
    new THREE.ExtrudeGeometry()
  );
  const [geometryRot, setGeometryRot] = useState<THREE.ExtrudeGeometry>(
    new THREE.ExtrudeGeometry()
  );
  const [tGeo, setTGeo] = useState<THREE.ShapeGeometry>(
    new THREE.ShapeGeometry()
  );
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!svg) {
      return;
    }
    const shapes: THREE.Shape[] = [];
    svg.paths.forEach((path, i) => {
      const pShapes = path.toShapes(false);
      pShapes.forEach((s) => {
        shapes.push(s);
      });
    });

    const geometry = new THREE.ExtrudeGeometry(shapes, {
      depth: 10,
      bevelEnabled: false,
    });
    geometry.scale(c.SCALE, c.SCALE, c.SCALE);
    geometry.center();
    geometry.computeBoundingBox();
    setGeometry(geometry);
    const geometryRot = geometry.clone();
    geometryRot.rotateZ(Math.PI / 3);
    geometryRot.center();
    setGeometryRot(geometryRot);

    const box = geometry.boundingBox;
    const size = box.getSize(new THREE.Vector3());
    const width = size.x;
    const height = size.y;
    setWidth(width);
    setHeight(height);

    const shape = new THREE.Shape();
    const x = 0;
    const y = 0;
    const a = (width * 1.1) / 2;
    const b = height / 2;
    shape.moveTo(x - a, y - b);
    shape.lineTo(x + a, y - b);
    shape.lineTo(x, y + b);
    const tGeo = new THREE.ShapeGeometry(shape);
    setTGeo(tGeo);
  }, [svg]);

  return {
    geometry,
    geometryRot,
    width,
    height,
    tGeo,
  };
};
