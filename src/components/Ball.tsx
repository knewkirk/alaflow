import React, { useRef } from 'react';
import * as THREE from 'three';

import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useFrame } from '@react-three/fiber';
import { Wireframe } from '@react-three/drei';
import { folder, useControls } from 'leva';

interface Props {
  position: THREE.Vector3Tuple;
}

export default ({ position }: Props) => {
  const wireframeProps = useControls(
    'ball',
    {
      wireframe: folder(
        {
          stroke: { value: '#3d9999' as any },
          backfaceStroke: { value: '#49ffff' as any },
          fill: { value: '#e29775' as any },
          fillOpacity: { value: 0.4, min: 0, max: 1 },
          fillMix: { value: 1, min: 0, max: 1 },
          thickness: { value: 0.2, min: 0, max: 0.3 },
          squeeze: { value: false },
          precision: {
            value: 'highp' as any,
            options: ['highp', 'medp', 'lowp'],
          },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const lightProps = useControls('ball', {
    light: folder(
      {
        color: { value: '#ffbb9c' },
        intensity: { value: 10, min: 0, max: 10 },
        distance: { value: 1.5, min: 0, max: 10 },
      },
      { collapsed: true }
    ),
  });

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const geoRef = useRef<THREE.IcosahedronGeometry>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const onClick = () => {
    const fac = 0.03;
    const randx = fac * Math.random();
    const randy = fac * Math.random();
    const randz = fac * Math.random();
    rigidBodyRef.current.applyImpulse({ x: 0, y: 2, z: 0 }, true);
    rigidBodyRef.current.applyTorqueImpulse(
      { x: randx, y: randy, z: randz },
      true
    );
  };

  useFrame(() => {
    const { x, y, z } = rigidBodyRef.current.nextTranslation();

    if (!lightRef.current) {
      return;
    }
    lightRef.current.position.set(x, y, z);
  });

  return (
    <>
      <pointLight
        ref={(r) => (lightRef.current = r)}
        {...lightProps}
      />
      <RigidBody
        position={position}
        colliders={'trimesh'}
        ref={(r) => (rigidBodyRef.current = r)}
      >
        <mesh
          onClick={onClick}
          castShadow
        >
          <icosahedronGeometry
            args={[0.7]}
            ref={(r) => (geoRef.current = r)}
          />
          <Wireframe {...(wireframeProps as any)} />
        </mesh>
      </RigidBody>
    </>
  );
};
