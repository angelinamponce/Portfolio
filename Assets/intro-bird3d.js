// Procedural 3D bird for the intro (index.html) and its hidden preview (bird-preview.html). Everything is built in code,
// with no model file: one smooth lofted body (body, neck and head, skinned so the neck and head can move without a
// seam), skinned wings (shoulder → wrist → tip) carrying layered feathers, and a slender tail. three.js r160, from a
// trimmed self-hosted build.
import * as THREE from './vendor/three-r160-intro.min.js';

// ── Proportions. bodyLength is the unit (tail base to chest) and sets the overall size; the rest are multiples of it.
//    Tune here: the intro and the preview both read this.
export const BIRD = {
  bodyLength: 1,
  wingSpan: 2.6,      // tip to tip
  neckLength: 0.3,
  tailLength: 0.8,
  headScale: 0.55,    // head size relative to the first 3D bird's
};

const COLORS = { mint: 0xcbe7d3, cream: 0xfaf7f0, gold: 0xcdb27e, eye: 0x17211b };
const DEV = ['localhost', '127.0.0.1', ''].includes(location.hostname);
const TAU = Math.PI * 2, deg = Math.PI / 180;
const sm = t => t * t * (3 - 2 * t), c01 = t => Math.max(0, Math.min(1, t)), lerp = (a, b, t) => a + (b - a) * t;
const ss = (a, b, x) => sm(c01((x - a) / (b - a)));

// Critically damped spring: eases s.x toward target with no overshoot; omega (1/s) sets how quickly
function spring(s, target, omega, dt) {
  const x = s.x - target, e = Math.exp(-omega * dt), k = s.v + omega * x;
  s.x = target + (x + k * dt) * e;
  s.v = (s.v - omega * k * dt) * e;
  return s.x;
}
const sp = (x = 0) => ({ x, v: 0 });
// CSS cubic-bezier() timing, solved for x by bisection
function cubicBezier(x1, y1, x2, y2) {
  const b = (p, q, t) => 3 * (1 - t) * (1 - t) * t * p + 3 * (1 - t) * t * t * q + t * t * t;
  return x => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; if (b(x1, x2, t) < x) lo = t; else hi = t; }
    return b(y1, y2, t);
  };
}
const easeInOut = cubicBezier(0.42, 0, 0.58, 1), easeOut = cubicBezier(0, 0, 0.58, 1);
const seeded = seed => () => (seed = seed * 16807 % 2147483647) / 2147483647;

// Catmull-Rom through a list of points (arrays of any length), t in [0, 1]
function catmull(P, t) {
  const n = P.length - 1, f = Math.max(0, Math.min(n - 1e-6, t * n)), i = Math.floor(f), u = f - i;
  const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(n, i + 2)];
  return p1.map((_, k) => 0.5 * (2 * p1[k] + (p2[k] - p0[k]) * u + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * u * u
    + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * u * u * u));
}
// A spine through points [x, y, radius] in the x-y plane, walked by arc length
function spine(P) {
  const N = 600, pts = [], len = [0];
  for (let i = 0; i <= N; i++) {
    pts.push(catmull(P, i / N));
    if (i) len.push(len[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const L = len[N];
  const tAt = s => { const d = s * L; let i = 1; while (i < N && len[i] < d) i++; return (i - 1 + (d - len[i - 1]) / ((len[i] - len[i - 1]) || 1)) / N; };
  const sAtX = x => { let i = 0; while (i < N && pts[i][0] < x) i++; return len[i] / L; };
  return { P, tAt, sAtX };
}
function geometry(pos, idx, extra = {}) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  for (const [k, v] of Object.entries(extra)) g.setAttribute(k, v);
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}
// A smooth closed tube along a spine: elliptical rings (wK × radius across z) spaced by arc length, wrapping by index so
// there is no seam. color(s, cosAngle) colours each vertex (cosAngle 1 on top); skin(s) gives two bone influences.
function tube(sp, { rings, radial, wK = 1, color, skin }) {
  const pos = [], col = [], si = [], sw = [], idx = [];
  for (let r = 0; r <= rings; r++) {
    const s = r / rings, t = sp.tAt(s), c = catmull(sp.P, t);
    const a = catmull(sp.P, Math.max(0, t - 0.002)), b = catmull(sp.P, Math.min(1, t + 0.002));
    const tl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / tl, ny = (b[0] - a[0]) / tl;
    const rad = Math.max(0.0006, c[2]);
    for (let j = 0; j < radial; j++) {
      const ang = j / radial * TAU, ca = Math.cos(ang), sa = Math.sin(ang);
      pos.push(c[0] + nx * rad * ca, c[1] + ny * rad * ca, rad * wK * sa);
      const cc = color(s, ca); col.push(cc.r, cc.g, cc.b);
      if (skin) { const k = skin(s); si.push(k[0], k[2], 0, 0); sw.push(k[1], k[3], 0, 0); }
    }
  }
  for (let r = 0; r < rings; r++) for (let j = 0; j < radial; j++) {
    const a = r * radial + j, b = r * radial + (j + 1) % radial;
    idx.push(a, b, a + radial, b, b + radial, a + radial);
  }
  const extra = { color: new THREE.Float32BufferAttribute(col, 3) };
  if (skin) { extra.skinIndex = new THREE.Uint16BufferAttribute(si, 4); extra.skinWeight = new THREE.Float32BufferAttribute(sw, 4); }
  return geometry(pos, idx, extra);
}
// A feather: a thin blade along +x (length 1, width 1 across z, top +y) tapering to a soft point, with a raised shaft
// and a gentle upward curl at the end. Scaled per feather.
function blade(segs, color, curl = 0.07) {
  const pos = [], col = [], idx = [];
  for (let i = 0; i <= segs; i++) {
    const t = i / segs, w = 0.5 * (0.3 + 0.7 * Math.sin(Math.PI / 2 * Math.min(1, t * 2.4))) * Math.pow(1 - t, 0.55);
    for (let j = 0; j <= 2; j++) {
      const v = j - 1;
      pos.push(t, curl * t * t * t + 0.06 * w * (1 - Math.abs(v)), v * w);
      const c = color(t); col.push(c.r, c.g, c.b);
    }
  }
  for (let i = 0; i < segs; i++) for (let j = 0; j < 2; j++) {
    const a = i * 3 + j, b = a + 3;
    idx.push(a, a + 1, b, a + 1, b + 1, b);
  }
  return geometry(pos, idx, { color: new THREE.Float32BufferAttribute(col, 3) });
}
const physical = (o = {}) => new THREE.MeshPhysicalMaterial({ roughness: 0.65, metalness: 0, sheen: 0.5, sheenRoughness: 0.75,
  sheenColor: new THREE.Color(COLORS.cream), specularIntensity: 0.22, ...o });

// Soft warm key, cool mint fill, a rim from behind to lift the silhouette off the dark panel, and sky/ground ambient
export function addBirdLights(scene) {
  scene.add(new THREE.HemisphereLight(0xfff8ee, 0x557767, 1.05));
  const key = new THREE.DirectionalLight(0xfff0da, 1.8); key.position.set(-0.6, 1, 0.8);
  const fill = new THREE.DirectionalLight(0xcdeedb, 0.55); fill.position.set(0.9, -0.35, 0.45);
  const rim = new THREE.DirectionalLight(0xf2fff7, 1.5); rim.position.set(0.25, 0.55, -1);
  scene.add(key, fill, rim);
}

// ── The bird: geometry, materials and its motion rig. update(dt ms, now ms, facing) steps it (facing: 1 when its +z side
//    is toward the camera, -1 when turned around); the cue methods (flap, fold, unfold, raise, look, shake, holdGlide)
//    steer it. object is normalised to about 1 unit long, feet at the origin. Options: clock (the timebase cues are
//    stamped with; defaults to the last update's now) and bob (false when the caller moves the body itself).
export function buildBird(opts = {}) {
  const { clock, bob: ownBob = true, ...shape } = opts;
  const B = { ...BIRD, ...shape }, L = B.bodyLength, n = B.neckLength / 0.3, hr = 0.15 * B.headScale;
  const rand = seeded(20261012);
  const mint = new THREE.Color(COLORS.mint), cream = new THREE.Color(COLORS.cream), gold = new THREE.Color(COLORS.gold);
  const mix = (a, b, t) => a.clone().lerp(b, t);

  const bodyMat = physical({ vertexColors: true });
  // Feathers and wings: vertex-coloured on top; their undersides (back faces) turn cream
  const featherMat = physical({ vertexColors: true, side: THREE.DoubleSide });
  featherMat.onBeforeCompile = sh => {
    sh.fragmentShader = sh.fragmentShader.replace('#include <color_fragment>', `#include <color_fragment>
      if (!gl_FrontFacing) diffuseColor.rgb = mix(vec3(${cream.r.toFixed(4)}, ${cream.g.toFixed(4)}, ${cream.b.toFixed(4)}), diffuseColor.rgb, 0.2);`);
  };
  const goldMat = physical({ color: COLORS.gold, roughness: 0.5, sheen: 0, specularIntensity: 0.35 });
  const eyeMat = physical({ color: COLORS.eye, roughness: 0.3, sheen: 0, specularIntensity: 0.4 });
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

  const object = new THREE.Group(), inner = new THREE.Group();
  // about 1 unit long without the tail (the default bird is 2.05 body lengths beak to tail tip, 1.65 without most of
  // the tail), so its body matches the flat bird's on screen
  object.scale.setScalar(L / 1.65);
  object.add(inner);
  const FEET = [0.12, -0.21];
  inner.position.set(-FEET[0], -FEET[1], 0);         // feet at the origin, so the flight path places it directly

  // Body, neck and head as one lofted surface. Slender (about 3:1), the chest lifted, the neck in a soft S into a small,
  // level head. Radii: tail base → chest → neck → head → closed just ahead of the beak root.
  const N0 = [0.37, 0.14], N1 = [N0[0] + 0.05 * n, N0[1] + 0.13 * n], N2 = [N0[0] + 0.16 * n, N0[1] + 0.24 * n];
  const Hc = [N2[0] + hr * 0.95, N2[1] + hr * 0.42];
  const body = spine([
    [-0.56, 0, 0.002], [-0.5, 0.005, 0.042], [-0.3, 0.016, 0.106], [-0.05, 0.036, 0.153], [0.17, 0.066, 0.165],
    [0.32, 0.11, 0.128], [N0[0], N0[1], 0.074], [N1[0], N1[1], 0.052], [N2[0], N2[1], 0.05],
    [Hc[0] - hr * 0.25, Hc[1], hr * 0.93], [Hc[0] + hr * 0.4, Hc[1] - hr * 0.04, hr * 0.84],
    [Hc[0] + hr * 0.82, Hc[1] - hr * 0.1, hr * 0.42], [Hc[0] + hr * 1.0, Hc[1] - hr * 0.12, 0.002],
  ]);
  const sT = body.sAtX(-0.42), sN = body.sAtX(N0[0]), sH = body.sAtX(N2[0] + hr * 0.15);
  const bones = { root: new THREE.Bone(), tail: new THREE.Bone(), neck: new THREE.Bone(), head: new THREE.Bone() };
  bones.root.position.set(0, 0.05, 0);
  bones.tail.position.set(-0.46, -0.04, 0);
  bones.neck.position.set(N0[0], N0[1] - 0.05, 0);
  bones.head.position.set(N2[0] - N0[0], N2[1] - N0[1], 0);
  bones.root.add(bones.tail, bones.neck); bones.neck.add(bones.head);
  const bodyGeo = tube(body, {
    rings: 44, radial: 24, wK: 0.92,
    color: (s, ca) => mix(cream, mint, ss(-0.3, 0.5, ca)),   // mint back, cream belly and throat
    skin: s => {                                       // bones: 0 root, 1 tail, 2 neck, 3 head
      const wh = ss(sH - 0.05, sH + 0.02, s), wn = ss(sN - 0.07, sN + 0.04, s), wt = 1 - ss(sT - 0.05, sT + 0.1, s);
      return wh > 0 ? [3, wh, 2, 1 - wh] : wn > 0 ? [2, wn, 0, 1 - wn] : [1, wt, 0, 1 - wt];
    },
  });
  const bodyMesh = new THREE.SkinnedMesh(bodyGeo, bodyMat);
  bodyMesh.add(bones.root);
  inner.add(bodyMesh);

  // Head details on the head bone: a short, fine, slightly down-curved gold beak; small dark eyes with a glint
  const rel = p => [p[0] - N2[0], p[1] - N2[1]];   // body frame → the head bone's frame (it rests at N2)
  const beak = tube(spine([
    [...rel([Hc[0] + hr * 0.62, Hc[1] - hr * 0.08]), hr * 0.3], [...rel([Hc[0] + hr * 1.15, Hc[1] - hr * 0.13]), hr * 0.17],
    [...rel([Hc[0] + hr * 1.55, Hc[1] - hr * 0.22]), hr * 0.07], [...rel([Hc[0] + hr * 1.75, Hc[1] - hr * 0.3]), 0.001],
  ]), { rings: 8, radial: 10, wK: 0.8, color: () => gold });
  bones.head.add(new THREE.Mesh(beak, goldMat));
  [-1, 1].forEach(side => {
    const r = hr * 0.15, e = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 8), eyeMat);
    const [x, y] = rel([Hc[0] + hr * 0.32, Hc[1] + hr * 0.22]);
    e.position.set(x, y, side * hr * 0.74);
    const g = new THREE.Mesh(new THREE.SphereGeometry(r * 0.3, 6, 4), glintMat);
    g.position.set(r * 0.45, r * 0.5, side * r * 0.62);
    e.add(g); bones.head.add(e);
  });

  // Legs, only out on the perch
  const legs = new THREE.Group(); inner.add(legs);
  const legGeo = tube(spine([[0.09, -0.07, 0.014], [0.105, -0.14, 0.01], [0.12, -0.21, 0.008], [0.122, -0.215, 0.001]]),
    { rings: 6, radial: 6, color: () => gold });
  [-0.045, 0.045].forEach(z => { const m = new THREE.Mesh(legGeo, goldMat); m.position.z = z; legs.add(m); });

  // Tail: six long, slender feathers in a narrow fan, the outer pair a little longer
  const tailGeo = blade(8, t => mix(mint, gold, 0.35 * ss(0.75, 1, t)), 0.05);
  const tailFeathers = [];
  for (let i = 0; i < 6; i++) {
    const k = (i - 2.5) / 2.5, f = new THREE.Mesh(tailGeo, featherMat);
    const len = B.tailLength * (0.9 + 0.1 * Math.abs(k)) * (0.95 + 0.1 * rand());
    f.scale.set(len, len, 0.085);
    f.position.set(0.02, 0.012 + 0.002 * Math.abs(k), k * 0.03);
    f.userData.spread = k * 0.13;
    bones.tail.add(f); tailFeathers.push(f);
  }

  // Wings: one skinned, cambered surface each (14 segments along the span, 4 across), narrow and swept slightly back,
  // with 8 primaries fanned at the tip and two rows of coverts. The far wing is the same build inside a mirror.
  const halfSpan = B.wingSpan / 2 - 0.09, primLen = 0.42 * halfSpan, Lm = halfSpan - primLen * 0.95;
  const segA = 0.3 * Lm, segB = 0.35 * Lm, chord = u => lerp(0.3, 0.13, Math.pow(u, 0.8));
  const lead = u => 0.03 - 0.12 * u * u, surfY = (u, v) => 0.045 * u * u + 0.02 * Math.sin(Math.PI * v) * (1 - 0.5 * u);
  const wingGeo = (() => {
    const U = 14, V = 4, pos = [], col = [], si = [], sw = [], idx = [];
    for (let i = 0; i <= U; i++) for (let j = 0; j <= V; j++) {
      const u = i / U, v = j / V, z = u * Lm;
      pos.push(lead(u) - v * chord(u), surfY(u, v), z);
      col.push(mint.r, mint.g, mint.b);
      const w1 = ss(segA - 0.05, segA + 0.05, z), w2 = ss(segA + segB - 0.05, segA + segB + 0.05, z);
      if (w2 > 0) { si.push(2, 1, 0, 0); sw.push(w2, 1 - w2, 0, 0); } else { si.push(1, 0, 0, 0); sw.push(w1, 1 - w1, 0, 0); }
    }
    for (let i = 0; i < U; i++) for (let j = 0; j < V; j++) {
      const a = i * (V + 1) + j, b = a + V + 1;
      idx.push(a, a + 1, b, a + 1, b + 1, b);
    }
    return geometry(pos, idx, { color: new THREE.Float32BufferAttribute(col, 3),
      skinIndex: new THREE.Uint16BufferAttribute(si, 4), skinWeight: new THREE.Float32BufferAttribute(sw, 4) });
  })();
  const primGeo = blade(8, t => mix(mint, gold, 0.55 * ss(0.68, 1, t)), 0.08);
  const covGeo = blade(6, t => mix(mint, cream, 0.12 * t), 0.04);
  // a feather's yaw so its length (+x) points `back` radians behind the span (+z): 0 = straight out, 90° = straight back
  const yawFor = back => -(back + Math.PI / 2);
  const wings = [1, -1].map(side => {
    const mirror = new THREE.Group(); mirror.scale.z = side; mirror.position.set(0.12, 0.13, 0.085 * side); inner.add(mirror);
    const sh = new THREE.Bone(), wr = new THREE.Bone(), hd = new THREE.Bone();
    sh.name = 'shoulder'; wr.name = 'wrist'; hd.name = 'tip';
    wr.position.z = segA; hd.position.z = segB; sh.add(wr); wr.add(hd);
    [sh, wr, hd].forEach(b => { b.rotation.order = 'YXZ'; });
    const mesh = new THREE.SkinnedMesh(wingGeo, featherMat);
    mesh.add(sh); mirror.add(mesh);
    const boneAt = z => z < segA ? [sh, 0] : z < segA + segB ? [wr, segA] : [hd, segA + segB];
    const feather = (geo, u, v, back, len, width, lift) => {
      const z = u * Lm, [bone, z0] = boneAt(z), f = new THREE.Mesh(geo, featherMat);
      f.position.set(lead(u) - v * chord(u), surfY(u, v) + lift, z - z0);
      f.scale.set(len, len, width);
      f.rotation.y = yawFor(back);
      f.userData.back = back;
      bone.add(f);
      return f;
    };
    const prim = [], cov = [];
    for (let i = 0; i < 8; i++) {                    // primaries: inner ones point back, the outer ones out along the span
      const k = i / 7, u = (segA + segB + (Lm - segA - segB) * (0.12 + 0.86 * k)) / Lm;
      prim.push(feather(primGeo, u, 0.5, lerp(62, 10, Math.pow(k, 0.85)) * deg,
        primLen * (0.62 + 0.38 * Math.pow(k, 0.7)) * (0.95 + 0.1 * rand()), 0.115, 0.004 + 0.002 * i));
    }
    for (let i = 0; i < 8; i++) {                    // greater coverts: soften the inner trailing edge
      const u = lerp(0.04, 0.7, i / 7);
      cov.push(feather(covGeo, u, 0.45, (86 - 8 * u) * deg, (0.6 * chord(u) + 0.05) * (0.95 + 0.1 * rand()), 0.11, 0.007));
    }
    const lesser = [];
    for (let i = 0; i < 9; i++) {                    // lesser coverts, nearer the leading edge
      const u = lerp(0.03, 0.8, i / 8);
      lesser.push(feather(covGeo, u, 0.14, 80 * deg, 0.45 * chord(u) * (0.95 + 0.1 * rand()), 0.09, 0.022));
    }
    return { mesh, mirror, side, sh, wr, hd, prim, cov, lesser };
  });
  object.updateMatrixWorld(true);
  bodyMesh.bind(new THREE.Skeleton([bones.root, bones.tail, bones.neck, bones.head]));
  wings.forEach(w => w.mesh.bind(new THREE.Skeleton([w.sh, w.wr, w.hd])));
  let tris = 0;
  object.traverse(o => { if (o.isMesh) { o.frustumCulled = false; tris += o.geometry.index.count / 3; } });

  // ── Motion. Cues are stamped with clock() when they are called, so they land at the caller's moment, not a frame late.
  const st = { cycle: 280, amp: 1, p0: 0, t0: 0, raised: false, glide: false,
    foldFrom: 0, foldTo: 0, foldAt: -1e9, foldMs: 1, fold: 0, settleAt: -1, look: null, lookAt: 0,
    shakeAt: -1e9, shakeMs: 300, now: 0 };
  const at = clock || (() => st.now);
  const phase = t => st.p0 + (t - st.t0) / st.cycle;
  const S = { glide: sp(), bob: sp(), tail: sp(0.06), tailYaw: sp() };
  // One wingbeat, p in [0, 1): the downstroke from the top (+1) to the bottom (-1) in the first half, the upstroke in the
  // second, eased at both ends like the flat bird's ease-in-out strokes. Raised (take-off): held at the top.
  const beat = p => st.raised ? 1 : Math.cos(TAU * p);
  const upPart = p => { p -= Math.floor(p); return st.raised || p < 0.5 ? 0 : Math.sin(TAU * (p - 0.5)); };
  const downPart = p => { p -= Math.floor(p); return st.raised || p >= 0.5 ? 0 : Math.sin(TAU * p); };
  // A head step: ease in, hold, ease out, on the flat bird's head timing (ease-in-out in and out, a linear hold)
  const env = (t, a, h, o) => t < 0 ? 0 : t < a ? easeInOut(t / a) : t < a + h ? 1 : t < a + h + o ? 1 - easeInOut((t - a - h) / o) : 0;
  // The wing shake: two flicks up from the folded angle and back, eased over the whole shake like the flat bird's
  const flick = t => { if (t <= 0 || t >= st.shakeMs) return 0; const x = easeInOut(t / st.shakeMs) * 4 % 2; return x < 1 ? x : 2 - x; };
  // Folded: each wing swings back along the body, its top facing out and up, lying over the back like a roof, with the
  // primaries closed into a slim stack along the tail. The shoulder rises onto the upper flank so nothing clips.
  const FOLD = { sh: [0.3, -1.45, -0.5], wr: [0.06, -0.08, 0], hd: [0.04, -0.06, 0] };
  const SHOULDER = [[0.12, 0.13, 0.085], [0.1, 0.155, 0.12]];

  function update(dt, now, facing = 1) {
    const t = dt / 1000, p = phase(now);
    st.now = now;
    st.fold = lerp(st.foldFrom, st.foldTo, easeOut(c01((now - st.foldAt) / st.foldMs)));
    const fold = st.fold, open = 1 - fold;
    if (fold > 0.995 && st.settleAt < 0) st.settleAt = now;
    if (fold < 0.9) st.settleAt = -1;
    const g = spring(S.glide, st.glide ? 1 : 0, 10, t), fl = open * (1 - g) * st.amp;
    const settle = st.settleAt < 0 ? -1 : now - st.settleAt;
    const pose = (j, flight) => [0, 1, 2].map(k => lerp(flight[k], FOLD[j][k], fold));
    wings.forEach(w => {
      // the chain: shoulder, then wrist 40ms and tip 80ms behind; the far wing trails the near one by 60ms (40ms in the
      // shake), as the flat bird's does
      const far = w.side !== facing, lag = ms => p - (ms + (far ? 60 : 0)) / st.cycle;
      const aS = beat(lag(0)), aW = beat(lag(40)), aH = beat(lag(80));
      const up = upPart(lag(40)) * fl, down = downPart(lag(0)) * fl;
      const sh = pose('sh', [-0.1 - 0.06 * g - 0.8 * aS * fl, -0.1 - 0.28 * up, 0]);
      sh[2] -= 12 * deg * flick(now - st.shakeAt - (far ? 40 : 0));
      w.mirror.position.set(...[0, 1, 2].map(k => lerp(SHOULDER[0][k], SHOULDER[1][k], fold) * (k === 2 ? w.side : 1)));
      w.sh.rotation.set(...sh);
      w.wr.rotation.set(...pose('wr', [-0.34 * aW * fl, -0.32 * up, 0]));   // the upstroke flexes the wrist back
      w.hd.rotation.set(...pose('hd', [-0.42 * aH * fl, 0.2 * up, 0]));
      const fan = 1 + 0.35 * up - 0.12 * down;        // primaries fan out on the upstroke, close on the downstroke
      w.prim.forEach((f, i) => {
        f.rotation.y = yawFor(lerp(lerp(44 * deg, f.userData.back, fan), (-3 + 1.2 * i) * deg, fold));
        // folding in, the feathers settle with a tiny ripple, tip to root
        const ts = settle - (7 - i) * 22;
        f.rotation.x = ts > 0 ? 0.045 * Math.exp(-ts / 160) * Math.sin(ts / 120 * TAU) : 0;
      });
      // folded, the coverts lie back along the wing like shingles
      [...w.cov, ...w.lesser].forEach(f => { f.rotation.y = yawFor(lerp(f.userData.back, 22 * deg, fold)); });
    });
    // Body bob in opposition to the wings (unless the caller moves the body), the tail following a beat behind
    const aS = beat(p), bob = ownBob ? spring(S.bob, -0.022 * aS * fl, 26, t) : 0;
    inner.position.y = -FEET[1] + bob;
    const breath = 1 + 0.01 * Math.sin(now / 2500 * TAU) * lerp(0.3, 1, fold);   // chest, ~1% every 2.5s
    bones.root.scale.set(1, breath, breath);
    bones.tail.rotation.z = spring(S.tail, 0.06 + 0.07 * aS * fl, 9, t);
    bones.tail.rotation.y = spring(S.tailYaw, 0.05 * Math.sin(now / 1500 * TAU) * fold, 4, t);
    tailFeathers.forEach(f => { f.rotation.y = Math.PI + f.userData.spread * lerp(1, 0.55, fold); });
    // Neck reaches forward in flight and rises into the S as the wings fold; the head stays level with the body
    const neck = lerp(-0.5, 0, fold) + 1.6 * bob;
    bones.neck.rotation.z = neck;
    // Head steps, as the flat bird's outline morphs: the beak lifts deg ('tilt', 'lookUp') or 0.3 × deg ('look'), never
    // dips; the flat head's foreshortening ('look' by deg/45, 'tilt' by deg/90) is a real turn toward the viewer here
    let turn = 0, lift = 0;
    if (st.look) {
      const k = st.look, e = env(now - st.lookAt, k.inMs, k.holdMs, k.outMs);
      const squeeze = k.type === 'look' ? k.deg / 45 : k.type === 'tilt' ? k.deg / 90 : 0;
      turn = e * Math.acos(1 - Math.min(1, squeeze));
      lift = e * Math.max(0, k.type === 'look' ? 0.3 * k.deg : k.deg) * deg;
    }
    bones.head.rotation.set(0, -turn * facing, -0.85 * neck + lift);
    legs.scale.y = Math.max(0.001, ss(0.35, 1, fold));
    legs.visible = fold > 0.02;
  }

  return {
    object, tris,
    update,
    get folded() { return st.fold; },
    // a new cycle time (and amplitude); restart begins a fresh beat from the top, as a newly started flat flap does
    flap(ms, k = 1, restart = false) {
      const t = at();
      st.p0 = restart ? 0 : phase(t); st.t0 = t; st.cycle = ms; st.amp = k;
      if (restart) st.raised = false;
    },
    raise() { st.raised = true; },                   // wings held up (until the next restarted flap)
    holdGlide(on) { st.glide = on; },                // the preview's held glide
    fold(ms = 160) { st.foldFrom = st.fold; st.foldTo = 1; st.foldAt = at(); st.foldMs = ms; },
    unfold(ms = 90) { st.foldFrom = st.fold; st.foldTo = 0; st.foldAt = at(); st.foldMs = ms; },
    look(step) { st.look = step; st.lookAt = at(); },
    shake(ms) { st.shakeAt = at(); st.shakeMs = ms; },
    // lighter version for slow devices: drop the lesser coverts
    degrade() { wings.forEach(w => w.lesser.forEach(f => { f.visible = false; })); },
    dispose() {
      object.traverse(o => {
        if (o.isSkinnedMesh) o.skeleton.dispose();
        if (o.isMesh) { o.geometry.dispose(); [].concat(o.material).forEach(m => m.dispose()); }
      });
    },
  };
}

// ── The intro's overlay: a transparent canvas over the page with an orthographic camera in CSS px (x right, y up, the
//    top-left corner at 0, 0), so screen positions and sizes map 1:1. It has no motion of its own: frame(st, now) copies
//    the flat bird's state, read from its transforms each frame:
//      feet [x, y] screen px   → position (the feet stay on the flat bird's feet)
//      rot deg                 → roll about the view axis
//      s                       → scale
//      sx 1 … -1 (the flip)    → yaw 0 … 180°, linear in sx, so it is edge-on exactly when the flat bird is
//      body {a,b,c,d,e,f}      → the flat body's bob, settle and crouch, in flat-bird px about the feet, inside the flip
//      opacity, filter, willChange → the canvas
export function createIntroBird(layer, size) {
  const canvas = document.createElement('canvas');
  canvas.className = 'intro-bird3d';
  canvas.setAttribute('aria-hidden', 'true');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene(), camera = new THREE.OrthographicCamera(0, 1, 0, -1, 1, 6000);
  camera.position.z = 3000;
  let W = 1, H = 1;
  function resize() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(W, H, false);
    camera.right = W; camera.bottom = -H; camera.updateProjectionMatrix();
  }
  resize();
  addBirdLights(scene);
  const bird = buildBird({ clock: () => performance.now(), bob: false });
  const root = new THREE.Group(), yaw = new THREE.Group(), body = new THREE.Group(), model = new THREE.Group();
  body.matrixAutoUpdate = false;
  model.scale.setScalar(size);                       // dove units → flat-bird px
  root.add(yaw); yaw.add(body); body.add(model); model.add(bird.object); scene.add(root);
  canvas.dataset.tris = bird.tris;
  layer.insertBefore(canvas, layer.firstChild);
  renderer.compile(scene, camera);                   // compile the shaders now, not on the first visible frame

  let last = 0, warm = 0, slow = 0, degraded = false;
  const a = new THREE.Vector3(), b = new THREE.Vector3();
  const toScreen = v => [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H];

  return {
    tris: bird.tris,
    resize,
    flap(ms, k = 1, restart = false) { bird.flap(ms, k, restart); },
    fold(ms) { bird.fold(ms); },
    look(step) { bird.look(step); },
    shake(ms) { bird.shake(ms); },
    // the flat take-off: a head step in progress snaps back to level, the wings go up and open, held there until the
    // flapping restarts
    takeOff() { bird.look(null); bird.raise(); bird.unfold(90); },
    frame(st, now) {
      const dt = last ? Math.min(50, now - last) : 16; last = now;
      // Frame budget: if frames stay over 20ms for 20 in a row, drop the lesser coverts
      if (++warm > 30) {
        slow = dt > 20 ? slow + 1 : 0;
        if (slow >= 20 && !degraded) {
          degraded = true; bird.degrade();
          if (DEV) console.info('[intro bird] frames over 20ms: fewer feathers');
        }
      }
      const sx = Math.max(-1, Math.min(1, st.sx)), m = st.body;
      root.position.set(st.feet[0], -st.feet[1], 0);
      root.rotation.z = -st.rot * deg;
      root.scale.setScalar(st.s);
      yaw.rotation.y = -Math.PI * (1 - sx) / 2;       // nose turns toward the viewer
      body.matrix.set(m.a, -m.c, 0, m.e, -m.b, m.d, 0, -m.f, 0, 0, 1, 0, 0, 0, 0, 1);   // y down → y up
      bird.update(dt, now, sx >= 0 ? 1 : -1);
      canvas.style.opacity = st.opacity;
      canvas.style.filter = st.filter;
      canvas.style.willChange = st.willChange;
      renderer.render(scene, camera);
    },
    // Where the camera actually put the dove: its feet on screen, and screen px per flat-bird px (vertical)
    measure() {
      a.set(0, 0, 0).applyMatrix4(body.matrixWorld).project(camera);
      b.set(0, 1, 0).applyMatrix4(body.matrixWorld).project(camera);
      const pa = toScreen(a), pb = toScreen(b);
      return { feet: pa, scale: Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) };
    },
    dispose() {
      bird.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    },
  };
}
