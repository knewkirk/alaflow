import React from 'react';
import * as THREE from 'three';
import { SpotLight } from '@react-three/drei';
import { folder, useControls } from 'leva';
import { useState } from 'react';

export default () => {
  const spotLightProps = useControls(
    'right',
    {
      lights: folder(
        {
          color: { value: '#a3ffff' },
          attenuation: { value: 0.8, min: 0, max: 20 },
          distance: { value: 10, min: 0, max: 30 },
          angle: { value: 0.9, min: 0, max: Math.PI },
          penumbra: { value: 1.8, min: 0, max: Math.PI },
          anglePower: { value: 10, min: 0, max: 10 },
          intensity: { value: 0.7, min: 0, max: 3 },
        },
        { collapsed: true }
      ),
    },
    { collapsed: true }
  );

  const [target1] = useState(() => new THREE.Object3D());
  const [target2] = useState(() => new THREE.Object3D());

  return (
    <>
      <SpotLight
        position={[2.5, 2, 1.5]}
        target={target1}
        castShadow
        {...spotLightProps}
      />
      <primitive
        object={target1}
        position={[6, 0, 0]}
      />
      <SpotLight
        position={[2.5, 2, -1.5]}
        target={target2}
        {...spotLightProps}
      />
      <primitive
        object={target2}
        position={[6, 0, 0]}
      />
    </>
  );
};

/*
Tried to get logo shadows going, weird scaling issues and
get too blurry to look good, especially with the chroma effect

const Shadow = () => {
  const shadowProps = useControls('shadows', {
    distance: { value: 0.36, min: 0, max: 1 },
    alphaTest: { value: 0.1, min: 0, max: 1 },
    scale: { value: 1.2, min: 0, max: 5 },
    width: { value: 1024, min: 0, max: 5024 },
    height: { value: 1224, min: 0, max: 5024 },
  });
  const [tx, setTx] = useState(new THREE.Texture());
  const [mat, setMat] = useState(null);
  const logoTexture = useTexture('/logo-black-bg.png');

  const png = useLoader(THREE.TextureLoader, '/logo-black-bg.png');

  useEffect(() => {
    if (!png) {
      return;
    }
    png.wrapS = THREE.RepeatWrapping;
    png.wrapT = THREE.RepeatWrapping;
    png.repeat.set(6, 6);
    png.needsUpdate = true;
    const mat = new THREE.MeshStandardMaterial({ map: png });
    // setMat(mat);
    // setTx(png);
  }, [png]);

  return (
    <SpotLightShadow
      map={png}
      // map={png}
      {...shadowProps}
    />
  );
};
*/
