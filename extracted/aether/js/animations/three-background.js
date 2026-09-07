// Three Background — ambient WebGL particle field + a procedural hero object.
// Both degrade gracefully: if Three.js failed to load from the CDN, or the
// device is flagged low-end, we skip 3D and the page still works fully
// (this layer is decorative, never load-bearing).

function hasThree() { return typeof window.THREE !== 'undefined'; }

export function initAmbientBackground(isLowEnd) {
  if (!hasThree()) return null;
  if (isLowEnd) return null; // skip the full-viewport field entirely on weak devices

  const THREE = window.THREE;
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return null;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  } catch (e) { return null; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 18;

  const count = 420;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 14 + Math.random() * 10;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi) - 6;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const mat = new THREE.PointsMaterial({ size: 0.045, color: 0xc9a876, transparent: true, opacity: 0.55 });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  let targetRotY = 0, targetRotX = 0, mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  let scrollFrac = 0; // 0..1 driven by scene engine
  let reduced = document.documentElement.dataset.reducedMotion === 'true';
  window.addEventListener('aether:perf-downgrade', () => { renderer.setPixelRatio(1); });

  let raf;
  let visible = true;
  document.addEventListener('visibilitychange', () => { visible = document.visibilityState === 'visible'; });

  function tick() {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    targetRotY += ((mouseX * 0.4) - targetRotY) * 0.02;
    targetRotX += ((mouseY * 0.2) - targetRotX) * 0.02;
    points.rotation.y = targetRotY + (reduced ? 0 : performance.now() * 0.00003) + scrollFrac * 0.6;
    points.rotation.x = targetRotX;
    renderer.render(scene, camera);
  }
  tick();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  return {
    setScrollFraction(f) { scrollFrac = f; },
    setReduced(v) { reduced = v; },
    destroy() { cancelAnimationFrame(raf); renderer.dispose(); }
  };
}

export function initHeroObject(isLowEnd) {
  const canvas = document.getElementById('hero-object-canvas');
  if (!canvas) return null;
  if (!hasThree()) return null;

  const THREE = window.THREE;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isLowEnd });
  } catch (e) { return null; }

  const wrap = canvas.parentElement;
  const size = () => ({ w: wrap.clientWidth, h: wrap.clientHeight });

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isLowEnd ? 1 : 2));
  let { w, h } = size();
  renderer.setSize(w, h);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.set(0, 0, 7);

  const group = new THREE.Group();
  scene.add(group);

  const core = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.5, isLowEnd ? 0 : 1),
    new THREE.MeshStandardMaterial({ color: 0xc9a876, metalness: 0.7, roughness: 0.25, wireframe: false, flatShading: true })
  );
  group.add(core);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(2.5, 0.05, 16, isLowEnd ? 32 : 80),
    new THREE.MeshStandardMaterial({ color: 0x6fcfe0, metalness: 0.4, roughness: 0.3, transparent: true, opacity: 0.85 })
  );
  ring.rotation.x = Math.PI / 2.4;
  group.add(ring);

  const ring2 = ring.clone();
  ring2.rotation.x = -Math.PI / 3.2;
  ring2.rotation.y = Math.PI / 5;
  ring2.material = ring.material.clone();
  ring2.material.opacity = 0.35;
  group.add(ring2);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(4, 3, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6fcfe0, 0.6);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5);
    mouseY = (e.clientY / window.innerHeight - 0.5);
  }, { passive: true });

  let reduced = document.documentElement.dataset.reducedMotion === 'true';
  let scrollFrac = 0;
  let raf, visible = true;
  document.addEventListener('visibilitychange', () => { visible = document.visibilityState === 'visible'; });

  function tick() {
    raf = requestAnimationFrame(tick);
    if (!visible) return;
    const t = reduced ? 0 : performance.now() * 0.0002;
    group.rotation.y = t + mouseX * 0.5 + scrollFrac * 1.2;
    group.rotation.x = mouseY * 0.3 + scrollFrac * 0.3;
    ring.rotation.z += reduced ? 0 : 0.0015;
    renderer.render(scene, camera);
  }
  tick();

  const ro = new ResizeObserver(() => {
    const s = size();
    if (s.w === 0 || s.h === 0) return;
    camera.aspect = s.w / s.h;
    camera.updateProjectionMatrix();
    renderer.setSize(s.w, s.h);
  });
  ro.observe(wrap);

  return {
    setScrollFraction(f) { scrollFrac = f; },
    setReduced(v) { reduced = v; },
    destroy() { cancelAnimationFrame(raf); ro.disconnect(); renderer.dispose(); }
  };
}
