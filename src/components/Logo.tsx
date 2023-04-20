import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useTimer } from 'use-timer';
import { useControls } from 'leva';

import useAnimation from '@hooks/useAnimation';

const NUM_ROWS = 5;
const NUM_COLS = 10;
const SCALE = 0.001;
const WPADDING = 0.08;
const HPADDING = 0.03;

const useEmissiveWave = (
  refMap: React.RefObject<Record<string, THREE.MeshStandardMaterial>>,
  shouldRun: boolean
) => {
  for (let i = 0; i < NUM_COLS; i++) {
    for (let j = 0; j < NUM_ROWS; j++) {
      useAnimation(
        {
          amplitude: 6,
          enabled: shouldRun,
          offset: 0.2 * i - 0.2 * j,
          peakiness: 5,
        },
        (y) => {
          const idx = `${i}${j}`;
          if (!refMap.current.hasOwnProperty(idx)) {
            return;
          }
          refMap.current[idx].emissiveIntensity = y;
        }
      );
    }
  }
};

export default () => {
  const { logoColor } = useControls('colors', {
    logoColor: { value: '#3d9999' },
  });
  const animationArgs = useControls('animation', {
    'logo colors': true,
    'logo random spin': true,
  });

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

  const meshRef = useRef<Record<string, THREE.Mesh>>({});
  const isSpinning = useRef(false);
  const clickedIdx = useRef('');
  const didUpdate = useRef(false);
  const logoUpdateCount = useRef(0);
  const materialRef = useRef<Record<string, THREE.MeshStandardMaterial>>({});

  useEmissiveWave(materialRef, animationArgs['logo colors']);

  const { time, start, pause, reset, status } = useTimer();
  useFrame(() => {
    const idx = clickedIdx.current;
    if (status === 'STOPPED' && !isSpinning.current) {
      start();
    }
    if (status === 'PAUSED' && isSpinning.current) {
      if (!meshRef.current || !idx || !meshRef.current.hasOwnProperty(idx)) {
        return;
      }

      meshRef.current[idx].rotation.y += 0.15;
      if (meshRef.current[idx].rotation.y >= 2 * Math.PI) {
        meshRef.current[idx].rotation.y = 0;
        clickedIdx.current = '';
        isSpinning.current = false;
        if (animationArgs['logo random spin']) {
          reset();
          start();
        }
      }
    }
    if (status === 'RUNNING' && !isSpinning.current) {
      if (time > 5 && animationArgs['logo random spin']) {
        pause();
        const rand1 = 1 + Math.trunc(Math.random() * (NUM_COLS - 1));
        const rand2 = 1 + Math.trunc(Math.random() * (NUM_ROWS - 1));
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
        group.position.y = -center.y + 1.2;
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
                pause();
                clickedIdx.current = `${i}${j}`;
                isSpinning.current = true;
              }}
              geometry={(i + j) % 2 === 1 ? geometry : geometryRot}
            >
              <meshStandardMaterial
                color={0x333333}
                // color={0xffffff}
                roughness={0.3}
                metalness={1}
                // emissive={0x3d9999}
                emissiveIntensity={0}
                emissive={logoColor}
                toneMapped={false}
                ref={(r) => (materialRef.current[`${i}${j}`] = r)}
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
