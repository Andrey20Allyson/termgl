const { EventSubject } = require("../utils/event-subject");
const { Draw3d } = require("./draw");
const { TerminalScreen } = require("./screens/terminal");

class Renderer {
  onPreFrame = new EventSubject();
  onFrame = new EventSubject();

  constructor(scene) {
    this.scene = scene;
    this.camera = this.scene.camera;
    this.screen = new TerminalScreen();
    this.fps = 30;

    this.draw = new Draw3d(this.scene, this.screen);
  }

  start() {
    this.screen.init();

    this.frame();
  }

  frame() {
    this.onPreFrame.emit();

    console.time("render");
    this.draw.color = 0x003030ff;
    this.draw.clear();

    this.scene.meshes.forEach((mesh) => {
      this.draw.mesh(mesh);
    });

    this.screen.swapbuffers();
    console.timeEnd("render");

    this.onFrame.emit();

    setTimeout(() => this.frame(), 1_000 / this.fps);
  }
}

module.exports = { Renderer };
