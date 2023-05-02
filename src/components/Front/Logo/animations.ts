import { MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';

import useWaveform from '@hooks/useWaveform';
import * as c from './constants';
import { ReturnValue } from 'use-timer/lib/types';

export const useEmissiveWave = (
  refMap: React.RefObject<Record<string, THREE.MeshStandardMaterial>>,
  shouldRun: boolean
) => {
  for (let i = 0; i < c.NUM_COLS; i++) {
    for (let j = 0; j < c.NUM_ROWS; j++) {
      useWaveform(
        {
          // amplitude: 6,
          amplitude: 2,
          enabled: shouldRun,
          offset: 0.2 * i - 0.2 * j,
          peakiness: 5,
        },
        (y) => {
          const idx = `${i}${j}`;
          if (!refMap.current.hasOwnProperty(idx)) {
            return;
          }
          refMap.current[idx].emissiveIntensity = y;
        }
      );
    }
  }
};

export const useRotation = (
  timer: ReturnValue,
  clickedIdx: MutableRefObject<string>,
  meshRef: MutableRefObject<Record<string, THREE.Mesh>>,
  isSpinning: MutableRefObject<boolean>,
  random: boolean,
  speed: number
) => {
  useFrame(() => {
    const idx = clickedIdx.current;
    if (timer.status === 'STOPPED' && !isSpinning.current) {
      timer.start();
    }
    if (timer.status === 'PAUSED' && isSpinning.current) {
      if (!meshRef.current || !idx || !meshRef.current.hasOwnProperty(idx)) {
        return;
      }

      meshRef.current[idx].rotation.y += speed;
      if (meshRef.current[idx].rotation.y >= 2 * Math.PI) {
        meshRef.current[idx].rotation.y = 0;
        clickedIdx.current = '';
        isSpinning.current = false;
        if (random) {
          timer.reset();
          timer.start();
        }
      }
    }
    if (timer.status === 'RUNNING' && !isSpinning.current) {
      if (timer.time > 5 && random) {
        timer.pause();
        const rand1 = 1 + Math.trunc(Math.random() * (c.NUM_COLS - 1));
        const rand2 = 1 + Math.trunc(Math.random() * (c.NUM_ROWS - 1));
        clickedIdx.current = `${rand1}${rand2}`;
        isSpinning.current = true;
      }
    }
  });
};
