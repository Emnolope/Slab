import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import ThreeMeshUI from 'three-mesh-ui/src/three-mesh-ui.js';
import FontJSON from 'three-mesh-ui/examples/assets/Roboto-msdf.json';
import FontImage from 'three-mesh-ui/examples/assets/Roboto-msdf.png';

const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
let scene, camera, renderer, controls;
window.addEventListener( 'load', init );
window.addEventListener( 'resize', onWindowResize );

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x505050 );
  camera = new THREE.PerspectiveCamera( 60, WIDTH / HEIGHT, 0.1, 100 );
  renderer = new THREE.WebGLRenderer( {
    antialias: true
  } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( WIDTH, HEIGHT );
  renderer.xr.enabled = true;
  document.body.appendChild( VRButton.createButton( renderer ) );
  document.body.appendChild( renderer.domElement );
  controls = new OrbitControls( camera, renderer.domElement );
  camera.position.set( 0, 1.6, 0 );
  controls.target = new THREE.Vector3( 0, 1, -1.8 );
  controls.update();
  // ROOM
  const room = new THREE.LineSegments(
    new BoxLineGeometry( 6, 6, 6, 10, 10, 10 ).translate( 0, 3, 0 ),
    new THREE.LineBasicMaterial( { color: 0x808080 } )
  );
  scene.add( room );
  // TEXT PANEL
  makeTextPanel(64);
  //
  renderer.setAnimationLoop( loop );
}

// TEXT PANEL
function makeTextPanel(n) { // Added: n parameter for the number of text boxes
  for (let i = 0; i < n; i++) { // Added: Loop for creating n text boxes
    const container = new ThreeMeshUI.Block({
      width: 3,
      height: 0.5,
      padding: 0.05,
      justifyContent: 'center',
      textAlign: 'left',
      fontFamily: FontJSON,
      fontTexture: FontImage,
    });

    // Modified: Set random position and rotation for the text box
    container.position.set(
      Math.random() * 4 - 2,
      Math.random() * 4,
      Math.random() * -4 - 1
    );
    container.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );

    scene.add(container);

    container.add(
      new ThreeMeshUI.Text({
        content: 'This library supports line break friendly characters '.repeat(100),
        fontSize: 0.055,
      })
    );
  }
}
// handles resizing the renderer when the viewport is resized
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function loop() {
  // Don't forget, ThreeMeshUI must be updated manually.
  // This has been introduced in version 3.0.0 in order
  // to improve performance
  ThreeMeshUI.update();
  controls.update();
  renderer.render( scene, camera );
}