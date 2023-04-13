import * as THREE from 'three';

import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ReflectorForSSRPass } from 'three/examples/jsm/objects/ReflectorForSSRPass.js';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass.js';
import { mergeBufferGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils';

export default class Three {
  container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  renderWordmark = async () => {
    const svgGroup = new THREE.Group();
    const loader = new SVGLoader();
    const svg = await loader.loadAsync('/wordmark.svg');
    const material = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      roughness: 0.6,
      metalness: 1,
    });
    const SCALE = 0.0001;
    const OFFSET_X = 0;
    const OFFSET_Y = 0.03;

    svg.paths.forEach((path, i) => {
      const shapes = path.toShapes(false);
      shapes.forEach((shape, j) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 100,
          bevelEnabled: false,
        });
        const mesh = new THREE.Mesh(geometry, material);
        svgGroup.add(mesh);
      });
    });

    svgGroup.rotation.z = Math.PI;
    svgGroup.rotation.y = Math.PI;
    svgGroup.scale.set(SCALE, SCALE, SCALE);

    var box = new THREE.Box3().setFromObject(svgGroup);
    var center = box.getCenter(new THREE.Vector3());
    svgGroup.position.x = -center.x - OFFSET_X;
    svgGroup.position.y = -center.y + OFFSET_Y;
    svgGroup.position.z = 0;
    return svgGroup;
  };

  renderLogo = async () => {
    const loader = new SVGLoader();
    const svg = await loader.loadAsync('/logo.svg');
    const material = new THREE.MeshPhongMaterial({
      color: 0x222222,
    });
    const SCALE = 0.00008;
    const WPADDING = 0.007;
    const HPADDING = 0.0035;

    let svgGeo: THREE.ExtrudeGeometry;
    svg.paths.forEach((path, i, len) => {
      const shapes = path.toShapes(false);
      shapes.forEach((shape, j, len1) => {
        if (j >= 1) {
          return;
        }
        svgGeo = new THREE.ExtrudeGeometry(shape, {
          depth: 10,
          bevelEnabled: false,
        });
      });
    });

    if (!svgGeo) {
      return;
    }

    svgGeo.scale(SCALE, SCALE, SCALE);
    svgGeo.computeBoundingBox();
    const box = svgGeo.boundingBox;
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    svgGeo.translate(-center.x, -center.y, 0);
    svgGeo.rotateZ(Math.PI);
    svgGeo.center();
    const width = size.x;
    const height = size.y;

    const toMerge = [svgGeo];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const svgCopy = svgGeo.clone();
        if ((i + j) % 2 === 1) {
          svgCopy.rotateZ(Math.PI / 3);
        }
        svgCopy.center();
        svgCopy.translate(
          i * (width / 2 + WPADDING),
          j * (height + HPADDING),
          0
        );
        toMerge.push(svgCopy);
      }
    }

    const bufferGeo = mergeBufferGeometries(toMerge);
    bufferGeo.center();
    bufferGeo.translate(0, 0.2, -0.1);
    const mesh = new THREE.Mesh(bufferGeo, material);

    return mesh;
  };

  init = async () => {
    let composer: any;
    let ssrPass: any;
    const gui = new GUI();
    let controls: any;
    let camera: THREE.Camera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let groundReflector: any;
    const selects: any = [];

    camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      15
    );
    camera.position.set(0, 0.2, 1.3);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.Fog(0x030303, 1, 4);

    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 80),
      new THREE.MeshPhongMaterial({
        color: 0x111111,
        specular: 0x101010,
        opacity: 0.3,
      })
    );
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.0001;
    plane.receiveShadow = true;
    plane.castShadow = false;
    scene.add(plane);

    const hemiLight = new THREE.HemisphereLight(0xaaaaaa, 0x111111);
    hemiLight.intensity = 0.3;
    scene.add(hemiLight);

    const spotLight = new THREE.SpotLight();
    spotLight.penumbra = 0.5;
    spotLight.position.set(-0.1, 0.2, 0.1);
    spotLight.lookAt(0, 0, 0);
    spotLight.intensity = 5;
    spotLight.castShadow = true;
    scene.add(spotLight);

    const wordMesh = await this.renderWordmark();
    wordMesh.castShadow = true;
    scene.add(wordMesh);

    wordMesh.traverse((m) => {
      selects.push(m);
    });

    const logo = await this.renderLogo();
    logo.castShadow = true;
    scene.add(logo);
    logo.traverse((m) => selects.push(m));
    selects.push(logo);

    const reflectorGeometry = new THREE.PlaneGeometry(10, 10);
    groundReflector = new ReflectorForSSRPass(reflectorGeometry, {
      clipBias: 0.0003,
      textureWidth: window.innerWidth,
      textureHeight: window.innerHeight,
      color: 0x888888,
      useDepthTexture: true,
    });
    groundReflector.material.depthWrite = false;
    groundReflector.rotation.x = -Math.PI / 2;
    groundReflector.visible = false;
    groundReflector.distanceAttenuation = false;
    groundReflector.receiveShadow = true;
    scene.add(groundReflector);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    this.container.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.0635, 0);
    controls.update();

    composer = new EffectComposer(renderer);
    ssrPass = new SSRPass({
      renderer,
      scene,
      camera,
      width: innerWidth,
      height: innerHeight,
      groundReflector,
      selects,
    });

    composer.addPass(ssrPass);
    // TODO: figure out why > light gradient posterizing/banding
    // composer.addPass(new ShaderPass(GammaCorrectionShader));

    gui.add(ssrPass, 'enabled');

    ssrPass.opacity = 0.03;
    groundReflector.opacity = ssrPass.opacity;
    gui
      .add(ssrPass, 'opacity')
      .min(0)
      .max(0.1)
      .step(0.0001)
      .onChange(() => {
        groundReflector.opacity = ssrPass.opacity;
      });
    if (PRODUCTION) {
      gui.hide();
    }

    renderer.setAnimationLoop(() => {
      composer.render();
    });
  };
}
