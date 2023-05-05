import React, { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { folder, useControls } from 'leva';

interface Props {
  position: THREE.Vector3Tuple;
}

export default ({ position }: Props) => {
  const { color, metalness, roughness } = useControls(
    'ball',
    {
      material: folder(
        {
          color: { value: '#ffbb9c' },
          metalness: { value: 1, min: 0, max: 1 },
          roughness: { value: 0.35, min: 0, max: 1 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const spotLightProps = useControls('ball', {
    light: folder(
      {
        color: { value: '#ffbb9c' },
        intensity: { value: 2, min: 0, max: 10 },
        attenuation: { value: 0.8, min: 0, max: 2 },
        distance: { value: 3, min: 0, max: 10 },
        angle: { value: 1.1, min: 0, max: 4 },
        penumbra: { value: 1.8, min: 0, max: 4 },
        anglePower: { value: 10, min: 0, max: 20 },
      },
      { collapsed: true }
    ),
  });

  const rigidBodyRef = useRef<RapierRigidBody>(null);

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

  const [target] = useState(() => new THREE.Object3D());

  return (
    <>
      <spotLight
        position={[position[0], 3, position[2]]}
        target={target}
        {...spotLightProps}
      />
      <primitive
        object={target}
        position={[position[0], 0, position[2]]}
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
          <icosahedronGeometry args={[0.7]} />
          <meshStandardMaterial
            color={color}
            metalness={metalness}
            roughness={roughness}
          />
        </mesh>
      </RigidBody>
    </>
  );
};
