const { Camera } = require("./camera");
const { Renderer } = require("./renderer");

class Scene {
  constructor() {
    this.meshes = [];
    this.camera = new Camera();
    this.renderer = new Renderer(this.camera);
  }

  add(mesh) {
    this.meshes.push(mesh);
  }
}

module.exports = { Scene };
