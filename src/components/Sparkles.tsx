import React from 'react';
import * as THREE from 'three';
import { Sparkles } from '@react-three/drei';
import { useControls } from 'leva';
import { useMemo } from 'react';

export default () => {
  const { enabled, size, amount, random, noise, scale } = useControls(
    'sparkles',
    {
      enabled: true,
      size: { value: 10, min: 0, max: 20 },
      random: true,
      amount: { value: 100, min: 0, max: 150 },
      noise: { value: 0.5, min: 0, max: 1 },
      scale: { value: 10, min: 1, max: 20 },
    },
    { collapsed: true }
  );
  const sizes = useMemo(() => {
    return new Float32Array(
      Array.from({ length: amount }, () => Math.random() * size)
    );
  }, [size, amount]);

  if (!enabled) {
    return null;
  } else {
    return (
      <Sparkles
        size={random ? sizes : size}
        color="white"
        count={amount}
        position={[0, 10, 0]}
        scale={scale}
        noise={noise}
      />
    );
  }
};
