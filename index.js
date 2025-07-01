const { Scene } = require("./rendering/scene");

const scene = new Scene();

let d = 0;
const b2 = new BlockMesh(40);
b2.cframe = b2.cframe
  .mult(CFrame.fromRotationY(0.7))
  .mult(CFrame.fromRotationX(0.7));

scene.add(b2);

function frame() {
  // const b1y = Math.sin((d - 7) / 10) * 10;
  // b1.position = new Vec3(20, b1y, 0);

  const b2y = Math.sin(d / 10) * 10;
  b2.position = new Vec3(0, b2y, 0);
  b2.cframe = CFrame.fromPosition(b2.position).mult(b2.cframe.rotation);
  // b2.cframe = b2.cframe.mult(CFrame.fromRotationX(d / 250));
  // b2.cframe = b2.cframe.mult(CFrame.fromRotationY(d / 50));

  d++;
}
