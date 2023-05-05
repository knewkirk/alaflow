import { CubeCamera } from '@react-three/drei';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { folder, useControls } from 'leva';
import React, { useRef } from 'react';
import * as THREE from 'three';
import { damp } from 'three/src/math/MathUtils';

export default () => {
  const { color, metalness, roughness } = useControls(
    'back',
    {
      material: folder(
        {
          color: { value: '#ffbb9c' },
          metalness: { value: 1, min: 0, max: 1 },
          roughness: { value: 0.1, min: 0, max: 1 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const speedX = useRef(0);
  const speedY = useRef(0);
  const meshRef = useRef(new THREE.Mesh());

  const onClick = (e: ThreeEvent<PointerEvent>) => {
    const f = 15;
    const midY = 1.5;
    speedX.current = (e.point.y - midY) / f;
    speedY.current = e.point.x / f;
  };

  useFrame(() => {
    if (!meshRef.current) {
      return;
    }
    const currentX = meshRef.current.rotation.x;
    const currentY = meshRef.current.rotation.y;
    const currentZ = meshRef.current.rotation.z;
    speedX.current = damp(speedX.current, 0, 0.3, 0.07);
    speedY.current = damp(speedY.current, 0, 0.3, 0.07);
    if (Math.abs(speedX.current) < 0.0001) {
      speedX.current = 0;
    }
    if (Math.abs(speedY.current) < 0.0001) {
      speedY.current = 0;
    }
    meshRef.current.rotation.set(
      currentX + speedX.current,
      currentY - speedY.current,
      currentZ
    );
  });

  return (
    <CubeCamera
      position={[0, 2, 6]}
      frames={1}
      resolution={128}
      near={1}
      far={12}
    >
      {
        ((texture: THREE.Texture) => (
          <mesh
            onClick={onClick}
            ref={(r) => (meshRef.current = r)}
          >
            <icosahedronGeometry args={[1.5]} />
            <meshStandardMaterial
              color={color}
              metalness={metalness}
              roughness={roughness}
              envMap={texture}
            />
          </mesh>
        )) as any
      }
    </CubeCamera>
  );
};
