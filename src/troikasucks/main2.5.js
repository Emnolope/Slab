// Import A-Frame and troika-three-text
const AFRAME = require('aframe');
const { Text } = require('troika-three-text');

// Create a basic A-Frame scene
const scene = document.createElement('a-scene');

// Configure the text properties for both texts
const textProps = [
  {
    value: 'Hello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\n',
    position: '0 1 -2'
  },
  {
    value: 'Space Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\nSpace Goodbye!\n',
    position: '0 1 -2',
    rotation: '0 10 -20'
  }
];

// Function to combine geometries
function combineGeometries(geo1, geo2) {
  const geometry1 = geo1.clone();
  const geometry2 = geo2.clone();

  geometry2.translate(0, -geometry1.boundingBox.getSize(new THREE.Vector3()).y, 0);
  geometry1.merge(geometry2);

  return geometry1;
}

// Create Troika Text instances for both texts
const texts = textProps.map((props) => {
  const text = new Text();
  text.text = props.value;
  text.fontSize = 0.2;
  text.color = 0xff0000;
  return text;
});

// Function to handle the completion of rendering for both texts
function onTextsRendered(geometries) {
  // Combine the geometries
  const combinedGeometry = combineGeometries(geometries[0], geometries[1]);

  // Create a new mesh with the combined geometry
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const combinedMesh = new THREE.Mesh(combinedGeometry, material);

  // Create an A-Frame entity to hold the combined mesh
  const combinedEntity = document.createElement('a-entity');
  combinedEntity.setObject3D('mesh', combinedMesh);
  combinedEntity.setAttribute('position', '0 1 -2');
  scene.appendChild(combinedEntity);
}

// Render the texts and wait for their completion
let textsRendered = 0;
const textGeometries = [];

texts.forEach((text, indeax) => {
  text.sync(() => {
    textGeometries[index] = text.geometry;
    textsRendered++;

    if (textsRendered === texts.length) {
      onTextsRendered(textGeometries);
    }
  });
});

// Add the scene to the DOM
document.body.appendChild(scene);