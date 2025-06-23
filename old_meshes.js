class BlockMesh extends Mesh {
  constructor(w, h, d) {
    super();

    this.vertices = [
      new Vec3(w, h, d),
      new Vec3(-w, h, d),
      new Vec3(-w, -h, d),
      new Vec3(w, -h, d),

      new Vec3(w, h, -d),
      new Vec3(-w, h, -d),
      new Vec3(-w, -h, -d),
      new Vec3(w, -h, -d),
    ];

    this.indexes = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],

      [4, 5],
      [5, 6],
      [6, 7],
      [7, 4],

      [0, 4],
      [1, 5],
      [2, 6],
      [3, 7],
    ];
  }
}

// created by AI
class TorusMesh extends Mesh {
  /**
   * @param {number} R - Major radius (torus ring radius)
   * @param {number} r - Minor radius (tube radius)
   * @param {number} segments - Number of segments around the ring
   * @param {number} sides - Number of segments around the tube
   */
  constructor(R, r, segments = 24, sides = 12) {
    super();

    this.vertices = [];
    this.indexes = [];

    for (let i = 0; i < segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cosTheta = Math.cos(theta);
      const sinTheta = Math.sin(theta);

      for (let j = 0; j < sides; j++) {
        const phi = (j / sides) * Math.PI * 2;
        const cosPhi = Math.cos(phi);
        const sinPhi = Math.sin(phi);

        const x = (R + r * cosPhi) * cosTheta;
        const y = r * sinPhi;
        const z = (R + r * cosPhi) * sinTheta;

        this.vertices.push(new Vec3(x, y, z));
      }
    }

    // Create indexes to form wireframe (edges between adjacent vertices)
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < sides; j++) {
        const current = i * sides + j;
        const nextSide = i * sides + ((j + 1) % sides);
        const nextSegment = ((i + 1) % segments) * sides + j;

        // edge along side
        this.indexes.push([current, nextSide]);
        // edge along ring
        this.indexes.push([current, nextSegment]);
      }
    }
  }
}

class FishMesh extends Mesh {
  constructor(length = 2, height = 1, width = 0.5) {
    super();

    const hl = length / 2;
    const hh = height / 2;
    const hw = width / 2;

    // Fish body shape (flattened along XZ plane, extruded in width)
    const front = new Vec3(hl, 0, 0.4);
    const top = new Vec3(0, hh, 1);
    const bottom = new Vec3(0, -hh, 1);
    const backTop = new Vec3(-hl + 0.2, hh / 2, 0.5);
    const backBottom = new Vec3(-hl + 0.2, -hh / 2, 0.5);
    const tailTop = new Vec3(-hl * 1.5, hh, 1);
    const tailBottom = new Vec3(-hl * 1.5, -hh, 1);

    // Left and right side extrusion for 3D effect
    const mirror = (p) => new Vec3(p.x, p.y, p.z * hw);
    const mirrorNeg = (p) => new Vec3(p.x, p.y, p.z * -hw);

    const points = [
      front,
      top,
      bottom,
      backTop,
      backBottom,
      tailTop,
      tailBottom,
    ];

    this.vertices = [
      ...points.map(mirror), // Right side
      ...points.map(mirrorNeg), // Left side
    ];

    // Edges: connect corresponding right and left vertices
    for (let i = 0; i < points.length; i++) {
      this.indexes.push([i, i + points.length]); // cross-line
    }

    // Wireframe edges on right side
    this.indexes.push([0, 1], [1, 3], [3, 5]); // top edge
    this.indexes.push([0, 2], [2, 4], [4, 6]); // bottom edge

    // Mirror those edges on the left side
    const offset = points.length;
    this.indexes.push(
      [0 + offset, 1 + offset],
      [1 + offset, 3 + offset],
      [3 + offset, 5 + offset]
    );
    this.indexes.push(
      [0 + offset, 2 + offset],
      [2 + offset, 4 + offset],
      [4 + offset, 6 + offset]
    );

    this.indexes.push([5, 6]);
    this.indexes.push([5 + offset, 6 + offset]);

    this.indexes.push([3, 4]);
    this.indexes.push([3 + offset, 4 + offset]);

    this.indexes.push([1, 2]);
    this.indexes.push([1 + offset, 2 + offset]);
  }
}

// const b2 = new TorusMesh(40, 15);

// const b2 = new FishMesh(60, 20, 10);
