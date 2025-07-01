const { CFrame } = require("./math/cframe");
const { mult, invertSignal } = require("./math/opr");
const { Vec3 } = require("./math/vector");
const { BlockMesh } = require("./meshing/mesh");
const { Scene } = require("./rendering/scene");

const scene = new Scene();

let d = 0;
const mesh = new BlockMesh(40);
mesh.cframe = mult(mesh.cframe, CFrame.fromRotation(0.7, 0.7, 0.7));

scene.add(mesh);

scene.onFrame.sub(frame);

scene.renderer.start();

function frame() {
  const y = Math.sin(d / 10) * 10;
  mesh.position = new Vec3(0, y, 0);
  mesh.cframe = mult(CFrame.fromPosition(mesh.position), mesh.cframe.rotation);

  scene.camera.cframe = mult(
    CFrame.fromPosition(new Vec3(0, 0, -50)),
    CFrame.fromRotation(0, -d / 40, 0)
  );

  d++;
}
