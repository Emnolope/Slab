const AFRAME = require('aframe');
const { Text } = require('troika-three-text');

AFRAME.registerComponent('troika-text', {
    schema: {
      value: { type: 'string', default: '' },
      fontSize: { type: 'number', default: 0.2 },
      color: { type: 'string', default: '#FFFFFF' },
    },
  
    init: function () {
      this.textMesh = new Text();
      this.el.setObject3D('mesh', this.textMesh);
    },
  
    update: function (oldData) {
      const data = this.data;
  
      if (data.value !== oldData.value) {
        this.textMesh.text = data.value;
      }
  
      if (data.fontSize !== oldData.fontSize) {
        this.textMesh.fontSize = data.fontSize;
      }
  
      if (data.color !== oldData.color) {
        this.textMesh.color = new THREE.Color(data.color);
      }
  
      this.textMesh.sync();
    },
  });

// Create a basic A-Frame scene
const scene = document.createElement('a-scene');

// Create Troika text entity
const text1 = document.createElement('a-entity');
text1.setAttribute('troika-text', {
  value: 'Hello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\nHello, World!\n',
  fontSize: 0.2,
  color: '#FF0000',
});
text1.setAttribute('position', '0 1 -2');

// Create Troika text entity
const text2 = document.createElement('a-entity');
text2.setAttribute('troika-text', {
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
