const { CFrame } = require("./math/cframe");
const { mult } = require("./math/opr");
const { Vec3 } = require("./math/vector");
const { BlockMesh } = require("./meshing/mesh");
const { Scene } = require("./rendering/scene");

const scene = new Scene();

let d = 0;
const mesh = new BlockMesh(40);
mesh.cframe = mult(mesh.cframe, CFrame.fromRotationY(0.7));
mesh.cframe = mult(mesh.cframe, CFrame.fromRotationX(0.7));

scene.add(mesh);

scene.onFrame.sub(frame);

scene.renderer.start();

function frame() {
  const y = Math.sin(d / 10) * 10;
  mesh.position = new Vec3(0, y, 0);
  mesh.cframe = mult(CFrame.fromPosition(mesh.position), mesh.cframe.rotation);

  d++;
}
