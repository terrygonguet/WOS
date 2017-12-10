AFRAME.registerComponent('homo-cloud', {
  schema: {
    number: {type: 'int', default: 700},
    color: {type: 'color', default: "#FFF"}
  },
  init: function () {
    this.update();
  },
  update: function () {
    var dotGeometry = new THREE.Geometry();
    var dir = $V([0,0,0]);
    do {
      dir.setElements([
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        Math.random() * 2 - 1
      ]);
      if (dir.modulus() <= 1) dotGeometry.vertices.push(new THREE.Vector3(...dir.elements));
    } while (dotGeometry.vertices.length < this.data.number);

    var dotMaterial = new THREE.PointsMaterial( { size: 2, sizeAttenuation: false, color: this.data.color } );
    var dots = new THREE.Points( dotGeometry, dotMaterial );
    this.el.setObject3D("points", dots);
  },
  tick: function (time, delta) {
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerComponent('rotator', {
  schema: {type: 'number', default: 10},
  init: function () {
    this.angle = 0;
  },
  update: function () {},
  tick: function (time, delta) {
    this.angle += this.data * delta / 1000;
    this.angle >= 360 && (this.angle = 0);
    var angles = this.el.getAttribute("rotation");
    angles.x = this.angle;
    angles.y = this.angle;
    angles.z = this.angle;
    this.el.setAttribute("rotation", angles);
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});
