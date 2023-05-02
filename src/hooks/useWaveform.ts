import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useRef } from 'react';

interface Params {
  period?: number;
  offset?: number;
  amplitude?: number;
  enabled?: boolean;
  peakiness?: number;
  once?: boolean;
}

// finish loading everything first
const WAIT = 3;

/**
 * Oscillate between 0 and params.amplitude, starting at 0
 * @params
 * @params.period - How long the animation takes for one loop
 * @params.amplitude - How high?
 * @params.offset - The positive distance from t=0 where y=0
 * @params.peakiness - How "peaky" the graph is
 *  (automatically raises to an even power and adjusts amp & freq)
 * @params.enabled - Self explanatory
 * @params.once - only run one time to the peak. don't wanna get irritating
 */
export default (
  {
    peakiness = 0,
    amplitude = 1,
    period = 10,
    offset = 0,
    enabled = true,
    once,
  }: Params,
  callback: (y: number) => void
) => {
  const args = useControls(
    'animation',
    {
      pause: false,
      forceOn: false,
      forceOff: false,
    },
    { collapsed: true }
  );

  const last = useRef(0);
  const didReachPeak = useRef(false);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() - WAIT;
    if (args.forceOn || (once && didReachPeak.current)) {
      callback(amplitude);
      return;
    }
    if (args.forceOff || t < 0) {
      callback(0);
      return;
    }

    if (!enabled || t < offset || args.pause) {
      callback(last.current);
      return;
    }
    const x = t - offset;
    let a, f, y;
    if (peakiness) {
      a = amplitude;
      f = Math.PI / period;
      y = a * Math.pow(Math.sin(x * f), peakiness * 2);
    } else {
      a = amplitude / 2;
      f = (2 * Math.PI) / period;
      y = a + a * Math.sin(x * f - Math.PI / 2);
    }
    last.current = y;
    callback(y);
    if (Math.abs(y - amplitude) < 0.000001) {
      didReachPeak.current = true;
    }
  });
};
