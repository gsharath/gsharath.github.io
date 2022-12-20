// in local
// import * as THREE from "../../three.js";
// import { GLTFLoader } from "../../GLTFLoader.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const loader = new GLTFLoader();
loader.setPath("/prem_sai_vittal/using-gltf/gltf/");
camera.position.z = 3;

loader.load("second-gltf.glb", function (gltf) {
  gltf.scene.scale.set(10, 10, 10);
  scene.add(gltf.scene);
  console.log(gltf);
});

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xffffff);

renderer.render(scene, camera); // last
