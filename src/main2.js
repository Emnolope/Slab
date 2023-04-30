// src/main.js

module.exports = function () {
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

  // Add the entities to the scene
  scene.appendChild(box);
  scene.appendChild(sphere);
  scene.appendChild(cylinder);
  scene.appendChild(plane);
  scene.appendChild(sky);

  // Add the scene to the DOM
  document.body.appendChild(scene);
};