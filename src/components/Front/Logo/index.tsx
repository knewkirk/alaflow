import React, { useRef, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { useTimer } from 'use-timer';

import * as c from './constants';
import useGeometry from './useGeometry';
import useWaveform from '@hooks/useWaveform';

const tempObj1 = new THREE.Object3D();
const tempObj2 = new THREE.Object3D();

export default () => {
  const svg = useLoader(SVGLoader, '/logo.svg');
  const { geometry, width, height, tGeo } = useGeometry(svg);

  const isSpinning = useRef(false);
  const clickedIdx = useRef(-1);
  const currSpinAmt = useRef(0);
  const timer = useTimer();

  const logoMesh = useRef<THREE.InstancedMesh>();
  const clickTgtMesh = useRef<THREE.InstancedMesh>();
  const matRef = useRef<THREE.MeshPhongMaterial>();
  const [didLoad, setDidLoad] = useState(false);

  useWaveform({ amplitude: 1.7 }, (y) => {
    matRef.current.emissiveIntensity = y;
  });

  useFrame(() => {
    if (
      !logoMesh.current ||
      !geometry ||
      !matRef.current ||
      !clickTgtMesh.current
    ) {
      return;
    }

    if (timer.status === 'STOPPED' && !isSpinning.current) {
      timer.start();
    }

    if (timer.status === 'RUNNING' && !isSpinning.current) {
      if (timer.time > 5) {
        timer.pause();
        const rand1 = 1 + Math.trunc(Math.random() * (c.NUM_COLS - 1));
        const rand2 = 1 + Math.trunc(Math.random() * (c.NUM_ROWS - 1));
        clickedIdx.current = rand1 * rand2;
        isSpinning.current = true;
      }
    }

    if (timer.status === 'PAUSED' && isSpinning.current) {
      currSpinAmt.current += 0.3;
      if (currSpinAmt.current >= 2 * Math.PI) {
        currSpinAmt.current = 0;
        isSpinning.current = false;
        timer.reset();
        timer.start();
      }
    }

    let i = 0;
    for (let x = 0; x < c.NUM_COLS; x++) {
      for (let y = 0; y < c.NUM_ROWS; y++) {
        const id = i++;
        const isOdd = (x + y) % 2;
        tempObj1.rotation.set(isOdd ? 0 : Math.PI, 0, 0);
        tempObj1.rotation.y =
          id === clickedIdx.current ? currSpinAmt.current : 0;
        tempObj1.position.set(x * width * 0.66, y * height * 1.1, 0);
        tempObj1.updateMatrix();
        logoMesh.current.setMatrixAt(id, tempObj1.matrix);

        tempObj2.rotation.set(0, 0, !isOdd ? 0 : Math.PI / 3);
        tempObj2.position.set(x * width * 0.64, y * height + 0.2, 0);
        tempObj2.updateMatrix();
        clickTgtMesh.current.setMatrixAt(id, tempObj2.matrix);
      }
    }
    logoMesh.current.instanceMatrix.needsUpdate = true;
    logoMesh.current.onAfterRender = () => {
      setDidLoad(true);
    };

    clickTgtMesh.current.instanceMatrix.needsUpdate = true;

    if (!isSpinning.current) {
      clickedIdx.current = -1;
    }
  });

  return (
    <group
      position={[-1.45, 0.2, -6.5]}
      onClick={(e) => {
        clickedIdx.current = e.instanceId;
        isSpinning.current = true;
        timer.pause();
      }}
    >
      <instancedMesh
        ref={logoMesh}
        args={[
          geometry,
          null,
          c.NUM_COLS * c.NUM_ROWS,
        ]}
      >
        <meshPhongMaterial
          color={'#004843'}
          emissive={'#64ffff'}
          emissiveIntensity={0}
          toneMapped={false}
          transparent
          opacity={didLoad ? 1 : 0}
          ref={matRef}
        />
      </instancedMesh>

      <instancedMesh
        args={[tGeo, null, c.NUM_COLS * c.NUM_ROWS]}
        ref={clickTgtMesh}
      >
        <meshBasicMaterial
          color="red"
          opacity={0}
          transparent
        />
      </instancedMesh>
    </group>
  );
};
/*


      <meshBasicMaterial color={"#ffaa33"} opacity={1} transparent/>
*/
