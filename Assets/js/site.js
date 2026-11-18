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

// ── Timeline: a track from the first node's dot to the last one's (--t0 / --tlen, in the timeline's own CSS px), filled
// in gold as you scroll (--tp, 0–1); each node (.timeline-item) gets .reached once the fill passes its .timeline-dot.
// The fill follows a trigger line 65% down the window, and also ramps to the end over the last 200px of the page, so
// the last nodes (which can never scroll up to the trigger) are reached at the very bottom. It eases toward its target
// each frame (instantly with reduced motion). Positions are re-measured on resize, when the timeline changes size
// (photos loading) and once the fonts are in. A timeline whose dots aren't drawn (Experience) is left as it is.
// initTimeline(element) for each timeline on a page (Experience on the homepage, commitments on /impact).
function initTimeline(tl) {
  if (!tl) return;
  const items = [...tl.querySelectorAll('.timeline-item')];
  if (!items.length) return;
  let centres = [], t0 = 0, tlen = 0, shown = null, target = 0, raf = 0;
  // a dot's centre in the timeline's own CSS px: measured on screen (sub-pixel exact), divided by the screen px per CSS
  // px (the page's content zoom), less any offset its node is still sliding in from (the scroll reveal's translateY).
  // A dot's reach animation scales it about its centre, so the centre holds.
  const shiftOf = el => { const m = getComputedStyle(el).transform; return m && m !== 'none' ? new DOMMatrixReadOnly(m).m42 : 0; };
  const measure = () => {
    const r = tl.getBoundingClientRect(), k = r.height / (tl.offsetHeight || 1);
    centres = items.map(it => { const d = it.querySelector('.timeline-dot'); if (!d || !d.offsetParent) return null; const q = d.getBoundingClientRect(); return q.height ? (q.top + q.height / 2 - r.top) / k - shiftOf(it) : null; });
    if (centres.some(c => c === null)) { centres = []; return; }   // dots not drawn (or not laid out yet)
    t0 = centres[0]; tlen = Math.max(0, centres[centres.length - 1] - t0);
    tl.style.setProperty('--t0', t0.toFixed(1) + 'px'); tl.style.setProperty('--tlen', tlen.toFixed(1) + 'px');
  };
  const aim = () => {
    if (!centres.length || !tlen) return 0;
    const r = tl.getBoundingClientRect(), k = r.height / (tl.offsetHeight || 1);   // screen px per CSS px
    const normal = (window.innerHeight * 0.65 - (r.top + t0 * k)) / (tlen * k);
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ramp = Math.max(0, Math.min(1, 1 - (maxScroll - window.scrollY) / 200));   // 0 → 1 over the last 200px
    const p = Math.max(0, Math.min(1, normal));
    return Math.min(1, p + (1 - p) * ramp);   // continuous, ≥ the normal progress, 1 at the bottom
  };
  const paint = p => {
    tl.style.setProperty('--tp', p.toFixed(4));
    const tip = t0 + p * tlen;
    items.forEach((item, i) => item.classList.toggle('reached', centres.length > 0 && centres[i] <= tip + 0.5));
  };
  const frame = () => {
    raf = 0;
    if (shown === null || reduceMotion) shown = target;
    else { shown += (target - shown) * 0.22; if (Math.abs(target - shown) < 0.001) shown = target; }
    paint(shown);
    if (shown !== target) raf = requestAnimationFrame(frame);
  };
  const update = () => { target = aim(); if (!raf) raf = requestAnimationFrame(frame); };
  const remeasure = () => { measure(); update(); };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', remeasure);
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(tl);   // photos loading, wrapping changes
  tl.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', remeasure, { once: true }); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  remeasure();
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
// CSS-style cubic-bezier(x1, y1, x2, y2) easing as a function of x (0–1)
function cubicBezier(x1, y1, x2, y2) {
  const f = (a, b, t) => 3 * a * t * (1 - t) ** 2 + 3 * b * (1 - t) * t * t + t ** 3;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 24; i++) { t = (lo + hi) / 2; if (f(x1, x2, t) < x) lo = t; else hi = t; }
    return f(y1, y2, t);
  };
}
// Tonal depth for the ASCII dove: dense glyphs (# % @) at full strength, light ones (. : -) at ~60%, the rest between
const DOVE_TONE = { '.': 0.58, ':': 0.6, '-': 0.64, '=': 0.74, '+': 0.8, '*': 0.88, '#': 1, '%': 1, '@': 1 };
const doveTone = ch => DOVE_TONE[ch] || 1;
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
  // facing: 1 as drawn (looking right), -1 mirrored; a turn takes 150ms (the grid squeezes through edge-on)
  let face = 1, faceFrom = 1, faceAt = -1;
  const FLIP = 150, faceNow = now => faceAt < 0 ? face : faceFrom + (face - faceFrom) * doveEase.inOut(Math.min(1, (now - faceAt) / FLIP));
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
    const fx = faceNow(now); if (faceAt >= 0 && now - faceAt >= FLIP) faceAt = -1;
    ctx.save(); ctx.translate(W / 2, 0); ctx.scale(fx, 1); ctx.translate(-W / 2, 0);
    for (const k of frame) {
      let x = (k.c + 0.5) * cellW, y = k.r * cellH, glyph = k.ch, alpha = 1;
      if (k.eye) { if (!blinking || tIntro < introMs) continue; glyph = '-'; }   // the eye is a gap; a blink fills it
      if (tIntro < introMs) {
        const p = doveEase.out(Math.max(0, Math.min(1, (tIntro - k.d * introMs * 0.39) / (introMs * 0.55))));
        x = k.sx * W + (x - k.sx * W) * p; y = k.sy * H + (y - k.sy * H) * p;
        glyph = p < 0.35 ? '.' : A.RAMP[Math.max(1, Math.round(A.RAMP.indexOf(glyph) * Math.min(1, (p - 0.35) / 0.5)))];
        alpha = 0.3 + 0.7 * p;
      }
      ctx.globalAlpha = alpha * doveTone(glyph); ctx.fillText(glyph, x, y);
    }
    ctx.restore();
    ctx.globalAlpha = 1;
  }
  const loop = now => {
    draw(now);
    if (mode === 'intro' && now - t0 >= introMs) { mode = 'idle'; idle.start(); }
    raf = (mode === 'intro' || flutterAt >= 0 || now < blinkUntil || faceAt >= 0) ? requestAnimationFrame(loop) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
  const flutter = () => { if (mode === 'idle' && flutterAt < 0 && !reduceMotion) { flutterAt = performance.now(); kick(); } };
  const idle = doveIdle({ blink: () => { blinkUntil = performance.now() + 150; kick(); }, flutter, blinkEvery, flutterEvery });
  if (o.hoverFlutter !== false) canvas.addEventListener('mouseenter', flutter);
  window.addEventListener('resize', () => { if (G) resize(); });
  // turn to face dir (1 right, -1 left); instantly with reduced motion or when asked
  const setFacing = (dir, instant) => {
    if (dir === face && faceAt < 0) return;
    const now = performance.now();
    if (instant || reduceMotion || mode !== 'idle') { face = dir; faceAt = -1; if (mode === 'idle') draw(now); return; }
    faceFrom = faceNow(now); face = dir; faceAt = now; kick();
  };
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
  return { start, flutter, setFacing, get facing() { return face; }, busy: () => flutterAt >= 0 || faceAt >= 0, grid: () => G, canvas };
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
// ── DoveKit: the shared motion pieces behind every constellation and flying dove on the site (the section marks, the
//    side-nav constellation, the conferences route map, and the Impact page's hands-and-globe). Everything here plays
//    once per page load, pauses while the tab is hidden, and renders its final state with reduced motion.
//   inViewOnce(el, fn)          fn() the first time el scrolls into view
//   ticker(step, { el })        a requestAnimationFrame loop: step(dt, now) each frame (return false to stop); paused
//                               while the tab is hidden or (with el) while el is off screen. Returns { start, stop }
//   dotsAlong(path, n | { spacing }) points spaced evenly along an SVG path element
//   drawOn(path, u)             a path with pathLength="1" drawn on to u (0–1) by its stroke dash
//   flyAlong({ path, dove, … }) a vector dove (an SVG <g> made with mountDove) flown along a path, banking and facing
//                               its direction of travel, flapping; resolves when it arrives
const DoveKit = (() => {
  const inViewOnce = (el, fn, { threshold = 0.3, rootMargin = '0px 0px -8% 0px' } = {}) => {
    if (!el) return;
    if (!('IntersectionObserver' in window)) return void fn();
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); fn(); } }, { threshold, rootMargin });
    io.observe(el);
  };
  const ticker = (step, { el } = {}) => {
    let raf = 0, last = null, wanted = false, onScreen = true;
    const frame = now => {
      const dt = last === null ? 16 : Math.min(64, now - last); last = now;
      let go = false;
      try { go = step(dt, now) !== false; } catch (e) { console.error('Animation step failed', e); }
      if (go) raf = requestAnimationFrame(frame); else { raf = 0; wanted = false; }
    };
    const start = () => { wanted = true; if (!raf && onScreen && !document.hidden) { last = null; raf = requestAnimationFrame(frame); } };
    const pause = () => { cancelAnimationFrame(raf); raf = 0; };
    const stop = () => { wanted = false; pause(); };
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); else if (wanted) start(); });
    if (el && 'IntersectionObserver' in window) new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; if (!onScreen) pause(); else if (wanted) start(); }).observe(el);
    return { start, stop };
  };
  const dotsAlong = (path, opt) => {
    const len = path.getTotalLength(), n = typeof opt === 'number' ? opt : Math.max(1, Math.round(len / opt.spacing));
    return Array.from({ length: n }, (_, i) => { const q = path.getPointAtLength(len * i / n); return { x: q.x, y: q.y, frac: i / n }; });
  };
  const drawOn = (path, u) => { path.style.strokeDashoffset = (1 - Math.max(0, Math.min(1, u))).toFixed(4); };
  // the dove's group is placed at the path point (its feet there: foot = share of its box), rotated a little toward the
  // direction of travel (bank, radians at most) and mirrored to face it; flapping while it flies
  const placeDove = (dove, x, y, ang = 0, face = 1) => dove.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(ang * 180 / Math.PI).toFixed(1)}) scale(${face} 1)`);
  const flyAlong = ({ path, dove, duration = 1000, ease = x => x, bank = 0.3, onStep, el }) => new Promise(resolve => {
    const len = path.getTotalLength(); let t = 0;
    if (dove.svg) dove.svg.classList.add('is-flapping');
    const tk = ticker(dt => {
      t += dt;
      const u = Math.min(1, t / duration), e = ease(u), d = len * e;
      const p = path.getPointAtLength(d), q = path.getPointAtLength(Math.min(len, d + 2)), r = path.getPointAtLength(Math.max(0, d - 2));
      const dx = q.x - r.x, dy = q.y - r.y, face = dx >= 0 ? 1 : -1;
      placeDove(dove, p.x, p.y, Math.max(-bank, Math.min(bank, Math.atan2(dy, Math.abs(dx) || 1e-6) * 0.6)) * face, face);
      if (onStep) onStep(e, p);
      if (u >= 1) { if (dove.svg) dove.svg.classList.remove('is-flapping'); resolve(); return false; }
    }, { el: el || path.ownerSVGElement });
    tk.start();
  });
  // a vector dove inside an SVG: a <g> holding the nav logo's dove at width w (drawing units), feet at its origin
  const svgDove = (parent, w, cls = 'kit-dove') => {
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.setAttribute('class', cls); parent.appendChild(g);
    const inner = document.createElementNS('http://www.w3.org/2000/svg', 'g'); g.appendChild(inner);
    const d = mountDove(inner, { hoverEl: null }); if (!d) return null;
    const h = w * DOVE_VECTOR.h / DOVE_VECTOR.w;
    Object.entries({ width: w, height: h, x: -w * 0.55, y: -h * 0.85 }).forEach(([k, v]) => d.svg.setAttribute(k, v.toFixed(1)));
    d.svg.style.width = w.toFixed(1) + 'px'; d.svg.style.height = h.toFixed(1) + 'px';   // (so no page rule for svg sizes can stretch it)
    return { g, svg: d.svg, flutter: d.flutter, w, h };
  };
  // a seeded random (mulberry32), for arrangements that differ per place but stay the same on every visit
  const seeded = seed => { let a = typeof seed === 'number' ? seed : [...String(seed)].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 2654435761) >>> 0, 2166136261); return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  // a smooth path through points (centripetal Catmull-Rom), sampled into a polyline with its running length.
  // at(d) gives the point d along it, and the direction of travel there
  const spline = (pts, per = 16) => {
    const tj = (a, b) => Math.pow(Math.hypot(b[0] - a[0], b[1] - a[1]), 0.5) || 1e-4;
    const cr = (p0, p1, p2, p3, u) => {
      const t1 = tj(p0, p1), t2 = t1 + tj(p1, p2), t3 = t2 + tj(p2, p3), t = t1 + (t2 - t1) * u;
      const L = (a, b, ta, tb) => [((tb - t) * a[0] + (t - ta) * b[0]) / (tb - ta), ((tb - t) * a[1] + (t - ta) * b[1]) / (tb - ta)];
      const A1 = L(p0, p1, 0, t1), A2 = L(p1, p2, t1, t2), A3 = L(p2, p3, t2, t3);
      return L(L(A1, A2, 0, t2), L(A2, A3, t1, t3), t1, t2);
    };
    const ext = (a, b) => [2 * a[0] - b[0], 2 * a[1] - b[1]], P = [ext(pts[0], pts[1]), ...pts, ext(pts[pts.length - 1], pts[pts.length - 2])];
    const poly = [];
    for (let i = 1; i < P.length - 2; i++) for (let k = 0; k < per; k++) poly.push(cr(P[i - 1], P[i], P[i + 1], P[i + 2], k / per));
    poly.push(pts[pts.length - 1]);
    const len = [0]; for (let i = 1; i < poly.length; i++) len.push(len[i - 1] + Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]));
    const total = len[len.length - 1];
    const at = d => {
      d = Math.max(0, Math.min(total, d)); let lo = 0, hi = len.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (len[m] < d) lo = m; else hi = m; }
      const f = len[hi] > len[lo] ? (d - len[lo]) / (len[hi] - len[lo]) : 0, a = poly[lo], b = poly[hi];
      return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, dx: b[0] - a[0], dy: b[1] - a[1] };
    };
    return { total, at };
  };
  return { inViewOnce, ticker, dotsAlong, drawOn, flyAlong, placeDove, svgDove, seeded, spline };
})();
Site.kit = DoveKit;

// ── Section marks: the small constellation above each section title (in place of the old hairline and diamond).
//    3–5 gold dots, one a little larger, joined by thin lines; each section gets its own arrangement (seeded by its id,
//    so it's the same on every visit). In view, the dots pop in left to right and the lines draw between them.
// (points: a hand-drawn arrangement instead, [[x, y, r], ...] in a width × height box, left to right)
function constellationMark(seed, { mirror = false, width: W = 72, height: H = 16, dots: [lo, hi] = [3, 5], points } = {}) {
  const rnd = DoveKit.seeded(seed), n = lo + Math.floor(rnd() * (hi - lo + 1)), big = Math.floor(rnd() * n);
  const pts = points ? points.map(([x, y, r]) => ({ x: mirror ? W - x : x, y, r })) : Array.from({ length: n }, (_, i) => {
    const x = 4 + (W - 8) * (i / (n - 1)) + (i && i < n - 1 ? (rnd() - 0.5) * (W / n) * 0.6 : 0);
    return { x: mirror ? W - x : x, y: 3.5 + rnd() * (H - 7), r: i === big ? 2.5 : 1.3 + rnd() * 0.55 };
  });
  if (mirror) pts.reverse();
  const lines = pts.slice(1).map((p, i) => `<path pathLength="1" style="--i:${i}" d="M${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}L${p.x.toFixed(1)} ${p.y.toFixed(1)}"/>`).join('');
  const dots = pts.map((p, i) => `<circle style="--i:${i}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(2)}"/>`).join('');
  return `<svg class="c-mark" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true" focusable="false">${lines}${dots}</svg>`;
}
// A constellation rule: a thin line with a few dots, stretched across its container (the top of a card). The line is
// revealed left to right (.is-drawn), each dot popping in as the line reaches it.
function constellationRule(seed) {
  const rnd = DoveKit.seeded(seed), n = 4 + Math.floor(rnd() * 2), big = 1 + Math.floor(rnd() * (n - 2));
  const pts = Array.from({ length: n }, (_, i) => ({ x: i === 0 ? 0 : i === n - 1 ? 100 : (100 * i / (n - 1)) + (rnd() - 0.5) * (60 / n), y: 2.5 + rnd() * 7 }));
  const d = 'M' + pts.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L');
  const dots = pts.map((p, i) => `<i style="left:${p.x.toFixed(1)}%;top:${p.y.toFixed(1)}px;--at:${(p.x / 100).toFixed(2)}"${i === big ? ' class="is-big"' : ''}></i>`).join('');
  return `<span class="c-rule" aria-hidden="true"><svg viewBox="0 0 100 12" preserveAspectRatio="none" focusable="false"><path d="${d}"/></svg>${dots}</span>`;
}
function initSectionMarks() {
  document.querySelectorAll('.section-label:not(.has-mark)').forEach(label => {
    const sec = label.closest('section'), id = (sec && sec.id) || label.textContent;
    label.insertAdjacentHTML('afterbegin', constellationMark(id));
    if (label.closest('.contact-content')) label.insertAdjacentHTML('beforeend', constellationMark(id + '-r', { mirror: true }));   // Contact is centred: one on each side
    label.classList.add('has-mark');
    const marks = label.querySelectorAll('.c-mark');
    if (reduceMotion) marks.forEach(m => m.classList.add('is-drawn'));
    else DoveKit.inViewOnce(label, () => marks.forEach(m => m.classList.add('is-drawn')), { threshold: 0.6 });
  });
}
document.addEventListener('DOMContentLoaded', initSectionMarks);

// ── The hero dove's occasional life (heroDoveLife): on top of its bob, blink and flutter, now and then it
//    · flies a small loop around the name: takes off with a few beats, swings down and around the name block and back
//      over the top (an ellipse ~1.3× the name's width, spline-smoothed), banking into the turns, flapping harder as it
//      climbs and gliding down, then lands on its perch with one broad beat and a soft settle (every 30–45s; 45–60s and
//      a tighter loop on phones)
//    · watches the cursor (mouse only): turns to face it when it has been on the other side for a moment, and hops
//      8–12px away (one or two beats) when it comes within ~120px, settling back ~1.5s after it leaves (once per 4s)
//    · scatters into gold dots when clicked / tapped / activated with Enter or Space, then re-forms (the intro's
//      formation)
//    One behaviour at a time; never while it flutters. The occasional loop only counts down while the hero is in view
//    and the tab is visible, and waits until 5s after the visitor last scrolled, clicked or typed. Flights draw on their
//    own full-screen canvas above the hero (pointer-events off: it never blocks a click), the perched dove hidden
//    meanwhile. Reduced motion: no loop or hops, instant turns, and the scatter is a plain fade out and in.
//    ?birddebug=1: press L (loop), S (startle) or C (scatter) to see each on demand.
function heroDoveLife(dove) {
  const canvas = dove && dove.canvas, slot = canvas && canvas.closest('.hero-bird');
  const hero = document.getElementById('hero'), nameEl = document.querySelector('#hero .hero-name'), root = document.documentElement;
  if (!slot || !hero || !nameEl) return;
  const A = DOVE_ASCII, mobile = window.matchMedia('(max-width: 768px)').matches;
  const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches && !mobile;
  const debug = /[?&]birddebug=1\b/.test(location.search);
  const rnd = (a, b) => a + Math.random() * (b - a), clamp01 = x => Math.max(0, Math.min(1, x));
  const introOn = () => root.classList.contains('intro-on');
  const assemble = cubicBezier(0.22, 1, 0.36, 1);

  // the one interactive part: a button over the perched dove
  const btn = document.createElement('button');
  btn.type = 'button'; btn.className = 'hero-dove-btn'; btn.setAttribute('aria-label', 'Dove: click to scatter');
  slot.appendChild(btn);
  const fitBtn = () => { btn.style.width = canvas.offsetWidth + 'px'; };
  window.addEventListener('resize', fitBtn); setTimeout(fitBtn, 0); new ResizeObserver(fitBtn).observe(canvas);

  // the flight layer: a full-screen canvas above the hero, never taking clicks
  const ov = document.createElement('canvas'); ov.className = 'hero-dove-fly'; ov.setAttribute('aria-hidden', 'true');
  document.body.appendChild(ov);
  const g = ov.getContext('2d'); let vw = 0, vh = 0, dpr = 1;
  const sizeOv = () => { vw = innerWidth; vh = innerHeight; dpr = window.devicePixelRatio || 1; ov.width = Math.round(vw * dpr); ov.height = Math.round(vh * dpr); };
  sizeOv(); window.addEventListener('resize', sizeOv);
  const perch = () => { const r = canvas.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, r }; };
  const clearOv = () => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, ov.width, ov.height); };
  // the dove on the flight layer, centred at (x, y): s = scale of its perched size, rot = bank, fx = facing (−1 … 1);
  // place(k, x, y) can move or restyle each character (returns [x, y, glyph, alpha], or null to skip it)
  const drawAt = ({ x, y, s = 1, rot = 0, fx = 1, list, alpha = 1, place }) => {
    const G = dove.grid(), P = perch(), cellH = P.h / G.ROWS, cellW = cellH * A.CHAR_ASPECT, W = cellW * G.COLS;
    clearOv(); g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.fillStyle = getComputedStyle(canvas).color; g.textBaseline = 'top'; g.textAlign = 'center';
    g.font = `${(cellH * 1.05).toFixed(2)}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    g.translate(x, y); g.rotate(rot); g.scale((Math.abs(fx) < 0.04 ? 0.04 * Math.sign(fx || 1) : fx) * s, s);
    for (const k of (list || G.frames[0])) {
      if (k.eye) continue;
      let px = (k.c + 0.5) * cellW - W / 2, py = k.r * cellH - P.h / 2, glyph = k.ch, a = 1;
      if (place) { const q = place(k, px, py); if (!q) continue; [px, py, glyph, a] = q; }
      g.globalAlpha = alpha * a * doveTone(glyph); g.fillText(glyph, px, py);
    }
    g.globalAlpha = 1;
  };
  // wingbeats: each beat a fold-and-open of the wing frames, its length varied ±15%; between beats the wings are out
  const wings = () => {
    let at = -1, dur = 0;
    return (now, beatMs) => {
      const G = dove.grid();
      if (at >= 0 && now - at < dur) return doveFoldFrame(G.frames, (now - at) / dur);
      if (beatMs) { at = now; dur = beatMs * rnd(0.85, 1.15); return G.frames[0]; }
      at = -1; return G.frames[0];
    };
  };

  let busy = null, stopCurrent = null;   // the running behaviour ('loop' | 'startle' | 'scatter') and how to cut it short
  const begin = (kind, stop) => { busy = kind; stopCurrent = stop; canvas.style.visibility = 'hidden'; };
  const end = () => { busy = null; stopCurrent = null; clearOv(); canvas.style.visibility = ''; };
  const free = (ignoreFlutter) => !busy && dove.grid() && (ignoreFlutter || !dove.busy()) && !introOn();

  // ── the loop flight
  function loopFlight() {
    if (!free() || reduceMotion) return false;
    const P0 = perch(), N = nameEl.getBoundingClientRect(), CRUISE = 0.62, half = P0.w * CRUISE / 2;
    const cx = N.left + N.width / 2, cy = N.top + N.height * 0.45;
    const a = N.width * (mobile ? 0.55 : 0.65), b = N.height * (mobile ? 0.5 : 0.62) + P0.h * 0.12;
    const left = Math.max(half + 8, cx - a), right = Math.min(vw - half - 8, cx + a);
    // anticlockwise: down and left off the perch, along under the name, up the right side, back over the top, and a
    // gliding descent onto the perch
    const path = DoveKit.spline([
      [P0.x, P0.y], [left + (P0.x - left) * 0.3, cy - b * 0.15], [cx - a * 0.35, cy + b], [cx + a * 0.4, cy + b * 0.95],
      [right, cy], [cx + a * 0.35, cy - b], [P0.x + P0.w * 0.55, P0.y - P0.h * 0.32], [P0.x, P0.y],
    ]);
    const DUR = mobile ? 2500 : 2800, LAND = 300, SETTLE = 220, flap = wings(), t0 = performance.now();
    let fx = dove.facing;
    const tk = DoveKit.ticker((dt, now) => {
      const t = now - t0, u = Math.min(1, t / DUR), e = 0.5 - 0.5 * Math.cos(Math.PI * u);
      if (u < 1) {
        const q = path.at(path.total * e), sp = Math.hypot(q.dx, q.dy) || 1, climb = -q.dy / sp;
        const toLand = DUR - t, share = path.total * e / path.total;
        const s = 1 + (CRUISE - 1) * (share < 0.15 ? share / 0.15 : share > 0.8 ? (1 - share) / 0.2 : 1);
        const want = toLand < 260 ? dove.facing : Math.abs(q.dx) > sp * 0.2 ? Math.sign(q.dx) : (fx >= 0 ? 1 : -1);
        fx += (want - fx) * Math.min(1, dt / 60);
        const bank = Math.max(-0.24, Math.min(0.24, Math.atan2(q.dy, Math.abs(q.dx) || 1e-6) * 0.5)) * (fx >= 0 ? 1 : -1) * clamp01(toLand / 200);
        let list;
        if (toLand <= LAND) list = doveFoldFrame(dove.grid().frames, 1 - toLand / LAND);   // one broad beat to land
        else if (t < 3 * 140) list = flap(now, 140);   // three strong beats to take off
        else list = flap(now, climb > 0.25 ? 110 : climb < -0.2 ? 0 : 190);   // harder climbing, glide descending
        drawAt({ x: q.x, y: q.y, s, rot: bank, fx, list });
        return true;
      }
      // the settle: a small dip past the perch and back, then the perched dove takes over
      const p = clamp01((t - DUR) / SETTLE), P = perch();
      drawAt({ x: P.x, y: P.y + 4 * Math.sin(Math.PI * 2 * p) * (1 - p), fx: dove.facing });
      if (p >= 1) { end(); return false; }
      return true;
    });
    begin('loop', () => { tk.stop(); end(); });
    tk.start();
    return true;
  }

  // ── the startle hop: away from the cursor, then back once it has gone
  let mx = -9999, my = -9999, lastStartle = -1e9;
  const nearBird = (x, y, pad) => { const r = perch().r; return x > r.left - pad && x < r.right + pad && y > r.top - pad && y < r.bottom + pad; };
  function startle(cx, cy) {
    if (!free() || reduceMotion) return false;
    lastStartle = performance.now();
    const P0 = perch(); let dx = P0.x - cx, dy = P0.y - cy; const m = Math.hypot(dx, dy) || 1; dx /= m; dy = Math.min(dy / m, 0.3);
    const dist = rnd(8, 12), off = [dx * dist, dy * dist - 2], flap = wings(), HOP = 320, BACK = 380, t0 = performance.now();
    let phase = 'out', heldAt = 0, backAt = 0;
    const tk = DoveKit.ticker((dt, now) => {
      const P = perch();
      if (phase === 'out') {
        const u = clamp01((now - t0) / HOP), e = doveEase.out(u);
        drawAt({ x: P.x + off[0] * e, y: P.y + off[1] * e - Math.sin(Math.PI * u) * 7, fx: dove.facing, list: flap(now, u < 0.75 ? 150 : 0) });
        if (u >= 1) { phase = 'hold'; heldAt = now; }
      } else if (phase === 'hold') {
        drawAt({ x: P.x + off[0], y: P.y + off[1], fx: dove.facing });
        const gone = !nearBird(mx, my, 150);
        if ((gone && now - heldAt > 1500) || now - heldAt > 8000) { phase = 'back'; backAt = now; }
      } else {
        const u = clamp01((now - backAt) / BACK), e = doveEase.inOut(u);
        drawAt({ x: P.x + off[0] * (1 - e), y: P.y + off[1] * (1 - e) - Math.sin(Math.PI * u) * 6 + (u > 0.8 ? Math.sin(Math.PI * (u - 0.8) / 0.2) * 2 : 0), fx: dove.facing, list: flap(now, u < 0.6 ? 170 : 0) });
        if (u >= 1) { end(); return false; }
      }
      return true;
    });
    begin('startle', () => { tk.stop(); end(); });
    tk.start();
    return true;
  }

  // ── scatter and re-form
  function scatter() {
    if (busy === 'startle' && stopCurrent) stopCurrent();   // a click cuts a hop short
    if (!free(true)) return;   // (and wins over a hover flutter in progress)
    if (reduceMotion) {   // a plain fade out and back in
      busy = 'scatter'; canvas.style.transition = 'opacity 0.2s ease'; canvas.style.opacity = '0';
      setTimeout(() => { canvas.style.opacity = ''; setTimeout(() => { canvas.style.transition = ''; busy = null; }, 260); }, 420);
      return;
    }
    const G = dove.grid(), OUT = 400, HOLD = 220, BACK = 700, t0 = performance.now();
    G.frames[0].forEach(k => { const ang = Math.atan2(k.r - G.ROWS / 2, (k.c - G.COLS / 2) * A.CHAR_ASPECT) + rnd(-0.6, 0.6); k.sd = rnd(40, 120) * (0.5 + k.d); k.sa = ang; });
    const tk = DoveKit.ticker((dt, now) => {
      const t = now - t0, P = perch();
      drawAt({ x: P.x, y: P.y, fx: dove.facing, place: (k, x, y) => {
        let o, glyph = k.ch, a = 1;
        if (t < OUT + HOLD) {   // out: each character flies off as a dot
          const p = doveEase.out(clamp01(t / OUT)); o = p; if (p > 0.35) glyph = '•'; a = 1 - 0.2 * p;
        } else {   // back: the intro's formation, centre first, densifying as they arrive
          const p = assemble(clamp01((t - OUT - HOLD - k.d * BACK * 0.35) / (BACK * 0.6))); o = 1 - p;
          glyph = p < 0.35 ? '•' : A.RAMP[Math.max(1, Math.round(A.RAMP.indexOf(k.ch) * Math.min(1, (p - 0.35) / 0.5)))]; a = 0.8 + 0.2 * p;
        }
        return [x + Math.cos(k.sa) * k.sd * o, y + Math.sin(k.sa) * k.sd * o, glyph, a];
      } });
      if (t >= OUT + HOLD + BACK) { end(); return false; }
      return true;
    });
    begin('scatter', () => { tk.stop(); end(); });
    tk.start();
  }
  btn.addEventListener('click', scatter);
  btn.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && !busy) dove.flutter(); });   // the hover flutter it always had (mouse only)

  // ── the cursor: facing and startle (mouse only)
  if (mouse) {
    let side = 1, faceTimer = 0, pending = false;
    const check = () => {
      pending = false;
      if (introOn() || !heroInView) return;
      const P = perch(), want = mx < P.x - P.w * 0.15 ? -1 : mx > P.x + P.w * 0.15 ? 1 : side;
      if (want !== side) {   // turn after the cursor has stayed on the other side for a moment
        side = want; clearTimeout(faceTimer);
        faceTimer = setTimeout(() => { if (!busy) dove.setFacing(side); }, side === -1 ? 1000 : 400);
      }
      if (nearBird(mx, my, 120) && performance.now() - lastStartle > 4000) startle(mx, my);
    };
    window.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; if (!pending) { pending = true; requestAnimationFrame(check); } }, { passive: true });
    document.addEventListener('mouseleave', () => { mx = my = -9999; });
  }

  // ── the occasional loop: counts down only while the hero is in view and the tab visible; waits for a quiet moment
  let heroInView = true;
  new IntersectionObserver(([e]) => { heroInView = e.isIntersecting; }, { threshold: 0.25 }).observe(hero);
  let lastInteract = 0;
  ['scroll', 'wheel', 'keydown', 'pointerdown', 'touchstart'].forEach(t => window.addEventListener(t, () => { lastInteract = performance.now(); }, { passive: true }));
  const gap = () => mobile ? rnd(45000, 60000) : rnd(30000, 45000);
  let remain = gap();
  if (!reduceMotion) setInterval(() => {
    if (document.hidden || !heroInView || introOn()) return;   // paused
    if ((remain -= 1000) > 0) return;
    if (!free() || performance.now() - lastInteract < 5000) { remain = 1000; return; }   // try again in a second
    if (loopFlight()) remain = gap();
  }, 1000);

  // ── ?birddebug=1: L loop, S startle (from a cursor just right of the bird), C scatter
  if (debug) {
    window.addEventListener('keydown', e => {
      if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test(document.activeElement.tagName)) return;
      const k = e.key.toLowerCase();
      if (k === 'l') loopFlight();
      else if (k === 's') { const P = perch(); mx = P.r.right + 60; my = P.y; startle(mx, my); setTimeout(() => { mx = my = -9999; }, 300); }
      else if (k === 'c') scatter();
    });
    setTimeout(() => { if (typeof showToast === 'function') showToast('Bird debug: press L (loop), S (startle), C (scatter)'); }, 1200);
    window.heroDoveDebug = { get facing() { return dove.facing; }, get busy() { return busy; }, loopFlight, startle: () => { const P = perch(); startle(P.r.right + 60, P.y); }, scatter };
  }
  return { loopFlight, startle, scatter };
}

// every page: the nav logo becomes the dove (a nav link click sends it into a flutter), the footer gets the ASCII one
// (each in its own try: a failure in the birds never stops the rest of the site's script)
try {
  const navDove = mountDove(document.querySelector('.logo-dove'), { hoverEl: document.querySelector('.logo-wrap') });
  Site.navDove = navDove;   // (a copied email sends it into a flutter too)
  if (navDove) document.querySelectorAll('#primary-nav a').forEach(a => a.addEventListener('click', navDove.flutter));
} catch (e) { console.error('Nav dove failed', e); }
try {   // the hero's dove above the name: idle straight away (hidden under the intro while that plays), plus its
  // occasional loop, cursor awareness and click-to-scatter (heroDoveLife)
  const heroDove = initAsciiBird(document.querySelector('.hero-dove'), { intro: false, hoverFlutter: false });
  if (heroDove) { heroDove.start(); heroDoveLife(heroDove); }
} catch (e) { console.error('Hero dove failed', e); }
try {
  const footerDove = initAsciiBird(document.querySelector('.footer-dove'), { intro: false });   // the sign-off: gold, with the hero dove's idles
  if (footerDove) footerDove.start();
} catch (e) { console.error('Footer dove failed', e); }

// ── Homepage intro (first visit in a session; ?intro=1 replays it). ~3.8s (~3s on phones):
//    1. assemble (dots drift in, building outward from the centre) · the name slides in as the last dots settle
//    2. the dove takes off with strong wingbeats and flies right along a rising-then-falling Bézier arc, growing to ~3×
//       (2× on phones) as if coming toward the viewer, then blurs and fades just past the right edge
//    3. a camera pan: the intro scene slides out to the left while the hero (and header) slide in from the right, with a
//       little parallax; the intro name glides onto the hero name (FLIP) and hands over to it. The hero's own entrance
//       (subtitle, bullets, buttons, headshot, stats) starts during the pan
//    4. the dove re-enters from just off the left edge, small and faint, and flies an easy arc into its slot above the
//       name (the hero dove, measured live every frame, so a resize is followed), growing to its resting size; one broad
//       wingbeat, a fold and a soft settle, then the hero dove (same grid, same size) takes over and starts its idles
//    Any click, scroll or key (or the Skip button) jumps to the end: the bird resting in the hero. The intro pauses while
//    the tab is hidden. The page is rendered underneath from the start; the overlay is aria-hidden.
function runDoveIntro({ onDone, onReveal = () => {} }) {
  const intro = document.getElementById('intro'), root = document.documentElement;
  const canvas = intro && intro.querySelector('.intro-canvas'), heroName = document.querySelector('#hero .hero-name');
  const nameEl = intro && intro.querySelector('.intro-name'), roleEl = intro && intro.querySelector('.intro-role');
  const heroBird = document.querySelector('#hero .hero-bird'), heroDove = heroBird && heroBird.querySelector('.hero-dove');
  let done = false, raf = 0, failsafe = 0, failsafeLeft = 5500, failsafeSet = 0, onHide = null;
  const anims = [];
  const armFailsafe = ms => { clearTimeout(failsafe); failsafeLeft = ms; failsafeSet = performance.now(); failsafe = setTimeout(finish, ms); };
  function finish() {
    if (done) return;
    done = true;
    clearTimeout(failsafe); cancelAnimationFrame(raf); anims.forEach(a => a.cancel());
    ['keydown', 'pointerdown', 'wheel', 'touchmove'].forEach(t => window.removeEventListener(t, finish));
    window.removeEventListener('resize', onResize);
    if (onHide) document.removeEventListener('visibilitychange', onHide);
    if (intro) intro.remove();
    if (heroBird) heroBird.style.removeProperty('visibility');
    if (heroName) heroName.style.removeProperty('opacity');
    root.classList.replace('intro-on', 'intro-done');   // the hero dove shows and starts bobbing (see .intro-on .hero-bird)
    try { onDone(); } catch (e) { console.error(e); root.classList.remove('hero-pending'); document.body.classList.add('page-loaded'); }
  }
  let onResize = () => {};
  try { sessionStorage.setItem('apIntroSeen', '1'); } catch (e) {}
  if (!intro || !canvas || !heroName || !heroDove || !intro.animate) return finish();
  ['keydown', 'pointerdown', 'wheel', 'touchmove'].forEach(t => window.addEventListener(t, finish, { passive: true }));
  intro.querySelector('.intro-skip-btn').addEventListener('click', finish);
  armFailsafe(5500);   // whatever happens, the page is revealed (the CSS and <head> fail-safes follow at 6s)

  sampleDove(canvas.dataset.src).then(G => { try { playIntro(G); } catch (e) { console.error('Intro failed; showing the page', e); finish(); } }, finish);
  function playIntro(G) {
    if (done) return;
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    // timeline (ms). out: takeoff → gone past the right edge · pan: the camera move · back: re-entry → touchdown
    // (its last 300ms are one broad wingbeat) · settle: the fold and settle in the slot
    const T = mobile
      ? { assemble: 1300, nameDots: [760, 140, 400], sharpen: [1180, 1380], roleIn: [1220, 1400], out: [1380, 2000], pan: [1700, 2250], reveal: 1900, back: [2200, 2800], settle: 170 }
      : { assemble: 1700, nameDots: [1000, 250, 500], sharpen: [1580, 1800], roleIn: [1620, 1850], out: [1800, 2600], pan: [2200, 2900], reveal: 2450, back: [2850, 3600], settle: 200 };
    // nameDots: [start, left-to-right stagger, each dot's travel]. The name's dots gather while the dove's last dots
    // settle, then sharpen into the real text (gold dots out, cream text in); the dove takes off as the name resolves,
    // and the pan starts mid-flight.
    T.end = T.back[1] + T.settle + 30;
    const OUT = T.out[1] - T.out[0], PAN = T.pan[1] - T.pan[0], BACK = T.back[1] - T.back[0];
    const MAXS = mobile ? 2 : 3, FADE_AT = mobile ? 1.7 : 2.5;   // fly-out scale, and where the fade begins
    let vw = innerWidth, vh = innerHeight;
    const dpr = window.devicePixelRatio || 1, A = DOVE_ASCII, ctx = canvas.getContext('2d');
    const sizeCanvas = () => { vw = innerWidth; vh = innerHeight; canvas.width = Math.round(vw * dpr); canvas.height = Math.round(vh * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    sizeCanvas();
    onResize = sizeCanvas; window.addEventListener('resize', onResize);
    const gold = getComputedStyle(heroDove).color;   // the hero dove's gold, so the bird never changes colour
    // layout: the dove, with the name beside it (desktop) or centred under it (phones)
    const birdH = mobile ? Math.min(vh * 0.24, 190) : Math.min(vh * 0.34, 280);
    const cellH = birdH / G.ROWS, cellW = cellH * A.CHAR_ASPECT, birdW = cellW * G.COLS;
    nameEl.innerHTML = heroName.innerHTML; nameEl.querySelectorAll('.name-underline').forEach(n => n.remove());
    const natural = nameEl.getBoundingClientRect();
    // the name's letters, for its dots: each character's box as the browser lays it out (so kerning, letter-spacing and
    // the line break match the real text), relative to the name's own box at its natural size
    const nameCS = getComputedStyle(nameEl), nameFont = `${nameCS.fontStyle} ${nameCS.fontWeight} ${nameCS.fontSize} ${nameCS.fontFamily}`;
    const chars = [];
    { const walk = document.createTreeWalker(nameEl, NodeFilter.SHOW_TEXT), range = document.createRange();
      for (let n = walk.nextNode(); n; n = walk.nextNode()) for (let i = 0; i < n.data.length; i++) {
        if (!n.data[i].trim()) continue;
        range.setStart(n, i); range.setEnd(n, i + 1);
        const r = range.getClientRects()[0]; if (r) chars.push({ ch: n.data[i], x: r.left - natural.left, top: r.top - natural.top, h: r.height });
      } }
    const s = (mobile ? birdH * 0.62 : birdH * 0.72) / natural.height;   // the name's size beside the dove
    const nw = natural.width * s, nh = natural.height * s, gap = mobile ? 22 : 44;
    let bx, by, nx, ny;
    if (mobile) { by = (vh - (birdH + gap + nh + 34)) / 2; bx = (vw - birdW) / 2; nx = (vw - nw) / 2; ny = by + birdH + gap; }
    else { const total = birdW + gap + nw; bx = (vw - total) / 2; by = (vh - birdH) / 2; nx = bx + birdW + gap; ny = by + (birdH - nh) / 2; }
    nameEl.style.left = nx + 'px'; nameEl.style.top = ny + 'px';
    // sample the letters into dots: draw them offscreen at the intro size, then take points on a grid sized for ~550
    // dots (~320 on phones), each with its screen target, a scattered start and a start time by its x (reading order)
    const nameDots = (() => {
      const W = Math.ceil(nw) + 8, H = Math.ceil(nh) + 8, off = document.createElement('canvas'); off.width = W; off.height = H;
      const o = off.getContext('2d'); o.fillStyle = '#000'; o.textBaseline = 'alphabetic'; o.textAlign = 'left';
      o.scale(s, s); o.font = nameFont; try { o.letterSpacing = '0px'; } catch (e) {}
      const m = o.measureText('Hg'), asc = m.fontBoundingBoxAscent || parseFloat(nameCS.fontSize) * 0.9, desc = m.fontBoundingBoxDescent || parseFloat(nameCS.fontSize) * 0.25;
      chars.forEach(c => o.fillText(c.ch, c.x, c.top + (c.h - asc - desc) / 2 + asc));   // each glyph on its own baseline
      const px = o.getImageData(0, 0, W, H).data;
      let ink = 0; for (let i = 3; i < px.length; i += 4) if (px[i] > 128) ink++;
      const step = Math.max(1.5, Math.sqrt(ink / (mobile ? 320 : 550))), out = [];
      for (let y = step / 2; y < H; y += step) for (let x = step / 2; x < W; x += step) {
        const jx = x + (Math.random() - 0.5) * step * 0.5, jy = y + (Math.random() - 0.5) * step * 0.5;
        if (px[(Math.min(H - 1, Math.round(jy)) * W + Math.min(W - 1, Math.round(jx))) * 4 + 3] > 128)
          out.push({ x: nx + jx, y: ny + jy, sx: Math.random() * vw, sy: Math.random() * vh, at: T.nameDots[0] + T.nameDots[1] * (jx / W) + Math.random() * 60 });
      }
      return out;
    })();
    const dotR = Math.max(1.1, cellH * 0.14);   // about the size of the dove's '.' dots
    roleEl.style.left = (mobile ? (vw - roleEl.offsetWidth) / 2 : nx) + 'px'; roleEl.style.top = (ny + nh + 12) + 'px';
    // the hero name's resting place, measured before the hero is moved off to the right for the pan
    const hero = heroName.getBoundingClientRect(), dx = hero.left - nx, dy = hero.top - ny;

    // ── the overlay's own timeline: the name slides in, then rides the pan onto the hero name and hands over to it
    const at = ms => ms / T.end, PE = 'cubic-bezier(.65,0,.35,1)';
    anims.push(nameEl.animate([
      { offset: 0, opacity: 0, transform: `translateX(0px) scale(${s})` },
      { offset: at(T.sharpen[0]), opacity: 0, transform: `translateX(0px) scale(${s})` },
      { offset: at(T.sharpen[1]), opacity: 1, transform: `translateX(0px) scale(${s})` },   // the real text sharpens in over the dots
      { offset: at(T.pan[0]), opacity: 1, transform: `translateX(0px) scale(${s})`, easing: PE },
      { offset: at(T.pan[1]), opacity: 1, transform: `translate(${dx}px, ${dy}px) scale(1)` },
      { offset: at(T.pan[1] + 1), opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(1)` },
      { offset: 1, opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(1)` },
    ], { duration: T.end, fill: 'forwards' }));
    anims.push(roleEl.animate([
      { offset: 0, opacity: 0 }, { offset: at(T.roleIn[0]), opacity: 0 }, { offset: at(T.roleIn[1]), opacity: 1 }, { offset: 1, opacity: 1 },
    ], { duration: T.end, fill: 'forwards' }));
    anims.push(intro.querySelector('.intro-skip-btn').animate([{ opacity: 0 }, { opacity: 0.85, offset: 0.1 }, { opacity: 0.85, offset: at(T.pan[0]) }, { opacity: 0, offset: at(T.pan[0] + 200) }, { opacity: 0 }], { duration: T.end, fill: 'forwards' }));
    // ── the camera pan: the scene moves left, the hero (and header) arrive from the right. Parallax: the overlay's
    //    ground moves a full screen, its leftover foreground (the role line) further; the hero's ground and header move
    //    a full screen, its content a little further. Hero-side moves add to whatever transform the entrance applies.
    const pan = (el, from, to, extra = {}) => { if (el) anims.push(el.animate([{ transform: from }, { transform: to }], { duration: PAN, delay: T.pan[0], easing: PE, fill: 'both', ...extra })); };
    const span = mobile ? 100 : 100, fg = mobile ? 115 : 125, inFg = mobile ? 10 : 14;
    pan(intro.querySelector('.intro-bg'), 'translateX(0)', `translateX(-${span}vw)`);
    pan(roleEl, 'translateX(0)', `translateX(-${fg}vw)`, { composite: 'add' });
    const back = { fill: 'backwards', composite: 'add' };   // nothing left behind once it's in place
    pan(document.getElementById('hero'), `translateX(${span}vw)`, 'translateX(0)', back);
    pan(document.getElementById('header'), `translateX(${span}vw)`, 'translateX(0)', back);
    document.querySelectorAll('#hero .hero-content, #hero .hero-right').forEach(el => pan(el, `translateX(${inFg}vw)`, 'translateX(0)', back));

    // the landing spot: the hero dove's canvas, which holds the same grid (its height sets the size), measured live
    const landing = () => {
      const r = heroDove.getBoundingClientRect(), h = r.height, w = h / G.ROWS * A.CHAR_ASPECT * G.COLS;
      return { cx: r.left + w / 2, cy: r.top + h / 2, w, h };
    };
    const P0 = [bx + birdW / 2, by + birdH / 2];   // takeoff: where the dove assembled
    const bez = (p0, p1, p2, p3, u) => { const v = 1 - u; return [0, 1].map(i => v * v * v * p0[i] + 3 * v * v * u * p1[i] + 3 * v * u * u * p2[i] + u * u * u * p3[i]); };
    const bezD = (p0, p1, p2, p3, u) => { const v = 1 - u; return [0, 1].map(i => 3 * v * v * (p1[i] - p0[i]) + 6 * v * u * (p2[i] - p1[i]) + 3 * u * u * (p3[i] - p2[i])); };
    const clamp01 = x => Math.max(0, Math.min(1, x));
    const assembleEase = cubicBezier(0.22, 1, 0.36, 1);
    // wingbeats as a list of { start, dur } (ms from the phase start), each duration ±15%; between them the wings are out
    const jit = d => d * (0.85 + Math.random() * 0.3);
    const beatsOut = (() => {   // 3 strong beats at takeoff, a short glide, then quick beats to the edge
      const b = []; let t = 0;
      for (let i = 0; i < 3; i++) { const d = jit(mobile ? 120 : 150); b.push({ start: t, dur: d }); t += d; }
      t += OUT * 0.2;
      while (t < OUT) { const d = jit(mobile ? 80 : 95); b.push({ start: t, dur: d }); t += d; }
      return b;
    })();
    const beatsBack = (() => {   // relaxed beats with short glides between, ending 300ms before touchdown
      const b = []; let t = 60;
      while (t < BACK - 300 - 120) { const d = jit(mobile ? 230 : 270); b.push({ start: t, dur: d }); t += d + jit(110); }
      b.push({ start: BACK - 300, dur: 300 });   // one broad beat to land
      return b;
    })();
    const wingsAt = (beats, ms) => { for (const bt of beats) if (ms >= bt.start && ms < bt.start + bt.dur) return doveFoldFrame(G.frames, (ms - bt.start) / bt.dur); return G.frames[0]; };

    const cells = G.frames[0];
    cells.forEach(k => { k.sx = Math.random() * vw; k.sy = Math.random() * vh; });
    const font = px => `${px.toFixed(2)}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    const drawBird = list => {   // in the current transform, centred on the origin
      for (const k of list) { if (k.eye) continue; ctx.globalAlpha = baseAlpha * doveTone(k.ch); ctx.fillText(k.ch, (k.c + 0.5) * cellW - birdW / 2, k.r * cellH - birdH / 2); }
    };
    let baseAlpha = 1, blurNow = '';
    const setBlur = px => { const v = px > 0.05 ? `blur(${px.toFixed(1)}px)` : ''; if (v !== blurNow) { canvas.style.filter = v; blurNow = v; } };
    const place = (x, y, rot, sc, list) => { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); drawBird(list); ctx.restore(); };

    // the clock: only runs while the tab is visible (the intro pauses with the page)
    let clock = 0, last = null, revealed = false, handedName = false;
    const frame = now => {
      // one clock for everything: the name animation's own time (it spans the whole intro and pauses with the others),
      // so the canvas, the sharpen, the name's FLIP and the pan stay in lockstep
      clock += last === null ? 0 : Math.max(0, now - last); last = now;
      const master = anims[0] && anims[0].currentTime;
      const t = typeof master === 'number' ? master : clock;
      ctx.clearRect(0, 0, vw, vh); ctx.textBaseline = 'top'; ctx.textAlign = 'center'; ctx.fillStyle = gold; ctx.font = font(cellH * 1.05);
      if (!revealed && t >= T.reveal) { revealed = true; try { onReveal(); } catch (e) { console.error(e); } }   // the hero's entrance, under the pan
      if (!handedName && t >= T.pan[1]) { handedName = true; heroName.style.opacity = '1'; }   // the intro name has landed on it: swap
      if (t >= T.nameDots[0] && t < T.sharpen[1]) {
        // the name's dots: drift in from the scatter on the dove's easing, then fade as the crisp text fades in
        const fadeOut = 1 - clamp01((t - T.sharpen[0]) / (T.sharpen[1] - T.sharpen[0]));
        const paths = [new Path2D(), new Path2D(), new Path2D()];   // faint → full as they arrive, like the dove's dots
        for (const d of nameDots) {
          if (t < d.at) continue;
          const p = assembleEase(clamp01((t - d.at) / T.nameDots[2])), x = d.sx + (d.x - d.sx) * p, y = d.sy + (d.y - d.sy) * p;
          const path = paths[p < 0.35 ? 0 : p < 0.8 ? 1 : 2];
          path.moveTo(x + dotR, y); path.arc(x, y, dotR, 0, Math.PI * 2);
        }
        [0.35, 0.65, 0.95].forEach((a, i) => { ctx.globalAlpha = a * fadeOut; ctx.fill(paths[i]); });
        ctx.globalAlpha = 1;
      }
      if (t < T.out[0]) {
        // 1. assembling: scattered dots gather into the dove, densifying glyph by glyph
        for (const k of cells) {
          if (k.eye) continue;
          let x = bx + (k.c + 0.5) * cellW, y = by + k.r * cellH, glyph = k.ch, alpha = 1;
          if (t < T.assemble) {
            // built outward from the centre: each dot starts by its distance from the middle (a wide stagger) and
            // drifts in on a soft ease-out
            const p = assembleEase(clamp01((t - k.d * T.assemble * 0.5) / (T.assemble * 0.5)));
            x = k.sx + (x - k.sx) * p; y = k.sy + (y - k.sy) * p;
            glyph = p < 0.35 ? '.' : A.RAMP[Math.max(1, Math.round(A.RAMP.indexOf(glyph) * Math.min(1, (p - 0.35) / 0.5)))];
            alpha = 0.25 + 0.75 * p;
          }
          ctx.globalAlpha = alpha * doveTone(glyph); ctx.fillText(glyph, x, y);
        }
      } else if (t < T.out[1]) {
        // 2. out toward the viewer: up a little, then down and off the right edge, growing faster as it nears
        const u = (t - T.out[0]) / OUT, v = 0.55 * u + 0.45 * u * u;
        const P3 = [vw + vw * 0.08, P0[1] + vh * 0.1], P1 = [P0[0] + (P3[0] - P0[0]) * 0.25, P0[1] - vh * 0.13], P2 = [P0[0] + (P3[0] - P0[0]) * 0.62, P0[1] - vh * 0.03];
        const [x, y] = bez(P0, P1, P2, P3, v), [tx, ty] = bezD(P0, P1, P2, P3, v);
        const sc = 1 + (MAXS - 1) * Math.pow(u, 2.3);
        const fade = clamp01((sc - FADE_AT) / (MAXS - FADE_AT));
        baseAlpha = 1 - fade; setBlur((mobile ? 2.5 : 3.5) * clamp01((sc - FADE_AT + 0.3) / (MAXS - FADE_AT + 0.3)));
        const bank = Math.max(-0.19, Math.min(0.19, Math.atan2(ty, tx) * 0.6));
        if (baseAlpha > 0.01) place(x, y, bank, sc, wingsAt(beatsOut, t - T.out[0]));
        baseAlpha = 1;
      } else if (t >= T.back[0] && t < T.back[1]) {
        // 4. back in from the left: faint and small, an easy arc up and over into the slot, growing to its resting size
        setBlur(0);
        const L = landing(), rest = L.h / birdH, u = (t - T.back[0]) / BACK, v = doveEase.inOut(u) * 0.85 + u * 0.15;
        const S0 = [-L.w * 0.3, L.cy + vh * 0.08], run = L.cx - S0[0];
        const P1 = [S0[0] + run * 0.4, L.cy - vh * 0.13], P2 = [L.cx - run * 0.22, L.cy - vh * 0.06];
        const [x, y] = bez(S0, P1, P2, [L.cx, L.cy], v), [tx, ty] = bezD(S0, P1, P2, [L.cx, L.cy], v);
        const sc = rest * (0.6 + 0.4 * doveEase.out(u));
        const bank = Math.max(-0.17, Math.min(0.17, Math.atan2(ty, tx) * 0.5)) * clamp01((BACK - (t - T.back[0])) / 250);
        baseAlpha = clamp01((t - T.back[0]) / 300);
        place(x, y, bank, sc, wingsAt(beatsBack, t - T.back[0]));
        baseAlpha = 1;
      } else if (t >= T.back[1]) {
        // landing: a quick fold and a tiny dip past the slot, then the hero dove takes over in the same place
        const L = landing(), p = clamp01((t - T.back[1]) / T.settle);
        const dip = 4 * Math.sin(Math.PI * 2 * p) * (1 - p) * (p < 0.5 ? 1 : 0.5);
        if (p < 1) place(L.cx, L.cy + dip, 0, L.h / birdH, p < 0.7 ? doveFoldFrame(G.frames, p / 0.7) : G.frames[0]);
        else if (heroBird.style.visibility !== 'visible') heroBird.style.visibility = 'visible';
      }
      ctx.globalAlpha = 1;
      if (t >= T.end) return finish();
      raf = requestAnimationFrame(safeFrame);
    };
    const safeFrame = now => { try { frame(now); } catch (e) { console.error('Intro failed; showing the page', e); finish(); } };
    // paused while the tab is hidden: the clock, the pan and the fail-safe all stop, and pick up where they were. If the
    // page's own fail-safes (6s, CSS and <head>) may already have fired by then, it just finishes.
    onHide = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf); raf = 0; anims.forEach(a => a.pause());
        clearTimeout(failsafe); failsafeLeft -= performance.now() - failsafeSet;
      } else if (performance.now() > 5600) finish();
      else { anims.forEach(a => a.play()); last = null; raf = requestAnimationFrame(safeFrame); armFailsafe(Math.max(500, failsafeLeft)); }
    };
    document.addEventListener('visibilitychange', onHide);
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
    { group: 'Actions', label: 'Copy email address', hint: siteEmail, run: async () => { const ok = await copyText(siteEmail); showToast(ok ? COPIED : `Copy failed. Email: ${siteEmail}`); if (ok && Site.navDove) Site.navDove.flutter(); } },
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
