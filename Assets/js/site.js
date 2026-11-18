// ── Shared by every page (the homepage and /impact): motion preferences, header + progress bar + back-to-top,
// in-page anchor scrolling, the mobile menu, dialogs, toast + copy, the theme toggle, magnetic buttons, the cursor
// spotlight, scroll reveal, and the ⌘K search. Each page's own script runs after this file and can:
//   - add search entries with Site.search.push(() => [{ group, label, hint, run }, ...]) (built each time search opens)
//   - define muteQuickView() (homepage) so in-page jumps keep the floating pill out of the way
// Anything that scans the page for elements (reveal, spotlight, magnetic buttons) waits for DOMContentLoaded, so it
// also picks up what the page's own script renders (Where I fit, the Impact cards).
const Site = { search: [], email: 'angelinaponce163@gmail.com', resume: '/Angelina%20Ponce%20Resume.pdf' };

const finePointer  = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Header, progress bar and back-to-top react to scrolling (each page adds its own scroll work on top)
const progressBar = document.getElementById('progress-bar');
const scrollBtn   = document.getElementById('scroll-top');
window.addEventListener('scroll', () => {
  const st   = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (st / docH * 100) + '%';
  document.getElementById('header').classList.toggle('scrolled', st > 60);
  if (scrollBtn) scrollBtn.classList.toggle('visible', st > 400);
});

// Scroll so a section's top sits just under the fixed header. Uses the rendered position, which is
// correct whether or not the section is inside the zoomed wrapper.
function scrollToSection(el, gap = 4, behavior = reduceMotion ? 'auto' : 'smooth') {
  // a card still waiting to fade in sits 18px low; settle it first so the measurement is its final position
  if (el.classList.contains('reveal')) { revealObs.unobserve(el); finishReveal(el); }
  const navH = document.getElementById('header').offsetHeight;
  const top = el.id === 'main' ? 0 : el.getBoundingClientRect().top + window.scrollY - navH - gap;
  window.scrollTo({ top, behavior });
}

// Arriving from another page with a #hash (e.g. /impact → /#experience): the browser's own jump ignores the fixed
// header, so once everything has loaded the target is placed just under it. Web fonts and logo files can still
// shift the layout after "load", so it is placed again when the fonts are ready and once more shortly after, unless
// the visitor has started scrolling by then. Reloads and back/forward keep the position the browser restores.
window.addEventListener('load', () => {
  let target = null;
  try { target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) {}
  const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  if (!target || (nav && nav.type !== 'navigate')) return;
  let moved = false;
  const stop = () => { moved = true; };
  ['wheel', 'touchmove', 'keydown', 'pointerdown'].forEach(t => window.addEventListener(t, stop, { once: true, passive: true }));
  const place = () => { if (!moved) scrollToSection(target, target.matches('section') ? 4 : 24, 'instant'); };
  place();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => requestAnimationFrame(place));
  setTimeout(place, 700);
});
// A #hash changed on the open page (typed in the address bar, or a link elsewhere on the page) gets the same placement
window.addEventListener('hashchange', () => {
  let target = null;
  try { target = location.hash.length > 1 && document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch (e) {}
  if (target) scrollToSection(target, target.matches('section') ? 4 : 24, 'instant');
});

// ── Menu (tablet & phone): toggles the nav as a dropdown; Esc or a click outside closes it
const header = document.getElementById('header');
const menuBtn = document.getElementById('menuToggle');
function closeMenu() {
  if (!header.classList.contains('menu-open')) return;
  header.classList.remove('menu-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
}
menuBtn.addEventListener('click', () => {
  const open = !header.classList.contains('menu-open');
  header.classList.toggle('menu-open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open) document.querySelector('#primary-nav a').focus();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape' && header.classList.contains('menu-open')) { closeMenu(); menuBtn.focus(); } });
document.addEventListener('click', e => { if (!header.contains(e.target)) closeMenu(); });

// ── Dialog helpers (project modal, lightbox, search): lock page scroll, close on backdrop click / data-close
function openDialog(d) { document.documentElement.style.overflow = 'hidden'; d.showModal(); }
document.querySelectorAll('dialog').forEach(d => {
  d.addEventListener('close', () => { document.documentElement.style.overflow = ''; });
  d.addEventListener('click', e => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
});

// ── Photo lightbox (the <dialog id="lightbox"> on each page that has photos). A page registers each set of photo
// buttons as a gallery with addLightboxGallery(buttons, caption): caption(button) returns [title, description], and the
// description is optional (an empty one isn't shown). Without a caption function, each button's data-lb-title and
// data-lb-desc are used. The arrows, the ← / → keys and the count stay within the gallery that was opened, and a
// gallery of one photo shows neither; the full-size file comes from the image's
// data-full (else the image as shown). Esc and a click outside close it (see openDialog above), and focus returns to
// the photo that opened it.
const lightbox = document.getElementById('lightbox');
let gallery = null, shotIdx = 0;
function showShot(i) {
  const shots = gallery.shots;
  shotIdx = (i + shots.length) % shots.length;
  const btn = shots[shotIdx], img = btn.querySelector('img'), [title, loc = ''] = gallery.caption(btn);
  const big = document.getElementById('lightboxImg');
  big.src = img.dataset.full || img.currentSrc || img.src;
  big.alt = img.alt;
  big.classList.remove('swap'); void big.offsetWidth; big.classList.add('swap');
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxLoc').textContent = loc;
  document.getElementById('lightboxCount').textContent = shots.length < 2 ? '' : `${shotIdx + 1} / ${shots.length}`;
  document.getElementById('lightboxPrev').hidden = document.getElementById('lightboxNext').hidden = shots.length < 2;
}
const captionFromData = btn => [btn.dataset.lbTitle || '', btn.dataset.lbDesc || ''];
function addLightboxGallery(shots, caption = captionFromData) {
  if (!lightbox) return;
  shots = shots.filter(Boolean);
  const g = { shots, caption };
  shots.forEach(btn => btn.addEventListener('click', () => {
    if (!g.shots.includes(btn)) return;   // dropped from the gallery (its photo failed to load)
    gallery = g; showShot(g.shots.indexOf(btn)); openDialog(lightbox); lightbox.lastBtn = btn;
  }));
  return g;
}
if (lightbox) {
  document.getElementById('lightboxPrev').addEventListener('click', () => showShot(shotIdx - 1));
  document.getElementById('lightboxNext').addEventListener('click', () => showShot(shotIdx + 1));
  lightbox.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') showShot(shotIdx - 1);
    if (e.key === 'ArrowRight') showShot(shotIdx + 1);
  });
  lightbox.addEventListener('close', () => { if (lightbox.lastBtn) lightbox.lastBtn.focus({ preventScroll: true }); });
}

// ── Copy (email, project links) + toast
const toast = document.getElementById('toast');
const COPIED = '<svg class="i" aria-hidden="true"><use href="#i-check"/></svg>Copied to clipboard';
let toastTimer = null;
// Over an open dialog the toast becomes a popover, so it sits in the top layer above the dialog; otherwise it is a
// plain fixed element, as before
const toastRaised = () => !!toast.showPopover && toast.matches(':popover-open');
function showToast(html) {
  if (toast.showPopover && document.querySelector('dialog[open]')) {
    if (toastRaised()) toast.hidePopover();
    toast.popover = 'manual'; toast.showPopover();
    toast.classList.remove('show'); void toast.offsetWidth;   // restart the slide-up from the hidden state
  }
  toast.innerHTML = html;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    if (toastRaised()) toastTimer = setTimeout(() => { toast.hidePopover(); toast.removeAttribute('popover'); }, 350);
  }, 2200);
}
// Copies text, falling back to a hidden textarea where the async clipboard is blocked; resolves true when it worked.
// The textarea goes inside an open dialog, since everything outside one is inert.
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); return true; } catch (err) {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    (document.querySelector('dialog[open]') || document.body).appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch (err2) {}
    ta.remove();
    return ok;
  }
}

// ── Theme toggle (remembered in localStorage)
const themeBtn = document.getElementById('themeToggle');
function syncThemeButton() {
  const dark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeBtn.setAttribute('aria-pressed', String(dark));
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}
themeBtn.addEventListener('click', () => {
  const root = document.documentElement;
  const dark = root.getAttribute('data-theme') !== 'dark';
  if (!reduceMotion) { root.classList.add('theme-anim'); setTimeout(() => root.classList.remove('theme-anim'), 500); }
  if (dark) root.setAttribute('data-theme', 'dark'); else root.removeAttribute('data-theme');
  try { localStorage.setItem('apTheme', dark ? 'dark' : 'light'); } catch (e) {}
  syncThemeButton();
});
syncThemeButton();

// ── In-page anchor links scroll smoothly to just under the header and take keyboard focus with them
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    let t = null;
    try { t = document.querySelector(a.getAttribute('href')); } catch (err) {}   // a bare "#" (the logo) is not a selector
    if (!t) return;
    e.preventDefault();
    closeMenu();
    if (typeof muteQuickView === 'function') muteQuickView();
    scrollToSection(t);
    // move keyboard focus with the scroll so Tab continues from the new section
    if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  });
});

// Magnetic buttons: they lean toward the pointer by a share (k) of its distance from their centre
function magnetize(btn, k) {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - rect.left - rect.width/2) * k}px, ${(e.clientY - rect.top - rect.height/2) * k}px)`;
  });
  btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
}

// ── Scroll reveal: grid items stagger by column; once an item has finished entering, its reveal
// classes are removed so its own hover transitions run without the entrance delay.
const finishReveal = el => { el.classList.remove('reveal', 'visible', 'reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5'); el.style.removeProperty('--d'); };
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    el.classList.add('visible');
    revealObs.unobserve(el);
    const delay = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
    setTimeout(() => finishReveal(el), delay + 900);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.projects-grid, .conf-grid, .value-grid').forEach(grid => {
    [...grid.children].filter(el => !el.classList.contains('conf-feature')).forEach((el, i) => {   // the full-width feature enters on its own
      el.classList.add('reveal');
      el.classList.remove('reveal-delay-1', 'reveal-delay-2', 'reveal-delay-3', 'reveal-delay-4', 'reveal-delay-5');
      el.style.setProperty('--d', (i % 3) * 90 + 'ms');
    });
  });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  document.querySelectorAll('.btn-mag:not([data-magnetic="off"])').forEach(btn => magnetize(btn, 0.18));   // data-magnetic="off": stays put
  if (!reduceMotion && finePointer) {
    document.querySelectorAll('.c-btn, .showcase-more').forEach(btn => magnetize(btn, 0.14));
    // the spotlight glow (see "Cursor spotlight" in the CSS) follows the pointer
    document.querySelectorAll('.project-card, .project-showcase, .conf-card, .modal-inner').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      });
    });
  }
});

// ── Count-up numbers: an element with data-target counts up from 0 to it (ease-out) once it scrolls into view. Numbers
// are drawn with thousands separators; data-duration (ms) overrides the default 1.4s. Reduced motion shows the number.
// Counters inside #hero are started by the homepage's own hero entrance instead.
function countUp(el) {
  const target = +el.dataset.target, fmt = n => n.toLocaleString('en-US');
  el.dataset.counted = '1';
  if (reduceMotion) { el.textContent = fmt(target); return; }
  const t0 = performance.now(), dur = +el.dataset.duration || 1400;
  const tick = now => {
    const p = Math.min(1, (now - t0) / dur);
    el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    countUp(e.target);
    counterObs.unobserve(e.target);
  });
}, { threshold: 0.5 });
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-target]').forEach(c => {
    if (c.closest('#hero')) return;
    if (!reduceMotion && !c.dataset.counted) c.textContent = '0';   // start from 0, so the final number never flashes first
    counterObs.observe(c);
  });
});

// ── Photo parallax: a photo drifts up to 8px against the scroll inside its frame (it is drawn slightly scaled up so the
// drift never shows an edge). Conference photos and the Impact case-study photos; reduced motion keeps them still.
const PARALLAX = [['.conf-img', '.conf-card'], ['.impact-shot.has-parallax img', '.impact-shot']];
if (!reduceMotion) window.addEventListener('scroll', () => {
  PARALLAX.forEach(([sel, box]) => document.querySelectorAll(sel).forEach(img => {
    const rect = img.closest(box).getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      img.style.setProperty('--py', ((p - 0.5) * 16).toFixed(1) + 'px');
    }
  }));
}, { passive: true });

// ── Timeline: the line draws with scroll (--tp, 0–1) and each node (.timeline-item) gets .reached as the line passes its
// .timeline-dot. initTimeline(element) for each timeline on a page (Experience on the homepage, commitments on /impact).
function initTimeline(tl) {
  if (!tl) return;
  const items = [...tl.querySelectorAll('.timeline-item')];
  let ticking = false;
  const update = () => {
    ticking = false;
    const r = tl.getBoundingClientRect();
    const reach = window.innerHeight * 0.65;
    const p = reduceMotion ? 1 : Math.max(0, Math.min(1, (reach - r.top) / r.height));
    tl.style.setProperty('--tp', p.toFixed(4));
    const tip = r.top + p * r.height;
    items.forEach(item => {
      const dot = item.querySelector('.timeline-dot').getBoundingClientRect();
      item.classList.toggle('reached', dot.top + dot.height / 2 <= tip + 1);
    });
  };
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

// ── The dove: the site's bird, from Assets/img/abuelas-blessing.png. Shared pieces:
//   sampleDove(src)          the image sampled once into ASCII grids (one per wing keyframe), shared by every ASCII dove
//   initAsciiBird(canvas, o) an ASCII dove on a canvas (the footer's sign-off), with blink and wing-fold idles
//   mountDove(el, o)         the vector dove (the nav logo on every page), traced from the same image, same idles
//   runDoveIntro(o)          the homepage's first-visit intro: the ASCII dove assembles, the name arrives, the dove
//                            flies into the nav logo and the page is revealed
const DOVE_ASCII = {
  RAMP: ' .:-=+*#%@', COLS: 56, CHAR_ASPECT: 0.6,  // character cell width ÷ height
  EMPTY: 0.08,                                     // cells less inked than this are background
  GAMMA: 2.2,                                      // contrast curve: partly inked cells (feather gaps) drop to lighter glyphs
  EYE: [0.719, 0.443],                             // the eye, as a share of the image's width / height
  FOLDS: [1, 0.85, 0.7],                           // wing keyframes: horizontal scale toward the wing root
  // the wings: left of their root on the body, above the belly. The root runs down the shoulder (x 0.56) and bends
  // in to where the front wing meets the belly (x 0.40 at y 0.665); each row of wing folds toward its own root.
  WING_BOTTOM: 0.665,
  rootX: y => y < 0.55 ? 0.56 : 0.56 - (y - 0.55) / (0.665 - 0.55) * 0.16,
};
const doveSamples = {};
function sampleDove(src) {
  if (doveSamples[src]) return doveSamples[src];
  return doveSamples[src] = new Promise((resolve, reject) => {
    const A = DOVE_ASCII, COLS = A.COLS, img = new Image();
    img.onerror = reject;
    img.onload = () => {
      const ROWS = Math.round(COLS * (img.naturalHeight / img.naturalWidth) * A.CHAR_ASPECT);
      const OW = COLS * 10, OH = Math.round(OW * img.naturalHeight / img.naturalWidth);
      const off = document.createElement('canvas'); off.width = OW; off.height = OH;
      const o = off.getContext('2d'); o.fillStyle = '#fff'; o.fillRect(0, 0, OW, OH); o.drawImage(img, 0, 0, OW, OH);
      const px = o.getImageData(0, 0, OW, OH).data, base = new Float32Array(OW * OH);
      for (let i = 0; i < base.length; i++) base[i] = 1 - (0.299 * px[i * 4] + 0.587 * px[i * 4 + 1] + 0.114 * px[i * 4 + 2]) / 255;
      // a keyframe's ink map: the wing pixels of each row squeezed toward that row's root; what they leave is blank
      const folded = s => {
        if (s === 1) return base;
        const m = base.slice();
        for (let y = 0; y < OH; y++) {
          const ny = y / OH; if (ny >= A.WING_BOTTOM) break;
          const rx = Math.round(A.rootX(ny) * OW), row = y * OW;
          for (let x = 0; x < rx; x++) m[row + x] = 0;
          for (let x = 0; x < rx; x++) { const v = base[row + x]; if (!v) continue; const nx = Math.round(rx - (rx - x) * s); if (v > m[row + nx]) m[row + nx] = v; }
        }
        return m;
      };
      const cw = OW / COLS, ch = OH / ROWS;
      const eyeR = Math.floor(A.EYE[1] * ROWS), eyeC = Math.round(A.EYE[0] * COLS);   // the eye pocket: two cells
      const isEye = (r, c) => r === eyeR && (c === eyeC - 1 || c === eyeC);
      const grid = m => {
        const out = [];
        for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
          if (isEye(r, c)) { out.push({ r, c, ch: ' ', eye: true }); continue; }
          let sum = 0, n = 0;
          for (let y = Math.floor(r * ch); y < Math.floor((r + 1) * ch); y++) for (let x = Math.floor(c * cw); x < Math.floor((c + 1) * cw); x++) { sum += m[y * OW + x]; n++; }
          const ink = sum / n;
          if (ink >= A.EMPTY) out.push({ r, c, ch: A.RAMP[Math.min(A.RAMP.length - 1, 1 + Math.floor(Math.pow(ink, A.GAMMA) * (A.RAMP.length - 1)))] });
        }
        return out;
      };
      const frames = A.FOLDS.map(s => grid(folded(s)));
      const midR = ROWS / 2, midC = COLS / 2, maxD = Math.hypot(midR, midC * A.CHAR_ASPECT);
      frames[0].forEach(k => { k.d = Math.hypot(k.r - midR, (k.c - midC) * A.CHAR_ASPECT) / maxD; });
      resolve({ ROWS, COLS, frames });
    };
    img.src = src;
  });
}
const doveEase = { out: x => 1 - Math.pow(1 - x, 3), inOut: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2 };
// the fold keyframe for a flutter at p (0–1): out → in → out
const doveFoldFrame = (frames, p) => frames[Math.round(doveEase.inOut(p < 0.5 ? p * 2 : 2 - p * 2) * (frames.length - 1))];

// Idle behaviour shared by every dove: blink() and flutter() on random timers that pause while the tab is hidden.
// Reduced motion: no timers at all.
function doveIdle({ blink, flutter, blinkEvery = [4000, 8000], flutterEvery = [10000, 20000] }) {
  let timers = [], on = false;
  const rnd = ([a, b]) => a + Math.random() * (b - a);
  const blinkLoop = () => { blink(); if (Math.random() < 0.25) timers.push(setTimeout(blink, 300)); timers.push(setTimeout(blinkLoop, rnd(blinkEvery))); };
  const flutterLoop = () => { flutter(); timers.push(setTimeout(flutterLoop, rnd(flutterEvery))); };
  const schedule = () => { if (!on || reduceMotion || document.hidden) return; timers.push(setTimeout(blinkLoop, rnd(blinkEvery)), setTimeout(flutterLoop, rnd(flutterEvery))); };
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  document.addEventListener('visibilitychange', () => { clear(); schedule(); });
  return { start() { if (!on) { on = true; schedule(); } } };
}

// ── ASCII dove on a canvas (data-src: the image). o.intro: assemble from scattered dots first (o.introMs long);
//    o.blinkEvery / o.flutterEvery: the idle intervals. Returns { start, flutter }.
function initAsciiBird(canvas, o = {}) {
  if (!canvas || !canvas.dataset.src) return null;
  const { intro = true, introMs = 1800, blinkEvery, flutterEvery } = o;
  const A = DOVE_ASCII, ctx = canvas.getContext('2d'), FLUTTER = 560;
  let G = null, wantStart = false, started = false, mode = 'hidden', t0 = 0, raf = 0, blinkUntil = 0, flutterAt = -1;
  let cellW = 0, cellH = 0, font = '';
  function resize() {
    const h = canvas.clientHeight || 120, dpr = window.devicePixelRatio || 1;
    cellH = h / G.ROWS; cellW = cellH * A.CHAR_ASPECT;
    canvas.style.width = (cellW * G.COLS) + 'px';
    canvas.width = Math.round(cellW * G.COLS * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    font = `${(cellH * 1.05).toFixed(2)}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    if (mode === 'idle') draw(performance.now());
  }
  function draw(now) {
    const W = cellW * G.COLS, H = cellH * G.ROWS;
    ctx.clearRect(0, 0, W, H); ctx.font = font; ctx.textBaseline = 'top'; ctx.textAlign = 'center'; ctx.fillStyle = getComputedStyle(canvas).color;
    const tIntro = mode === 'intro' ? now - t0 : Infinity;
    let frame = G.frames[0];
    if (flutterAt >= 0 && tIntro >= introMs) { const p = (now - flutterAt) / FLUTTER; if (p >= 1) flutterAt = -1; else frame = doveFoldFrame(G.frames, p); }
    const blinking = now < blinkUntil;
    for (const k of frame) {
      let x = (k.c + 0.5) * cellW, y = k.r * cellH, glyph = k.ch, alpha = 1;
      if (k.eye) { if (!blinking || tIntro < introMs) continue; glyph = '-'; }   // the eye is a gap; a blink fills it
      if (tIntro < introMs) {
        const p = doveEase.out(Math.max(0, Math.min(1, (tIntro - k.d * introMs * 0.39) / (introMs * 0.55))));
        x = k.sx * W + (x - k.sx * W) * p; y = k.sy * H + (y - k.sy * H) * p;
        glyph = p < 0.35 ? '.' : A.RAMP[Math.max(1, Math.round(A.RAMP.indexOf(glyph) * Math.min(1, (p - 0.35) / 0.5)))];
        alpha = 0.3 + 0.7 * p;
      }
      ctx.globalAlpha = alpha; ctx.fillText(glyph, x, y);
    }
    ctx.globalAlpha = 1;
  }
  const loop = now => {
    draw(now);
    if (mode === 'intro' && now - t0 >= introMs) { mode = 'idle'; idle.start(); }
    raf = (mode === 'intro' || flutterAt >= 0 || now < blinkUntil) ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const flutter = () => { if (mode === 'idle' && flutterAt < 0 && !reduceMotion) { flutterAt = performance.now(); kick(); } };
  const idle = doveIdle({ blink: () => { blinkUntil = performance.now() + 150; kick(); }, flutter, blinkEvery, flutterEvery });
  canvas.addEventListener('mouseenter', flutter);
  window.addEventListener('resize', () => { if (G) resize(); });
  new MutationObserver(() => { if (mode === 'idle') draw(performance.now()); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  function start() {
    if (!G) { wantStart = true; return; }
    if (started) return;
    started = true;
    if (reduceMotion || !intro) { mode = 'idle'; draw(performance.now()); idle.start(); return; }
    G.frames[0].forEach(k => { k.sx = Math.random(); k.sy = Math.random(); });
    mode = 'intro'; t0 = performance.now(); kick();
  }
  sampleDove(canvas.dataset.src).then(g => { G = g; resize(); if (canvas.parentElement) canvas.parentElement.classList.add('is-live'); if (wantStart) start(); });
  return { start, flutter };
}

// ── Vector dove: the nav logo on every page. Traced from the same image (potrace), split into body and wings along
//    the same wing root as the ASCII dove so the wings can fold toward the body; a small disc closes the eye.
const DOVE_VECTOR = {
  w: 1486, h: 1338,
  eye: [1069, 593, 17],                                                  // the eye's centre and its cover's radius
  wingClip: '0,0 840,0 840,736 602,890 0,890',                           // the wings (a little past the root: no seam)
  bodyClip: '832,0 1486,0 1486,1338 0,1338 0,890 594,890 832,736',
  paths: [
    "M623 1277 c-1 -1 -3 -4 -5 -6 -4 -5 -16 -21 -16 -23 0 0 -1 -2 -3 -4 -2 -3 -3 -5 -3 -6 0 0 -1 -3 -2 -6 -1 -2 -3 -6 -4 -9 0 -2 -1 -7 -2 -9 -7 -19 -8 -34 -8 -67 1 -23 1 -28 3 -38 2 -6 3 -13 3 -15 0 -1 1 -6 3 -11 1 -4 2 -8 2 -10 0 -1 1 -5 2 -7 2 -4 5 -19 4 -20 0 -1 -4 2 -5 4 0 1 -1 4 -3 5 -1 2 -2 4 -2 4 0 1 -1 4 -2 6 -2 3 -3 6 -4 8 -1 2 -2 5 -3 8 -1 2 -2 4 -2 5 0 1 -1 4 -2 7 -2 2 -3 6 -3 9 -1 2 -2 6 -3 7 0 2 -2 7 -2 11 -1 4 -2 9 -3 10 -1 2 -2 9 -4 30 0 4 -1 8 -1 9 -2 0 -7 -4 -9 -8 -1 -1 -3 -6 -6 -11 -2 -4 -4 -8 -5 -10 0 -1 -1 -2 -2 -3 0 -1 -1 -3 -2 -5 -1 -3 -2 -6 -3 -9 -1 -2 -3 -7 -3 -11 -1 -3 -3 -9 -4 -12 -2 -8 -2 -60 0 -68 1 -3 3 -9 4 -13 0 -5 2 -9 2 -11 1 -1 2 -4 3 -7 0 -2 1 -6 2 -8 2 -3 3 -7 3 -9 1 -2 2 -5 3 -6 1 -1 2 -4 3 -7 1 -2 2 -5 3 -5 0 -1 1 -2 1 -2 0 -1 1 -4 3 -7 7 -13 1 -12 -9 1 -1 1 -3 4 -5 6 -4 5 -8 11 -8 12 0 1 -1 3 -2 4 -2 2 -3 5 -3 6 -1 1 -2 4 -3 5 -1 1 -2 3 -2 3 0 1 -1 4 -3 6 -1 3 -2 7 -3 10 -1 5 -3 7 -4 6 -2 -1 -7 -12 -8 -16 0 -2 -1 -6 -2 -9 -5 -14 -5 -65 0 -76 1 -2 2 -6 3 -8 0 -3 1 -7 2 -9 1 -1 2 -5 3 -7 0 -1 1 -5 2 -6 2 -2 3 -5 4 -6 1 -2 12 -9 19 -11 1 0 4 -1 5 -2 1 -1 4 -2 6 -3 1 0 7 -2 12 -5 5 -2 9 -4 10 -4 0 0 14 -6 18 -8 1 -1 3 -2 5 -3 1 -1 3 -2 5 -2 1 -1 3 -2 4 -3 2 0 4 -2 6 -2 1 -1 3 -2 5 -3 1 0 3 -1 4 -2 1 -1 5 -2 7 -4 3 -1 9 -5 14 -8 5 -3 10 -6 11 -7 1 0 2 -1 2 -1 2 0 13 -7 13 -8 0 0 2 -2 4 -3 3 -1 8 -5 12 -8 1 0 6 -4 12 -8 5 -5 11 -9 13 -11 2 -2 8 -7 13 -11 9 -8 25 -24 30 -30 1 -3 3 -5 4 -6 4 -4 14 -16 17 -20 1 -3 5 -7 7 -11 6 -8 14 -20 14 -22 0 0 1 -2 2 -3 1 -2 4 -7 7 -12 2 -5 5 -9 5 -10 1 0 6 -11 13 -25 7 -13 13 -26 15 -28 1 -2 2 -5 3 -6 1 -1 2 -2 2 -3 1 -2 3 -5 5 -8 2 -3 5 -8 6 -10 2 -3 3 -5 4 -5 1 0 1 -1 1 -1 0 -1 1 -3 2 -4 3 -3 2 -3 -1 -2 -3 0 -18 14 -22 20 -1 2 -3 5 -4 7 -1 1 -2 3 -3 3 -1 1 -8 11 -8 12 0 1 -1 3 -2 4 -2 1 -8 11 -12 20 -2 2 -3 5 -4 6 -2 2 -9 14 -13 22 -1 2 -2 4 -3 4 -1 0 -2 1 -3 3 -2 5 -6 12 -7 13 -1 1 -8 11 -8 12 0 1 -1 2 -2 3 -1 1 -4 4 -6 8 -2 3 -5 6 -6 7 0 1 -1 2 -2 3 -3 5 -43 46 -51 52 -3 2 -8 5 -11 8 -4 3 -8 6 -9 7 -1 0 -2 1 -2 2 -1 0 -3 2 -5 3 -5 2 -9 6 -12 8 -1 1 -3 2 -3 2 -1 0 -3 1 -5 2 -1 2 -4 3 -5 4 -1 1 -5 2 -7 4 -3 2 -8 4 -11 5 -2 2 -5 3 -6 4 -1 1 -2 2 -4 2 -2 1 -4 2 -4 3 -1 1 -4 2 -5 3 -2 0 -5 1 -7 3 -1 1 -3 2 -4 2 -1 0 -4 1 -7 2 -2 2 -8 4 -11 6 -4 2 -10 4 -12 6 -3 1 -7 2 -8 3 -1 0 -4 1 -5 2 -1 1 -3 2 -4 2 -2 0 -4 1 -6 2 -2 1 -4 2 -4 2 -1 0 -15 6 -21 9 -2 1 -5 2 -7 2 -2 1 -6 2 -8 4 -2 1 -5 2 -6 2 -1 0 -3 1 -5 2 -2 1 -5 3 -8 4 -2 0 -6 2 -8 3 -3 1 -5 2 -6 2 -1 0 -3 1 -5 3 -3 1 -5 2 -6 2 -1 0 -3 1 -5 2 -3 1 -8 3 -13 5 -5 2 -10 5 -12 6 -2 1 -5 2 -6 2 -2 1 -5 2 -6 3 -2 1 -3 2 -4 2 -2 0 -31 14 -45 22 -3 1 -7 3 -9 4 -2 1 -4 3 -5 4 -1 0 -5 3 -9 5 -5 2 -11 6 -14 8 -3 2 -6 4 -8 5 -1 1 -5 3 -8 6 -4 2 -7 5 -8 5 -2 1 -5 3 -7 4 -2 2 -6 5 -7 6 -1 1 -3 2 -4 3 -2 1 -3 2 -3 2 -1 0 -13 10 -16 13 -1 1 -3 3 -6 4 -14 11 -46 42 -58 57 -3 4 -9 12 -13 17 -5 5 -10 12 -12 15 -3 4 -6 8 -8 11 -2 3 -4 6 -4 6 0 1 -1 3 -3 5 -2 2 -5 6 -6 9 -2 3 -3 6 -4 7 -1 0 -2 2 -8 13 -2 5 -4 6 -6 3 -3 -6 -1 -50 3 -61 0 -2 2 -8 3 -11 0 -4 1 -8 2 -9 1 -1 2 -4 3 -7 0 -3 2 -7 3 -9 1 -3 2 -5 2 -6 0 -1 1 -4 3 -6 4 -8 5 -11 7 -14 0 -2 2 -5 3 -6 0 -1 2 -4 3 -7 1 -2 2 -4 3 -4 0 -1 3 -4 5 -8 2 -3 4 -8 5 -9 1 -1 4 -5 6 -9 7 -10 17 -23 25 -31 16 -18 51 -52 54 -53 1 0 3 -2 5 -3 2 -2 3 -3 4 -3 1 0 3 -5 3 -7 0 -1 -4 0 -4 1 -1 1 -2 2 -4 2 -2 1 -5 2 -5 2 -1 1 -3 3 -5 4 -6 3 -13 7 -18 10 -19 12 -27 18 -27 19 0 0 -1 1 -2 2 -9 4 -53 47 -64 62 -2 3 -4 5 -4 5 0 0 -2 2 -3 4 -1 2 -2 3 -2 3 -1 0 -2 2 -3 4 -6 11 -9 -5 -3 -20 1 -5 2 -9 2 -11 0 -1 1 -5 3 -8 2 -3 3 -6 3 -7 0 -1 6 -14 9 -18 1 -2 3 -6 4 -8 2 -3 4 -7 5 -8 2 -2 3 -4 5 -6 3 -6 4 -7 6 -10 2 -1 6 -7 11 -12 9 -12 9 -12 19 -21 13 -13 45 -41 52 -44 1 -1 3 -2 4 -3 0 0 2 -2 4 -3 5 -3 11 -7 11 -8 0 -1 1 -2 3 -3 2 0 3 -2 2 -2 -1 -2 -6 -1 -8 1 -1 1 -4 2 -7 3 -2 1 -4 1 -4 2 -1 0 -5 3 -10 5 -5 2 -10 5 -11 7 -2 1 -4 2 -5 2 -1 0 -2 1 -3 2 -1 1 -3 2 -4 3 -2 0 -5 2 -7 4 -2 1 -5 3 -6 4 -7 4 -21 15 -22 16 -1 1 -6 5 -10 9 -15 14 -35 35 -38 41 -2 2 -2 3 -4 2 -3 0 -3 0 -5 -8 -2 -10 -1 -19 1 -33 1 -6 2 -12 2 -14 0 -2 1 -6 2 -9 2 -4 3 -9 4 -12 0 -2 1 -6 3 -9 1 -2 2 -5 2 -6 0 0 1 -3 2 -6 2 -2 3 -5 3 -6 0 -1 1 -3 2 -5 2 -2 3 -5 4 -6 0 -2 1 -4 2 -5 1 -1 2 -2 2 -2 0 -1 1 -3 3 -5 2 -3 3 -5 3 -6 0 0 1 -2 3 -3 1 -2 5 -7 8 -11 14 -19 47 -49 62 -58 3 -1 7 -4 9 -6 3 -2 6 -4 8 -4 1 -1 4 -2 5 -3 1 -1 2 -2 3 -2 1 0 3 -1 4 -2 2 -1 4 -3 6 -3 2 -1 4 -2 5 -3 1 0 4 -2 6 -2 2 -1 5 -3 6 -3 2 -2 12 -6 19 -8 3 0 6 -2 7 -3 1 0 4 -1 8 -2 6 -1 16 -7 14 -8 -2 -2 -12 -1 -18 1 -4 1 -10 2 -13 3 -4 0 -10 1 -13 2 -3 1 -8 2 -11 3 -4 1 -8 2 -10 3 -2 1 -4 2 -5 2 -1 0 -4 1 -6 2 -2 1 -5 2 -7 3 -7 2 -33 15 -36 18 -1 1 -3 3 -6 4 -7 4 -8 5 -10 7 -6 5 -7 -1 -4 -12 0 -4 2 -9 2 -12 0 -2 2 -7 3 -9 1 -3 2 -6 2 -6 0 -1 3 -8 10 -22 5 -10 31 -36 41 -42 1 -1 3 -2 3 -2 6 -4 23 -13 31 -15 2 -1 5 -2 6 -2 0 -1 6 -2 12 -3 7 -1 13 -3 15 -3 5 -2 46 -2 55 1 5 1 10 2 11 2 3 0 7 -1 6 -2 0 0 -2 -2 -4 -3 -2 -2 -6 -4 -10 -4 -3 -1 -8 -3 -10 -3 -2 -1 -8 -3 -12 -3 -5 -1 -10 -2 -12 -3 -10 -2 -44 -1 -52 1 -15 5 -23 3 -18 -3 1 -1 3 -5 5 -8 5 -9 21 -26 29 -31 4 -2 8 -5 10 -6 2 -2 4 -3 5 -3 1 0 4 -1 7 -2 3 -2 6 -3 7 -3 1 0 6 -1 11 -3 12 -3 39 -3 50 1 3 1 8 2 10 2 2 0 6 1 9 3 2 1 6 2 7 2 1 0 4 1 7 2 5 3 13 7 19 9 2 1 4 1 5 1 0 -1 -1 -5 -2 -5 0 0 -3 -2 -6 -5 -2 -2 -6 -5 -8 -6 -3 -1 -5 -3 -5 -3 -1 -1 -11 -7 -12 -7 0 0 -2 -1 -4 -2 -2 -2 -6 -3 -8 -4 -8 -2 -14 -6 -14 -8 0 -1 6 -6 11 -8 1 -1 3 -2 5 -3 1 -1 3 -2 5 -3 2 -1 5 -2 6 -3 1 -1 3 -2 4 -2 2 0 5 -1 8 -2 2 -2 7 -3 9 -4 3 0 7 -1 9 -2 3 -1 9 -2 15 -3 5 -1 12 -1 14 -2 15 -3 42 -3 55 0 2 1 8 1 14 2 6 1 13 2 16 3 4 1 9 3 13 3 3 1 7 2 9 3 1 0 6 2 10 3 l7 3 0 -3 c1 -2 0 -4 -2 -6 -1 -1 -2 -2 -2 -3 0 0 -1 -1 -2 -2 -1 -1 -2 -3 -3 -4 -1 -1 -2 -4 -3 -5 -2 -2 -5 -6 -7 -9 -3 -4 -9 -11 -14 -17 -4 -5 -11 -14 -15 -18 -12 -16 -37 -40 -46 -46 -1 -1 -4 -3 -6 -5 -5 -5 -39 -27 -42 -27 0 0 -2 -1 -4 -2 -1 -2 -4 -3 -6 -4 -2 0 -4 -2 -5 -2 -1 -1 -3 -2 -6 -3 -2 -1 -4 -2 -5 -2 -1 -1 -3 -2 -4 -3 -2 0 -6 -1 -8 -3 -3 -1 -6 -2 -7 -2 -2 0 -5 -1 -7 -2 -3 -2 -6 -3 -9 -3 -2 -1 -6 -2 -8 -3 -2 -1 -6 -2 -9 -3 -2 0 -7 -1 -9 -2 -3 -1 -10 -3 -14 -3 -5 -1 -12 -3 -15 -3 -3 -1 -8 -2 -10 -2 -3 0 -7 0 -10 -1 -21 -4 -90 -6 -112 -3 -13 2 -15 2 -17 -1 -1 -2 -1 -3 1 -9 2 -4 3 -8 3 -9 0 -2 1 -4 3 -6 1 -2 2 -4 2 -5 0 -1 1 -2 2 -3 1 -1 2 -3 3 -6 2 -4 2 -5 14 -17 5 -5 10 -9 11 -10 2 -1 6 -3 10 -6 5 -2 8 -4 9 -4 1 0 3 -1 6 -2 5 -3 14 -4 33 -6 11 -1 37 2 48 5 9 3 20 4 20 2 0 -1 0 -2 -1 -2 0 0 -2 -1 -5 -3 -2 -1 -5 -3 -8 -4 -2 0 -5 -2 -7 -2 -1 -1 -4 -2 -7 -3 -2 -1 -6 -2 -7 -3 -6 -3 -31 -4 -52 -3 -11 1 -14 -1 -9 -6 2 -1 3 -2 3 -3 0 0 1 -2 3 -4 2 -2 3 -4 3 -4 0 -1 1 -2 2 -3 1 -2 3 -3 4 -4 4 -5 13 -13 17 -15 2 -1 6 -4 8 -5 2 -2 4 -3 4 -3 1 0 3 -1 5 -2 26 -14 75 -14 102 0 2 1 4 2 5 2 1 0 2 1 4 2 3 2 10 4 10 2 0 -1 -7 -8 -9 -9 -1 -1 -3 -2 -5 -3 -2 -2 -4 -3 -6 -5 -6 -4 -23 -12 -30 -13 -2 0 -6 -1 -8 -1 -1 -1 -6 -1 -9 -2 -7 -1 -9 -3 -5 -7 5 -5 13 -11 16 -13 25 -13 39 -17 63 -16 10 1 12 1 18 4 3 2 6 3 6 3 5 0 24 17 34 31 4 5 8 10 8 10 1 1 7 9 8 12 1 1 4 5 6 7 2 3 4 5 4 5 0 1 6 9 11 17 2 2 4 5 5 7 5 9 35 42 39 42 0 0 2 1 3 3 1 1 3 3 4 3 1 1 4 3 8 5 3 3 9 6 14 8 4 3 8 5 9 6 1 0 4 1 6 2 3 1 6 2 7 2 2 1 5 2 7 3 2 0 7 1 9 2 3 1 9 2 14 3 5 1 14 2 19 3 4 0 16 2 25 2 8 0 19 2 23 2 3 1 12 2 18 3 6 1 14 2 18 3 3 1 9 2 13 3 3 0 9 1 13 3 3 1 7 2 9 2 1 0 5 1 8 2 2 2 6 3 7 3 2 0 5 1 7 2 3 2 6 3 8 4 2 0 5 1 7 2 2 1 9 5 17 8 7 4 14 7 15 9 2 1 4 2 4 2 1 0 4 2 8 4 3 3 7 5 8 6 7 4 35 29 43 38 3 4 6 8 7 9 4 3 12 14 12 15 0 0 1 2 3 4 1 2 3 5 3 6 1 1 2 2 2 2 1 0 2 2 3 4 1 3 2 5 3 5 0 1 3 5 5 10 3 5 6 11 6 12 3 4 7 13 8 18 1 2 3 6 4 9 1 2 2 6 3 9 1 2 2 6 3 9 1 3 2 7 3 8 0 2 2 6 2 9 1 3 2 8 3 10 1 2 2 7 2 10 1 3 2 9 4 13 1 5 2 10 2 13 0 2 1 7 2 11 1 4 3 11 3 15 1 5 2 12 3 15 1 4 2 10 2 13 1 4 2 9 3 12 1 2 2 7 2 10 1 3 2 7 4 10 1 2 2 6 2 7 0 2 1 5 3 8 1 2 2 5 2 6 0 1 1 4 3 5 1 2 2 4 2 5 0 1 1 4 3 6 2 3 3 5 3 5 0 5 33 38 38 38 1 0 3 1 4 3 2 1 4 2 5 2 2 0 4 1 6 3 2 1 5 2 6 2 2 0 6 1 10 1 3 1 9 2 12 3 l7 0 0 -3 c0 -5 0 -6 -3 -11 -1 -2 -2 -4 -2 -5 0 -1 -1 -4 -3 -8 -2 -3 -3 -7 -3 -8 0 -2 -1 -4 -2 -7 -1 -2 -3 -7 -3 -10 -1 -4 -1 -9 -2 -11 0 -2 -1 -6 -1 -8 -1 -3 -1 -6 -2 -7 0 -2 1 -4 5 -4 5 -2 7 1 7 9 0 4 1 9 1 12 1 3 2 9 3 13 1 3 2 10 4 14 1 4 2 8 2 9 0 1 1 4 2 5 1 2 2 5 3 8 2 9 8 13 20 13 11 0 12 2 8 7 -2 2 -4 5 -5 6 -5 6 -3 11 11 25 4 3 4 5 1 5 -1 0 -5 -3 -10 -8 -13 -12 -12 -12 -16 -9 -12 5 -27 23 -40 50 -3 5 -22 24 -26 25 -2 1 -4 2 -4 3 -1 1 -16 8 -17 8 -1 0 -5 1 -10 3 -12 3 -31 3 -43 0 -4 -2 -8 -3 -10 -3 -1 0 -4 -1 -6 -2 -3 -2 -6 -3 -7 -3 -2 -1 -4 -2 -5 -3 -2 -1 -4 -2 -6 -3 -2 -1 -4 -1 -4 -2 0 0 -2 -3 -5 -5 -12 -9 -14 -11 -21 -19 -5 -5 -10 -11 -12 -13 -3 -4 -10 -13 -17 -21 -12 -16 -42 -46 -52 -52 -3 -3 -7 -5 -8 -6 -6 -4 -9 0 -10 14 -1 6 -1 14 -2 18 -1 4 -1 20 0 44 0 31 0 38 -1 46 -1 6 -2 12 -2 15 0 3 -1 8 -2 13 -2 4 -3 8 -3 9 0 1 -1 5 -2 8 -2 4 -3 8 -3 9 -2 7 -15 32 -23 43 -2 3 -4 6 -4 7 0 0 -1 2 -2 3 -2 1 -5 5 -8 10 -3 4 -7 9 -8 10 -8 8 -14 15 -16 19 -2 2 -8 10 -14 17 -6 7 -12 15 -13 17 -1 2 -5 6 -8 9 -2 4 -5 8 -7 9 -1 2 -2 4 -3 6 -1 1 -3 4 -6 7 -2 3 -4 6 -4 7 0 0 -1 3 -3 5 -6 7 -7 9 -8 11 -1 1 -3 4 -5 7 -2 2 -4 6 -5 9 -1 2 -3 4 -3 5 -2 0 -8 11 -13 20 -1 3 -2 5 -3 6 -1 0 -2 2 -2 4 -1 2 -2 4 -3 6 -1 1 -2 3 -3 5 -1 2 -2 5 -3 6 -1 1 -2 3 -2 4 0 1 -1 3 -2 5 -2 2 -3 5 -3 6 -1 2 -2 5 -3 6 -1 2 -2 3 -2 4 0 1 -1 3 -2 6 -2 3 -4 7 -8 20 -1 3 -3 7 -4 10 -1 2 -2 5 -2 6 0 1 -1 5 -2 8 -3 7 -6 20 -8 31 -1 4 -3 10 -3 13 -1 3 -2 11 -3 17 -1 6 -1 15 -2 19 -1 3 -1 12 -2 20 l0 13 -3 0 c-2 0 -3 0 -4 -2z m-206 -427 c1 -1 4 -2 7 -3 4 0 7 -2 9 -3 1 -1 4 -2 5 -2 2 0 4 -1 6 -1 1 -1 4 -3 8 -4 3 -1 6 -2 8 -3 1 0 4 -1 7 -2 3 -1 7 -2 8 -3 1 -1 4 -2 7 -2 2 -1 5 -2 6 -3 1 -1 5 -2 9 -3 9 -3 18 -6 20 -7 1 -1 5 -2 8 -3 3 -1 6 -2 6 -3 1 0 4 -1 6 -2 5 -1 14 -5 21 -9 3 -1 6 -2 7 -2 0 0 4 -1 8 -3 16 -8 28 -13 30 -15 1 0 4 -2 7 -3 2 -1 6 -3 9 -5 2 -2 6 -4 9 -5 2 -1 4 -3 5 -4 1 -1 3 -2 3 -2 1 0 11 -6 12 -8 1 0 2 -2 4 -2 3 -2 15 -11 21 -16 2 -2 7 -6 10 -8 14 -11 55 -57 55 -62 0 0 1 -2 3 -4 2 -2 3 -4 3 -5 1 -1 1 -2 2 -2 0 0 1 -1 2 -3 1 -2 2 -4 3 -6 2 -2 5 -7 7 -12 1 -2 2 -4 3 -5 1 -2 1 -2 -2 -2 -2 0 -3 0 -3 1 0 0 -3 4 -6 8 -3 4 -6 8 -6 8 0 1 -1 2 -3 4 -1 1 -6 7 -10 12 -11 11 -25 25 -35 35 -5 3 -10 8 -12 11 -3 2 -7 5 -10 8 -7 4 -10 6 -14 10 -2 2 -4 3 -4 3 -1 0 -2 1 -3 2 -1 1 -3 2 -5 3 -2 0 -3 1 -3 2 0 0 -1 1 -3 2 -2 1 -4 3 -4 3 0 0 -2 2 -5 3 -2 1 -4 3 -5 3 -1 1 -2 2 -2 2 -1 0 -3 1 -4 2 -1 1 -6 4 -11 6 -4 2 -8 5 -9 5 0 1 -2 2 -4 3 -3 1 -6 3 -7 4 -1 0 -4 2 -6 2 -2 1 -4 2 -5 3 -1 1 -6 3 -16 7 -2 1 -4 2 -5 3 -1 0 -5 2 -8 4 -10 4 -25 12 -41 19 -6 3 -12 6 -13 6 0 0 -2 1 -3 2 -1 1 -4 2 -6 3 -2 0 -5 2 -6 2 0 1 -3 2 -5 3 -1 0 -4 2 -6 3 -1 1 -3 2 -4 2 -1 0 -7 3 -20 9 -2 1 -5 2 -6 2 0 0 -2 1 -3 2 -1 1 -4 2 -6 3 -3 1 -6 2 -8 4 -2 1 -4 2 -6 3 -2 0 -3 1 -3 1 0 1 -1 2 -2 3 -2 2 1 3 4 1z m658 -94 c11 -8 8 -23 -6 -23 -6 0 -8 1 -11 6 -2 5 -3 6 0 11 4 7 11 10 17 6z m-91 -307 c0 -2 -1 -3 -2 -4 0 -1 -1 -4 -2 -6 0 -2 -1 -6 -2 -8 -2 -3 -3 -6 -4 -8 0 -2 -1 -5 -2 -6 -1 -1 -2 -3 -2 -3 0 -1 -7 -16 -9 -19 -1 -1 -2 -3 -3 -5 0 -2 -1 -4 -2 -4 -1 0 -2 -2 -3 -4 -1 -3 -3 -6 -5 -9 -2 -2 -4 -5 -5 -7 -1 -1 -2 -3 -3 -5 -8 -10 -35 -37 -45 -44 -1 -1 -4 -3 -6 -5 -6 -4 -15 -10 -16 -10 0 0 -2 -1 -3 -2 -2 -2 -5 -4 -7 -4 -2 -1 -7 -4 -11 -6 -4 -2 -8 -4 -9 -4 -1 0 -3 -1 -6 -2 -6 -4 -14 -7 -20 -8 -3 -1 -8 -3 -11 -4 -3 -1 -7 -2 -8 -2 -2 0 -5 -1 -9 -2 -3 -1 -10 -3 -15 -3 -5 -1 -11 -2 -13 -2 -7 -3 -24 -4 -24 -1 0 1 12 6 19 7 4 1 8 3 9 3 2 1 4 2 7 2 2 1 6 2 8 3 3 1 7 2 9 3 2 1 5 2 7 3 1 0 4 1 6 2 3 1 5 2 6 2 1 1 3 2 6 3 2 1 4 2 5 3 1 0 4 2 6 3 3 0 5 2 6 3 1 0 2 1 3 1 1 0 4 1 6 3 2 2 5 3 6 3 1 0 2 1 3 2 1 1 4 3 7 4 2 1 4 3 4 3 0 0 1 1 2 1 1 1 3 2 5 4 2 1 6 4 8 5 2 1 6 4 8 6 3 2 7 6 10 8 4 3 13 11 20 19 18 17 31 33 45 55 1 1 3 4 4 5 1 2 2 3 2 4 0 0 1 2 3 5 2 2 3 4 3 5 0 1 1 3 2 5 2 1 3 4 3 5 1 3 7 10 8 9 1 0 1 -1 1 -2z",
    "M1359 862 c-2 -1 -10 -2 -17 -2 -6 -1 -13 -2 -15 -3 -1 -1 -6 -2 -10 -3 -5 -1 -12 -3 -17 -5 -5 -2 -11 -4 -14 -5 -3 -1 -6 -3 -7 -4 -1 0 -4 -2 -6 -3 -2 -1 -7 -3 -9 -5 -2 -2 -6 -4 -7 -5 -10 -5 -41 -41 -41 -47 0 -1 -1 -4 -2 -5 -2 -2 -3 -5 -3 -6 0 -1 -1 -4 -3 -7 -5 -11 -4 -17 4 -14 2 1 4 2 5 3 1 0 3 1 6 2 2 1 4 2 5 2 1 1 3 2 5 3 2 1 4 2 6 3 1 1 3 3 5 3 4 2 11 6 13 8 0 0 2 1 4 2 2 1 6 3 8 5 2 2 6 4 8 5 2 1 4 2 4 3 0 0 2 2 4 3 3 1 5 2 6 3 1 0 3 1 4 1 3 1 3 1 -1 -4 -3 -2 -5 -4 -6 -4 0 0 -3 -2 -6 -6 -3 -3 -6 -5 -7 -5 0 0 -2 -1 -3 -2 -1 -1 -3 -2 -4 -3 -1 -1 -5 -3 -9 -6 -3 -3 -7 -5 -7 -5 -1 0 -3 -1 -4 -3 -2 -1 -7 -4 -11 -6 -4 -3 -9 -6 -12 -7 -2 -2 -6 -4 -9 -5 -4 -2 -5 -4 -2 -5 11 -4 49 -3 60 1 2 0 5 2 8 3 2 1 7 3 10 5 4 2 8 4 10 5 6 3 32 29 36 37 1 2 3 6 5 8 2 2 4 6 5 9 1 2 2 4 3 4 0 1 1 3 2 5 1 2 2 6 4 8 1 3 2 6 2 7 0 1 1 4 2 7 2 2 3 5 3 6 0 1 1 5 3 10 2 8 3 12 1 14 -2 1 -3 1 -9 0z",
    "M1177 651 c0 0 0 -1 1 -1 0 -1 1 -2 1 -4 1 -1 2 -3 3 -4 1 -2 2 -4 3 -6 1 -2 2 -4 3 -5 0 0 2 -3 3 -5 4 -9 7 -14 8 -14 1 -1 1 -2 1 -3 0 -1 1 -3 2 -5 2 -2 3 -6 4 -8 1 -2 2 -5 2 -5 2 -1 3 -12 1 -12 0 0 -1 1 -1 2 0 1 -1 3 -3 5 -2 2 -3 4 -3 5 0 1 -1 3 -3 6 -2 2 -3 4 -3 5 0 1 -1 3 -2 4 -1 1 -3 4 -4 6 -5 8 -6 10 -8 13 -1 1 -2 3 -2 4 0 1 -1 2 -2 3 -1 1 -5 7 -9 14 -1 2 -4 3 -4 1 -4 -14 -6 -34 -3 -46 2 -16 3 -18 5 -22 1 -3 2 -6 2 -6 0 -3 11 -23 16 -29 2 -4 4 -7 5 -8 1 -2 25 -26 29 -29 1 -1 5 -4 9 -6 7 -6 9 -6 10 -1 1 3 2 6 2 9 2 3 2 6 5 24 2 15 0 54 -4 58 -1 1 -2 4 -3 7 -1 3 -3 8 -5 11 -2 2 -4 6 -5 8 -2 4 -18 21 -19 21 -1 0 -4 2 -7 4 -4 2 -8 5 -10 6 -2 0 -5 2 -6 3 -3 1 -9 2 -9 0z",
  ],
};
let doveCount = 0;
function mountDove(el, { blinkEvery = [6000, 12000], flutterEvery = [20000, 40000], hoverEl = el } = {}) {
  if (!el) return null;
  const V = DOVE_VECTOR, id = 'dove' + (++doveCount);
  const shape = `<g transform="translate(0 ${V.h}) scale(1 -1)">${V.paths.map(d => `<path d="${d}"/>`).join('')}</g>`;
  el.innerHTML = `<svg class="dove" viewBox="0 0 ${V.w} ${V.h}" aria-hidden="true" focusable="false">`
    + `<defs><clipPath id="${id}w"><polygon points="${V.wingClip}"/></clipPath><clipPath id="${id}b"><polygon points="${V.bodyClip}"/></clipPath></defs>`
    + `<g class="dove-body" clip-path="url(#${id}b)">${shape}</g><g class="dove-wings" clip-path="url(#${id}w)">${shape}</g>`
    + `<circle class="dove-eye" cx="${V.eye[0]}" cy="${V.eye[1]}" r="${V.eye[2]}"/></svg>`;
  const svg = el.firstElementChild;
  const replay = cls => { svg.classList.remove(cls); void svg.getBoundingClientRect(); svg.classList.add(cls); };
  const blink = () => { if (!reduceMotion) replay('is-blinking'); };
  const flutter = () => { if (!reduceMotion && !svg.classList.contains('is-folding')) replay('is-folding'); };
  svg.addEventListener('animationend', e => {
    if (e.target.classList.contains('dove-wings')) svg.classList.remove('is-folding');
    if (e.target.classList.contains('dove-eye')) svg.classList.remove('is-blinking');
  });
  if (hoverEl) hoverEl.addEventListener('mouseenter', flutter);
  doveIdle({ blink, flutter, blinkEvery, flutterEvery }).start();
  return { blink, flutter, svg };
}
// every page: the nav logo becomes the dove (a nav link click sends it into a flutter), the footer gets the ASCII one
// (each in its own try: a failure in the birds never stops the rest of the site's script)
try {
  const navDove = mountDove(document.querySelector('.logo-dove'), { hoverEl: document.querySelector('.logo-wrap') });
  if (navDove) document.querySelectorAll('#primary-nav a').forEach(a => a.addEventListener('click', navDove.flutter));
} catch (e) { console.error('Nav dove failed', e); }
try {   // the hero's dove above the name: idle straight away (hidden under the intro while that plays)
  const heroDove = initAsciiBird(document.querySelector('.hero-dove'), { intro: false });
  if (heroDove) heroDove.start();
} catch (e) { console.error('Hero dove failed', e); }
try {
  const footerDove = initAsciiBird(document.querySelector('.footer-dove'), { intro: false, blinkEvery: [6000, 12000], flutterEvery: [20000, 40000] });
  if (footerDove) footerDove.start();
} catch (e) { console.error('Footer dove failed', e); }

// ── Homepage intro (first visit in a session; ?intro=1 replays it). ~3s (2.2s on phones):
//    assemble (dots → dove) · the name slides in · one wing fold at takeoff · the dove flies along an arc into its slot
//    above the hero name (the hero dove, measured live every frame, so a resize mid-flight is followed), shrinking to
//    exactly its size with a slight overshoot and settle · on arrival the hero dove (the same grid at the same size,
//    hidden until now) takes over, so the bird stays · meanwhile the name glides onto the hero name (FLIP) and the
//    overlay fades. Any click, scroll or key (or the Skip button) jumps to the end: the bird resting in the hero.
//    The page is rendered underneath from the start; the overlay is aria-hidden.
function runDoveIntro({ onDone }) {
  const intro = document.getElementById('intro'), root = document.documentElement;
  const canvas = intro && intro.querySelector('.intro-canvas'), heroName = document.querySelector('#hero .hero-name');
  const nameEl = intro && intro.querySelector('.intro-name'), roleEl = intro && intro.querySelector('.intro-role');
  const heroBird = document.querySelector('#hero .hero-bird'), heroDove = heroBird && heroBird.querySelector('.hero-dove');
  let done = false, raf = 0, failsafe = 0;
  const anims = [];
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(failsafe); cancelAnimationFrame(raf); anims.forEach(a => a.cancel());
    ['keydown', 'pointerdown', 'wheel', 'touchmove'].forEach(t => window.removeEventListener(t, finish));
    window.removeEventListener('resize', onResize);
    if (intro) intro.remove();
    if (heroBird) heroBird.style.removeProperty('visibility');
    root.classList.replace('intro-on', 'intro-done');   // the hero dove shows and starts bobbing (see .intro-on .hero-bird)
    try { onDone(); } catch (e) { console.error(e); root.classList.remove('hero-pending'); document.body.classList.add('page-loaded'); }
  }
  let onResize = () => {};
  try { sessionStorage.setItem('apIntroSeen', '1'); } catch (e) {}
  if (!intro || !canvas || !heroName || !heroDove || !intro.animate) return finish();
  ['keydown', 'pointerdown', 'wheel', 'touchmove'].forEach(t => window.addEventListener(t, finish, { passive: true }));
  intro.querySelector('.intro-skip-btn').addEventListener('click', finish);
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
  failsafe = setTimeout(finish, 4000);   // whatever happens, the page is revealed within 4s

  sampleDove(canvas.dataset.src).then(G => { try { playIntro(G); } catch (e) { console.error('Intro failed; showing the page', e); finish(); } }, finish);
  function playIntro(G) {
    if (done) return;
    const mobile = window.matchMedia('(max-width: 768px)').matches, K = mobile ? 2.2 / 3 : 1;
    const T = { assemble: 1200 * K, nameIn: [1200 * K, 1700 * K], roleIn: [1350 * K, 1650 * K], fold: [1900 * K, 2200 * K],
      fly: [2200 * K, 2720 * K], flip: [2200 * K, 2900 * K], bg: [2200 * K, 2620 * K], end: 2960 * K };
    let vw = innerWidth, vh = innerHeight;
    const dpr = window.devicePixelRatio || 1, A = DOVE_ASCII, ctx = canvas.getContext('2d');
    const sizeCanvas = () => { vw = innerWidth; vh = innerHeight; canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    sizeCanvas();
    onResize = sizeCanvas; window.addEventListener('resize', onResize);
    // layout: the dove, with the name beside it (desktop) or centred under it (phones)
    const birdH = mobile ? Math.min(vh * 0.24, 190) : Math.min(vh * 0.34, 280);
    const cellH = birdH / G.ROWS, cellW = cellH * A.CHAR_ASPECT, birdW = cellW * G.COLS;
    nameEl.innerHTML = heroName.innerHTML; nameEl.querySelectorAll('.name-underline').forEach(n => n.remove());
    const natural = nameEl.getBoundingClientRect();
    const s = (mobile ? birdH * 0.62 : birdH * 0.72) / natural.height;   // the name's size beside the dove
    const nw = natural.width * s, nh = natural.height * s, gap = mobile ? 22 : 44;
    let bx, by, nx, ny;
    if (mobile) { by = (vh - (birdH + gap + nh + 34)) / 2; bx = (vw - birdW) / 2; nx = (vw - nw) / 2; ny = by + birdH + gap; }
    else { const total = birdW + gap + nw; bx = (vw - total) / 2; by = (vh - birdH) / 2; nx = bx + birdW + gap; ny = by + (birdH - nh) / 2; }
    nameEl.style.left = nx + 'px'; nameEl.style.top = ny + 'px';
    roleEl.style.left = (mobile ? (vw - roleEl.offsetWidth) / 2 : nx) + 'px'; roleEl.style.top = (ny + nh + 12) + 'px';
    // the hero name's resting place (its entrance is switched off while the intro runs, so this is where it ends up)
    const hero = heroName.getBoundingClientRect(), dx = hero.left - nx, dy = hero.top - ny;
    const at = ms => ms / T.end, E = 'cubic-bezier(.22,1,.36,1)', EIO = 'cubic-bezier(.65,0,.35,1)';
    anims.push(nameEl.animate([
      { offset: 0, opacity: 0, transform: `translateX(-40px) scale(${s})` },
      { offset: at(T.nameIn[0]), opacity: 0, transform: `translateX(-40px) scale(${s})`, easing: E },
      { offset: at(T.nameIn[1]), opacity: 1, transform: `translateX(0px) scale(${s})` },
      { offset: at(T.flip[0]), opacity: 1, transform: `translateX(0px) scale(${s})`, easing: EIO },
      { offset: at(T.flip[1]), opacity: 1, transform: `translate(${dx}px, ${dy}px) scale(1)` },
      { offset: 1, opacity: 1, transform: `translate(${dx}px, ${dy}px) scale(1)` },
    ], { duration: T.end, fill: 'forwards' }));
    anims.push(roleEl.animate([
      { offset: 0, opacity: 0 }, { offset: at(T.roleIn[0]), opacity: 0 }, { offset: at(T.roleIn[1]), opacity: 1 },
      { offset: at(T.flip[0]), opacity: 1 }, { offset: at(T.flip[0] + 200 * K), opacity: 0 }, { offset: 1, opacity: 0 },
    ], { duration: T.end, fill: 'forwards' }));
    // the overlay fades while the dove is in flight, so the nav (tile, name) is in full view when it lands
    anims.push(intro.querySelector('.intro-bg').animate([
      { offset: 0, opacity: 1 }, { offset: at(T.bg[0]), opacity: 1 }, { offset: at(T.bg[1]), opacity: 0 }, { offset: 1, opacity: 0 },
    ], { duration: T.end, fill: 'forwards' }));
    anims.push(intro.querySelector('.intro-skip-btn').animate([{ opacity: 0 }, { opacity: 0.85, offset: 0.1 }, { opacity: 0.85, offset: 0.7 }, { opacity: 0 }], { duration: T.end, fill: 'forwards' }));

    // the landing spot: the hero dove's canvas, which holds the same grid (its height sets the size), measured live
    const landing = () => {
      const r = heroDove.getBoundingClientRect(), h = r.height, w = h / G.ROWS * A.CHAR_ASPECT * G.COLS;
      return { cx: r.left + w / 2, cy: r.top + h / 2, w, h };
    };
    const P0 = [bx + birdW / 2, by + birdH / 2];
    // easeOutBack: a slight overshoot past the logo, then settles onto it
    const settle = x => { const c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
    const cells = G.frames[0];
    cells.forEach(k => { k.sx = Math.random() * vw; k.sy = Math.random() * vh; k.dens = A.RAMP.indexOf(k.ch) / (A.RAMP.length - 1); });
    const font = px => `${px.toFixed(2)}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    let landed = false;
    const t0 = performance.now();
    const frame = now => {
      const t = now - t0;
      ctx.clearRect(0, 0, vw, vh); ctx.textBaseline = 'top'; ctx.textAlign = 'center'; ctx.fillStyle = '#f5efe3';
      if (t < T.fly[0]) {
        const folding = t >= T.fold[0] && t < T.fold[1];
        const list = folding ? doveFoldFrame(G.frames, (t - T.fold[0]) / (T.fold[1] - T.fold[0])) : G.frames[0];
        ctx.font = font(cellH * 1.05);
        for (const k of list) {
          if (k.eye) continue;
          let x = bx + (k.c + 0.5) * cellW, y = by + k.r * cellH, glyph = k.ch, alpha = 1;
          if (t < T.assemble && !folding) {
            const p = doveEase.out(Math.max(0, Math.min(1, (t - k.d * T.assemble * 0.35) / (T.assemble * 0.6))));
            x = k.sx + (x - k.sx) * p; y = k.sy + (y - k.sy) * p;
            glyph = p < 0.35 ? '.' : A.RAMP[Math.max(1, Math.round(A.RAMP.indexOf(glyph) * Math.min(1, (p - 0.35) / 0.5)))];
            alpha = 0.25 + 0.75 * p;
          }
          ctx.globalAlpha = alpha; ctx.fillText(glyph, x, y);
        }
      } else {
        // flight → landing → crossfade
        const L = landing(), P2 = [L.cx, L.cy];
        const P1 = [P0[0] + (P2[0] - P0[0]) * 0.25, P0[1] + (P2[1] - P0[1]) * 0.9];   // a gentle arc
        const sEnd = L.h / birdH;
        const u = Math.min(1, (t - T.fly[0]) / (T.fly[1] - T.fly[0]));
        const v = settle(u);
        const cx = (1 - v) * (1 - v) * P0[0] + 2 * (1 - v) * v * P1[0] + v * v * P2[0];
        const cy = (1 - v) * (1 - v) * P0[1] + 2 * (1 - v) * v * P1[1] + v * v * P2[1];
        const sc = 1 + (sEnd - 1) * Math.min(1.04, v);
        if (u >= 1 && !landed) { landed = true; heroBird.style.visibility = 'visible'; }   // arrived: the hero dove takes over
        const fadeOut = landed ? 0 : 1;
        const cw = cellW * sc, ch = cellH * sc, small = ch < 3;   // tiny: draw each character as a block of its density
        if (!small) ctx.font = font(ch * 1.05);
        for (const k of cells) {
          if (k.eye) continue;
          const x = cx + ((k.c + 0.5) * cellW - birdW / 2) * sc, y = cy + (k.r * cellH - birdH / 2) * sc;
          const trail = 0.35 * Math.sin(Math.PI * u) * (k.c / G.COLS);              // the tail side trails a little mid-flight
          const alpha = (1 - trail) * fadeOut;
          if (alpha <= 0.01) continue;
          if (small) { ctx.globalAlpha = alpha * (0.35 + 0.65 * k.dens); ctx.fillRect(x - cw / 2, y, cw, ch); }
          else { ctx.globalAlpha = alpha; ctx.fillText(k.ch, x, y); }
        }
      }
      ctx.globalAlpha = 1;
      if (t >= T.end) return finish();
      raf = requestAnimationFrame(safeFrame);
    };
    const safeFrame = now => { try { frame(now); } catch (e) { console.error('Intro failed; showing the page', e); finish(); } };
    raf = requestAnimationFrame(safeFrame);
  }
}

// ── Command palette (⌘K / Ctrl+K, or the header's search button): jump to a section, feature a project, find an
// event or an Impact case study, or run an action. Typing filters by every word; ↑/↓ move, Enter runs, Esc closes.
// Order: Sections (the header nav), then whatever the page registered in Site.search, then Actions.
const cmdk = document.getElementById('cmdk'), cmdkInput = document.getElementById('cmdkInput');
const cmdkList = document.getElementById('cmdkList'), cmdkEmpty = document.getElementById('cmdkEmpty');
const siteEmail = (document.querySelector('[data-email]') || {}).dataset?.email || Site.email;
function downloadResume() {
  const a = document.querySelector('.hero-btns a[download]')
    || Object.assign(document.createElement('a'), { href: Site.resume, download: 'Angelina-Ponce-Resume.pdf' });
  a.click();
}
let CMDK_ITEMS = [];
function buildCmdkItems() {
  return [
    ...[...document.querySelectorAll('#primary-nav a')].map(a => ({ group: 'Sections', label: a.textContent.trim(), run: () => a.click() })),
    ...Site.search.flatMap(provider => typeof provider === 'function' ? provider() : provider),
    { group: 'Actions', label: 'Copy email address', hint: siteEmail, run: async () => showToast(await copyText(siteEmail) ? COPIED : `Copy failed. Email: ${siteEmail}`) },
    { group: 'Actions', label: 'Download resume', run: downloadResume },
    { group: 'Actions', label: 'Switch between light and dark mode', run: () => themeBtn.click() },
  ];
}
let cmdkMatches = [], cmdkActive = 0;
function renderCmdk() {
  const words = cmdkInput.value.toLowerCase().split(/\s+/).filter(Boolean);
  cmdkMatches = CMDK_ITEMS.filter(it => { const hay = `${it.label} ${it.hint || ''} ${it.group} ${it.keywords || ''}`.toLowerCase(); return words.every(w => hay.includes(w)); });
  const rows = [];
  let group = null;
  cmdkMatches.forEach((it, i) => {
    if (it.group !== group) {
      group = it.group;
      const h = document.createElement('li');
      h.className = 'cmdk-group'; h.textContent = group; h.setAttribute('role', 'none'); h.setAttribute('aria-hidden', 'true');
      rows.push(h);
    }
    const li = document.createElement('li');
    li.className = 'cmdk-option'; li.id = 'cmdk-opt-' + i; li.setAttribute('role', 'option');
    li.textContent = it.label;
    if (it.hint) { const s = document.createElement('span'); s.textContent = it.hint; li.appendChild(s); }
    li.addEventListener('mousemove', () => { if (cmdkActive !== i) setCmdkActive(i); });
    li.addEventListener('click', () => runCmdk(i));
    rows.push(li);
  });
  cmdkList.replaceChildren(...rows);
  cmdkEmpty.hidden = cmdkMatches.length > 0;
  setCmdkActive(0, true);
}
function setCmdkActive(i, reveal) {
  cmdkActive = i;
  cmdkList.querySelectorAll('.cmdk-option').forEach((o, n) => o.setAttribute('aria-selected', String(n === i)));
  const opt = document.getElementById('cmdk-opt-' + i);
  if (opt) cmdkInput.setAttribute('aria-activedescendant', opt.id); else cmdkInput.removeAttribute('aria-activedescendant');
  if (opt && reveal) opt.scrollIntoView({ block: 'nearest' });
}
function runCmdk(i) {
  const it = cmdkMatches[i];
  if (!it) return;
  cmdk.close();
  document.documentElement.style.overflow = '';   // unlock now, so the action's scroll is not swallowed
  it.run();
}
function openCmdk() {
  if (document.querySelector('dialog[open]')) return;
  closeMenu();
  CMDK_ITEMS = buildCmdkItems();
  cmdkInput.value = '';
  renderCmdk();
  openDialog(cmdk);
  cmdkInput.focus();
}
cmdkInput.addEventListener('input', renderCmdk);
cmdkInput.addEventListener('keydown', e => {
  const n = cmdkMatches.length;
  if (e.key === 'ArrowDown' && n) { e.preventDefault(); setCmdkActive((cmdkActive + 1) % n, true); }
  else if (e.key === 'ArrowUp' && n) { e.preventDefault(); setCmdkActive((cmdkActive - 1 + n) % n, true); }
  else if (e.key === 'Enter') { e.preventDefault(); runCmdk(cmdkActive); }
});
document.getElementById('cmdkOpen').addEventListener('click', openCmdk);
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if (cmdk.open) cmdk.close(); else openCmdk();
  }
});
