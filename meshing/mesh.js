const { CFrame } = require("../math/cframe");
const { mult } = require("../math/opr");
const { Vec3 } = require("../math/vector");

class Mesh {
  /**@type {Vec3[]} */
  vertices = [];
  /**@type {[number, number, number][]} */
  indexes = [];
  cframe = new CFrame();
  /**@type {number[]} */
  face_colors = [];

  constructor() {
    this.cframe = CFrame.fromRotationY(0);
  }

  set position(vec3) {
    this.cframe = mult(CFrame.fromPosition(vec3), this.cframe.rotation);
  }

  get position() {
    return this.cframe.position;
  }
}

class BlockMesh extends Mesh {
  constructor(size) {
    super();

    const halfSize = size / 2;

    this.vertices = [
      new Vec3(-halfSize, -halfSize, halfSize), //  #0 back  top    left
      new Vec3(halfSize, -halfSize, halfSize), //   #1 back  top    right
      new Vec3(halfSize, halfSize, halfSize), //    #2 back  bottom right
      new Vec3(-halfSize, halfSize, halfSize), //   #3 back  bottom left

      new Vec3(-halfSize, -halfSize, -halfSize), // #4 front top    left
      new Vec3(halfSize, -halfSize, -halfSize), //  #5 front top    right
      new Vec3(halfSize, halfSize, -halfSize), //   #6 front bottom right
      new Vec3(-halfSize, halfSize, -halfSize), //  #7 front bottom left
    ];

    this.indexes = [
      // back face
      [0, 2, 1],
      [0, 2, 3],

      // front face
      [5, 7, 4],
      [5, 7, 6],

      // top face
      [0, 5, 1],
      [0, 5, 4],

      // bottom face
      [2, 7, 3],
      [2, 7, 6],

      // left face
      [0, 7, 3],
      [0, 7, 4],

      // right face
      [2, 5, 1],
      [2, 5, 6],
    ];

    this.face_colors = [
      0xff0000ff, 0xff0000ff,

      0xffff00ff, 0xffff00ff,

      0xff00ffff, 0xff00ffff,

      0x0000ffff, 0x0000ffff,

      0x00ff00ff, 0x00ff00ff,

      0x00ffffff, 0x00ffffff,
    ];
  }
}

// created by AI
class TorusMesh extends Mesh {
  /**
   * @param {number} R - Major radius (torus ring radius)
   * @param {number} r - Minor radius (tube radius)
   * @param {number} segments - Number of segments around the ring
   * @param {number} sides - Number of segments around the tube
   */
  constructor(R, r, segments = 24, sides = 12) {
    super();

    this.vertices = [];
    this.indexes = [];

    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      for (let j = 0; j < sides; j++) {
        const phi = (j / sides) * Math.PI * 2;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        const x = (R + r * cosPhi) * cosTheta;
        const y = r * sinPhi;
        const z = (R + r * cosPhi) * sinTheta;

        this.vertices.push(new Vec3(x, y, z));
      }
    }
  }
}

module.exports = { Mesh, BlockMesh, TorusMesh };
