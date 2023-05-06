// merge buffer geometery demo

import * as THREE from 'three';
import * as BufferGeometryUtils from 'threeBufferGeometryUtils.js';

// Create a WebGLRenderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a scene
const scene = new THREE.Scene();

// Create a camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create geometries for a sphere, a box, and a torus
const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const torusGeometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);

// Position the geometries
sphereGeometry.translate(-2, 0, 0);
boxGeometry.translate(0, 0, 0);
torusGeometry.translate(2, 0, 0);

// Merge the geometries
const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries([
  sphereGeometry,
  boxGeometry,
  torusGeometry
]);

// Create a material
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });

const sphereMesh = new THREE.Mesh(sphereGeometry, material);
const boxMesh = new THREE.Mesh(boxGeometry, material);
const torusMesh = new THREE.Mesh(torusGeometry, material);
//scene.add(sphereMesh);
//scene.add(boxMesh);
//scene.add(torusMesh);

// Create a mesh with the merged geometry and material
const mergedMesh = new THREE.Mesh(mergedGeometry, material);

// Add the mesh to the scene
scene.add(mergedMesh);

// Create the animation loop
const animate = function () {
  requestAnimationFrame(animate);

  // Rotate the mesh
  mergedMesh.rotation.x += 0.01;
  mergedMesh.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

// Start the animation loop
animate();
