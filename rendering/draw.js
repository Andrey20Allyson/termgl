const { mult, sum } = require("../math/opr");
const { Vec3 } = require("../math/vector");

class Draw3d {
  constructor(scene, screen) {
    this.color = 0xffffffff;
    this.scene = scene;
    this.screen = screen;
    this.camera = this.scene.camera;

    this.zbufferStart = Infinity;
    this.zbuffer = new Float32Array(this.screen.backbuffer.length);
  }

  projectVec(vec) {
    const scale = this.camera.fov / (this.camera.fov + vec.z);
    const smw = Math.round(this.screen.width / 2);
    const smh = Math.round(this.screen.height / 2);

    return new Vec3(
      Math.round(vec.x * scale) + smw,
      Math.round(vec.y * scale) + smh,
      vec.z
    );
  }

  clear() {
    for (let i = 0; i < this.screen.backbuffer.length; i++) {
      this.screen.backbuffer[i] = this.color;
      this.zbuffer[i] = this.zbufferStart;
    }
  }

  mesh(mesh) {
    let verticies = mesh.vertices;

    verticies = verticies.map((vert) => mult(mesh.cframe.rotation, vert));

    verticies = verticies.map((vert) => sum(vert, mesh.cframe.position));

    // linecolor = 0x0000ffff;

    // for (const [ia, ib, ic] of mesh.indexes) {
    //   const pa = projectVec(verticies[ia]);
    //   const pb = projectVec(verticies[ib]);
    //   const pc = projectVec(verticies[ic]);
    // }

    // linecolor = 0xffffffff;

    // for (let face_index = 0; face_index < mesh.indexes.length; face_index++) {
    //   const [ia, ib, ic] = mesh.indexes[face_index];
    //   const face_color = mesh.face_colors[face_index];
    //   const p0 = projectVec(verticies[ia]);
    //   const p1 = projectVec(verticies[ib]);
    //   const p2 = projectVec(verticies[ic]);

    //   linecolor = face_color;

    //   fill_triangle(p0, p1, p2);

    //   p0[2] -= 2;
    //   p1[2] -= 2;
    //   p2[2] -= 2;

    //   linecolor = 0xffffffff;

    //   drawline3d(p0, p1);
    //   drawline3d(p1, p2);
    //   drawline3d(p2, p0);
    // }

    this.color = 0xff00ff00;

    for (const vertex of verticies) {
      const point = this.projectVec(vertex);
      point[2] -= 4;

      this.pixel(point);
    }
  }

  face(p0, p1, p2) {}

  line(p0, p1) {}

  pixel(pos) {
    const index = pos.x + pos.y * this.screen.width;
    if (this.zbuffer[index] < pos.z) {
      return;
    }

    this.zbuffer[index] = pos.z;
    this.screen.backbuffer[index] = this.color;
  }
}

module.exports = { Draw3d };
