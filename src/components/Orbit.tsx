import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { useControls } from 'leva';

const POLAR_ANGLE_JUST_GT_HORIZ = (6 * Math.PI) / 11;

export default () => {
  const { reverseOrbit, lookAtRight, lookAtLeft, lookAtBack } = useControls(
    'camera',
    {
      reverseOrbit: true,
      lookAtRight: false,
      lookAtLeft: false,
      lookAtBack: false,
    },
    { collapsed: true }
  );

  const [minAngle, setMinAngle] = useState(POLAR_ANGLE_JUST_GT_HORIZ);
  const [target, setTarget] = useState(new THREE.Vector3(0, 0.5, 0));

  useEffect(() => {
    let x = 0;
    let y = 0.5;
    let z = 0;
    if (reverseOrbit) {
      setMinAngle(POLAR_ANGLE_JUST_GT_HORIZ);
      y = 0.501;
      if (lookAtRight) {
        x = 0.01;
      } else if (lookAtLeft) {
        x = -0.01;
      } else if (lookAtBack) {
        z = 0.01;
      } else {
        z = -0.01;
      }
    } else {
      setMinAngle(0);
      if (lookAtRight) {
        x = 6;
      } else if (lookAtLeft) {
        x = -6;
      } else if (lookAtBack) {
        z = 6;
      } else {
        z = -6;
      }
    }
    setTarget(new THREE.Vector3(x, y, z));
  }, [reverseOrbit, lookAtRight, lookAtLeft]);

  return (
    <OrbitControls
      target={target}
      reverseOrbit={reverseOrbit}
      dampingFactor={0.1}
      minPolarAngle={minAngle}
    />
  );
};
