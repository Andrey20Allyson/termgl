const { stdout } = require("node:process");

const Reset = "\x1b[0m";

function bgrgb(r, g, b) {
  return `\x1b[48;2;${r};${g};${b}m`;
}

function txrgb(r, g, b) {
  return `\x1b[38;2;${r};${g};${b}m`;
}

function u32torgba(u32) {
  return [
    u32 >>> (8 * 3),
    (u32 >>> (8 * 2)) & 0xff,
    (u32 >>> (8 * 1)) & 0xff,
    u32 & 0xff,
  ];
}

class TerminalScreen {
  constructor() {
    const [w, h] = stdout.getWindowSize();

    this.width = w;
    this.height = h * 2;

    this.backbuffer = new Uint32Array(this.width * this.height);
    this.frontbuffer = new Uint32Array(this.width * this.height);
  }

  swapbuffers() {
    const buffer = this.backbuffer;
    this.backbuffer = this.frontbuffer;
    this.frontbuffer = buffer;

    const rowc = this.height / 2;

    const pixels = [];

    for (let i = 0; i < rowc; i++) {
      for (let j = 0; j < this.width; j++) {
        const [p1, p2] = this.getPixels(i, j);

        if (p1 === p2) {
          const [p1r, p1g, p1b, p1a] = u32torgba(p1);
          const p1color = bgrgb(p1r, p1g, p1b);

          pixels.push(`${p1color} `);
          continue;
        }

        const [p1r, p1g, p1b, p1a] = u32torgba(p1);
        const p1color = txrgb(p1r, p1g, p1b);

        const [p2r, p2g, p2b, p2a] = u32torgba(p2);
        const p2color = bgrgb(p2r, p2g, p2b);

        pixels.push(`${p1color}${p2color}▀`);
      }

      pixels.push("\n");
    }

    pixels.pop();
    pixels.push(Reset);

    stdout.cursorTo(0, 0);
    stdout.write(pixels.join(""));
    stdout.cursorTo(0, 0);
  }

  getPixels(row, col) {
    const i1 = col + (row * 2 + 0) * this.width;
    const i2 = col + (row * 2 + 1) * this.width;

    return [this.frontbuffer[i1], this.frontbuffer[i2]];
  }
}

module.exports = { TerminalScreen };
