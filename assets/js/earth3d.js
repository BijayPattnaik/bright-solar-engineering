/* ============================================================
   Bright Solar Engineering — 3D rotating Earth ("Go green")
   ------------------------------------------------------------
   A slowly rotating globe with a sunlight terminator sweeping
   across it, and Odisha marked with a pulsing beacon.

   SAME RULES AS hero3d.js. This file is PROGRESSIVE
   ENHANCEMENT and does nothing at all when:

     · the visitor prefers reduced motion
     · the device/browser has no WebGL
     · the visitor is on Data Saver or a 2G connection
     · the CDN import fails (offline, or opened via file://)

   In every one of those cases the CSS globe in .globe-stage
   stays visible instead, so the section always looks finished.

   NO IMAGE ASSETS. The land, ocean and city lights are drawn
   procedurally onto a canvas, exactly like the PV cell texture
   in hero3d.js — so the site still works with no internet and
   nobody downloads a 2 MB earth map on mobile data.

   To switch it off: delete the <script type="module"> tag for
   this file at the bottom of index.html. Nothing else breaks.
   ============================================================ */

const THREE_CDN = 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

/* Odisha — the beacon sits on the showroom's rough position */
const ODISHA = { lat: 20.15, lon: 85.5 };

/* ---------- Should we run at all? ---------- */
function shouldRender() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const c = navigator.connection;
  if (c && (c.saveData || /^(slow-)?2g$/.test(c.effectiveType || ''))) return false;
  try {
    const cv = document.createElement('canvas');
    if (!(cv.getContext('webgl2') || cv.getContext('webgl'))) return false;
  } catch (e) { return false; }
  return true;
}

/* ------------------------------------------------------------
   Coarse landmass outlines, as [longitude, latitude] pairs.
   Deliberately simplified — this is a brand illustration, not
   an atlas. Accurate enough to read as Earth at a glance and
   to put India in the right place, which is the only bit of
   geography this page actually needs to get right.
------------------------------------------------------------ */
const LAND = [
  // North America
  [[-168,65],[-158,71],[-140,70],[-124,70],[-104,73],[-88,70],[-80,63],[-64,60],[-56,51],
   [-66,45],[-70,41],[-76,35],[-81,25],[-90,29],[-97,26],[-105,20],[-112,25],[-117,32],
   [-124,40],[-128,50],[-135,57],[-150,59],[-163,58]],
  // Greenland
  [[-45,83],[-25,80],[-20,70],[-32,60],[-48,60],[-55,68],[-58,76]],
  // South America
  [[-81,8],[-72,11],[-60,10],[-50,4],[-42,-3],[-35,-8],[-39,-16],[-48,-25],[-56,-34],
   [-62,-40],[-66,-46],[-71,-54],[-75,-50],[-73,-40],[-71,-30],[-70,-20],[-76,-12],[-80,-3]],
  // Africa
  [[-17,15],[-12,25],[-2,32],[10,34],[22,32],[32,31],[36,24],[39,15],[44,11],[51,12],
   [48,2],[42,-11],[37,-18],[33,-26],[26,-34],[18,-34],[12,-16],[9,-1],[3,5],[-8,5],[-16,11]],
  // Eurasia
  [[-10,36],[-2,44],[4,50],[10,55],[18,58],[26,64],[30,70],[42,68],[58,70],[72,73],
   [90,75],[108,76],[125,73],[140,72],[155,70],[168,66],[178,65],[172,58],[158,54],
   [143,49],[133,44],[128,35],[122,31],[118,24],[110,20],[105,10],[99,3],[95,14],
   [90,22],[85,20],[80,10],[74,8],[70,21],[62,24],[55,25],[48,30],[44,38],[36,41],
   [28,40],[18,39],[8,37],[0,36]],
  // Australia
  [[114,-22],[122,-18],[130,-12],[137,-12],[143,-11],[147,-19],[153,-27],[150,-37],
   [143,-39],[135,-35],[128,-32],[118,-34],[114,-28]],
  // Antarctica band
  [[-180,-72],[-140,-75],[-100,-73],[-60,-78],[-20,-72],[20,-70],[60,-68],[100,-67],
   [140,-70],[180,-73],[180,-90],[-180,-90]]
];

const lonToX = (lon, W) => (lon + 180) / 360 * W;
const latToY = (lat, H) => (90 - lat) / 180 * H;

/* ---------- Procedural Earth texture ---------- */
function makeEarthTexture(THREE) {
  const W = 2048, H = 1024;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');

  // Ocean — deep navy, lighter toward the equator so the sphere
  // does not read as a flat disc once it is lit.
  // Bright enough to read as a planet on a WHITE page. A darker,
  // more "realistic" ocean turns the globe into a heavy blob here.
  const ocean = g.createLinearGradient(0, 0, 0, H);
  ocean.addColorStop(0,    '#15407c');
  ocean.addColorStop(0.35, '#1f5cb0');
  ocean.addColorStop(0.5,  '#2a74d4');
  ocean.addColorStop(0.65, '#1f5cb0');
  ocean.addColorStop(1,    '#15407c');
  g.fillStyle = ocean;
  g.fillRect(0, 0, W, H);

  // Land — brand green, with a warmer edge so coastlines read
  g.lineJoin = 'round';
  LAND.forEach(poly => {
    g.beginPath();
    poly.forEach(([lon, lat], i) => {
      const x = lonToX(lon, W), y = latToY(lat, H);
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    });
    g.closePath();
    const b = g.createLinearGradient(0, 0, 0, H);
    b.addColorStop(0,   '#43913a');
    b.addColorStop(0.5, '#6cbb52');
    b.addColorStop(1,   '#43913a');
    g.fillStyle = b;
    g.fill();
    g.strokeStyle = 'rgba(140,200,120,.45)';
    g.lineWidth = 2.5;
    g.stroke();
  });

  // Faint graticule, so rotation is legible even over ocean
  g.strokeStyle = 'rgba(255,255,255,.055)';
  g.lineWidth = 1.5;
  for (let lon = -180; lon <= 180; lon += 30) {
    g.beginPath(); g.moveTo(lonToX(lon, W), 0); g.lineTo(lonToX(lon, W), H); g.stroke();
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    g.beginPath(); g.moveTo(0, latToY(lat, H)); g.lineTo(W, latToY(lat, H)); g.stroke();
  }

  // A warm bloom over Odisha so the beacon has something to sit on
  const ox = lonToX(ODISHA.lon, W), oy = latToY(ODISHA.lat, H);
  const glow = g.createRadialGradient(ox, oy, 0, ox, oy, W * 0.045);
  glow.addColorStop(0, 'rgba(247,179,43,.85)');
  glow.addColorStop(1, 'rgba(247,179,43,0)');
  g.fillStyle = glow;
  g.fillRect(ox - W * 0.05, oy - W * 0.05, W * 0.1, W * 0.1);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------
   Rooftop arrays dotted over the globe.

   NOTE ON ORIGINALITY: the panels, the globe and its texture are
   all generated in code here — no third-party artwork is used or
   traced. A solar-panelled globe is a generic industry concept;
   what is protected is someone else's particular rendering of it,
   and none of that is copied. Keep it that way: do not swap this
   for a downloaded image.

   Positions are hand-placed on landmasses so panels never appear
   to float in the middle of an ocean.
------------------------------------------------------------ */
const ARRAY_SITES = [
  [22, 78], [35, 105], [5, 110], [-25, 133], [20, 10], [-20, 25],
  [48, 10], [26, 45], [40, -110], [37, -85], [-10, -55], [-31, -64],
  [58, 90], [36, 140]
];

function makePanelTexture(THREE, cols = 4, rows = 3) {
  const S = 256;
  const cv = document.createElement('canvas');
  cv.width = cv.height = S;
  const g = cv.getContext('2d');
  g.fillStyle = '#0a1836';                      // backsheet / frame gaps
  g.fillRect(0, 0, S, S);
  const pad = S * 0.06, gap = S * 0.022;
  const cw = (S - pad * 2) / cols, ch = (S - pad * 2) / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = pad + c * cw + gap / 2, y = pad + r * ch + gap / 2;
      const grd = g.createLinearGradient(x, y, x + cw, y + ch);
      grd.addColorStop(0,   '#1a3d8f');
      grd.addColorStop(0.5, '#12275e');
      grd.addColorStop(1,   '#1f4aa8');
      g.fillStyle = grd;
      g.fillRect(x, y, cw - gap, ch - gap);
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* lat/lon -> position on a sphere of radius r */
function toVec3(THREE, lat, lon, r) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
     r * Math.cos(phi),
     r * Math.sin(phi) * Math.sin(theta)
  );
}

async function init() {
  const mount = document.getElementById('earth3d');
  if (!mount || !shouldRender()) return;

  let THREE;
  try {
    THREE = await import(/* @vite-ignore */ THREE_CDN);
  } catch (e) {
    return;                       // offline / blocked — CSS globe stays
  }

  const cssGlobe = document.querySelector('.globe-fallback');
  const W = () => mount.clientWidth  || 1;
  const H = () => mount.clientHeight || 1;

  const scene = new THREE.Scene();
  /* Framing: the camera MUST look at the origin. Offsetting
     position.y without a lookAt() points it down the -Z axis and
     drops the globe out of the bottom of the frame.
     Distance is set so the atmosphere shell (r = 2.12) leaves a
     visible margin inside the canvas — see fitDistance() below. */
  const camera = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 100);
  camera.position.set(0, 0.35, 7.6);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W(), H());
  mount.appendChild(renderer.domElement);

  const globe = new THREE.Group();
  globe.rotation.z = -23.4 * Math.PI / 180;      // real axial tilt
  scene.add(globe);

  // --- Earth ---
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(2, 64, 48),
    new THREE.MeshStandardMaterial({
      map: makeEarthTexture(THREE),
      roughness: 0.85,
      metalness: 0.0
    })
  );
  globe.add(earth);

  // --- Atmosphere: a rim glow, drawn on the inside of a slightly
  //     larger sphere so it only shows at the edges ---
  const atmos = new THREE.Mesh(
    new THREE.SphereGeometry(2.12, 48, 32),
    new THREE.ShaderMaterial({
      transparent: true, side: THREE.BackSide, depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color('#5aa9ff') } },
      vertexShader: `
        varying vec3 vN; varying vec3 vP;
        void main(){
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position,1.0);
          vP = mv.xyz;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform vec3 uColor; varying vec3 vN; varying vec3 vP;
        void main(){
          float f = pow(1.0 - abs(dot(normalize(vN), normalize(-vP))), 2.6);
          gl_FragColor = vec4(uColor, f * 0.85);
        }`
    })
  );
  scene.add(atmos);

  // --- Rooftop arrays standing on the surface ---
  const panelGeo = new THREE.PlaneGeometry(0.46, 0.31);
  const panelMat = new THREE.MeshStandardMaterial({
    map: makePanelTexture(THREE), roughness: 0.28, metalness: 0.45,
    // A little self-illumination so arrays on the night side still
    // read as panels rather than as black smudges on the globe
    emissive: new THREE.Color('#16337a'), emissiveIntensity: 0.5,
    side: THREE.DoubleSide
  });
  ARRAY_SITES.forEach(([lat, lon]) => {
    const holder = new THREE.Object3D();
    holder.position.copy(toVec3(THREE, lat, lon, 2.015));
    // stand the panel on the surface, then tilt it toward the equator
    // the way a real array is tilted toward the sun
    holder.lookAt(0, 0, 0);
    holder.rotateX(Math.PI);
    const panel = new THREE.Mesh(panelGeo, panelMat);
    panel.rotation.x = (lat >= 0 ? -1 : 1) * 0.38;
    holder.add(panel);
    globe.add(holder);
  });

  // --- Odisha beacon: a dot plus two rings that pulse outward ---
  const beacon = new THREE.Group();
  const pos = toVec3(THREE, ODISHA.lat, ODISHA.lon, 2.02);
  beacon.position.copy(pos);
  beacon.lookAt(0, 0, 0);
  const gold = new THREE.Color('#f7b32b');
  beacon.add(new THREE.Mesh(
    new THREE.SphereGeometry(0.045, 16, 16),
    new THREE.MeshBasicMaterial({ color: gold })
  ));
  const rings = [0, 1].map(i => {
    const m = new THREE.Mesh(
      new THREE.RingGeometry(0.06, 0.075, 32),
      new THREE.MeshBasicMaterial({ color: gold, transparent: true, side: THREE.DoubleSide })
    );
    m.userData.offset = i * 0.5;
    beacon.add(m);
    return m;
  });
  globe.add(beacon);

  /* --- Lights ---
     A sun that orbits so a terminator sweeps the globe, but with
     enough ambient and fill that the night side never goes black.
     This is a marketing illustration on a white page, not an
     astronomy demo: an unlit half reads as "broken image". --- */
  scene.add(new THREE.AmbientLight(0xe6efff, 1.75));
  const sun = new THREE.DirectionalLight(0xfff3d6, 1.5);
  sun.position.set(5, 2, 3);
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0x9cc4ff, 1.1);
  fill.position.set(-5, -1, -3);
  scene.add(fill);
  const top = new THREE.DirectionalLight(0xffffff, 0.35);
  top.position.set(0, 6, 1);
  scene.add(top);

  /* ---------- Run only while it is actually on screen ---------- */
  let onScreen = true, visible = true, raf = 0;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => { onScreen = es[0].isIntersecting; }, { threshold: 0.01 })
      .observe(mount);
  }
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

  const clock = new THREE.Clock();
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!onScreen || !visible) return;

    const t = clock.getElapsedTime();
    globe.rotation.y += 0.0016;                    // slow, readable spin
    sun.position.set(Math.cos(t * 0.18) * 6, 2, Math.sin(t * 0.18) * 6);

    rings.forEach(r => {
      const p = (t * 0.55 + r.userData.offset) % 1;
      const s = 1 + p * 3.2;
      r.scale.set(s, s, s);
      r.material.opacity = (1 - p) * 0.75;
    });

    renderer.render(scene, camera);
  }

  /* Pull the camera back far enough that the atmosphere shell fits
     inside BOTH dimensions with a margin, whatever the stage aspect
     happens to be. Hand-tuned distances break the moment the layout
     changes — this cannot. */
  const OUTER = 2.12;                      // atmosphere radius
  const MARGIN = 1.16;                     // 16% breathing room
  function fitCamera() {
    const aspect = W() / H();
    const vHalf = (camera.fov * Math.PI / 180) / 2;
    const hHalf = Math.atan(Math.tan(vHalf) * aspect);
    const need = OUTER * MARGIN;
    const d = Math.max(need / Math.tan(vHalf), need / Math.tan(hHalf));
    camera.position.set(0, d * 0.05, d).setLength(d);
    camera.lookAt(0, 0, 0);
  }

  function resize() {
    camera.aspect = W() / H();
    fitCamera();
    camera.updateProjectionMatrix();
    renderer.setSize(W(), H());
  }
  window.addEventListener('resize', resize, { passive: true });

  // Only hide the CSS globe once WebGL is genuinely running
  if (cssGlobe) cssGlobe.style.display = 'none';
  mount.classList.add('is-live');
  resize();
  frame();

  window.BSE_EARTH3D = {
    stop() { cancelAnimationFrame(raf); renderer.dispose(); },
    /* Renders one frame and returns it as a data URL. Exists because
       screenshots do not work in this project's tooling — it is the
       only way to check the globe is framed correctly rather than
       clipped. Cheap, and never called by the site itself. */
    snapshot(type = 'image/jpeg', q = 0.7) {
      renderer.render(scene, camera);
      return renderer.domElement.toDataURL(type, q);
    }
  };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
