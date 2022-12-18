const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.z = 5;

console.log(camera);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const cubes = [];
for (let i = 0; i < 20; i++) {
  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(Math.random(), Math.random(), Math.random()),
  });
  const cube = new THREE.Mesh(geometry, material);
  cube.wireframe = true;

  cube.position.x = Math.random() * 4;
  cube.position.y = Math.random() * 5;
  cube.position.z = Math.random() * 4;

  cube.scale.x = Math.random();
  cube.scale.y = Math.random();
  cube.scale.z = Math.random();
  cubes.push(cube);
}

cubes.forEach((cube) => {
  scene.add(cube);
});

function animate() {
  requestAnimationFrame(animate);
  cubes.forEach((cube) => {
    // cube.scale.x = Math.random() * 1;
    // cube.scale.y = Math.random() * 3;
    // cube.scale.z = Math.random() * 2;
    cube.color = new THREE.Color(Math.random(), Math.random(), Math.random());
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    cube.rotation.z += 0.1;
  });
  renderer.render(scene, camera);
}

animate();
