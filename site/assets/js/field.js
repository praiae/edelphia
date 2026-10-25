/* =========================================================
   EDELPHIA — Particle field
   One cloud of points, five shapes:
   0 Φ symbol · 1 galaxy · 2 neural sphere · 3 wave field · 4 Φ again
   uProgress (0..4) blends between them on the GPU.
   ========================================================= */
(function () {
  'use strict';

  const NOISE = /* glsl */ `
    vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
    vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
    float snoise(vec3 v){
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
      i = mod(i, 289.0);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      float n_ = 1.0/7.0;
      vec3 ns = n_ * D.wyz - D.xzx;
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      vec4 x = x_ * ns.x + ns.yyyy;
      vec4 y = y_ * ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
  `;

  const VERT = /* glsl */ `
    uniform float uTime;
    uniform float uProgress;
    uniform float uPixelRatio;
    uniform float uSize;
    uniform float uIntro;
    uniform float uDim;
    uniform float uLight;
    uniform vec3  uMouse;
    uniform float uMouseStrength;

    attribute vec3 aPhi;
    attribute vec3 aGalaxy;
    attribute vec3 aSphere;
    attribute vec3 aGrid;
    attribute float aOrbit;
    attribute float aRandom;

    varying vec3 vColor;
    varying float vAlpha;

    ${NOISE}

    const float S = 1.0 / 52.0;   // svg units -> world units

    mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
    float ease(float t){ return t < 0.5 ? 4.0*t*t*t : 1.0 - pow(-2.0*t + 2.0, 3.0) / 2.0; }

    vec3 phiShape(){
      if (aOrbit < 0.0) return aPhi;
      // orbit: a tilted circle whose projection is the logo's ellipse (108 x 30, rotated 22deg)
      float a = aOrbit + uTime * 0.35;
      vec3 p = vec3(108.0 * cos(a), 30.0 * sin(a), -103.7 * sin(a)) * S;
      p.xy = rot(-0.384) * p.xy;
      return p + aPhi;   // aPhi holds a small jitter for orbit points
    }

    vec3 galaxyShape(){
      vec3 g = aGalaxy;
      float r = length(g.xz);
      g.xz = rot(uTime * 0.12 / (0.35 + r * 0.25)) * g.xz;
      g.yz = rot(-1.05) * g.yz;
      g.xy = rot(0.35) * g.xy;
      return g;
    }

    vec3 sphereShape(){
      vec3 n = normalize(aSphere);
      float d = snoise(n * 1.6 + vec3(uTime * 0.18));
      float d2 = snoise(n * 4.0 - vec3(uTime * 0.25)) * 0.35;
      vec3 p = aSphere + n * (d + d2) * 0.42;
      p.xz = rot(uTime * 0.08) * p.xz;
      return p;
    }

    vec3 gridShape(){
      vec3 p = aGrid;
      float w = sin(p.x * 0.7 + uTime * 0.9) * 0.35
              + cos(p.z * 0.55 + uTime * 0.7) * 0.35
              + snoise(vec3(p.x * 0.25, p.z * 0.25, uTime * 0.15)) * 0.5;
      p.y += w;
      return p;
    }

    void main(){
      vec3 phi = phiShape();
      float s0 = ease(clamp(uProgress,       0.0, 1.0));
      float s1 = ease(clamp(uProgress - 1.0, 0.0, 1.0));
      float s2 = ease(clamp(uProgress - 2.0, 0.0, 1.0));
      float s3 = ease(clamp(uProgress - 3.0, 0.0, 1.0));

      vec3 pos = mix(phi, galaxyShape(), s0);
      pos = mix(pos, sphereShape(), s1);
      pos = mix(pos, gridShape(),   s2);
      pos = mix(pos, phi,           s3);

      // turbulence peaks mid-transition, vanishes when a shape is settled
      float k = sin(fract(uProgress) * 3.14159);
      k = k * k;
      vec3 q = pos * 0.6 + aRandom * 4.0;
      vec3 turb = vec3(snoise(q + uTime * 0.2), snoise(q + 31.7), snoise(q - 17.3));
      pos += turb * k * 1.3;

      // intro: particles condense from a wide dust cloud
      vec3 dust = normalize(aGalaxy + vec3(0.001)) * (6.0 + aRandom * 6.0);
      pos = mix(dust, pos, ease(clamp(uIntro * 1.4 - aRandom * 0.4, 0.0, 1.0)));

      // idle breathing
      pos += 0.025 * vec3(
        sin(uTime * 1.3 + aRandom * 40.0),
        cos(uTime * 1.1 + aRandom * 30.0),
        sin(uTime * 0.9 + aRandom * 20.0));

      vec4 world = modelMatrix * vec4(pos, 1.0);

      // mouse: soft repulsion in world space
      vec3 dm = world.xyz - uMouse;
      float dist = length(dm.xy);
      float f = smoothstep(1.6, 0.0, dist) * uMouseStrength;
      world.xy += normalize(dm.xy + 0.0001) * f * 0.55;
      world.z  += f * 0.6;

      vec4 mv = viewMatrix * world;
      gl_Position = projectionMatrix * mv;

      float size = uSize * (0.35 + aRandom * aRandom * 1.6);
      gl_PointSize = size * uPixelRatio * (1.0 / -mv.z);

      vec3 blue  = vec3(0.184, 0.482, 1.0);
      vec3 soft  = vec3(0.620, 0.761, 1.0);
      vec3 white = vec3(0.949, 0.961, 0.976);
      float h = fract(aRandom * 7.31);
      vec3 darkC = h < 0.55 ? mix(blue, soft, h / 0.55) : mix(soft, white, (h - 0.55) / 0.45);
      // light theme: navy → brand blue, drawn with normal blending
      vec3 navy = vec3(0.039, 0.059, 0.094);
      vec3 deep = vec3(0.122, 0.373, 0.839);
      vec3 lightC = h < 0.5 ? mix(navy, deep, h / 0.5) : mix(deep, blue, (h - 0.5) / 0.5);
      vColor = mix(darkC + f * 0.6, mix(lightC, blue, f * 0.8), uLight);

      float depth = smoothstep(14.0, 3.0, -mv.z);
      vAlpha = (0.35 + 0.65 * depth) * (0.55 + 0.45 * aRandom) * uIntro * uDim * (1.0 + uLight * 0.25);
    }
  `;

  const FRAG = /* glsl */ `
    varying vec3 vColor;
    varying float vAlpha;
    void main(){
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float a = smoothstep(0.5, 0.0, d);
      a = pow(a, 1.6);
      gl_FragColor = vec4(vColor, a * vAlpha);
    }
  `;

  /* ---------- shape samplers (CPU, once) ---------- */
  const S = 1 / 52;
  const rnd = Math.random;
  const TAU = Math.PI * 2;

  function buildPhi(n) {
    const pos = new Float32Array(n * 3);
    const orbit = new Float32Array(n);
    const planetA = 0.2 * Math.PI;
    for (let i = 0; i < n; i++) {
      const r = rnd();
      let x, y, z = (rnd() - 0.5) * 0.22;
      orbit[i] = -1;
      if (r < 0.5) {                // bowl: ring between two ellipses
        const t = rnd() * TAU;
        const k = rnd();
        const ix = 50 * Math.cos(t), iy = 68 * Math.sin(t);
        const ox = 78 * Math.cos(t), oy = 72 * Math.sin(t);
        x = 120 + ix + (ox - ix) * k;
        y = 120 + iy + (oy - iy) * k;
      } else if (r < 0.68) {        // stem
        x = 114 + rnd() * 12;
        y = 22 + rnd() * 196;
      } else if (r < 0.74) {        // serifs
        x = 92 + rnd() * 56;
        y = rnd() < 0.5 ? 18 + rnd() * 5 : 217 + rnd() * 5;
      } else if (r < 0.77) {        // planet: a tight cluster riding the orbit
        orbit[i] = planetA;
        const a = rnd() * TAU, rr = Math.pow(rnd(), 2) * 0.14;
        pos[i * 3] = Math.cos(a) * rr;
        pos[i * 3 + 1] = Math.sin(a) * rr;
        pos[i * 3 + 2] = (rnd() - 0.5) * 0.1;
        continue;
      } else {                      // orbit ring
        orbit[i] = rnd() * TAU;
        pos[i * 3] = (rnd() - 0.5) * 0.06;
        pos[i * 3 + 1] = (rnd() - 0.5) * 0.06;
        pos[i * 3 + 2] = (rnd() - 0.5) * 0.06;
        continue;
      }
      pos[i * 3] = (x - 120) * S;
      pos[i * 3 + 1] = -(y - 120) * S;
      pos[i * 3 + 2] = z;
    }
    return { pos, orbit };
  }

  function buildGalaxy(n) {
    const pos = new Float32Array(n * 3);
    const arms = 3, R = 5.2;
    for (let i = 0; i < n; i++) {
      const r = Math.pow(rnd(), 1.6) * R;
      const arm = (i % arms) / arms * TAU;
      const spin = r * 1.05;
      const spread = Math.pow(rnd(), 3) * (rnd() < 0.5 ? 1 : -1) * 0.55 * (0.4 + r * 0.35);
      const a = arm + spin + spread;
      pos[i * 3] = Math.cos(a) * r + (rnd() - 0.5) * 0.15;
      pos[i * 3 + 1] = (rnd() - 0.5) * 0.35 * Math.exp(-r * 0.35);
      pos[i * 3 + 2] = Math.sin(a) * r + (rnd() - 0.5) * 0.15;
    }
    return pos;
  }

  function buildSphere(n) {
    const pos = new Float32Array(n * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const th = golden * i;
      const R = 2.1 * (rnd() < 0.12 ? 0.55 + rnd() * 0.4 : 1); // some inner "neurons"
      pos[i * 3] = Math.cos(th) * rad * R;
      pos[i * 3 + 1] = y * R;
      pos[i * 3 + 2] = Math.sin(th) * rad * R;
    }
    return pos;
  }

  function buildGrid(n) {
    const pos = new Float32Array(n * 3);
    const cols = Math.round(Math.sqrt(n * 1.6));
    const rows = Math.ceil(n / cols);
    for (let i = 0; i < n; i++) {
      const cx = i % cols, cz = Math.floor(i / cols);
      pos[i * 3] = (cx / (cols - 1) - 0.5) * 16 + (rnd() - 0.5) * 0.03;
      pos[i * 3 + 1] = -1.7;
      pos[i * 3 + 2] = 3.2 - (cz / (rows - 1)) * 14;
    }
    return pos;
  }

  /* ---------- Field ---------- */
  class Field {
    constructor(canvas, opts = {}) {
      this.canvas = canvas;
      this.count = opts.count || 22000;
      this.mouse = new THREE.Vector2(9, 9);
      this.mouseWorld = new THREE.Vector3(99, 99, 0);
      this.targetRot = new THREE.Vector2();
      this.offset = new THREE.Vector3();      // per-stage group offset (tweened from outside)
      this.clock = new THREE.Clock();
      this.running = true;

      const renderer = this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      this.camera.position.set(0, 0, 7.2);

      const n = this.count;
      const phi = buildPhi(n);
      const random = new Float32Array(n);
      for (let i = 0; i < n; i++) random[i] = rnd();

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      geo.setAttribute('aPhi', new THREE.BufferAttribute(phi.pos, 3));
      geo.setAttribute('aOrbit', new THREE.BufferAttribute(phi.orbit, 1));
      geo.setAttribute('aGalaxy', new THREE.BufferAttribute(buildGalaxy(n), 3));
      geo.setAttribute('aSphere', new THREE.BufferAttribute(buildSphere(n), 3));
      geo.setAttribute('aGrid', new THREE.BufferAttribute(buildGrid(n), 3));
      geo.setAttribute('aRandom', new THREE.BufferAttribute(random, 1));
      geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);

      this.uniforms = {
        uTime: { value: 0 },
        uProgress: { value: 0 },
        uPixelRatio: { value: renderer.getPixelRatio() },
        uSize: { value: 26 },
        uIntro: { value: 0 },
        uDim: { value: 1 },
        uLight: { value: 0 },
        uMouse: { value: this.mouseWorld },
        uMouseStrength: { value: 0 },
      };

      const mat = new THREE.ShaderMaterial({
        vertexShader: VERT,
        fragmentShader: FRAG,
        uniforms: this.uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      this.material = mat;
      this.points = new THREE.Points(geo, mat);
      this.group = new THREE.Group();
      this.group.add(this.points);
      this.scene.add(this.group);

      this.resize = this.resize.bind(this);
      this.tick = this.tick.bind(this);
      window.addEventListener('resize', this.resize);
      window.addEventListener('pointermove', (e) => {
        this.mouse.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
      }, { passive: true });
      document.addEventListener('pointerleave', () => this.mouse.set(9, 9));
      document.addEventListener('visibilitychange', () => {
        this.running = !document.hidden;
        if (this.running) { this.clock.getDelta(); requestAnimationFrame(this.tick); }
      });

      this.resize();
      requestAnimationFrame(this.tick);
    }

    get progress() { return this.uniforms.uProgress; }
    get intro() { return this.uniforms.uIntro; }
    get dim() { return this.uniforms.uDim; }

    // additive glow only reads on dark backgrounds; light mode uses normal blending
    setTheme(light) {
      this.uniforms.uLight.value = light ? 1 : 0;
      this.material.blending = light ? THREE.NormalBlending : THREE.AdditiveBlending;
      this.material.needsUpdate = true;
      this.renderer.render(this.scene, this.camera);   // fresh frame for the view-transition snapshot
    }

    resize() {
      const w = innerWidth, h = innerHeight;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      // keep the Φ comfortably inside narrow (portrait) screens
      this.camera.position.z = w / h < 0.8 ? 7.2 / Math.max(w / h, 0.45) * 0.8 : 7.2;
      this.camera.updateProjectionMatrix();
    }

    tick() {
      if (!this.running) return;
      const dt = Math.min(this.clock.getDelta(), 0.05);
      this.uniforms.uTime.value += dt;

      // mouse → world plane z = 0
      const cam = this.camera;
      const halfH = Math.tan((cam.fov * Math.PI) / 360) * cam.position.z;
      const halfW = halfH * cam.aspect;
      const has = Math.abs(this.mouse.x) <= 1;
      if (has) this.mouseWorld.set(this.mouse.x * halfW, this.mouse.y * halfH, 0);
      const ms = this.uniforms.uMouseStrength;
      ms.value += ((has ? 1 : 0) - ms.value) * 0.06;

      // gentle parallax toward the pointer
      const mx = has ? this.mouse.x : 0, my = has ? this.mouse.y : 0;
      this.targetRot.set(-my * 0.18, mx * 0.28);
      this.group.rotation.x += (this.targetRot.x - this.group.rotation.x) * 0.04;
      this.group.rotation.y += (this.targetRot.y + Math.sin(this.uniforms.uTime.value * 0.15) * 0.12 - this.group.rotation.y) * 0.04;
      this.group.position.copy(this.offset);

      this.renderer.render(this.scene, cam);
      requestAnimationFrame(this.tick);
    }
  }

  window.EdelphiaField = Field;
})();
