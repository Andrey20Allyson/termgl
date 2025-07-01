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

    const relativePosition = mult(
      mult(-1, this.camera.cframe),
      mesh.cframe.position
    );

    verticies = verticies.map((vert) =>
      mult(mult(this.camera.cframe.rotation, mesh.cframe.rotation), vert)
    );

    verticies = verticies.map((vert) => sum(vert, relativePosition));

    for (let face_index = 0; face_index < mesh.indexes.length; face_index++) {
      const [ia, ib, ic] = mesh.indexes[face_index];
      const faceColor = mesh.face_colors[face_index];
      const p0 = this.projectVec(verticies[ia]);
      const p1 = this.projectVec(verticies[ib]);
      const p2 = this.projectVec(verticies[ic]);

      this.color = faceColor;

      this.face(p0, p1, p2);

      p0[2] -= 2;
      p1[2] -= 2;
      p2[2] -= 2;

      this.color = 0xffffffff;

      this.line(p0, p1);
      this.line(p1, p2);
      this.line(p2, p0);
    }

    this.color = 0xff00ff00;

    for (const vertex of verticies) {
      const point = this.projectVec(vertex);
      point[2] -= 4;

      this.pixel(point);
    }
  }

  face(p0, p1, p2) {
    // Sort by Y
    [p0, p1, p2] = [p0, p1, p2].sort((a, b) => a.y - b.y);

    if (p1.y === p2.y) {
      this._fillFlatBottomTriangle(p0, p1, p2);
    } else if (p0.y === p1.y) {
      this._fillFlatTopTriangle(p2, p1, p0);
    } else {
      // General triangle — split
      const alpha = (p1.y - p0.y) / (p2.y - p0.y);
      const vi = {
        x: p0.x + (p2.x - p0.x) * alpha,
        y: p1.y,
        z: p0.z + (p2.z - p0.z) * alpha,
      };
      this._fillFlatBottomTriangle(p0, p1, vi);
      this._fillFlatTopTriangle(p2, p1, vi);
    }
  }

  line(p0, p1) {
    const x1 = p0.x;
    const y1 = p0.y;
    const z1 = p0.z;

    const x2 = p1.x;
    const y2 = p1.y;
    const z2 = p1.z;

    const dx = Math.abs(x2 - x1);
    const dy = Math.abs(y2 - y1);
    const dz = z2 - z1;

    const xsig = x1 < x2 ? 1 : -1;
    const ysig = y1 < y2 ? 1 : -1;

    let x = x1;
    let y = y1;
    let z = z1;

    if (dx > dy) {
      let err = dx / 2;
      let zchange = dz / dx;

      while (x !== x2) {
        this.pixel(new Vec3(x, y, z));
        x += xsig;
        z += zchange;
        err -= dy;
        if (err < 0) {
          y += ysig;
          err += dx;
        }
      }
    } else {
      let err = dy / 2;
      let zchange = dz / dy;

      while (y !== y2) {
        this.pixel(new Vec3(x, y, z));
        y += ysig;
        z += zchange;
        err -= dx;
        if (err < 0) {
          x += xsig;
          err += dy;
        }
      }
    }

    // Draw the final point
    this.pixel(p1);
  }

  pixel(pos) {
    const index = pos.x + pos.y * this.screen.width;
    if (this.zbuffer[index] < pos.z) {
      return;
    }

    this.zbuffer[index] = pos.z;
    this.screen.backbuffer[index] = this.color;
  }

  _fillFlatBottomTriangle(p0, p1, p2) {
    let dy = Math.abs(p1.y - p0.y);

    let xr = p1.x;
    let zr = p1.z;
    let xrc = (p0.x - p1.x) / dy;
    let zrc = (p0.z - p1.z) / dy;

    let xl = p2.x;
    let zl = p2.z;
    let xlc = (p0.x - p2.x) / dy;
    let zlc = (p0.z - p2.z) / dy;

    for (
      let y = p1.y;
      y >= p0.y;
      y--, xr += xrc, zr += zrc, xl += xlc, zl += zlc
    ) {
      this.line(
        new Vec3(Math.round(xr), y, Math.round(zr)),
        new Vec3(Math.round(xl), y, Math.round(zl))
      );
    }
  }

  _fillFlatTopTriangle(p0, p1, p2) {
    let dy = Math.abs(p1.y - p0.y);

    let xr = p1.x;
    let zr = p1.z;
    let xrc = (p0.x - p1.x) / dy;
    let zrc = (p0.z - p1.z) / dy;

    let xl = p2.x;
    let zl = p2.z;
    let xlc = (p0.x - p2.x) / dy;
    let zlc = (p0.z - p2.z) / dy;

    for (
      let y = p1.y;
      y <= p0.y;
      y++, xr += xrc, zr += zrc, xl += xlc, zl += zlc
    ) {
      this.line(
        new Vec3(Math.round(xr), y, Math.round(zr)),
        new Vec3(Math.round(xl), y, Math.round(zl))
      );
    }
  }
}

module.exports = { Draw3d };
