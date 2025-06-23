const { stdout } = require("node:process");

stdout.cursorTo(0, 0);
stdout.clearScreenDown();

const [w, h] = stdout.getWindowSize();
const screen = {
  width: w,
  height: h * 2,
};

const renderbuffers = {
  backbuffer: new Uint32Array(screen.width * screen.height),
  frontbuffer: new Uint32Array(screen.width * screen.height),
};

const Reset = "\x1b[0m";

function bgrgb(r, g, b) {
  return `\x1b[48;2;${r};${g};${b}m`;
}

function txrgb(r, g, b) {
  return `\x1b[38;2;${r};${g};${b}m`;
}

function u32torgba(u32) {
  return [
    u32 >>> (8 * 3),
    (u32 >>> (8 * 2)) & 0xff,
    (u32 >>> (8 * 1)) & 0xff,
    u32 & 0xff,
  ];
}

function swapbuffers() {
  const buffer = renderbuffers.backbuffer;
  renderbuffers.backbuffer = renderbuffers.frontbuffer;
  renderbuffers.frontbuffer = buffer;

  const rowc = screen.height / 2;

  const pixels = [];

  for (let i = 0; i < rowc; i++) {
    for (let j = 0; j < screen.width; j++) {
      const [p1, p2] = getpixels(i, j);

      if (p1 === p2) {
        const [p1r, p1g, p1b, p1a] = u32torgba(p1);
        const p1color = bgrgb(p1r, p1g, p1b);

        pixels.push(`${p1color} `);
        continue;
      }

      const [p1r, p1g, p1b, p1a] = u32torgba(p1);
      const p1color = txrgb(p1r, p1g, p1b);

      const [p2r, p2g, p2b, p2a] = u32torgba(p2);
      const p2color = bgrgb(p2r, p2g, p2b);

      pixels.push(`${p1color}${p2color}▀`);
    }

    pixels.push("\n");
  }

  pixels.pop();
  pixels.push(Reset);

  function getpixels(row, col) {
    const i1 = col + (row * 2 + 0) * screen.width;
    const i2 = col + (row * 2 + 1) * screen.width;

    return [buffer[i1], buffer[i2]];
  }

  stdout.cursorTo(0, 0);
  stdout.write(pixels.join(""));
  stdout.cursorTo(0, 0);
}

function clearbuffer(color) {
  for (let i = 0; i < renderbuffers.backbuffer.length; i++) {
    renderbuffers.backbuffer[i] = color;
  }
}

function drawpixel(x, y, color) {
  renderbuffers.backbuffer[x + y * screen.width] = color;
}

function drawline(x1, y1, x2, y2) {
  const m_new = 2 * (y2 - y1);
  let slope_error_new = m_new - (x2 - x1);

  let y = y1;
  for (let x = x1; x <= x2; x++) {
    drawpixel(x, y, 0x0077ff00);

    slope_error_new = slope_error_new + m_new;

    if (slope_error_new >= 0) {
      y = y + 1;
      slope_error_new = slope_error_new - 2 * (x2 - x1);
    }
  }
}

function drawline2(x1, y1, x2, y2) {
  const dx = Math.abs(x1 - x2) + 1;
  const dy = Math.abs(y1 - y2) + 1;

  const ysig = y1 > y2 ? -1 : 1;
  const xsig = x1 > x2 ? -1 : 1;

  if (dx > dy) {
    const err_s = Math.abs(Math.ceil(dx / dy));
    let err = err_s;
    let x = x1;
    let y = y1;

    while (xsig === 1 ? x <= x2 : x >= x2) {
      drawpixel(x, y, 0xffffffff);

      err--;
      x += xsig;

      if (err <= 0) {
        err = err_s;
        y += ysig;
      }
    }

    return;
  }

  const err_s = Math.abs(Math.ceil(dy / dx));
  let err = err_s;
  let x = x1;
  let y = y1;
  const yf = y + dy;

  while (ysig === 1 ? y <= y2 : y >= y2) {
    drawpixel(x, y, 0xffffffff);

    err--;
    y += ysig;

    if (err <= 0) {
      err = err_s;
      x += xsig;
    }
  }
}

function drawline3(x1, y1, x2, y2) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);

  const xsig = x1 < x2 ? 1 : -1;
  const ysig = y1 < y2 ? 1 : -1;

  let x = x1;
  let y = y1;

  if (dx > dy) {
    let err = dx / 2;

    while (x !== x2) {
      drawpixel(x, y, 0xffffffff);
      x += xsig;
      err -= dy;
      if (err < 0) {
        y += ysig;
        err += dx;
      }
    }
  } else {
    let err = dy / 2;

    while (y !== y2) {
      drawpixel(x, y, 0xffffffff);
      y += ysig;
      err -= dx;
      if (err < 0) {
        x += xsig;
        err += dy;
      }
    }
  }

  // Draw the final point
  drawpixel(x2, y2, 0xffffffff);
}

function drawpoint(x, y, color) {
  drawpixel(x, y, color);
  drawpixel(x - 1, y, color);
  drawpixel(x + 1, y, color);
  drawpixel(x, y - 1, color);
  drawpixel(x, y + 1, color);
}

function project(vec3) {
  const fov = 180;

  const scale = fov / (fov + vec3[2]);
  const smw = Math.round(screen.width / 2);
  const smh = Math.round(screen.height / 2);

  return [Math.round(vec3[0] * scale) + smw, Math.round(vec3[1] * scale) + smh];
}

// drawline2(20, 20, 10, 10);
// drawline2(20, 20, 20, 5);
// drawline2(20, 20, 30, 10);
// drawline2(20, 20, 35, 20);
// drawline2(20, 20, 30, 30);

// drawpoint(20, 20, 0xff00ff00);

function dot4(Aa, Ab, Ac, Ad, Ba, Bb, Bc, Bd) {
  return Aa * Ba + Ab * Bb + Ac * Bc + Ad * Bd;
}

class Vec3 extends Float32Array {
  constructor(x = 0, y = 0, z = 0) {
    super([x, y, z]);
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  mult(other) {
    if (typeof other === "number") {
      return new Vec3(this.x * other, this.y * other, this.z * other);
    }

    if (other instanceof CFrame) {
      return this.mult(other.mat);
    }

    if (other instanceof Mat4) {
      return new Vec3(
        dot4(
          other[0],
          other[1],
          other[2],
          other[3],
          this[0],
          this[1],
          this[2],
          1
        ),
        dot4(
          other[4],
          other[5],
          other[6],
          other[7],
          this[0],
          this[1],
          this[2],
          1
        ),
        dot4(
          other[8],
          other[9],
          other[10],
          other[11],
          this[0],
          this[1],
          this[2],
          1
        )
      );
    }

    return new Vec3(this.x * other.x, this.y * other.y, this.z * other.z);
  }

  sum(other) {
    return new Vec3(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  dot(other) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }
}

class Vec4 extends Float32Array {
  constructor(x = 0, y = 0, z = 0, a = 0) {
    super([x, y, z, a]);
  }

  get x() {
    return this[0];
  }

  get y() {
    return this[1];
  }

  get z() {
    return this[2];
  }

  get a() {
    return this[3];
  }

  mult(other) {
    if (typeof other === "number") {
      return new Vec4(
        this.x * other,
        this.y * other,
        this.z * other,
        this.a * other
      );
    }

    return new Vec4(
      this.x * other.x,
      this.y * other.y,
      this.z * other.z,
      this.a * other.a
    );
  }

  sum(other) {
    return new Vec4(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z,
      this.a + other.a
    );
  }

  dot(other) {
    return (
      this.x * other.x + this.y * other.y + this.z * other.z + this.a * other.a
    );
  }
}

class Mat3 extends Float32Array {
  constructor(r1, r2, r3) {
    super(9);
    if (r1 == null) {
      this[0] = 1;
      this[1] = 0;
      this[2] = 0;
      this[3] = 0;
      this[4] = 1;
      this[5] = 0;
      this[6] = 0;
      this[7] = 0;
      this[8] = 1;
      return this;
    }

    // Assume r1, r2, r3 are arrays of length 3
    this[0] = r1[0];
    this[1] = r1[1];
    this[2] = r1[2];
    this[3] = r2[0];
    this[4] = r2[1];
    this[5] = r2[2];
    this[6] = r3[0];
    this[7] = r3[1];
    this[8] = r3[2];
  }

  mult(other) {
    const m11 = this[0] * other[0] + this[1] * other[3] + this[2] * other[6];
    const m12 = this[0] * other[1] + this[1] * other[4] + this[2] * other[7];
    const m13 = this[0] * other[2] + this[1] * other[5] + this[2] * other[8];

    const m21 = this[3] * other[0] + this[4] * other[3] + this[5] * other[6];
    const m22 = this[3] * other[1] + this[4] * other[4] + this[5] * other[7];
    const m23 = this[3] * other[2] + this[4] * other[5] + this[5] * other[8];

    const m31 = this[6] * other[0] + this[7] * other[3] + this[8] * other[6];
    const m32 = this[6] * other[1] + this[7] * other[4] + this[8] * other[7];
    const m33 = this[6] * other[2] + this[7] * other[5] + this[8] * other[8];

    return new Mat3([m11, m12, m13], [m21, m22, m23], [m31, m32, m33]);
  }
}

class Mat4 extends Float32Array {
  constructor(r1, r2, r3, r4) {
    super(16);
    this[0] = r1[0];
    this[1] = r1[1];
    this[2] = r1[2];
    this[3] = r1[3];

    this[4] = r2[0];
    this[5] = r2[1];
    this[6] = r2[2];
    this[7] = r2[3];

    this[8] = r3[0];
    this[9] = r3[1];
    this[10] = r3[2];
    this[11] = r3[3];

    this[12] = r4[0];
    this[13] = r4[1];
    this[14] = r4[2];
    this[15] = r4[3];
  }

  /**
   *
   * @param {Mat4} other
   * @returns {Mat4}
   */
  mult(other) {}

  /**
   * @param {Mat4} other
   * @returns {Mat4}
   */
  sum(other) {}

  static identity() {
    return new Mat4([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]);
  }
}
require("./Mat4.impl")(Mat4);

class CFrame {
  /**@type {Mat4} */
  mat;

  constructor(mat = Mat4.identity()) {
    this.mat = mat;
  }

  get position() {
    return new Vec3(this.mat[3], this.mat[7], this.mat[11]);
  }

  mult(other) {
    return new CFrame(this.mat.mult(other.mat));
  }

  sum(other) {
    return new CFrame(this.mat.sum(other.mat));
  }

  get rotation() {
    return new CFrame(
      new Mat4(
        [this.mat[0], this.mat[1], this.mat[2], 0],
        [this.mat[4], this.mat[5], this.mat[6], 0],
        [this.mat[8], this.mat[9], this.mat[10], 0],
        [0, 0, 0, 1]
      )
    );
  }

  toString() {
    const [Aa, Ba, Ca, Da, Ab, Bb, Cb, Db, Ac, Bc, Cc, Dc, Ad, Bd, Cd, Dd] =
      this.mat;

    return `CFrame [\n  ${Aa}, ${Ba}, ${Ca}, ${Da}\n  ${Ab}, ${Bb}, ${Cb}, ${Db}\n  ${Ac}, ${Bc}, ${Cc}, ${Dc}\n  ${Ad}, ${Bd}, ${Cd}, ${Dd}\n]`;
  }

  static fromPosition(vec3) {
    const cf = new CFrame();
    cf.mat[3] = vec3[0];
    cf.mat[7] = vec3[1];
    cf.mat[11] = vec3[2];

    return cf;
  }

  static fromRotationY(angle) {
    const cf = new CFrame();
    cf.mat[0] = Math.cos(angle);
    cf.mat[2] = Math.sin(angle);

    cf.mat[8] = -Math.sin(angle);
    cf.mat[10] = Math.cos(angle);

    return cf;
  }

  static fromRotationX(angle) {
    const cf = new CFrame();

    const c = Math.cos(angle);
    const s = Math.sin(angle);

    cf.mat[5] = c;
    cf.mat[6] = -s;
    cf.mat[9] = s;
    cf.mat[10] = c;

    return cf;
  }
}

class Mesh {
  /**@type {Vec3[]} */
  vertices = [];
  /**@type {[number, number, number][]} */
  indexes = [];
  cframe = new CFrame();

  constructor() {
    this.cframe = CFrame.fromRotationY(0);
  }

  set position(vec3) {
    this.cframe = CFrame.fromPosition(vec3).mult(this.cframe.rotation);
  }

  get position() {
    return this.cframe.position;
  }
}

// function fill_triangle(p0, p1, p2) {
//   [p0, p1, p2] = [p0, p1, p2]
//     .sort((a, b) => a[1] - b[1])
//     .map((p) => ({ x: p[0], y: p[1] }));

//   function edgeInterp(y0, y1, x0, x1) {
//     let res = [];
//     let dy = y1 - y0;
//     if (dy === 0) return res;
//     let dx = (x1 - x0) / dy;
//     let x = x0;
//     for (let y = Math.ceil(y0); y <= Math.floor(y1); y++) {
//       res.push({ x, y });
//       x += dx;
//     }
//     return res;
//   }

//   // Long edge from top to bottom
//   let left = edgeInterp(p0.y, p2.y, p0.x, p2.x);
//   let right = [
//     ...edgeInterp(p0.y, p1.y, p0.x, p1.x),
//     ...edgeInterp(p1.y, p2.y, p1.x, p2.x),
//   ];

//   // Make sure left and right have same y-values
//   if (left.length !== right.length) {
//     const temp = left;
//     left = right;
//     right = temp;
//   }

//   for (let i = 0; i < left.length; i++) {
//     const y = left[i].y;
//     const xL = left[i].x;
//     const xR = right[i].x;
//     // drawline3(xL, y, xR, y);
//   }
// }

function fill_triangle(p0, p1, p2) {
  // Sort by Y
  [p0, p1, p2] = [p0, p1, p2]
    .map((p) => ({ x: p[0], y: p[1] }))
    .sort((a, b) => a.y - b.y);

  if (p1.y === p2.y) {
    // Flat-bottom triangle
    fillFlatBottomTriangle(p0, p1, p2);
  } else if (p0.y === p1.y) {
    // Flat-top triangle
    fillFlatTopTriangle(p0, p1, p2);
  } else {
    // General triangle — split
    const alpha = (p1.y - p0.y) / (p2.y - p0.y);
    const vi = {
      x: p0.x + (p2.x - p0.x) * alpha,
      y: p1.y,
    };
    fillFlatBottomTriangle(p0, p1, vi);
    fillFlatTopTriangle(p1, vi, p2);
  }
}

function fillFlatBottomTriangle(p0, p1, p2) {
  const invslope1 = (p1.x - p0.x) / (p1.y - p0.y);
  const invslope2 = (p2.x - p0.x) / (p2.y - p0.y);

  let curx1 = p0.x;
  let curx2 = p0.x;

  for (let y = Math.ceil(p0.y); y <= Math.floor(p1.y); y++) {
    drawline3(curx1, y, curx2, y);
    curx1 += invslope1;
    curx2 += invslope2;
  }
}

function fillFlatTopTriangle(p0, p1, p2) {
  const invslope1 = (p2.x - p0.x) / (p2.y - p0.y);
  const invslope2 = (p2.x - p1.x) / (p2.y - p1.y);

  let curx1 = p2.x;
  let curx2 = p2.x;

  for (let y = Math.floor(p2.y); y >= Math.ceil(p0.y); y--) {
    drawline3(curx1, y, curx2, y);
    curx1 -= invslope1;
    curx2 -= invslope2;
  }
}

/**
 *
 * @param {Mesh} mesh
 */
function render_mesh(mesh) {
  let verticies = mesh.vertices;

  verticies = verticies.map((vert) => vert.mult(mesh.cframe.rotation));

  verticies = verticies.map((vert) => vert.sum(mesh.cframe.position));

  for (const [ia, ib, ic] of mesh.indexes) {
    const pa = project(verticies[ia]);
    const pb = project(verticies[ib]);
    const pc = project(verticies[ic]);

    fill_triangle(pa, pb, pc);
  }

  for (const [ia, ib, ic] of mesh.indexes) {
    const [xa, ya] = project(verticies[ia]);
    const [xb, yb] = project(verticies[ib]);
    const [xc, yc] = project(verticies[ic]);

    drawline3(xa, ya, xb, yb);
    drawline3(xb, yb, xc, yc);
    drawline3(xc, yc, xa, ya);
  }

  for (const vertex of verticies) {
    const [x, y] = project(vertex);

    drawpixel(x, y, 0xff00ff00);
  }
}

const meshes = [];

function add_mesh(mesh) {
  meshes.push(mesh);
}

const fps = 30;

let d = 0;
function render() {
  console.time("render");
  clearbuffer(0x00303000);
  // drawpixel(...project([0, 0, 0]), 0x0000ff00);

  // const b1y = Math.sin((d - 7) / 10) * 10;
  // b1.position = new Vec3(20, b1y, 0);

  const b2y = Math.sin(d / 10) * 10;
  b2.position = new Vec3(0, b2y, 0);
  b2.cframe = CFrame.fromPosition(b2.position)
    .mult(CFrame.fromRotationY(d / 50))
    .mult(CFrame.fromRotationX(d / 50));

  meshes.forEach(render_mesh);

  swapbuffers();
  console.timeEnd("render");

  setTimeout(() => {
    d++;
    render();
  }, 1_000 / fps);
}

// const b1 = new BlockMesh(20, 20, 20);
// b1.position = new Vec3(30, 0, 0);

// const b2 = new BlockMesh(40, 40, 40);

const b2 = new Mesh();
b2.vertices = [new Vec3(-10, -10, 0), new Vec3(10, -10, 0), new Vec3(0, 10, 0)];
b2.indexes = [[0, 1, 2]];

// add_mesh(b1);
add_mesh(b2);

render();
