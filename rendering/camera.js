const { CFrame } = require("../math/cframe");

class Camera {
  constructor() {
    this.cframe = new CFrame();
    this.fov = 100;
  }
}

module.exports = { Camera };
