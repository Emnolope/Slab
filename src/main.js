/* BUILD A FUCKING BIBLE APP YOU HEATHEN*/

import AFRAME from 'aframe';
import 'aframe-locomotion';
import { Text, preloadFont } from 'troika-three-text';
import { genesis, exodus, proverbs } from './uhh/bible';
import CryptoJS from 'crypto-js';
const myfont = 'https://raw.githubusercontent.com/IBM/plex/master/IBM-Plex-Mono/fonts/complete/woff/IBMPlexMono-Light.woff';//IBMPlexMono-Light.woff

//console.log(proverbs);

AFRAME.registerComponent('rig-controls', {
  init() {
    const hyperspeed = 40;
    this.speed = 5;
    const keyHandler = (e, d) => this.onKey(e, d);
    const buttonHandler = (e, d, ud) => this.onButton(e, d, ud);
    window.addEventListener('keydown', e => keyHandler(e, true));
    window.addEventListener('keyup', e => keyHandler(e, false));
    this.el.addEventListener('bbuttondown', e => buttonHandler(e, true, false));
    this.el.addEventListener('bbuttonup', e => buttonHandler(e, false, false));
    this.el.addEventListener('abuttondown', e => buttonHandler(e, false, true));
    this.el.addEventListener('abuttonup', e => buttonHandler(e, false, false));
  },
  remove() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    this.el.removeEventListener('bbuttondown', this.onBButtonDown);
    this.el.removeEventListener('bbuttonup', this.onBButtonUp);
    this.el.removeEventListener('abuttondown', this.onAButtonDown);
    this.el.removeEventListener('abuttonup', this.onAButtonUp);
  },
  onButton(event, isDown, isUp) {
    if (event.type.startsWith('b')) this.moveDown = isDown;
    if (event.type.startsWith('a')) this.moveUp = isUp;
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

async function preloadFontAsync(options) {
  return new Promise((resolve) => {
    preloadFont(options, () => {
      console.log('Font preloading complete');
      resolve();
    });
  });
}

async function gettext(note, password) {
  const url = `https://api.allorigins.win/raw?url=`+`https://www.protectedtext.com/${note}?action=getJSON`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (response.ok) {
    const data = await response.json();
    const e_orig_content = data["eContent"];
    const text = CryptoJS.AES.decrypt(e_orig_content, password).toString(CryptoJS.enc.Utf8);
    console.log(text);
    return text;
  } else {
    console.error(`Error fetching data: ${response.status} - ${response.statusText}`);
    return 'ERROR';
  }
}

async function createTextAsync(textMesh) {
  return new Promise((resolve) => {
    textMesh.sync(() => {
      resolve();
    });
  });
}

// async function for initializing the scene
async function initScene() {
  await preloadFontAsync({
    //font: 'https://fonts.cdnfonts.com/s/16061/RobotoMono-Regular.woff',
    font: myfont,
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz 0123456789!@#$%^&*()~`_-+={[}]|:;"\'<,>.?/',
    sdfGlyphSize: 8,
  });

  // Fetch the text from the internet
  const urlParams = new URLSearchParams(window.location.search);
  let [oParam,tParam] = [urlParams.get('o'), urlParams.get('t')];
  [oParam, tParam] = oParam && tParam ? [oParam, tParam] : ["uhhidk", "password1234"];
  const text = await gettext(oParam, tParam);

  // Create a basic A-Frame scene
  const scene = document.createElement('a-scene');
  scene.setAttribute('background', 'color: black');

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

  // Create Oculus Touch controllers and add them to the rig-controls entity
  const leftController = document.createElement('a-entity');
  leftController.setAttribute('oculus-touch-controls','hand: left');
  leftController.setAttribute('smooth-locomotion', 'target: #rig; reference: #camera');
  rigControls.appendChild(leftController);
  
  let hyperSpeed = false;
  const speed = 5;
  function updateMoveSpeed() {
    leftController.setAttribute('smooth-locomotion', `target: #rig; reference: #camera; moveSpeed: ${speed * (hyperSpeed ? 25 : 1)}`);
  } updateMoveSpeed();
  leftController.addEventListener('gripdown', e => {
    hyperSpeed = true;
    updateMoveSpeed();
  });
  leftController.addEventListener('gripup', e => {
    hyperSpeed = false;
    updateMoveSpeed();
  });

  const rotationStep = 5; 
  leftController.addEventListener('xbuttondown', e => {
    const userPosition = leftController.getAttribute('position');
    const closestPanel = findClosestTextPanel(userPosition);
  
    if (closestPanel) {
      const currentRotation = closestPanel.getAttribute('rotation');
      closestPanel.setAttribute('rotation', `${currentRotation.x + rotationStep} ${currentRotation.y} ${currentRotation.z}`);
    }
  });
  
  leftController.addEventListener('ybuttondown', e => {
    const userPosition = leftController.getAttribute('position');
    const closestPanel = findClosestTextPanel(userPosition);
  
    if (closestPanel) {
      const currentRotation = closestPanel.getAttribute('rotation');
      closestPanel.setAttribute('rotation', `${currentRotation.x - rotationStep} ${currentRotation.y} ${currentRotation.z}`);
    }
  });
  function findClosestTextPanel(userPosition) {
    let closestPanel = null;
    let minDistance = Infinity;

    const worldUserPosition = new THREE.Vector3();
    leftController.object3D.getWorldPosition(worldUserPosition);

    for (const panel of document.querySelectorAll('.text-panel')) {
      const worldPanelPosition = new THREE.Vector3();
      panel.object3D.getWorldPosition(worldPanelPosition);

      const distance = distance3D(worldUserPosition, worldPanelPosition);
     
      if (distance < minDistance) {
        minDistance = distance;
        closestPanel = panel;
      }
    }
  
    return closestPanel;
  }
  function distance3D(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
  }

  // Add event listeners for Shift key press and release
  window.addEventListener('keydown', e => {
    if (e.key === 'Shift') {
      hyperSpeed = true;
      updateMoveSpeed();
    }
  });
  window.addEventListener('keyup', e => {
    if (e.key === 'Shift') {
      hyperSpeed = false;
      updateMoveSpeed();
    }
  });

  const rightController = document.createElement('a-entity');
  rightController.setAttribute('oculus-touch-controls', 'hand: right');
  rightController.setAttribute('snap-turn', 'target: #rig; reference: #camera');
  rigControls.appendChild(rightController);

  // Add the rig-controls entity to the scene
  scene.appendChild(rigControls);

  // Function to split the text into sections
  const splitText = (text, maxSectionLength) => {
    const lines = text.split('\n');
    const sections = [];
    let currentSection = '';
    lines.forEach(line => {
    if (currentSection.length + line.length + 1 <= maxSectionLength) {
      currentSection += line + '\n';
      } else {
        sections.push(currentSection);
        currentSection = line + '\n';
      }
    });
    if (currentSection !== '') {
      sections.push(currentSection);
    }
    return sections;
  };
  
  // Split the fetched text into sections
  const maxSectionLength = 5000; // or 19000
  const sections = splitText(text, maxSectionLength);
  const boxWidth = 26;

  for (const [index, section] of sections.entries()) {
    const textEntity = document.createElement('a-entity');
    textEntity.setAttribute('position', `${index * boxWidth} 0 -2`);
    textEntity.setAttribute('rotation', '0 0 0');
    textEntity.classList.add('text-panel');
    const textMesh = new Text();
    const object3D = new THREE.Object3D();

    textMesh.text = section;
    //textMesh.font = 'https://fonts.cdnfonts.com/s/16061/RobotoMono-Regular.woff';
    textMesh.font = myfont;
    textMesh.fontSize = 0.2;
    textMesh.color = new THREE.Color('#FFFFFF');
    textMesh.maxWidth = 16;
    textMesh.overflowWrap='break-word';

    await createTextAsync(textMesh);

    object3D.add(textMesh);
    textEntity.setObject3D('mesh', object3D);
    scene.appendChild(textEntity);
  }
  
  document.body.appendChild(scene);
}

initScene(); // Call the async initScene function