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

  static identity() {
    return new Mat4([1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]);
  }
}

module.exports = { Mat4 };
