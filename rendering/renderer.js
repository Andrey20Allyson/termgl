const { EventSubject } = require("../utils/event-subject");
const { Draw3d } = require("./draw");
const { TerminalScreen } = require("./screens/terminal");

class Renderer {
  onFrame = new EventSubject();

  constructor(scene) {
    this.scene = scene;
    this.camera = this.scene.camera;
    this.screen = new TerminalScreen();
    this.fps = 30;

    this.draw = new Draw3d(this.scene, this.screen);

    this.onFrame.sub(this.handleFrame, this);
  }

  start() {
    this.onFrame.emit();
  }

  handleFrame() {
    console.time("render");
    this.draw.color = 0x003030ff;
    this.draw.clear();

    this.scene.meshes.forEach((mesh) => {
      this.draw.mesh(mesh);
    });

    this.screen.swapbuffers();
    console.timeEnd("render");

    setTimeout(() => this.onFrame.emit(), 1_000 / this.fps);
  }
}

module.exports = { Renderer };
