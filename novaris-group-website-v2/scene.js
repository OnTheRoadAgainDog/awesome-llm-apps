/* ===========================================================
   Novaris Group v2 — interactive 3D globe (Three.js)
   A particle globe with orbiting connection arcs that reacts to
   the pointer. Degrades gracefully if Three.js / WebGL is absent.
   =========================================================== */
(function () {
  'use strict';

  const canvas = document.getElementById('globe');
  if (!canvas) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Fallback: paint a static radial glow if Three.js or WebGL is unavailable.
  function fallback() {
    canvas.style.background =
      'radial-gradient(60% 60% at 70% 35%, rgba(37,99,235,.30), transparent 60%),' +
      'radial-gradient(50% 50% at 25% 70%, rgba(34,211,238,.16), transparent 60%)';
  }

  if (typeof THREE === 'undefined' || reduce) { fallback(); return; }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) { fallback(); return; }
  if (!renderer || !renderer.getContext()) { fallback(); return; }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.z = 11.5;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const group = new THREE.Group();
  scene.add(group);

  const R = 4.2;

  /* --- soft circular sprite for particles --- */
  function discTexture() {
    const s = 64;
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.85)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const t = new THREE.Texture(c);
    t.needsUpdate = true;
    return t;
  }

  /* --- Fibonacci-sphere particle field --- */
  const COUNT = 1400;
  const positions = new Float32Array(COUNT * 3);
  const colors = new Float32Array(COUNT * 3);
  const cA = new THREE.Color(0x2563eb);
  const cB = new THREE.Color(0x22d3ee);
  const tmp = new THREE.Color();
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    positions[i * 3] = x * R;
    positions[i * 3 + 1] = y * R;
    positions[i * 3 + 2] = z * R;
    tmp.copy(cA).lerp(cB, (y + 1) / 2);
    colors[i * 3] = tmp.r; colors[i * 3 + 1] = tmp.g; colors[i * 3 + 2] = tmp.b;
  }

  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  const pMat = new THREE.PointsMaterial({
    size: 0.085, map: discTexture(), vertexColors: true,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.95,
  });
  group.add(new THREE.Points(pGeo, pMat));

  /* --- faint wireframe shell --- */
  const shell = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(R * 0.99, 2)),
    new THREE.LineBasicMaterial({ color: 0x2563eb, transparent: true, opacity: 0.09 })
  );
  group.add(shell);

  /* --- orbiting connection arcs between random surface points --- */
  function spherePoint() {
    const u = Math.random(), v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    return new THREE.Vector3(
      R * Math.sin(phi) * Math.cos(theta),
      R * Math.cos(phi),
      R * Math.sin(phi) * Math.sin(theta)
    );
  }

  const arcs = [];
  const ARC_N = 7;
  for (let i = 0; i < ARC_N; i++) {
    const a = spherePoint(), b = spherePoint();
    const mid = a.clone().add(b).multiplyScalar(0.5).setLength(R * 1.45);
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const pts = curve.getPoints(60);
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.28 });
    group.add(new THREE.Line(geo, mat));

    // traveling glow node
    const node = new THREE.Sprite(new THREE.SpriteMaterial({
      map: discTexture(), color: 0x7dd3fc, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    node.scale.setScalar(0.5);
    group.add(node);
    arcs.push({ curve, node, t: Math.random(), speed: 0.0016 + Math.random() * 0.0022 });
  }

  /* --- pointer parallax --- */
  const target = { x: 0, y: 0 };
  const cur = { x: 0, y: 0 };
  window.addEventListener('pointermove', (e) => {
    target.x = (e.clientX / window.innerWidth - 0.5) * 2;
    target.y = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  /* --- resize --- */
  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  /* --- pause rendering when off-screen --- */
  let visible = true;
  const hero = canvas.closest('.hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.01 })
      .observe(hero);
  }

  const v = new THREE.Vector3();
  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;

    group.rotation.y += 0.0016;
    cur.x += (target.x - cur.x) * 0.05;
    cur.y += (target.y - cur.y) * 0.05;
    group.rotation.y += cur.x * 0.01;
    group.rotation.x = cur.y * 0.35;

    for (const arc of arcs) {
      arc.t += arc.speed;
      if (arc.t > 1) arc.t = 0;
      arc.curve.getPoint(arc.t, v);
      arc.node.position.copy(v);
    }
    renderer.render(scene, camera);
  }
  tick();
})();
