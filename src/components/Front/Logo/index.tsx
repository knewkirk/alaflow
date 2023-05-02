import React, { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { folder, useControls } from 'leva';
import { useTimer } from 'use-timer';

import { useEmissiveWave, useRotation } from './animations';
import * as c from './constants';
import useGeometry from './useGeometry';

export default () => {
  const logoProps = useControls(
    'front',
    {
      logo: folder(
        {
          // color: { value: '#3d9999' },
          color: { value: '#64ffff' },
          animateGlow: true,
          spinRandom: true,
          spinSpeed: { value: 0.4, min: 0.15, max: 0.5 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const svg = useLoader(SVGLoader, '/logo.svg');
  const { geometry, geometryRot, width, height, tGeo } = useGeometry(svg);

  const meshRef = useRef<Record<string, THREE.Mesh>>({});
  const isSpinning = useRef(false);
  const clickedIdx = useRef('');
  const didUpdate = useRef(false);
  const logoUpdateCount = useRef(0);
  const materialRef = useRef<Record<string, THREE.MeshStandardMaterial>>({});

  const timer = useTimer();

  useEmissiveWave(materialRef, logoProps.animateGlow);

  useRotation(
    timer,
    clickedIdx,
    meshRef,
    isSpinning,
    logoProps.spinRandom,
    logoProps.spinSpeed
  );

  return (
    <group
      onUpdate={(group) => {
        if (
          didUpdate.current ||
          logoUpdateCount.current < c.NUM_COLS * c.NUM_ROWS
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
      {[...Array(c.NUM_COLS)].map((_, i) => (
        <React.Fragment key={i}>
          {[...Array(c.NUM_ROWS)].map((_, j) => (
            <mesh
              position={[
                i * (width / 2 + c.WPADDING),
                j * (height + c.HPADDING),
                -6.5,
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
                timer.pause();
                clickedIdx.current = `${i}${j}`;
                isSpinning.current = true;
              }}
              geometry={(i + j) % 2 === 1 ? geometry : geometryRot}
            >
              <meshStandardMaterial
                color={0x333333}
                roughness={0.3}
                metalness={1}
                emissiveIntensity={0}
                emissive={logoProps.color}
                toneMapped={false}
                ref={(r) => (materialRef.current[`${i}${j}`] = r)}
              />
              <mesh
                geometry={tGeo}
                rotation={[0, 0, (i + j) % 2 === 1 ? Math.PI : 0]}
              >
                <meshBasicMaterial
                  color="red"
                  opacity={0}
                  transparent
                />
              </mesh>
            </mesh>
          ))}
        </React.Fragment>
      ))}
    </group>
  );
};
