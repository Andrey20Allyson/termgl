const { CFrame } = require("./cframe");
const { Mat4 } = require("./matrix");
const { Vec3 } = require("./vector");

function dot4(Aa, Ab, Ac, Ad, Ba, Bb, Bc, Bd) {
  return Aa * Ba + Ab * Bb + Ac * Bc + Ad * Bd;
}

function mult(a, b) {
  if (typeof a === "number") {
    return multn(a, b);
  }

  if (a instanceof Vec3) {
    return multv3(a, b);
  }

  if (a instanceof Mat4) {
    return multm4(a, b);
  }

  if (a instanceof CFrame) {
    return multm4(a.mat, b);
  }

  throw new Error("err");
}

function multn(n, b) {
  if (typeof b === "number") {
    return n * b;
  }

  if (b instanceof Vec3) {
    return multnv3(n, b);
  }

  if (b instanceof Mat4) {
    return multnm4(n, b);
  }

  if (b instanceof CFrame) {
    return new CFrame(multnm4(n, b.mat));
  }

  throw new Error("err");
}

function multnv3(n, v3) {
  return new Vec3(v3.x * n, v3.y * n, v3.z * n);
}

function multnm4(n, m4) {
  return new Mat4(
    [m4[0] * n, m4[1] * n, m4[2] * n, m4[3] * n],
    [m4[4] * n, m4[5] * n, m4[6] * n, m4[7] * n],
    [m4[8] * n, m4[9] * n, m4[10] * n, m4[11] * n],
    [m4[12] * n, m4[13] * n, m4[14] * n, m4[15] * n]
  );
}

function multv3(v3, b) {
  if (typeof b === "number") {
    return multnv3(b, v3);
  }

  if (b instanceof Vec3) {
    return new Vec3(v3.x * b.x, v3.y * b.y, v3.z * b.z);
  }

  throw new Error("err");
}

function multm4(m4, b) {
  if (b instanceof Vec3) {
    return new Vec3(
      dot4(m4[0], m4[1], m4[2], m4[3], b[0], b[1], b[2], 1),
      dot4(m4[4], m4[5], m4[6], m4[7], b[0], b[1], b[2], 1),
      dot4(m4[8], m4[9], m4[10], m4[11], b[0], b[1], b[2], 1)
    );
  }

  if (b instanceof CFrame) {
    return new CFrame(multm4m4(m4, b.mat));
  }

  if (b instanceof Mat4) {
    return multm4m4(m4, b);
  }

  throw new Error("err");
}

function multm4m4(a, b) {
  const Aa = dot4(b[0], b[4], b[8], b[12], a[0], a[1], a[2], a[3]);
  const Ab = dot4(b[0], b[4], b[8], b[12], a[4], a[5], a[6], a[7]);
  const Ac = dot4(b[0], b[4], b[8], b[12], a[8], a[9], a[10], a[11]);
  const Ad = dot4(b[0], b[4], b[8], b[12], a[12], a[13], a[14], a[15]);

  const Ba = dot4(b[1], b[5], b[9], b[13], a[0], a[1], a[2], a[3]);
  const Bb = dot4(b[1], b[5], b[9], b[13], a[4], a[5], a[6], a[7]);
  const Bc = dot4(b[1], b[5], b[9], b[13], a[8], a[9], a[10], a[11]);
  const Bd = dot4(b[1], b[5], b[9], b[13], a[12], a[13], a[14], a[15]);

  const Ca = dot4(b[2], b[6], b[10], b[14], a[0], a[1], a[2], a[3]);
  const Cb = dot4(b[2], b[6], b[10], b[14], a[4], a[5], a[6], a[7]);
  const Cc = dot4(b[2], b[6], b[10], b[14], a[8], a[9], a[10], a[11]);
  const Cd = dot4(b[2], b[6], b[10], b[14], a[12], a[13], a[14], a[15]);

  const Da = dot4(b[3], b[7], b[11], b[15], a[0], a[1], a[2], a[3]);
  const Db = dot4(b[3], b[7], b[11], b[15], a[4], a[5], a[6], a[7]);
  const Dc = dot4(b[3], b[7], b[11], b[15], a[8], a[9], a[10], a[11]);
  const Dd = dot4(b[3], b[7], b[11], b[15], a[12], a[13], a[14], a[15]);

  return new Mat4(
    [Aa, Ba, Ca, Da],
    [Ab, Bb, Cb, Db],
    [Ac, Bc, Cc, Dc],
    [Ad, Bd, Cd, Dd]
  );
}

function sum(a, b) {
  if (a instanceof Vec3) {
    return sumv3(a, b);
  }

  if (a instanceof Mat4) {
    return summ4(a, b);
  }

  if (a instanceof CFrame) {
    return summ4(a.mat, b);
  }

  throw new Error("err");
}

function sumv3(v3, b) {
  if (b instanceof Vec3) {
    return new Vec3(v3.x + b.x, v3.y + b.y, v3.z + b.z);
  }

  throw new Error("err");
}

function summ4(m4, b) {
  if (b instanceof Mat4) {
    return summ4m4(m4, b);
  }

  if (b instanceof CFrame) {
    return new CFrame(summ4m4(m4, b.mat));
  }

  throw new Error("err");
}

function summ4m4(a, b) {
  return new Mat4(
    [a[0] + b[0], a[1] + b[1], a[2] + b[2], a[3] + b[3]],
    [a[4] + b[4], a[5] + b[5], a[6] + b[6], a[7] + b[7]],
    [a[8] + b[8], a[9] + b[9], a[10] + b[10], a[11] + b[11]],
    [a[12] + b[12], a[13] + b[13], a[14] + b[14], a[15] + b[15]]
  );
}

function invertSignal(value) {
  return mult(-1, value);
}

module.exports = { mult, sum, invertSignal };
