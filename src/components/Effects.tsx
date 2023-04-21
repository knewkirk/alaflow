import React, { useRef } from 'react';
import * as THREE from 'three';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { KernelSize, BlendFunction } from 'postprocessing';
import { useControls } from 'leva';

import useAnimation from '@hooks/useAnimation';

export default () => {
  const { bloom, chroma } = useControls('animation', {
    bloom: true,
    chroma: true,
  });

  const { offset } = useControls(
    'chroma',
    {
      offset: { value: 0.01, min: 0, max: 0.02 },
    },
    { collapsed: true }
  );

  const bloomProps = useControls(
    'bloom',
    {
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
      mipmapBlur: { value: false },
    },
    { collapsed: true }
  );

  const bloomRef = useRef(null);
  const chromaRef = useRef(null);

  useAnimation({ enabled: bloom }, (y) => {
    bloomRef.current.intensity = y;
    bloomRef.current.luminanceThreshold = 1 - 0.5 * y;
  });
  useAnimation({ enabled: chroma, amplitude: offset }, (y) => {
    const val = offset - y;
    chromaRef.current.offset = new THREE.Vector2(val, val);
  });

  return (
    <EffectComposer>
      <Bloom ref={(r) => (bloomRef.current = r)} {...bloomProps} />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL} // blend mode
        ref={(r) => (chromaRef.current = r)}
        offset={new THREE.Vector2(offset, offset)}
      />
    </EffectComposer>
  );
};
