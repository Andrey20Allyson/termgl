class Draw3d {
  constructor(screen) {
    this.color = 0xffffffff;
    this.screen = screen;

    this.zbufferStart = 0;
    this.zbuffer = new Float32Array(this.screen.backbuffer.length);
  }

  clear() {
    for (let i = 0; i < this.screen.backbuffer.length; i++) {
      this.screen.backbuffer[i] = this.color;
      this.zbuffer[i] = this.zbufferStart;
    }
  }

  mesh(mesh) {}

  face(p0, p1, p2) {}

  line(p0, p1) {}

  pixel(pos) {}
}

module.exports = { Draw3d };
