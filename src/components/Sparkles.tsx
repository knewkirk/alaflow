import React from 'react';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';
import { useMemo } from 'react';

export default () => {
  const sizes = useMemo(() => {
    return new Float32Array(
      Array.from({ length: 100 }, () => Math.random() * 10)
    );
  }, []);

  return (
    <Sparkles
      size={sizes}
      color="white"
      count={100}
      position={[0, 10, 0]}
      scale={11}
      noise={0.5}
    />
  );
};
