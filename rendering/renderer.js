const { EventSubject } = require("../utils/event-subject");
const { TerminalScreen } = require("./screens/terminal");

class Renderer {
  onFrame = new EventSubject();

  constructor(camera) {
    this.camera = camera;
    this.screen = new TerminalScreen();
    this.fps = 30;

    this.onFrame.sub(this.onFrame, this);
  }

  start() {
    this.onFrame();
  }

  onFrame() {
    console.time("render");
    clearbuffer(0x00303000);

    meshes.forEach(render_mesh);

    swapbuffers();
    console.timeEnd("render");

    setInterval(() => this.onFrame.emit(), 1_000 / this.fps);
  }
}

module.exports = { Renderer };
