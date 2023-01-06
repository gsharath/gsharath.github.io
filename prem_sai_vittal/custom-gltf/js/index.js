// in local
// import * as THREE from "../../three.js";
// import { GLTFLoader } from "../../GLTFLoader.js";
// import { OrbitControls } from "../../OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(
  80,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const loader = new GLTFLoader();
scene.add(new THREE.AxesHelper(20));

const light = new THREE.DirectionalLight(0xffffff);

loader.setPath("/prem_sai_vittal/custom-gltf/");

loader.load("second.glb", function (gltf) {
  scene.add(gltf.scene);
  console.log(gltf.scene.children[0]);
  animate();
});
scene.add(light);
camera.position.set(-2, 92, 174);
// light.position.set(-2, 92, 174);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
  renderer.render(scene, camera);
  light.position.x += 0.1;
  light.position.y += 0.1;
  light.position.z += 0.1;
  controls.update();

  requestAnimationFrame(animate);
}
