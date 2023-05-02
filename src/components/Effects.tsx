import React, { useRef } from 'react';
import * as THREE from 'three';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { KernelSize, BlendFunction } from 'postprocessing';
import { folder, useControls } from 'leva';

import useWaveform from '@hooks/useWaveform';

export default () => {
  const { animate: animateChroma, ...chromaProps } = useControls(
    'effects',
    {
      chroma: folder(
        {
          enabled: true,
          animate: true,
          offset: { value: 0.01, min: 0, max: 0.02 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const { animate: animateBloom, ...bloomProps } = useControls(
    'effects',
    {
      bloom: folder(
        {
          enabled: true,
          animate: true,
          intensity: { value: 0, min: 0, max: 2 },
          width: { value: 100, min: 0, max: 1000 },
          height: { value: 1000, min: 0, max: 1000 },
          kernelSize: {
            value: KernelSize.LARGE,
            options: [
              KernelSize.HUGE,
              KernelSize.VERY_LARGE,
              KernelSize.LARGE,
              KernelSize.MEDIUM,
              KernelSize.SMALL,
              KernelSize.VERY_SMALL,
            ],
          },
          luminanceThreshold: { value: 1, min: 0, max: 2 },
          luminanceSmoothing: { value: 0.9, min: 0, max: 1 },
          mipmapBlur: { value: true },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const bloomRef = useRef(null);
  const chromaRef = useRef(null);

  useWaveform({ enabled: bloomProps.enabled && animateBloom, once: true }, (y) => {
    bloomRef.current.intensity = y;
    bloomRef.current.luminanceThreshold = 1 - 0.5 * y;
  });
  useWaveform(
    {
      enabled: chromaProps.enabled && animateChroma,
      amplitude: chromaProps.offset,
      once: true,
    },
    (y) => {
      const val = Math.max(0, chromaProps.offset - y * 1.5);
      chromaRef.current.offset = new THREE.Vector2(val, val);
    }
  );

  return (
    <EffectComposer>
      <Bloom
        ref={(r) => (bloomRef.current = r)}
        {...bloomProps}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL} // blend mode
        ref={(r) => (chromaRef.current = r)}
        offset={new THREE.Vector2(chromaProps.offset, chromaProps.offset)}
      />
    </EffectComposer>
  );
};
