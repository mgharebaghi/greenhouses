import * as THREE from "three";

const ease = (value: number) => {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

/** Imperative renderer isolated from React and the authentication flow. */
export function mountSeedGrowthScene(host: HTMLDivElement): () => void {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-4, 4, 3, -3, 0.1, 40);
  camera.position.set(5, 4.2, 8);
  camera.lookAt(0, 1.25, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.className = "absolute inset-0 h-full w-full";
  renderer.domElement.setAttribute("aria-hidden", "true");

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const material = (color: number) => {
    const value = new THREE.MeshStandardMaterial({ color, roughness: 0.85 });
    materials.add(value);
    return value;
  };
  const mesh = (
    geometry: THREE.BufferGeometry,
    surface: THREE.Material,
    parent: THREE.Object3D = scene,
  ) => {
    geometries.add(geometry);
    const value = new THREE.Mesh(geometry, surface);
    parent.add(value);
    return value;
  };
  scene.add(new THREE.HemisphereLight(0xd5ffe7, 0x47352d, 2.6));
  const light = new THREE.DirectionalLight(0xffe8c0, 3.2);
  light.position.set(-3, 6, 5);
  scene.add(light);

  const cellCenters = Array.from(
    { length: 6 },
    (_, index) =>
      new THREE.Vector3(((index % 3) - 1) * 1.48, 0, index < 3 ? -0.74 : 0.74),
  );
  const trayMaterial = material(0x294b40);
  trayMaterial.roughness = 0.68;
  const roundedRectangle = (width: number, height: number, radius: number) => {
    const shape = new THREE.Shape();
    const x = -width / 2;
    const y = -height / 2;
    shape.moveTo(x + radius, y);
    shape.lineTo(x + width - radius, y);
    shape.quadraticCurveTo(x + width, y, x + width, y + radius);
    shape.lineTo(x + width, y + height - radius);
    shape.quadraticCurveTo(
      x + width,
      y + height,
      x + width - radius,
      y + height,
    );
    shape.lineTo(x + radius, y + height);
    shape.quadraticCurveTo(x, y + height, x, y + height - radius);
    shape.lineTo(x, y + radius);
    shape.quadraticCurveTo(x, y, x + radius, y);
    return shape;
  };
  // A single molded rim connects six tapered square plug cells.
  const trayShape = roundedRectangle(4.72, 3.2, 0.18);
  for (const center of cellCenters) {
    const opening = roundedRectangle(1.2, 1.2, 0.09);
    const hole = new THREE.Path(
      opening
        .getPoints(24)
        .map(
          (point) => new THREE.Vector2(point.x + center.x, point.y - center.z),
        ),
    );
    trayShape.holes.push(hole);
  }
  const trayRim = mesh(
    new THREE.ExtrudeGeometry(trayShape, {
      depth: 0.09,
      bevelEnabled: true,
      bevelSize: 0.025,
      bevelThickness: 0.025,
      bevelSegments: 2,
      curveSegments: 8,
    }),
    trayMaterial,
  );
  trayRim.rotation.x = -Math.PI / 2;
  trayRim.position.y = 0.08;
  const cellGeometry = new THREE.BufferGeometry();
  cellGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
      [
        -0.6, 0.1, -0.6, 0.6, 0.1, -0.6, 0.6, 0.1, 0.6, -0.6, 0.1, 0.6, -0.43,
        -0.8, -0.43, 0.43, -0.8, -0.43, 0.43, -0.8, 0.43, -0.43, -0.8, 0.43,
      ],
      3,
    ),
  );
  cellGeometry.setIndex([
    0, 4, 1, 1, 4, 5, 1, 5, 2, 2, 5, 6, 2, 6, 3, 3, 6, 7, 3, 7, 0, 0, 7, 4, 4,
    7, 5, 5, 7, 6,
  ]);
  cellGeometry.computeVertexNormals();
  const cellMaterial = material(0x203e34);
  cellMaterial.side = THREE.DoubleSide;
  cellCenters.forEach((center) =>
    mesh(cellGeometry, cellMaterial).position.copy(center),
  );
  const shadowMaterial = new THREE.MeshBasicMaterial({
    color: 0x020b10,
    transparent: true,
    opacity: 0.16,
  });
  materials.add(shadowMaterial);
  const trayShadow = mesh(new THREE.PlaneGeometry(5, 3.4), shadowMaterial);
  trayShadow.rotation.x = -Math.PI / 2;
  trayShadow.position.y = -0.86;
  const earth = new THREE.Group();
  earth.scale.set(0.2, 0.55, 0.275);
  // A shallow soil bed with shared geometry and instanced clods.
  // The grain texture is generated locally; no external assets are loaded.
  const soilMaterial = material(0x674631);
  soilMaterial.vertexColors = true;
  const wetSoil = new THREE.Color(0x423024);
  const drySoil = soilMaterial.color.clone();
  const soilHeight = (x: number, z: number) => {
    const radius = Math.hypot(x / 2.55, z / 1.85);
    return (
      0.16 -
      0.14 * Math.pow(radius, 1.7) +
      Math.sin(x * 9 + z * 4) * Math.cos(z * 11 - x * 3) * 0.045 +
      Math.sin(x * 19 - z * 13) * 0.018
    );
  };
  const random = (index: number) => {
    const value = Math.sin(index * 127.1 + 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const grainSize = 128;
  const grainData = new Uint8Array(grainSize * grainSize * 4);
  for (let y = 0; y < grainSize; y++) {
    for (let x = 0; x < grainSize; x++) {
      const index = y * grainSize + x;
      const clusters =
        Math.sin(x * 0.41 + Math.sin(y * 0.3)) * Math.cos(y * 0.37);
      const value = Math.round(100 + random(index) * 85 + clusters * 30);
      grainData.set([value, value, value, 255], index * 4);
    }
  }
  const grainTexture = new THREE.DataTexture(grainData, grainSize, grainSize);
  grainTexture.wrapS = grainTexture.wrapT = THREE.RepeatWrapping;
  grainTexture.magFilter = THREE.LinearFilter;
  grainTexture.minFilter = THREE.LinearMipmapLinearFilter;
  grainTexture.generateMipmaps = true;
  grainTexture.needsUpdate = true;
  textures.add(grainTexture);
  soilMaterial.bumpMap = grainTexture;
  soilMaterial.bumpScale = 0.075;
  soilMaterial.roughness = 1;
  const rings = 18;
  const segments = 96;
  const positions: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let ring = 0; ring <= rings; ring++) {
    for (let segment = 0; segment <= segments; segment++) {
      const angle = (segment / segments) * Math.PI * 2;
      const edge =
        1 + Math.sin(angle * 7) * 0.055 + Math.cos(angle * 11) * 0.04;
      const radius = (ring / rings) * edge;
      const x = Math.cos(angle) * radius * 2.55;
      const z = Math.sin(angle) * radius * 1.85;
      positions.push(x, soilHeight(x, z), z);
      uvs.push((x / 5.5 + 0.5) * 4, (z / 4 + 0.5) * 4);
      const shade =
        0.65 +
        Math.sin(x * 4 + z * 3) * 0.1 +
        random(ring * segments + segment) * 0.12;
      colors.push(shade, shade * 0.87, shade * 0.72);
      if (ring < rings && segment < segments) {
        const vertex = ring * (segments + 1) + segment;
        indices.push(
          vertex,
          vertex + 1,
          vertex + segments + 1,
          vertex + 1,
          vertex + segments + 2,
          vertex + segments + 1,
        );
      }
    }
  }
  const soilGeometry = new THREE.BufferGeometry();
  soilGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3),
  );
  soilGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3),
  );
  soilGeometry.setIndex(indices);
  soilGeometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  soilGeometry.computeVertexNormals();
  mesh(soilGeometry, soilMaterial, earth);

  const clodMaterial = material(0x694831);
  clodMaterial.bumpMap = grainTexture;
  clodMaterial.bumpScale = 0.045;
  clodMaterial.roughness = 1;
  const clodDryColor = clodMaterial.color.clone();
  const clodWetColor = new THREE.Color(0x443126);
  const clodGeometry = new THREE.SphereGeometry(1, 12, 8);
  const clodPositions = clodGeometry.getAttribute("position");
  for (let i = 0; i < clodPositions.count; i++) {
    const x = clodPositions.getX(i);
    const y = clodPositions.getY(i);
    const z = clodPositions.getZ(i);
    const roughness = 1 + Math.sin(x * 7 + y * 9 + z * 6) * 0.12;
    clodPositions.setXYZ(i, x * roughness, y * roughness, z * roughness);
  }
  clodGeometry.computeVertexNormals();
  const addSoilParticles = (count: number, fine: boolean) => {
    const geometry = fine ? new THREE.IcosahedronGeometry(1, 0) : clodGeometry;
    geometries.add(geometry);
    const particles = new THREE.InstancedMesh(geometry, clodMaterial, count);
    const transform = new THREE.Object3D();
    const color = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const offset = fine ? 2000 : 0;
      const angle = random(i * 5 + offset) * Math.PI * 2;
      const radius = Math.sqrt(random(i * 5 + offset + 1)) * 0.98;
      const x = Math.cos(angle) * radius * 2.5;
      const z = Math.sin(angle) * radius * 1.8;
      const size = fine
        ? 0.008 + random(i * 5 + offset + 2) * 0.025
        : 0.035 + Math.pow(random(i * 5 + 2), 3) * 0.12;
      transform.position.set(x, soilHeight(x, z) + size * 0.23, z);
      transform.scale.set(
        size * (0.85 + random(i + 80) * 0.5),
        size * (0.4 + random(i + 140) * 0.3),
        size,
      );
      transform.rotation.set(random(i + 50) * 3, angle, random(i + 90) * 2);
      transform.updateMatrix();
      particles.setMatrixAt(i, transform.matrix);
      color.setHSL(
        0.065 + random(i + 100) * 0.025,
        0.2 + random(i + 110) * 0.18,
        0.3 + random(i + 120) * 0.24,
      );
      particles.setColorAt(i, color);
    }
    earth.add(particles);
    return particles;
  };
  const clods = addSoilParticles(80, false);
  const grains = addSoilParticles(220, true);
  const seed = mesh(new THREE.SphereGeometry(0.14, 16, 10), material(0xd9b879));
  seed.scale.set(0.7, 1.3, 0.8);

  const plant = new THREE.Group();
  plant.position.y = 0.2;
  scene.add(plant);
  const stemMaterial = material(0xb6ce64);
  const stemPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(-0.09, 0.6, 0),
    new THREE.Vector3(0.07, 1.35, 0),
    new THREE.Vector3(0, 2.3, 0),
  ]);
  mesh(
    new THREE.TubeGeometry(stemPath, 24, 0.028, 8, false),
    stemMaterial,
    plant,
  );
  const leafMaterials = [material(0xa3ca42), material(0xb5d94c)];
  leafMaterials.forEach((surface) => {
    surface.side = THREE.DoubleSide;
    surface.roughness = 0.65;
    surface.vertexColors = true;
  });
  // Thin, curved blades with a soft central fold instead of extruded slabs.
  const leafPoint = (t: number, across: number) => {
    const width = 0.29 * Math.pow(Math.sin(Math.PI * t), 0.55);
    return new THREE.Vector3(
      across * width,
      t * 1.2,
      Math.sin(Math.PI * t) * (0.12 - across * across * 0.11) - t * t * 0.1,
    );
  };
  const leafPositions: number[] = [];
  const leafColors: number[] = [];
  const leafIndices: number[] = [];
  const leafRows = 20;
  const leafColumns = 8;
  for (let row = 0; row <= leafRows; row++) {
    for (let column = 0; column <= leafColumns; column++) {
      const t = row / leafRows;
      const across = (column / leafColumns) * 2 - 1;
      const point = leafPoint(t, across);
      leafPositions.push(point.x, point.y, point.z);
      const shade = 0.76 + t * 0.17 + Math.abs(across) * 0.07;
      leafColors.push(shade, shade, shade * 0.94);
      if (row < leafRows && column < leafColumns) {
        const vertex = row * (leafColumns + 1) + column;
        leafIndices.push(
          vertex,
          vertex + 1,
          vertex + leafColumns + 1,
          vertex + 1,
          vertex + leafColumns + 2,
          vertex + leafColumns + 1,
        );
      }
    }
  }
  const leafGeometry = new THREE.BufferGeometry();
  leafGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(leafPositions, 3),
  );
  leafGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(leafColors, 3),
  );
  leafGeometry.setIndex(leafIndices);
  leafGeometry.computeVertexNormals();
  const veinMaterial = material(0xd2e784);
  const midrib = new THREE.CatmullRomCurve3(
    Array.from({ length: 9 }, (_, i) => {
      const point = leafPoint(i / 8, 0);
      point.z += 0.004;
      return point;
    }),
  );
  const midribGeometry = new THREE.TubeGeometry(midrib, 20, 0.004, 4, false);
  const sideVeinPositions: number[] = [];
  for (let i = 0; i < 5; i++) {
    const t = 0.22 + i * 0.12;
    for (const side of [-1, 1]) {
      const start = leafPoint(t, 0);
      const end = leafPoint(t + 0.1, side * 0.82);
      sideVeinPositions.push(
        start.x,
        start.y,
        start.z + 0.005,
        end.x,
        end.y,
        end.z + 0.005,
      );
    }
  }
  const sideVeinGeometry = new THREE.BufferGeometry();
  sideVeinGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(sideVeinPositions, 3),
  );
  geometries.add(sideVeinGeometry);
  const sideVeinMaterial = new THREE.LineBasicMaterial({
    color: 0xbad89a,
    transparent: true,
    opacity: 0.25,
  });
  materials.add(sideVeinMaterial);
  const leaves: THREE.Group[] = [];
  // Two cotyledons at the crown, matching the reference's young seedling.
  for (let i = 0; i < 2; i++) {
    const pivot = new THREE.Group();
    const stemPoint = stemPath.getPoint(i === 0 ? 0.93 : 0.98);
    pivot.position.copy(stemPoint);
    pivot.rotation.set(
      i === 0 ? 0.62 : -0.18,
      i === 0 ? 0.85 : 0.55,
      i === 0 ? 1.12 : -0.25,
    );
    plant.add(pivot);
    mesh(leafGeometry, leafMaterials[i % 2], pivot);
    mesh(midribGeometry, veinMaterial, pivot);
    pivot.add(new THREE.LineSegments(sideVeinGeometry, sideVeinMaterial));
    leaves.push(pivot);
  }
  // All cells share geometry and textures, with independent growth and moisture.
  seed.removeFromParent();
  plant.removeFromParent();
  const soilInstances: THREE.InstancedMesh[] = [];
  // Deliberate silhouettes keep the differences visible at the login's scale.
  const seedlingProfiles = [
    {
      height: 0.81,
      width: 0.62,
      leafLength: [0.9, 1.02],
      leafWidth: [1.12, 1.08],
      spread: [0.12, -0.12],
    },
    {
      height: 0.6,
      width: 0.67,
      leafLength: [0.78, 1.2],
      leafWidth: [0.9, 0.75],
      spread: [-0.18, -0.48],
    },
    {
      height: 0.72,
      width: 0.63,
      leafLength: [1.1, 0.84],
      leafWidth: [0.84, 1.3],
      spread: [0.24, -0.18],
    },
    {
      height: 0.52,
      width: 0.7,
      leafLength: [0.86, 1.1],
      leafWidth: [1.22, 1.13],
      spread: [-0.28, -0.37],
    },
    {
      height: 0.76,
      width: 0.62,
      leafLength: [0.95, 0.92],
      leafWidth: [1.04, 0.86],
      spread: [0.03, 0.08],
    },
    {
      height: 0.64,
      width: 0.66,
      leafLength: [1.06, 1.12],
      leafWidth: [0.95, 1.18],
      spread: [-0.12, -0.28],
    },
  ];
  const cells = cellCenters.map((center, index) => {
    const soil = earth.clone(true);
    soil.position.copy(center);
    const soilSurface = soilMaterial.clone();
    const clodSurface = clodMaterial.clone();
    materials.add(soilSurface);
    materials.add(clodSurface);
    soil.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.material =
          object.material === soilMaterial ? soilSurface : clodSurface;
      }
      if (object instanceof THREE.InstancedMesh) soilInstances.push(object);
    });
    scene.add(soil);
    const sprout = plant.clone(true);
    const profile = seedlingProfiles[index];
    // Stable variation keeps each seedling's appearance across animation loops.
    const variation = {
      height: profile.height,
      width: profile.width,
      lean: (random(index + 331) - 0.5) * 0.13,
      turn: (random(index + 347) - 0.5) * 0.48,
      growthDuration: 4.6 + random(index + 359) * 1.1,
      swaySpeed: 0.85 + random(index + 373) * 0.3,
    };
    const bend = (random(index + 389) - 0.5) * 0.34;
    const individualStem = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.05 + bend, 0.6, 0.02),
      new THREE.Vector3(0.04 - bend * 0.5, 1.35, -0.025),
      new THREE.Vector3(bend * 0.4, 2.3, 0),
    ]);
    const stem = sprout.children[0] as THREE.Mesh;
    stem.geometry = new THREE.TubeGeometry(
      individualStem,
      24,
      0.025 + random(index + 401) * 0.006,
      8,
      false,
    );
    geometries.add(stem.geometry);
    const individualLeaves = sprout.children
      .filter((child): child is THREE.Group => child instanceof THREE.Group)
      .map((leaf, leafIndex) => {
        const leafSeed = 419 + index * 17 + leafIndex * 5;
        leaf.position.copy(
          individualStem.getPoint(leafIndex === 0 ? 0.93 : 0.98),
        );
        leaf.rotation.x += (random(leafSeed) - 0.5) * 0.24;
        leaf.rotation.y += (random(leafSeed + 1) - 0.5) * 0.3;
        const surface = leafMaterials[leafIndex].clone();
        surface.color.offsetHSL(
          (random(leafSeed + 2) - 0.5) * 0.025,
          (random(leafSeed + 3) - 0.5) * 0.08,
          (random(leafSeed + 4) - 0.5) * 0.055,
        );
        materials.add(surface);
        (leaf.children[0] as THREE.Mesh).material = surface;
        return {
          object: leaf,
          length: profile.leafLength[leafIndex],
          width: profile.leafWidth[leafIndex],
          spread: profile.spread[leafIndex],
          fold: 0.65 + random(leafSeed + 7) * 0.7,
        };
      });
    sprout.position.set(center.x, 0.12, center.z);
    sprout.rotation.y = variation.turn;
    scene.add(sprout);
    const kernel = seed.clone();
    kernel.scale.multiplyScalar(0.7);
    scene.add(kernel);
    return {
      center,
      sprout,
      kernel,
      soilSurface,
      clodSurface,
      leaves: individualLeaves,
      variation,
    };
  });
  const wateringCan = new THREE.Group();
  scene.add(wateringCan);
  const canMaterial = material(0x82c5bd);
  mesh(
    new THREE.CylinderGeometry(0.35, 0.3, 0.62, 24),
    canMaterial,
    wateringCan,
  );
  const rim = mesh(
    new THREE.TorusGeometry(0.35, 0.025, 6, 24),
    material(0xc7e8cf),
    wateringCan,
  );
  rim.rotation.x = Math.PI / 2;
  rim.position.y = 0.32;
  const handle = mesh(
    new THREE.TorusGeometry(0.3, 0.045, 6, 20, Math.PI * 1.6),
    canMaterial,
    wateringCan,
  );
  handle.position.set(0.36, 0.05, 0);
  handle.rotation.z = -Math.PI * 0.8;
  const spout = mesh(
    new THREE.CylinderGeometry(0.07, 0.11, 0.72, 12),
    canMaterial,
    wateringCan,
  );
  spout.rotation.z = 0.95;
  spout.position.set(-0.48, 0.1, 0);
  const nozzle = mesh(
    new THREE.CylinderGeometry(0.14, 0.14, 0.1, 16),
    canMaterial,
    wateringCan,
  );
  nozzle.rotation.z = 0.95;
  nozzle.position.set(-0.78, 0.32, 0);
  const waterMaterial = new THREE.MeshBasicMaterial({
    color: 0x9bddd9,
    transparent: true,
    opacity: 0.8,
  });
  materials.add(waterMaterial);
  const dropGeometry = new THREE.SphereGeometry(0.035, 6, 6);
  const drops = Array.from({ length: 24 }, () => {
    const drop = mesh(dropGeometry, waterMaterial);
    drop.scale.y = 1.9;
    return drop;
  });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let elapsed = 0;
  let previous = 0;
  let lastRender = 0;
  let frame = 0;
  let inView = true;
  let contextLost = false;
  let destroyed = false;
  const fallback = host.querySelector("svg");
  const update = (time: number) => {
    const t = reducedMotion.matches ? 17 : time % 23;
    const fade = 1 - ease((t - 21) / 1.5);
    cells.forEach((cell, index) => {
      const plantedAt = 0.4 + index * 0.35;
      const wateredAt = 4.2 + [0, 1, 2, 5, 4, 3].indexOf(index) * 0.85;
      const falling = ease((t - plantedAt) / 0.9);
      cell.kernel.visible = t >= plantedAt && t < plantedAt + 1.4;
      cell.kernel.position.set(
        cell.center.x - 0.16 * (1 - falling),
        2.8 * (1 - falling) + 0.09 - ease((t - plantedAt - 0.9) / 0.5) * 0.2,
        cell.center.z,
      );
      cell.kernel.rotation.z = time * 1.6 + index;
      const growth =
        ease((t - wateredAt - 1.2) / cell.variation.growthDuration) * fade;
      cell.sprout.visible = growth > 0.001;
      cell.sprout.scale.set(
        cell.variation.width * (0.6 + growth * 0.4),
        Math.max(growth, 0.001) * cell.variation.height,
        cell.variation.width * (0.6 + growth * 0.4),
      );
      cell.sprout.rotation.z =
        cell.variation.lean * growth +
        (reducedMotion.matches
          ? 0
          : Math.sin(time * cell.variation.swaySpeed + index) * 0.025 * growth);
      cell.leaves.forEach((leaf, leafIndex) => {
        const opening = ease((growth - 0.3) / 0.7);
        const size = Math.max(0.001, opening * (leafIndex === 0 ? 0.78 : 0.92));
        leaf.object.scale.set(
          size * (leafIndex === 0 ? 0.72 : 0.94) * leaf.width,
          size * leaf.length,
          size * leaf.fold,
        );
        leaf.object.rotation.z =
          (leafIndex === 0 ? 0.2 + opening * 0.92 : -0.08 - opening * 0.17) +
          leaf.spread * opening;
      });
      const moisture = ease((t - wateredAt) / 0.7) * fade;
      cell.soilSurface.color.copy(drySoil).lerp(wetSoil, moisture);
      cell.clodSurface.color.copy(clodDryColor).lerp(clodWetColor, moisture);
    });
    // Serpentine pass: back row left-to-right, then front row right-to-left.
    const wateringOrder = [0, 1, 2, 5, 4, 3];
    const pass = THREE.MathUtils.clamp((t - 4.2) / 0.85, 0, 5);
    const current = Math.floor(pass);
    const next = Math.min(current + 1, 5);
    const target = cellCenters[wateringOrder[current]]
      .clone()
      .lerp(cellCenters[wateringOrder[next]], ease(pass - current));
    wateringCan.visible = t >= 3.7 && t < 9.4;
    wateringCan.position.set(
      target.x + 0.83 + (1 - ease((t - 3.7) / 0.5)) * 1.3,
      2.5 + ease((t - 8.8) / 0.6) * 1.3,
      target.z,
    );
    wateringCan.rotation.z = 0.42 * ease((t - 3.7) / 0.5);
    drops.forEach((drop, index) => {
      drop.visible = t >= 4.2 && t < 9;
      const progress = (((t * 1.8 + index / drops.length) % 1) + 1) % 1;
      drop.position.set(
        target.x + Math.sin(index * 7) * 0.22 * progress,
        2.4 * (1 - progress) + 0.09,
        target.z + Math.cos(index * 5) * 0.22 * progress,
      );
    });
  };
  const draw = () => {
    update(elapsed);
    renderer.render(scene, camera);
    if (fallback) fallback.style.visibility = "hidden";
  };
  const tick = (now: number) => {
    frame = requestAnimationFrame(tick);
    if (now - lastRender < 1000 / 30) return;
    elapsed += Math.min((now - previous) / 1000, 0.1);
    previous = now;
    lastRender = now;
    draw();
  };
  const syncPlayback = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    if (
      destroyed ||
      contextLost ||
      document.hidden ||
      !inView ||
      host.clientWidth === 0
    )
      return;
    draw();
    if (!reducedMotion.matches) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    }
  };
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (width === 0 || height === 0) {
      syncPlayback();
      return;
    }
    const aspect = width / height;
    camera.left = -3 * aspect;
    camera.right = 3 * aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    syncPlayback();
  };
  const onContextLost = (event: Event) => {
    event.preventDefault();
    contextLost = true;
    cancelAnimationFrame(frame);
    if (fallback) fallback.style.visibility = "visible";
  };
  const onContextRestored = () => {
    contextLost = false;
    syncPlayback();
  };
  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncPlayback();
  });
  renderer.domElement.addEventListener("webglcontextlost", onContextLost);
  renderer.domElement.addEventListener(
    "webglcontextrestored",
    onContextRestored,
  );
  document.addEventListener("visibilitychange", syncPlayback);
  reducedMotion.addEventListener("change", syncPlayback);
  host.appendChild(renderer.domElement);
  resizeObserver.observe(host);
  intersectionObserver.observe(host);
  resize();

  return () => {
    destroyed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    document.removeEventListener("visibilitychange", syncPlayback);
    reducedMotion.removeEventListener("change", syncPlayback);
    renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
    renderer.domElement.removeEventListener(
      "webglcontextrestored",
      onContextRestored,
    );
    soilInstances.forEach((instance) => instance.dispose());
    clods.dispose();
    grains.dispose();
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((surface) => surface.dispose());
    textures.forEach((texture) => texture.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
    if (fallback) fallback.style.visibility = "visible";
  };
}
