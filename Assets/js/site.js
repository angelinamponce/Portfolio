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
// buttons as a gallery with addLightboxGallery(buttons, caption): caption(button) returns [title, subtitle]. The arrows,
// the ← / → keys and the count stay within the gallery that was opened; the full-size file comes from the image's
// data-full (else the image as shown). Esc and a click outside close it (see openDialog above), and focus returns to
// the photo that opened it.
const lightbox = document.getElementById('lightbox');
let gallery = null, shotIdx = 0;
function showShot(i) {
  const shots = gallery.shots;
  shotIdx = (i + shots.length) % shots.length;
  const btn = shots[shotIdx], img = btn.querySelector('img'), [title, loc] = gallery.caption(btn);
  const big = document.getElementById('lightboxImg');
  big.src = img.dataset.full || img.currentSrc || img.src;
  big.alt = img.alt;
  big.classList.remove('swap'); void big.offsetWidth; big.classList.add('swap');
  document.getElementById('lightboxTitle').textContent = title;
  document.getElementById('lightboxLoc').textContent = loc;
  document.getElementById('lightboxCount').textContent = `${shotIdx + 1} / ${shots.length}`;
  document.getElementById('lightboxPrev').hidden = document.getElementById('lightboxNext').hidden = shots.length < 2;
}
function addLightboxGallery(shots, caption) {
  if (!lightbox) return;
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

  document.querySelectorAll('.btn-mag').forEach(btn => magnetize(btn, 0.18));
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
