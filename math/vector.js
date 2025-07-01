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
}

module.exports = { Vec3 };
