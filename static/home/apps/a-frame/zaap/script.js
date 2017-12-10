AFRAME.registerComponent('zapper', {
  schema: {type: 'number', default: 0.1},
  init: function () {
    this.zaapTime = 0;
    this.tickTime = 0;
    this.i = 0;
    this.zaap();
    this.lineMaterial = new THREE.LineBasicMaterial({
      color: "#F00",
      linewidth: 1
    });
  },
  zaap: function () {
    var geometry = new THREE.Geometry();
    var dir = $V([
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ]).toUnitVector().x(Math.random() * 0.03 + 0.015);
    var vertex = new THREE.Vector3(0,0,0);
    vertex.dir = $V([0,0,0]);
    geometry.vertices.push(vertex);
    vertex = new THREE.Vector3(...dir.elements);
    vertex.dir = dir;
    geometry.vertices.push(vertex);
    this.el.setObject3D("zaap" + (this.i++), new THREE.Line(geometry, this.lineMaterial));
  },
  update: function () {},
  tick: function (time, delta) {
    this.zaapTime += delta;
    if (this.zaapTime >= 100) {
      this.zaapTime -= 100;
      Math.random() <= this.data && this.zaap();
    }

    if ((this.tickTime += delta) >= 25) {
      this.tickTime = 0;
      for (var key in this.el.object3DMap) {
        if (this.el.object3DMap.hasOwnProperty(key) && key.startsWith("zaap")) {
          var object3D = this.el.object3DMap[key];
          var geometry = new THREE.Geometry();
          var vertices = object3D.geometry.vertices;
          var last = vertices[vertices.length-1].dir;
          var stlast = vertices[vertices.length-2].dir;

          if (Math.random() <= last.modulus() / 2) {
            Math.random() <= 0.1 && this.el.removeObject3D(key);
            object3D.geometry.dispose();
            continue;
          }

          var dir = last.subtract(stlast).add($V([
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.1
          ]));
          var next = last.add(dir);
          var vertex = new THREE.Vector3(...next.elements);
          vertex.dir = next;
          vertices.push(vertex);
          geometry.vertices = vertices;
          object3D.geometry.dispose();
          object3D.geometry = geometry;
          // this.el.removeObject3D(key);
          // this.el.setObject3D(key, new THREE.Line(geometry, this.lineMaterial));
        }
      }
    }
  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});

AFRAME.registerComponent('dotring', {
  schema: {
    radius: { type: 'number', default: 1 },
    number: { type: 'int', default: 250 }
  },
  init: function () {
    var dotGeometry = new THREE.Geometry();
    var dir = $V([this.data.radius,0,0]);
    for (var i = 0; i < this.data.number; i++) {
      dotGeometry.vertices.push(new THREE.Vector3(...dir.elements));
      dir = dir.rotate(2 * Math.PI / this.data.number, Line.Z);
    }
    var dotMaterial = new THREE.PointsMaterial( { size: 3, sizeAttenuation: false } );
    var dots = new THREE.Points( dotGeometry, dotMaterial );
    this.el.setObject3D("points", dots);
  },
  update: function () {},
  tick: function (time, delta) {

  },
  remove: function () {},
  pause: function () {},
  play: function () {}
});
