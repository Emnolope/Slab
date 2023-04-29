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

// Add the text entity to the scene
scene.appendChild(text1);
scene.appendChild(text2);

// Add the scene to the DOM
document.body.appendChild(scene);