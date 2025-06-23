function dot4(Aa, Ab, Ac, Ad, Ba, Bb, Bc, Bd) {
  return Aa * Ba + Ab * Bb + Ac * Bc + Ad * Bd;
}

module.exports = (Mat4) => {
  Mat4.prototype.mult = function (other) {
    const Aa = dot4(
      other[0],
      other[4],
      other[8],
      other[12],
      this[0],
      this[1],
      this[2],
      this[3]
    );

    const Ab = dot4(
      other[0],
      other[4],
      other[8],
      other[12],
      this[4],
      this[5],
      this[6],
      this[7]
    );

    const Ac = dot4(
      other[0],
      other[4],
      other[8],
      other[12],
      this[8],
      this[9],
      this[10],
      this[11]
    );

    const Ad = dot4(
      other[0],
      other[4],
      other[8],
      other[12],
      this[12],
      this[13],
      this[14],
      this[15]
    );

    const Ba = dot4(
      other[1],
      other[5],
      other[9],
      other[13],
      this[0],
      this[1],
      this[2],
      this[3]
    );

    const Bb = dot4(
      other[1],
      other[5],
      other[9],
      other[13],
      this[4],
      this[5],
      this[6],
      this[7]
    );

    const Bc = dot4(
      other[1],
      other[5],
      other[9],
      other[13],
      this[8],
      this[9],
      this[10],
      this[11]
    );

    const Bd = dot4(
      other[1],
      other[5],
      other[9],
      other[13],
      this[12],
      this[13],
      this[14],
      this[15]
    );

    const Ca = dot4(
      other[2],
      other[6],
      other[10],
      other[14],
      this[0],
      this[1],
      this[2],
      this[3]
    );

    const Cb = dot4(
      other[2],
      other[6],
      other[10],
      other[14],
      this[4],
      this[5],
      this[6],
      this[7]
    );

    const Cc = dot4(
      other[2],
      other[6],
      other[10],
      other[14],
      this[8],
      this[9],
      this[10],
      this[11]
    );

    const Cd = dot4(
      other[2],
      other[6],
      other[10],
      other[14],
      this[12],
      this[13],
      this[14],
      this[15]
    );

    const Da = dot4(
      other[3],
      other[7],
      other[11],
      other[15],
      this[0],
      this[1],
      this[2],
      this[3]
    );

    const Db = dot4(
      other[3],
      other[7],
      other[11],
      other[15],
      this[4],
      this[5],
      this[6],
      this[7]
    );

    const Dc = dot4(
      other[3],
      other[7],
      other[11],
      other[15],
      this[8],
      this[9],
      this[10],
      this[11]
    );

    const Dd = dot4(
      other[3],
      other[7],
      other[11],
      other[15],
      this[12],
      this[13],
      this[14],
      this[15]
    );

    return new Mat4(
      [Aa, Ba, Ca, Da],
      [Ab, Bb, Cb, Db],
      [Ac, Bc, Cc, Dc],
      [Ad, Bd, Cd, Dd]
    );
  };

  Mat4.prototype.sum = function (other) {
    return new Mat4(
      [
        this[0] + other[0],
        this[1] + other[1],
        this[2] + other[2],
        this[3] + other[3],
      ],
      [
        this[4] + other[4],
        this[5] + other[5],
        this[6] + other[6],
        this[7] + other[7],
      ],
      [
        this[8] + other[8],
        this[9] + other[9],
        this[10] + other[10],
        this[11] + other[11],
      ],
      [
        this[12] + other[12],
        this[13] + other[13],
        this[14] + other[14],
        this[15] + other[15],
      ]
    );
  };
};
