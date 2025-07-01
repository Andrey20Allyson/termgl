const { CFrame } = require("./math/cframe");
const { mult } = require("./math/opr");
const { Vec3 } = require("./math/vector");
const { BlockMesh } = require("./meshing/mesh");
const { Scene } = require("./rendering/scene");

const scene = new Scene();

let d = 0;
const mesh = new BlockMesh(40);

scene.add(mesh);

scene.renderer.onPreFrame.sub(update);

scene.renderer.start();

function update() {
  const y = Math.sin(d / 10) * 10;
  mesh.position = new Vec3(0, y, 0);
  mesh.cframe = mult(
    CFrame.fromPosition(mesh.position),
    CFrame.fromRotation(0.7, 0.7, 0)
  );

  scene.camera.cframe = mult(
    CFrame.fromPosition(new Vec3(0, 0, -20)),
    CFrame.fromRotation(0, -d / 40, 0)
  );

  d++;
}
