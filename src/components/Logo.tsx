import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';

import { useTimer } from 'use-timer';

const NUM_ROWS = 5;
const NUM_COLS = 10;
const SCALE = 0.001;
const WPADDING = 0.08;
const HPADDING = 0.03;

export default () => {
  const svg = useLoader(SVGLoader, '/logo.svg');
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

  // Use refs for things we don't want to trigger a react render for
  const meshRef = useRef<Record<string, THREE.Mesh>>({});
  const isSpinning = useRef(false);
  const clickedIdx = useRef('');
  const didUpdate = useRef(false);
  const logoUpdateCount = useRef(0);

  const { time, start, pause, reset, status } = useTimer();
  useFrame((state, delta) => {
    const idx = clickedIdx.current;
    if (status === 'STOPPED' && !isSpinning.current) {
      start();
      // TODO: Remove if doing the random thing
      pause();
    }
    if (status === 'PAUSED' && isSpinning.current) {
      if (!meshRef.current || !idx || !meshRef.current.hasOwnProperty(idx)) {
        return;
      }

      meshRef.current[idx].rotation.y += 0.15;
      if (meshRef.current[idx].rotation.y >= 2 * Math.PI) {
        // reset();
        meshRef.current[idx].rotation.y = 0;
        clickedIdx.current = '';
        isSpinning.current = false;
        // start();
      }
    }
    // TODO: Figure out if the randomness thing good idea
    if (status === 'RUNNING' && !isSpinning.current) {
      if (time < 0) {
        pause();
        const rand1 = Math.trunc(Math.random() * NUM_COLS);
        const rand2 = Math.trunc(Math.random() * NUM_ROWS);
        console.log('spinning:', `${rand1}${rand2}`);
        clickedIdx.current = `${rand1}${rand2}`;
        isSpinning.current = true;
      }
    }
  });

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
    geometry.scale(SCALE, SCALE, SCALE);
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

  return (
    <group
      onUpdate={(group) => {
        if (
          didUpdate.current ||
          logoUpdateCount.current < NUM_COLS * NUM_ROWS
        ) {
          return;
        }
        const box = new THREE.Box3().setFromObject(group);
        const center = box.getCenter(new THREE.Vector3());
        group.position.x = -center.x;
        group.position.y = -center.y + 1.5;
        didUpdate.current = true;
      }}
      // TODO: Figure out why this is necessary
      onAfterRender={() => {}}
    >
      {[...Array(NUM_COLS)].map((_, i) => (
        <React.Fragment key={i}>
          {[...Array(NUM_ROWS)].map((_, j) => (
            <mesh
              position={[
                i * (width / 2 + WPADDING),
                j * (height + HPADDING),
                -0.5,
              ]}
              key={`${i}${j}`}
              castShadow
              receiveShadow
              ref={(r) => (meshRef.current[`${i}${j}`] = r)}
              onAfterRender={() => {
                logoUpdateCount.current++;
              }}
              onPointerDown={() => {
                if (isSpinning.current) {
                  return;
                }
                clickedIdx.current = `${i}${j}`;
                isSpinning.current = true;
              }}
              geometry={(i + j) % 2 === 1 ? geometry : geometryRot}
            >
              <meshStandardMaterial
                color={0x555555}
                roughness={0.4}
                metalness={1}
              />
              <mesh
                geometry={tGeo}
                rotation={[0, 0, (i + j) % 2 === 1 ? Math.PI : 0]}
              >
                <meshBasicMaterial color="red" opacity={0} transparent />
              </mesh>
            </mesh>
          ))}
        </React.Fragment>
      ))}
    </group>
  );
};
