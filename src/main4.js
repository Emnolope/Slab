const AFRAME = require('aframe');
const { Text } = require('troika-three-text');
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

// Create a basic A-Frame scene
const scene = document.createElement('a-scene');

// Create first Troika text entity
const text1 = document.createElement('a-entity');
const textMesh1 = new Text();
const object3D1 = new THREE.Object3D();

textMesh1.text = 'Hello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\n';
textMesh1.fontSize = 0.2;
textMesh1.color = new THREE.Color('#FF0000');

// Create second Troika text entity
const text2 = document.createElement('a-entity');
const textMesh2 = new Text();
const object3D2 = new THREE.Object3D();

textMesh2.text = 'Space Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\n';
textMesh2.fontSize = 0.2;
textMesh2.color = new THREE.Color('#FF0000');

// Wrap the sync operation in a Promise
const syncTextMesh1 = new Promise((resolve) => {
  textMesh1.sync(() => {
    object3D1.add(textMesh1);
    text1.setObject3D('mesh', object3D1);
    resolve();
  });
});

const syncTextMesh2 = new Promise((resolve) => {
  textMesh2.sync(() => {
    object3D2.add(textMesh2);
    text2.setObject3D('mesh', object3D2);
    resolve();
  });
});

// Wait for both sync operations to complete
Promise.all([syncTextMesh1, syncTextMesh2]).then(() => {
  const geometry1 = textMesh1.geometry;
  const geometry2 = textMesh2.geometry;

  const mergedGeometry = BufferGeometryUtils.mergeGeometries([geometry1, geometry2]);

  const mergedMaterial = textMesh1.material;
  const mergedMesh = new THREE.Mesh(mergedGeometry, mergedMaterial);

  const mergedEntity = document.createElement('a-entity');
  mergedEntity.setObject3D('mesh', mergedMesh);
  mergedEntity.setAttribute('position', '0 1 -2');

  scene.appendChild(mergedEntity);

  // Add the text entities to the scene
  scene.appendChild(text1);
  scene.appendChild(text2);

  // Add the scene to the DOM
  document.body.appendChild(scene);
});