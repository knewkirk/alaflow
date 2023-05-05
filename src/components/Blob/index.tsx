import { Float } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';

import lerpColor from '@lib/lerpColor';
import { vertexShader, fragmentShader } from './shaders';
import { folder, useControls } from 'leva';

interface Props {
  position: THREE.Vector3Tuple;
}

export default ({ position }: Props) => {
  const {
    intensity,
    distance,
    colorALight,
    colorADark,
    colorBLight,
    colorBDark,
  } = useControls(
    'blobs',
    {
      intensity: { value: 5, min: 0, max: 10 },
      distance: { value: 2.5, min: 0, max: 10 },
      colorALight: { value: '#ffc9b0' },
      colorADark: { value: '#ff9666' },
      colorBLight: { value: '#a3ffff' },
      colorBDark: { value: '#4affff' },
    },
    { collapsed: true }
  );

  const meshRef = useRef<THREE.Mesh>();
  const clicked = useRef(false);
  const peaked = useRef(false);
  const toggleColor = useRef(false);
  const lightRef = useRef(new THREE.PointLight());

  const lightOrange = useMemo(
    () => new THREE.Color(colorALight as any),
    [colorALight]
  );
  const darkOrange = useMemo(
    () => new THREE.Color(colorADark as any),
    [colorADark]
  );
  const lightTeal = useMemo(
    () => new THREE.Color(colorBLight as any),
    [colorBLight]
  );
  const darkTeal = useMemo(
    () => new THREE.Color(colorBDark as any),
    [colorBDark]
  );

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_colorA: { value: lightOrange },
      u_colorB: { value: darkOrange },
      u_intensity: { value: 0.05 },
    }),
    []
  );

  useFrame(({ clock }) => {
    if (!meshRef.current) {
      return;
    }
    (meshRef.current.material as THREE.ShaderMaterial).uniforms.u_time.value =
      clock.getElapsedTime();

    const currentIntensity = (meshRef.current.material as THREE.ShaderMaterial)
      .uniforms.u_intensity.value;
    if (!currentIntensity) {
      (
        meshRef.current.material as THREE.ShaderMaterial
      ).uniforms.u_intensity.value = 0.2;
    }
    if (clicked.current) {
      let newIntensity = currentIntensity;
      if (currentIntensity < 0.06 && peaked.current === true) {
        clicked.current = false;
        peaked.current = false;
      } else {
        if (currentIntensity > 0.38) {
          peaked.current = true;
        }
        if (peaked.current) {
          newIntensity = THREE.MathUtils.lerp(currentIntensity, 0.05, 0.03);
        } else {
          newIntensity = THREE.MathUtils.lerp(currentIntensity, 0.4, 0.08);
        }
      }
      (
        meshRef.current.material as THREE.ShaderMaterial
      ).uniforms.u_intensity.value = newIntensity;
    }

    const currentA = (meshRef.current.material as THREE.ShaderMaterial).uniforms
      .u_colorA.value;
    const currentB = (meshRef.current.material as THREE.ShaderMaterial).uniforms
      .u_colorB.value;
    const currentLight = lightRef.current.color;
    if (toggleColor.current) {
      (
        meshRef.current.material as THREE.ShaderMaterial
      ).uniforms.u_colorA.value = lerpColor(currentA, darkTeal, 0.05);
      (
        meshRef.current.material as THREE.ShaderMaterial
      ).uniforms.u_colorB.value = lerpColor(currentB, lightTeal, 0.05);
      lightRef.current.color = lerpColor(currentLight, lightTeal, 0.05);
    } else {
      (
        meshRef.current.material as THREE.ShaderMaterial
      ).uniforms.u_colorA.value = lerpColor(currentA, darkOrange, 0.05);
      (
        meshRef.current.material as THREE.ShaderMaterial
      ).uniforms.u_colorB.value = lerpColor(currentB, lightOrange, 0.05);
      lightRef.current.color = lerpColor(currentLight, lightOrange, 0.05);
    }
  });

  return (
    <Float
      floatIntensity={0.1}
      rotationIntensity={0.05}
      speed={7}
      position={position}
      enabled={false}
    >
      <pointLight
        intensity={intensity}
        distance={distance}
        ref={lightRef}
      />
      <mesh
        ref={meshRef}
        onClick={() => {
          clicked.current = true;
          toggleColor.current = !toggleColor.current;
        }}
      >
        <icosahedronGeometry args={[0.7, 4]} />
        <shaderMaterial
          uniforms={uniforms}
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
        />
      </mesh>
    </Float>
  );
};
