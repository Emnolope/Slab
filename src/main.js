// src/main.js

// Import dependencies from 'test-3d.js'
global.THREE = require('three');
var createText = require('three-bmfont-text');
var MSDFShader = require('./msdf');
var loadFont = require('load-bmfont');

// Custom A-Frame component that wraps 'test-3d.js'
AFRAME.registerComponent('text-3d', {
  init: function() {
    // Load font function from 'test-3d.js'
    function load(opt, cb) {
      loadFont(opt.font, function(err, font) {
        if (err) throw err
        const textureLoader = new THREE.TextureLoader();
        textureLoader.load(opt.image, function(tex) {
          cb(font, tex);
        });
      })
    }
    // Start function from 'test-3d.js'
    function start(font, texture) {
      var app = createOrbitViewer({
        clearColor: 'rgb(40, 40, 40)',
        clearAlpha: 1.0,
        fov: 55,
        position: new THREE.Vector3(0, 0, -2)
      })
      var maxAni = app.renderer.getMaxAnisotropy()

      // setup our texture with some nice mipmapping etc
      texture.needsUpdate = true
      texture.minFilter = THREE.LinearMipMapLinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.generateMipmaps = true
      texture.anisotropy = maxAni

      var copy = getCopy()

      // create our text geometry
      var geom = createText({
        text: copy, // the string to render
        font: font, // the bitmap font definition
        width: 1000 // optional width for word-wrap
      })

      // here we use 'three-bmfont-text/shaders/msdf'
      // to help us build a shader material
      var material = new THREE.RawShaderMaterial(MSDFShader({
        map: texture,
        side: THREE.DoubleSide,
        transparent: true,
        color: 'rgb(230, 230, 230)'
      }))

      var layout = geom.layout
      var textAnchor = new THREE.Object3D()
      textAnchor.scale.multiplyScalar(-0.005)
      app.scene.add(textAnchor)

      // create multiple copies of text, each rotated around y-axis with even angular spacing
      var numRotateCopies = 40
      for (var i = 0; i < numRotateCopies; i++) {
        var textCopy = new THREE.Mesh(geom, material)
        textCopy.position.x = -layout.width / 2
        textCopy.position.y = layout.height * 1.035
        textCopy.rotation.y = (i * Math.PI * 2) / numRotateCopies // set rotation
        textAnchor.add(textCopy)
      }

      function update(delta) {
        textAnchor.position.y += delta * 3; // Multiply by delta to keep the movement consistent
        textAnchor.position.y %= 20;
      }

      let lastUpdate = performance.now();

      function animate() {
        // Schedule the next frame
        requestAnimationFrame(animate);

        // Calculate elapsed time since the last update
        const now = performance.now();
        const delta = (now - lastUpdate) / 1000;
        lastUpdate = now;

        // Update the scene with the calculated delta
        update(delta);
      }

      // Start the animation loop
      animate();
    }
    // getCopy function from 'test-3d.js'
    function getCopy() {
      return [
        'Total characters: 3,326',
        'Click + drag to rotate',
        '',
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sodales arcu felis, sed molestie ante faucibus a. Integer ligula est, cursus a nisl nec, tempus euismod lorem. Nullam risus felis, fringilla aliquam eros nec, condimentum pretium felis. Praesent rutrum ornare massa, ac rutrum nisl pharetra sit amet. Morbi scelerisque diam quis eleifend lacinia. Sed a porttitor leo. Aenean et vestibulum eros, id condimentum ligula. Quisque maximus, eros et bibendum tristique, enim nulla laoreet mi, molestie imperdiet felis dolor et turpis. Cras sed nunc nec tortor mollis auctor. Aenean cursus blandit metus, in viverra lacus fringilla nec. Nulla a consectetur urna. Sed scelerisque leo in arcu viverra, quis euismod leo maximus. Maecenas ultrices, ligula et malesuada volutpat, sapien nisi placerat ligula, quis dapibus eros diam vitae justo. Sed in elementum ante. Phasellus sed sollicitudin odio. Fusce iaculis tortor ut suscipit aliquam. Curabitur eu nunc id est commodo ornare eu nec arcu. Phasellus et placerat velit, ut tincidunt lorem. Sed at gravida urna. Vivamus id tristique lacus, nec laoreet dolor. Vivamus maximus quam nec consectetur aliquam. Integer condimentum nulla a elit porttitor molestie. Nullam nec dictum lacus. Curabitur rhoncus scelerisque magna ac semper. Curabitur porta est nec cursus tempus. Phasellus hendrerit ac dolor quis pellentesque. Aenean diam nisl, dapibus eget enim vitae, convallis tempor nibh. Proin sit amet ante suscipit, gravida odio ac, euismod neque. Sed sodales, leo eget congue ultricies, leo tellus euismod mauris, tempor finibus elit orci sit amet massa. Pellentesque aliquam magna a neque aliquet, ac dictum tortor dictum.',
        '',
        'Praesent vestibulum ultricies aliquam. Morbi ut ex at nunc ultrices convallis vel et metus. Aliquam venenatis diam ut sodales tristique. Duis et facilisis ipsum. Sed sed ex dictum, mattis urna nec, dictum ex. Donec facilisis tincidunt aliquam. Sed pellentesque ullamcorper tellus nec eleifend. Mauris pulvinar mi diam, et pretium magna molestie eu. In volutpat euismod porta. Etiam a magna non dolor accumsan finibus. Suspendisse potenti. Phasellus blandit nibh vel tortor facilisis auctor.',
        '',
        'Mauris vel iaculis libero. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Etiam et porttitor enim, eget semper ipsum. Vestibulum nec eros massa. Nullam ornare dui eget diam tincidunt tristique. Pellentesque molestie finibus pretium. Quisque in tempor elit. Fusce quis orci ut lacus cursus hendrerit. Curabitur iaculis eros et justo condimentum sodales. In massa sapien, mattis nec nibh id, sagittis semper ex. Nunc cursus sem sit amet leo maximus, vitae molestie lectus cursus.',
        '',
        'Morbi viverra ipsum purus, eu fermentum urna tincidunt at. Maecenas feugiat, est quis feugiat interdum, est ante egestas sem, sed porttitor arcu dui quis nulla. Praesent sed auctor enim. Sed vel dolor et nunc bibendum placerat. Nunc venenatis luctus tortor, ut gravida nunc auctor semper. Suspendisse non orci ut justo iaculis pretium lobortis nec nunc. Donec non libero tellus. Mauris felis mauris, consequat sed tempus ut, tincidunt sit amet nibh. Nam pellentesque lacinia massa, quis rhoncus erat fringilla facilisis. Pellentesque nunc est, lobortis non libero vel, dapibus suscipit dui.'
      ].join('\n')
    }
    // Load the font and texture, then start
    load({
      font: './fnt/Roboto-msdf.json',
      image: './fnt/Roboto-msdf.png'
    }, start);
  }
});

module.exports = function() {
  // Create a basic A-Frame scene
  const scene = document.createElement('a-scene');

  // Create entities (objects) in the scene
  const box = document.createElement('a-box');
  box.setAttribute('position', '-1 0.5 -3');
  box.setAttribute('rotation', '0 45 0');
  box.setAttribute('color', '#4CC3D9');

  const sphere = document.createElement('a-sphere');
  sphere.setAttribute('position', '0 1.25 -5');
  sphere.setAttribute('radius', '1.25');
  sphere.setAttribute('color', '#EF2D5E');

  const cylinder = document.createElement('a-cylinder');
  cylinder.setAttribute('position', '1 0.75 -3');
  cylinder.setAttribute('radius', '0.5');
  cylinder.setAttribute('height', '1.5');
  cylinder.setAttribute('color', '#FFC65D');

  const plane = document.createElement('a-plane');
  plane.setAttribute('position', '0 0 -4');
  plane.setAttribute('rotation', '-90 0 0');
  plane.setAttribute('width', '4');
  plane.setAttribute('height', '4');
  plane.setAttribute('color', '#7BC8A4');

  const sky = document.createElement('a-sky');
  sky.setAttribute('color', '#ECECEC');

  // Add the 'text-3d' component to the A-Frame scene
  scene.setAttribute('text-3d', '');

  // Add the entities to the scene
  scene.appendChild(box);
  scene.appendChild(sphere);
  scene.appendChild(cylinder);
  scene.appendChild(plane);
  scene.appendChild(sky);

  // Add the scene to the DOM
  document.body.appendChild(scene);
};