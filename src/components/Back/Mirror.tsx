import { CubeCamera } from '@react-three/drei';
import { ThreeEvent, useFrame, useLoader } from '@react-three/fiber';
import React, { useRef } from 'react';
import * as THREE from 'three';
import { damp } from 'three/src/math/MathUtils';
import { folder, useControls } from 'leva';

export default () => {
  const speedX = useRef(0);
  const speedY = useRef(0);
  const meshRef = useRef(new THREE.Mesh());

  const { lambda, dt, scale, roughness, color } = useControls('back', {
    spinner: folder(
      {
        lambda: { value: 0.3, min: 0, max: 1 },
        dt: { value: 0.07, min: 0, max: 0.1 },
        scale: { value: 1.5, min: 1, max: 3 },
        roughness: { value: 0.08, min: 0, max: 0.2 },
        color: { value: '#ffbb9c' },
      },
      { collapsed: true }
    ),
  });

  const cubeCamProps = useControls({
    cubeCam: folder({
      resolution: { value: 128, min: 0, max: 1024 },
      near: { value: 1, min: 0, max: 5 },
      far: { value: 12, min: 0, max: 100 },
    }),
  });

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
    speedX.current = damp(speedX.current, 0, lambda, dt);
    speedY.current = damp(speedY.current, 0, lambda, dt);
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
        {...cubeCamProps}
      >
        {
          ((texture: THREE.Texture) => (
            <mesh
              onClick={onClick}
              ref={(r) => (meshRef.current = r)}
            >
              <icosahedronGeometry args={[scale]} />
              <meshStandardMaterial
                color={color}
                metalness={1}
                roughness={roughness}
                envMap={texture}
              />
            </mesh>
          )) as any
        }
      </CubeCamera>
  );
};
