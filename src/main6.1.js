onThumbstickMoved(event) {
    const rig = document.querySelector('#rig');
    const camera = document.querySelector('#camera');
    const moveSpeed = 5 * event.detail.y * (event.timeStamp - this.previousTimestamp) / 1000;
    const rotationSpeed = 5 * event.detail.x * (event.timeStamp - this.previousTimestamp) / 1000;
    if (event.target.id === "leftController") {
      const direction = new THREE.Vector3();
      camera.object3D.getWorldDirection(direction);
      direction.y = 0;
      direction.normalize();
      direction.multiplyScalar(moveSpeed);
      rig.object3D.position.add(direction);
    } else if (event.target.id === "rightController") {
      rig.object3D.rotation.y -= rotationSpeed;
    }
    this.previousTimestamp = event.timeStamp;
  },