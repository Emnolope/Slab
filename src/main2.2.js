const AFRAME = require('aframe');
const { Text } = require('troika-three-text');

function createTroikaTextEntity(options) {
  const entity = document.createElement('a-entity');
  const textMesh = new Text();
  const object3D = new THREE.Object3D();

  textMesh.text = options.value || '';
  textMesh.fontSize = options.fontSize || 0.2;
  textMesh.color = new THREE.Color(options.color || '#FFFFFF');

  textMesh.sync(() => {
    object3D.add(textMesh);
    entity.setObject3D('mesh', object3D);
  });

  return entity;
}

// Create a basic A-Frame scene
const scene = document.createElement('a-scene');

// Create Troika text entity
const text1 = createTroikaTextEntity({
  value: 'Hello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\n',
  fontSize: 0.2,
  color: '#FF0000',
});
text1.setAttribute('position', '0 1 -2');

// Create Troika text entity
const text2 = createTroikaTextEntity({
  value: 'Space Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\n',
  fontSize: 0.2,
  color: '#FF0000',
});
text2.setAttribute('position', '0 1 -2');
text2.setAttribute('rotation', '0 10 -20');

// Add the text entities to the scene
scene.appendChild(text1);
scene.appendChild(text2);

// Add the scene to the DOM
document.body.appendChild(scene);
