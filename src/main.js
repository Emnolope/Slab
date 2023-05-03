const AFRAME = require('aframe');
const { Text, preloadFont } = require('troika-three-text');
import {genesis, exodus, proverbs } from './uhh/bible';

console.log(proverbs);

AFRAME.registerComponent('rig-controls', {
  init() {
    const hyperspeed=10;
    this.speed = 5;
    const keyHandler = (e, d) => this.onKey(e, d);
    window.addEventListener('keydown', e => keyHandler(e, true));
    window.addEventListener('keyup', e => keyHandler(e, false));
  },
  remove() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  },
  onKey(event, isDown) {
    if (['q', 'Q'].includes(event.key)) this.moveDown = isDown;
    if (['e', 'E'].includes(event.key)) this.moveUp = isDown;
  },
  tick(time, delta) {
    const rig = document.querySelector('#rig');
    if (this.moveUp) rig.object3D.position.y += this.speed * delta / 1000;
    if (this.moveDown) rig.object3D.position.y -= this.speed * delta / 1000;
  }
});

// Preload the monospace font
preloadFont(
  {
    font: 'https://fonts.cdnfonts.com/s/16061/RobotoMono-Regular.woff',
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
  },
  () => {
    console.log('Font preloading complete');

    // Create a basic A-Frame scene
    const scene = document.createElement('a-scene');

    // Create the rig-controls entity
    const rigControls = document.createElement('a-entity');
    rigControls.setAttribute('id', 'rig');
    rigControls.setAttribute('rig-controls', '');

    // Create the camera and add it to the rig-controls entity
    const camera = document.createElement('a-camera');
    camera.setAttribute('id', 'camera');
    camera.setAttribute('camera', '');
    camera.setAttribute('look-controls', '');
    camera.setAttribute('wasd-controls', 'acceleration: 20');
    rigControls.appendChild(camera);

    // Add the rig-controls entity to the scene
    scene.appendChild(rigControls);

    // Create first Troika text entity
    const text1 = document.createElement('a-entity');
    text1.setAttribute('position', '0 0 -2');
    const textMesh1 = new Text();
    const object3D1 = new THREE.Object3D();

    textMesh1.text = proverbs;
    textMesh1.font = 'https://fonts.cdnfonts.com/s/16061/RobotoMono-Regular.woff'; // Set the loaded font to the Troika text
    textMesh1.fontSize = 0.2;
    textMesh1.color = new THREE.Color('#FF0000');

    // NATO codes
    const natoCodes = ['Alfa', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliett', 'Kilo', 'Lima', 'Mike', 'November', 'Oscar', 'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango', 'Uniform', 'Victor', 'Whiskey', 'X-ray', 'Yankee', 'Zulu'];

    // Assign unique NATO code to the A-Frame entity
    text1.setAttribute('nato-code', natoCodes[0]);

    // Wrap the sync operation in a Promise
    const syncTextMesh1 = new Promise((resolve) => {
      textMesh1.sync(() => {
        object3D1.add(textMesh1);
        text1.setObject3D('mesh', object3D1);
        resolve();
      });
    });

    // Wait for sync operation to complete
    syncTextMesh1.then(() => {
      // Add the text entity to the scene
      scene.appendChild(text1);

      // Add the scene to the DOM
      document.body.appendChild(scene);
    });
  },
);
