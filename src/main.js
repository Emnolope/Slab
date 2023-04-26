// Import A-Frame and aframe-troika-text
require('aframe');
require('aframe-troika-text');

// Create a basic A-Frame scene
const scene = document.createElement('a-scene');

// Create Troika text entity
const text1 = document.createElement('a-entity');
text1.setAttribute('troika-text', {
  value: 'Hello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\n',
  fontSize: 0.2,
  color: '#FF0000'
});
text1.setAttribute('position', '0 1 -2');
// Create Troika text entity
const text2 = document.createElement('a-entity');
text2.setAttribute('troika-text', {
  value: 'Space Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\n',
  fontSize: 0.2,
  color: '#FF0000'
});
text2.setAttribute('position', '0 1 -2');
text2.setAttribute('rotation', '0 10 -20');

// Function to combine geometries
function combineGeometries(geo1, geo2) {
  const geometry1 = geo1.clone();
  const geometry2 = geo2.clone();

  geometry2.translate(0, -geometry1.boundingBox.getSize(new THREE.Vector3()).y, 0);
  geometry1.merge(geometry2);

  return geometry1;
}

// Wait for both texts to be rendered
let textsRendered = 0;
[text1, text2].forEach((text) => {
  text.addEventListener('troika-text-rendered', () => {
    textsRendered++;
    if (textsRendered === 2) {
      // Retrieve the geometries from both text entities
      const geo1 = text1.getObject3D('mesh').geometry;
      const geo2 = text2.getObject3D('mesh').geometry;

      // Combine the geometries
      const combinedGeometry = combineGeometries(geo1, geo2);

      // Create a new mesh with the combined geometry
      const combinedMesh = new THREE.Mesh(combinedGeometry, text1.getObject3D('mesh').material);

      // Create an A-Frame entity to hold the combined mesh
      const combinedEntity = document.createElement('a-entity');
      combinedEntity.setObject3D('mesh', combinedMesh);
      combinedEntity.setAttribute('position', '0 1 -2');
      scene.appendChild(combinedEntity);

      // Remove the original text entities
      text1.parentNode.removeChild(text1);
      text2.parentNode.removeChild(text2);
    }
  });
});

// Add the text entities to the scene
scene.appendChild(text1);
scene.appendChild(text2);

// Add the scene to the DOM
document.body.appendChild(scene);