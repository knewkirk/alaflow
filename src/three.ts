import * as THREE from 'three';

export default class Three {
  container: HTMLElement;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  scene: THREE.Scene;

  constructor(container: HTMLElement) {
    // this.init(container);
    this.container = container;
  }

  init = () => {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);

    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    this.camera.position.x = 0;
    this.camera.position.y = -10;
    this.camera.position.z = 380;
    this.camera.lookAt(0, 0, 0);

    this.scene = new THREE.Scene();
    this.scene.matrixWorldAutoUpdate = true;
    this.scene.add(this.camera);

    this.container.appendChild(this.renderer.domElement);

    const geo = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshBasicMaterial({ color: 0x00aaff });
    const mesh = new THREE.Mesh(geo, material);
    this.scene.add(mesh);

    const light = new THREE.SpotLight();
    this.scene.add(light);

    this.renderer.render(this.scene, this.camera);
  };
}
