/* ============================================================
   Bright Solar Engineering — 3D hero
   ------------------------------------------------------------
   A real photovoltaic module, rendered in WebGL, tilted at
   Odisha's latitude (20°N) — the angle a panel is actually
   installed at here — with the sun tracking an arc across it.

   PROGRESSIVE ENHANCEMENT. This file is optional. If any of
   the following is true, it does nothing at all and the CSS
   sun in the hero stays visible instead:

     · the visitor prefers reduced motion
     · the device/browser has no WebGL
     · the browser can't load ES modules from a CDN
     · the visitor is on a metered/save-data connection
     · the page is opened offline via file://

   That means the site still works with no internet, and
   nobody on a cheap phone pays for 150 KB they didn't ask for.

   To switch it off entirely: delete the <script type="module">
   tag at the bottom of index.html. Nothing else breaks.
   ============================================================ */

const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

/* ---------- Should we run at all? ---------- */
function shouldRender() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

  // Respect Data Saver and very slow connections
  const c = navigator.connection;
  if (c && (c.saveData || /^(slow-)?2g$/.test(c.effectiveType || ''))) return false;

  // WebGL support
  try {
    const canvas = document.createElement('canvas');
    if (!(canvas.getContext('webgl2') || canvas.getContext('webgl'))) return false;
  } catch (e) { return false; }

  return true;
}

/* ---------- Procedural PV cell texture ----------
   Drawn on a canvas rather than loaded as an image, so the
   site needs no extra asset and the cell grid matches the
   panel in the BSE logo exactly.
------------------------------------------------------------ */
function makeCellTexture(THREE, cols = 6, rows = 10) {
  const S = 1024;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d');

  // Frame gap / backsheet showing between cells
  g.fillStyle = '#0a1836';
  g.fillRect(0, 0, S, S);

  const pad = S * 0.035;
  const cw = (S - pad * 2) / cols;
  const ch = (S - pad * 2) / rows;
  const gap = Math.max(2, S * 0.004);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * cw + gap / 2;
      const y = pad + r * ch + gap / 2;
      const w = cw - gap;
      const h = ch - gap;

      // Monocrystalline cell: deep blue with a slight diagonal sheen
      const grad = g.createLinearGradient(x, y, x + w, y + h);
      grad.addColorStop(0,   '#16337a');
      grad.addColorStop(0.5, '#0f2358');
      grad.addColorStop(1,   '#1b3d8c');
      g.fillStyle = grad;
      g.fillRect(x, y, w, h);

      // Chamfered corners, as on real mono cells
      g.fillStyle = '#0a1836';
      const ch2 = w * 0.1;
      [[x, y], [x + w, y], [x, y + h], [x + w, y + h]].forEach(([px, py], i) => {
        g.beginPath();
        g.moveTo(px, py);
        g.lineTo(px + (i % 2 ? -ch2 : ch2), py);
        g.lineTo(px, py + (i < 2 ? ch2 : -ch2));
        g.closePath();
        g.fill();
      });

      // Busbars — the fine silver lines carrying current
      g.strokeStyle = 'rgba(226,232,240,.55)';
      g.lineWidth = Math.max(1, S * 0.0016);
      for (let b = 1; b <= 3; b++) {
        const bx = x + (w / 4) * b;
        g.beginPath(); g.moveTo(bx, y); g.lineTo(bx, y + h); g.stroke();
      }
      // Finer perpendicular fingers
      g.strokeStyle = 'rgba(226,232,240,.16)';
      g.lineWidth = Math.max(1, S * 0.0008);
      for (let f = 1; f < 14; f++) {
        const fy = y + (h / 14) * f;
        g.beginPath(); g.moveTo(x, fy); g.lineTo(x + w, fy); g.stroke();
      }
    }
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ---------- Build and run ---------- */
async function init() {
  const host = document.querySelector('.hero__visual');
  if (!host || !shouldRender()) return;

  let THREE;
  try {
    THREE = await import(/* @vite-ignore */ THREE_CDN);
  } catch (e) {
    return;               // offline or CDN blocked — CSS sun stays
  }

  const cssSun = host.querySelector('.sun-stage');
  const mount = document.createElement('div');
  mount.className = 'hero3d';
  host.appendChild(mount);

  const isPhone = window.matchMedia('(max-width: 860px)').matches;
  const W = () => mount.clientWidth || host.clientWidth || 480;
  const H = () => Math.max(320, Math.min(520, W() * 0.95));

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 100);
  camera.position.set(0, 2.4, 7.0);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !isPhone, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isPhone ? 1.5 : 2));
  renderer.setSize(W(), H());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  mount.appendChild(renderer.domElement);

  /* --- The array ---
     Three modules on a shared rail, not one giant slab. A single
     panel filling the frame reads as a flat rectangle; a short row
     reads as an installation and gives the light something to
     travel across. --------------------------------------------- */
  const array = new THREE.Group();          // holds the tilt + entrance
  const rig   = new THREE.Group();          // holds the presentation turn
  rig.add(array);
  scene.add(rig);

  const PW = 1.42, PH = 2.34, PT = 0.07;    // one portrait module
  const GAP = 0.09, COUNT = 3;
  const cellTex   = makeCellTexture(THREE);
  const glassMat  = new THREE.MeshStandardMaterial({ map: cellTex, metalness: 0.45, roughness: 0.18 });
  const frameMat  = new THREE.MeshStandardMaterial({ color: 0xc9d2de, metalness: 0.9, roughness: 0.32 });
  const backMat   = new THREE.MeshStandardMaterial({ color: 0x0a1628, metalness: 0.1, roughness: 0.9 });
  const glassGeo  = new THREE.PlaneGeometry(PW, PH);
  const frameGeo  = new THREE.BoxGeometry(PW + 0.09, PH + 0.09, PT);

  const spanX = COUNT * PW + (COUNT - 1) * GAP;
  for (let i = 0; i < COUNT; i++) {
    const mod = new THREE.Group();
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.z = PT / 2 + 0.001;
    mod.add(glass);
    mod.add(new THREE.Mesh(frameGeo, frameMat));
    const back = new THREE.Mesh(glassGeo, backMat);
    back.position.z = -PT / 2 - 0.001;
    back.rotation.y = Math.PI;
    mod.add(back);
    mod.position.x = -spanX / 2 + PW / 2 + i * (PW + GAP);
    array.add(mod);
  }

  // Mounting rails behind the row — the part cheap quotations skimp on
  const railMat = new THREE.MeshStandardMaterial({ color: 0x8b97a8, metalness: 0.85, roughness: 0.4 });
  [-0.62, 0.62].forEach(y => {
    const rail = new THREE.Mesh(new THREE.BoxGeometry(spanX + 0.3, 0.075, 0.075), railMat);
    rail.position.set(0, y, -PT / 2 - 0.05);
    array.add(rail);
  });

  /* Energy rising off the array — small motes that drift up and fade.
     A Points cloud, so it is one draw call however many there are. */
  const MOTES = isPhone ? 26 : 46;
  const motePos = new Float32Array(MOTES * 3);
  const moteSeed = [];
  for (let i = 0; i < MOTES; i++) {
    moteSeed.push({ x: (Math.random() - 0.5) * spanX, z: (Math.random() - 0.5) * 1.4,
                    t: Math.random(), spd: 0.18 + Math.random() * 0.3 });
  }
  const motes = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(motePos, 3)),
    new THREE.PointsMaterial({ color: 0xf7b32b, size: 0.075, transparent: true,
                               opacity: 0.85, depthWrite: false })
  );
  scene.add(motes);

  // Lay flat, then tilt to Odisha's latitude (~20°N) — the angle a
  // fixed panel is actually mounted at here. The entrance animates
  // from flat up to this angle.
  const TILT = -Math.PI / 2 + THREE.MathUtils.degToRad(20);
  array.rotation.x = -Math.PI / 2;          // starts flat, tilts up on load
  array.scale.setScalar(0.95);

  /* --- Light --- */
  const sun = new THREE.DirectionalLight(0xfff0d0, 3.1);
  scene.add(sun);

  // Visible sun disc that travels with the light
  const disc = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xffc85c })
  );
  scene.add(disc);

  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.62, 24, 24),
    new THREE.MeshBasicMaterial({ color: 0xf7b32b, transparent: true, opacity: 0.16 })
  );
  scene.add(glow);

  scene.add(new THREE.AmbientLight(0x6f8cc0, 0.75));
  const rim = new THREE.DirectionalLight(0xc5512a, 0.7);
  rim.position.set(-4, 1.2, -3);
  scene.add(rim);

  /* --- Animation: the sun arcs east→west, panel rotates slowly --- */
  let raf = null, t = 0, visible = true, intro = 0;

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!visible) return;

    t += 0.0042;
    const a = (t % (Math.PI * 2));

    // Sunrise to sunset arc across the sky
    const arc = Math.sin(a) * 5.2;
    const height = Math.max(0.35, Math.cos(a * 0.5) * 3.4 + 1.6);
    sun.position.set(arc, height, 3.2);
    disc.position.set(arc, height, 1.4);
    glow.position.copy(disc.position);

    // Warmer and dimmer near the horizon, as it really is
    const noon = Math.max(0, height / 5);
    sun.intensity = 1.1 + noon * 2.4;
    disc.material.color.setHSL(0.11 - (1 - noon) * 0.055, 0.95, 0.55 + noon * 0.12);

    /* Entrance: the array tilts up from flat into its mounting angle
       over the first ~1.4s, then holds. eased, runs once. */
    if (intro < 1) {
      intro = Math.min(1, intro + 0.012);
      const e = 1 - Math.pow(1 - intro, 3);            // easeOutCubic
      array.rotation.x = -Math.PI / 2 + (TILT + Math.PI / 2) * e;
      array.position.y = (1 - e) * -0.55;
    }

    // Gentle presentation turn on the rig, so the tilt above is untouched
    rig.rotation.y = Math.sin(t * 0.33) * 0.30;
    rig.rotation.z = Math.sin(t * 0.51) * 0.055;

    /* Motes drift upward off the array and fade back in at the bottom */
    const arr = motes.geometry.attributes.position.array;
    for (let i = 0; i < MOTES; i++) {
      const m = moteSeed[i];
      m.t += m.spd * 0.006;
      if (m.t > 1) m.t = 0;
      arr[i * 3]     = m.x;
      arr[i * 3 + 1] = -0.7 + m.t * 3.1;
      arr[i * 3 + 2] = m.z;
    }
    motes.geometry.attributes.position.needsUpdate = true;
    motes.material.opacity = 0.22 + noon * 0.6;

    renderer.render(scene, camera);
  }

  /* --- Only run while actually on screen --- */
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { threshold: 0.02 })
      .observe(mount);
  }
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  /* Pull back far enough that the whole row fits with a margin at
     whatever aspect the stage ends up. The row is wider than it is
     tall, so width is what binds — a hand-set distance clips it on
     narrow screens. */
  function fitCamera() {
    const aspect = W() / H();
    const vHalf = (camera.fov * Math.PI / 180) / 2;
    const hHalf = Math.atan(Math.tan(vHalf) * aspect);
    const need = (spanX * array.scale.x) / 2 * 1.30;      // half-width + 30%
    const d = Math.max(need / Math.tan(hHalf), 6.2);
    // Elevation and aim were tuned by measuring the rendered pixel
    // bounds, not by eye: this pair centres the array vertically
    // (~14% top / ~17% bottom) and shows the panel faces rather than
    // a foreshortened edge. Change them and re-measure.
    camera.position.set(0, d * 0.42, d).setLength(d);
    camera.lookAt(0, 0.6, 0);
  }

  function resize() {
    camera.aspect = W() / H();
    fitCamera();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  }
  window.addEventListener('resize', resize, { passive: true });

  // Swap the CSS sun out only once WebGL is genuinely running
  if (cssSun) cssSun.style.display = 'none';
  mount.classList.add('is-live');
  resize();
  frame();

  // Give the rest of the site a way to stop it
  window.BSE_HERO3D = {
    stop() { cancelAnimationFrame(raf); renderer.dispose(); },
    /* Renders one frame so the canvas can be read back. Screenshots
       do not work in this project's tooling, so this is how the
       framing gets checked. Never called by the site itself. */
    snapshot() { renderer.render(scene, camera); return renderer.domElement; },
    /* Exposed so the framing can be measured and tuned against real
       rendered pixels instead of guessed at. */
    camera, refit: fitCamera
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
