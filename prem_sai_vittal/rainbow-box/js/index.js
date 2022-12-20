// import * as THREE from "../../three.js";
// <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" integrity="sha512-dLxUelApnYxpLt6K2iomGngnHO83iUvZytA3YjDUCjT0HDOHKXnVYdf3hU4JjM8uEhxf9nD1/ey98U3t2vZ0qQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 3;

const box = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  color: new THREE.Color(0.5, 0.5, 0.4),
});
const mesh = new THREE.Mesh(box, material);
console.log(mesh);
scene.add(mesh);

function rotate() {
  requestAnimationFrame(rotate);
  mesh.rotation.x += 0.05;
  mesh.rotation.y += 0.05;
  mesh.rotation.z += 0.05;

  mesh.material.color = new THREE.Color(
    Math.random(),
    Math.random(),
    Math.random()
  );
  renderer.render(scene, camera);
}

rotate();

// renderer.render(scene, camera);
