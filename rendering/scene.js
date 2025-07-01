const { Camera } = require("./camera");
const { Renderer } = require("./renderer");

class Scene {
  constructor() {
    this.meshes = [];
    this.camera = new Camera();
    this.renderer = new Renderer(this);

    this.onFrame = this.renderer.onFrame;
  }

  add(mesh) {
    this.meshes.push(mesh);
  }
}

module.exports = { Scene };
