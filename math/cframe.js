const { Mat4 } = require("./matrix");
const { mult } = require("./opr");
const { Vec3 } = require("./vector");

class CFrame {
  /**@type {Mat4} */
  type = "cframe";
  mat;

  constructor(mat = Mat4.identity()) {
    this.mat = mat;
  }

  get position() {
    return new Vec3(this.mat[3], this.mat[7], this.mat[11]);
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

  static fromPosition(x, y, z) {
    if (x instanceof Vec3) {
      y = x.y;
      z = x.z;
      x = x.x;
    }

    const cf = new CFrame();
    cf.mat[3] = x;
    cf.mat[7] = y;
    cf.mat[11] = z;

    return cf;
  }

  static fromRotation(rx, ry, rz) {
    return mult(
      mult(CFrame.fromRotationX(rx), CFrame.fromRotationY(ry)),
      new CFrame()
    );
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

module.exports = { CFrame };
