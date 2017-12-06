AFRAME.registerComponent('rotator', {
  schema: {type: 'number', default: 10},
  init: function () {
    this.angle = 0;
  },
  update: function () {},
  tick: function (time, delta) {
    this.angle += this.data * delta / 1000;
    this.angle >= 360 && (this.angle = 0);
    this.el.setAttribute("rotation", "35 " + this.angle + " 45");
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerComponent('cloud', {
  schema: {type: 'int', default: 700},
  init: function () {
    this.count = 0;
    for (var i = 0; i < this.data; i++) {
      this.makePoint();
    }
  },
  makePoint: function (i) {
    var dir = $V([
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    ]).toUnitVector().x(Math.random() * 0.7);
    // var s = document.createElement("a-entity");
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(...dir.elements));
    var dotMaterial = new THREE.PointsMaterial( { size: 2, sizeAttenuation: false } );
    var dot = new THREE.Points( dotGeometry, dotMaterial );
    // s.setAttribute("position", dir.elements.join(" "));
    this.el.setObject3D("point"+(this.count++), dot);
    // this.el.appendChild(s);
  },
  update: function () {},
  tick: function (time, delta) {
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerComponent('wires', {
  schema: {},
  init: function () {
    var geometry = new THREE.BoxGeometry(1,1,1);
    var wireframe = new THREE.EdgesGeometry( geometry );
    var lineMaterial = new THREE.LineBasicMaterial({
      color: "#F00",
      linewidth: 2
    });
    var mesh = new THREE.LineSegments(wireframe, lineMaterial);
    this.el.setObject3D("mesh", mesh);
  }
});
