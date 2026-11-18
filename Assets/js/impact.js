// ── Impact content: the data behind /impact (case studies + long-term commitments) and the homepage search.
// Edit the copy here; the markup is built from it. Text goes in as text, never as HTML.
//
// IMAGES (every row: case studies and long-term commitments)
//   1. Save each photo in  Assets/img/  as  <name>-photo-800.jpg  and  <name>-photo-1600.jpg  (800 / 1600px wide,
//      never upscaled past the source, JPEG quality ~82, EXIF/location stripped). Logos stay PNG (one optimized copy,
//      e.g. Assets/img/pathways-logo.png). Still open: the Anthropic hackathon photo.
//   2. Set that row's  image  (the -800 file) and  srcset  (step 4), and describe the image in  alt  (what a screen-reader
//      user should hear, e.g. 'Angelina presenting the watchlist review to the asset management team').
//   3. Optionally set  fit  for how the image sits in its slot:
//        'cover'   (default) a 4:3 slot, the photo cropped to fill it, with the site's shared photo treatment
//                  (slightly desaturated, a light deep-green wash, a soft shade at the bottom)
//        'contain' a 4:3 slot with a plain light panel; the image is shown whole with padding, no crop, no overlay.
//                  Use it for logos (transparent PNG or SVG; logos go in  public/logos/ , e.g.
//                  public/logos/operation-smile.png  for Operation Smile).
//        'native'  the image at its own aspect ratio, no crop, no overlay
//        'art'     flat artwork: a 4:3 slot filled with  bg  (a colour), the image whole on it, no overlay; opens
//                  in the lightbox like a photo
//      With 'cover', two more optional fields:
//        position  where the crop is anchored (CSS object-position), e.g. 'center 30%' keeps the top third in view
//                  when a portrait photo fills a landscape slot
//        overlay   false skips the photo treatment and shows the photo as it is
//   4. Optionally list responsive versions in  srcset  (the site's convention: <name>-photo-800.jpg and
//      <name>-photo-1600.jpg in Assets/img/, 800 and 1600px wide), e.g.
//        image: '/Assets/img/<name>-photo-800.jpg',
//        srcset: '/Assets/img/<name>-photo-800.jpg 800w, /Assets/img/<name>-photo-1600.jpg 1600w'
//      The browser then picks the version that fits the slot (sizes are set per row type below).
//   6. Optionally set  description  for a line under the title in the lightbox (the title is the organization);
//      rows without one show the title only.
//   5. Optionally set  full  to a different file for the lightbox (e.g. the uncropped original when the slot's
//      files are a crop); otherwise the lightbox shows the largest file in srcset.
//   If a file is missing or fails to load, the row falls back to the empty slot.
//
// SHOW_IMAGE_PLACEHOLDERS: true shows an empty framed slot on rows that have no image yet; false leaves those rows
// without a slot (the content takes the full width; rows with an image still show it), so the page can ship before the
// images are ready.
const SHOW_IMAGE_PLACEHOLDERS = true;

// The /impact page hero: the heading, the italic subtitle under it, and the paragraph below the divider (the page's
// HTML holds the same text as a no-script fallback; what's here wins). The page <title> is set in impact/index.html.
const IMPACT_PAGE = {
  title: 'Impact',
  subtitle: 'Getting resources to the people markets underserve',
  sub: 'I use finance and AI to strengthen the organizations that serve communities the market reaches last.',
};

// One case-study row per focus area. The body is one paragraph: story when it's filled in, otherwise problem and did
// joined (they also feed the site search). stat is optional: a row without one is simply shorter. When set, a
// trailing "+" or "%" is drawn in gold like the hero's, and statLabel is its caption (sentence case). caption is an
// optional line under the image (e.g. place and date). id names the row's anchor (/impact/#impact-<id>).
const IMPACT = [
  {
    id: 'cpc',
    years: 0.25,   // years of involvement, sizes this row's dot in the hero constellation: Summer 2026 (Experience)
    story: '',   // your new copy: one paragraph (replaces problem + did on the page)
    caption: '',   // optional line under the image, e.g. 'Brooklyn, NY · Summer 2026'
    tag: 'Economic Mobility',
    org: 'Community Preservation Corporation',
    orgNote: 'Nonprofit affordable housing lender',
    problem: 'Affordable housing loans need early warning before properties fall into distress.',
    did: "Monitored a $353M portfolio of 10,000+ units with quarterly DSCR analysis and watchlist tracking to flag at-risk loans. Supported compliance reviews and inspections across CPC's $5.9B Community Stabilization Partners portfolio.",
    stat: '35,000+', statLabel: 'Rent-regulated units supported',
    // portrait photo in a 4:3 slot shows a 56% band of its height; 33% is the lowest band that keeps both hard hats
    // fully in view (hat tops ~4% below the frame edge) while showing as much of the vests as possible
    image: '/Assets/img/cpc-photo-800.jpg', position: 'center 26%',   // a little higher than the lowest hat-safe framing, so the parallax drift and zoom keep both hats in
    srcset: '/Assets/img/cpc-photo-800.jpg 800w, /Assets/img/cpc-photo-1600.jpg 1232w',   // source is 1232px wide (not upscaled)
    alt: 'Angelina in a hard hat and safety vest during a CPC property inspection.',
  },
  {
    id: 'stackhacks',
    years: 2,   // years of involvement, sizes this row's dot in the hero constellation: 2024 – present (Experience)
    story: '',   // your new copy: one paragraph (replaces problem + did on the page)
    caption: '',   // optional line under the image, e.g. 'Brooklyn, NY · Summer 2026'
    tag: 'Education & Access',
    org: 'StackHacks, Binghamton University',
    orgNote: 'President & Co-Founder',
    problem: 'Underrepresented students lack on-ramps into software engineering.',
    did: 'Co-founded a student-run engineering org for underrepresented students and allies. Direct the executive board and 4 project divisions delivering workshops and product work for 100+ students.',
    stat: '600%', statLabel: 'Membership growth',
    // landscape, wider than 4:3: the full height shows and ~9% is trimmed from each side, so the STACKHACKS
    // projector text and the front rows stay in frame
    image: '/Assets/img/stackhacks-photo-800.jpg', position: 'center 40%', overlay: false,   // brightened in the file; no overlay
    srcset: '/Assets/img/stackhacks-photo-800.jpg 800w, /Assets/img/stackhacks-photo-1600.jpg 1260w',   // source is 1260px wide
    alt: 'StackHacks members gathered at a general body meeting, with the StackHacks logo projected behind them.',
  },
  {
    id: 'pathways-inc',
    years: 0.25,   // years of involvement, sizes this row's dot in the hero constellation: Summer 2024 (Earlier Experience)
    story: '',   // your new copy: one paragraph (replaces problem + did on the page)
    caption: '',   // optional line under the image, e.g. 'Brooklyn, NY · Summer 2026'
    tag: 'Health & Wellbeing',
    org: 'Pathways Inc.',
    orgNote: 'Nonprofit behavioral health services',
    problem: 'Elderly residents with neurological and psychological disabilities need consistent, individualized support.',
    did: 'Built one-on-one relationships with 15+ residents through 30 hours of weekly direct support, and led 10+ workshops on independence and daily living skills.',
    image: '/Assets/img/pathways-logo.png', fit: 'contain', alt: 'Pathways logo.',
  },
  {
    id: 'code-with-claude',
    years: 0,   // years of involvement, sizes this row's dot in the hero constellation: a one-day event, Nov 2026 (Conferences)
    story: '',   // your new copy: one paragraph (replaces problem + did on the page)
    caption: '',   // optional line under the image, e.g. 'Brooklyn, NY · Summer 2026'
    tag: 'Responsible AI',
    org: "Anthropic's Code with Claude: Women in AI Hackathon",
    orgNote: 'Safety & Rights track',
    problem: 'Deepfakes erode trust and harm the people they depict.',
    did: 'Built a Claude Code solution addressing deepfakes, mentored and judged by Anthropic teams.',
    // event artwork, not a photo (the same file as the Conferences card, referenced directly): shown whole on its
    // own orange like there, no overlay; it still opens in the lightbox
    image: '/Assets/img/Anthropic.webp', fit: 'art', bg: '#d77657',
    alt: "Anthropic's Code with Claude: Women in AI Hackathon artwork.",
  },
];

// Long-term commitments: rows under the case studies, a step smaller. since is the year shown as the stat; orgNote is
// an optional description shown in parentheses after the organization.
const IMPACT_COMMITMENTS = [   // in the order shown on the page; the image side keeps zigzagging on from the case studies
  {
    id: 'operation-smile',
    years: 12,   // years of involvement, sizes this row's dot in the hero constellation: since 2014
    caption: '',
    tag: 'Global Health',
    role: 'Fundraising Volunteer',
    org: 'Operation Smile',
    since: '2014 – Present',
    line: 'Raised $75,000+ toward free cleft lip and palate surgeries for 250+ children without access to care.',
    // landscape, wider than 4:3: the sides are trimmed. 'right center' shifts as far right as the photo allows, which
    // puts the child's face (62% across the source) at ~55% of the slot, with the photo she holds still in frame.
    image: '/Assets/img/operation-smile-photo-800.jpg', position: 'right center', overlay: false,
    srcset: '/Assets/img/operation-smile-photo-800.jpg 800w, /Assets/img/operation-smile-photo-1600.jpg 894w',   // source is 894px wide
    alt: 'A child smiling, representing the patients Operation Smile serves.',
  },
  {
    id: 'grace-community',
    years: 2,   // years of involvement, sizes this row's dot in the hero constellation: since 2024
    caption: '',
    tag: 'Food Security',
    role: 'Volunteer',
    org: 'Grace Community Church, Feed My Starving Children MobilePack',
    since: '2024 – Present',
    line: 'Pack nutritionally complete meals for children facing hunger around the world through church-hosted meal-packing events.',
    // landscape 4:3, the same shape as the slot: shown whole, so Angelina (right of centre) and the table stay in frame
    image: '/Assets/img/grace-community-photo-800.jpg', overlay: false,
    srcset: '/Assets/img/grace-community-photo-800.jpg 800w, /Assets/img/grace-community-photo-1600.jpg 1600w',
    alt: 'Angelina packing meals at a Feed My Starving Children event hosted by Grace Community Church.',
  },
  {
    id: 'mothers-for-others',
    years: 3,   // years of involvement, sizes this row's dot in the hero constellation: since 2023
    caption: '',
    tag: 'Family Support',
    role: 'Youth Volunteer',
    org: 'Mothers for Others',
    orgNote: 'Fairfield County diaper bank',
    since: '2023',
    line: "Recruit and lead youth volunteers for the county's largest independent diaper bank serving low-income families; accepted the 2023 Proclamation on the organization's behalf.",
    // the -800/-1600 files are a 1.46:1 crop of the original (source-assets/, not deployed): the four of them fill ~85%
    // of the width, centred, with the mural above and behind; it ends just above the wood rail (mid-thigh), with the
    // proclamation whole. Shown at that shape (fit 'native': no further cropping, no object-position), with the 1px
    // outline; the lightbox shows the same crop (the -1600 file).
    image: '/Assets/img/mothers-for-others-photo-800.jpg?v=6', fit: 'native', overlay: false,
    srcset: '/Assets/img/mothers-for-others-photo-800.jpg?v=6 800w, /Assets/img/mothers-for-others-photo-1600.jpg?v=6 1600w',
    alt: 'Angelina with fellow Mothers for Others volunteers in front of a mural, one of them holding a framed proclamation.',
  },
  {
    id: 'greenwich-first-selectman',
    years: null,   // years of involvement, sizes this row's dot in the hero constellation: set it with the start year
    caption: '',
    tag: 'Civic Engagement',
    role: 'Intern & Volunteer',
    org: 'Office of the First Selectman, Town of Greenwich',
    since: '2023 – 2024',
    line: "Supported community outreach in First Selectman Fred Camillo's office, including engagement with Greenwich's Latino residents, and volunteer each year at the town's Independence Day celebration.",
    // the -800/-1600 files are a 4:3 crop of the portrait original, centred on the two of them (head to waist, hand
    // flag in frame; the wall flag above didn't fit). The lightbox shows the uncropped original (full).
    image: '/Assets/img/greenwich-july4-photo-800.jpg?v=2', overlay: false,
    full: '/Assets/img/greenwich-july4-full-1600.jpg',
    srcset: '/Assets/img/greenwich-july4-photo-800.jpg?v=2 800w, /Assets/img/greenwich-july4-photo-1600.jpg?v=2 1600w',
    alt: "Angelina with Greenwich First Selectman Fred Camillo at the town's Independence Day celebration.",
  },
  {
    id: 'harvest-time-vbs',
    years: 7,   // years of involvement, sizes this row's dot in the hero constellation: since 2019
    caption: '',
    tag: 'Youth Mentorship',
    role: 'Camp Counselor',
    org: 'Harvest Time Church Vacation Bible School',
    since: '2019 – 2024',
    line: 'Mentor and support campers ages 4 to 12, creating an inclusive, safe, and welcoming environment where every child can grow in their faith and get to know Christ.',
    image: '/Assets/img/harvest-time-photo-800.jpg', position: 'center 30%', overlay: false,
    srcset: '/Assets/img/harvest-time-photo-800.jpg 800w, /Assets/img/harvest-time-photo-1600.jpg 1600w',   // portrait: both faces and the SCUBA screen stay in frame; the name tag is retouched out of the file
    alt: 'Angelina with a fellow counselor at Harvest Time Church Vacation Bible School.',
  },
];

// ── Rendering
// Fills the /impact hero from IMPACT_PAGE (elements with data-impact="title" / "subtitle" / "sub")
function renderImpactHero() {
  for (const k of ['title', 'subtitle', 'sub']) {
    const el = document.querySelector(`[data-impact="${k}"]`);
    if (el && IMPACT_PAGE[k]) el.textContent = IMPACT_PAGE[k];
  }
}
const impactEl = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
const impactIcon = name => { const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); s.setAttribute('class', 'i'); s.setAttribute('aria-hidden', 'true'); s.innerHTML = `<use href="#i-${name}"/>`; return s; };

// A row's image slot: the image when there is one (see fit above), otherwise (if placeholders are on) an empty framed
// 4:3 slot. Returns null when the row should have no slot.
// Every photo button on the page, in page order: the Impact lightbox gallery (see impactLightbox)
const IMPACT_SHOTS = [];
// Registers the photos with the site's lightbox (Assets/js/site.js); call it after rendering. Caption: the row's
// organization, plus the row's optional description (the alt text stays on the <img> for screen readers, but isn't
// shown as a caption).
function impactLightbox() {
  if (typeof addLightboxGallery !== 'function') return;
  addLightboxGallery(IMPACT_SHOTS, btn => {
    const row = btn.closest('.impact-row, .impact-tl-item');   // a case-study row or a timeline node
    const title = row.querySelector('.impact-org').textContent;   // the organization
    return [title, btn.dataset.lbDesc || ''];
  });
}
// sizes: the slot's rendered width, so the browser picks the right file from srcset
const IMPACT_SIZES = { case: '(max-width: 900px) 100vw, 460px', commit: '(max-width: 900px) 100vw, 400px', thumb: '140px' };
function impactShot({ image, alt, fit = 'cover', position, overlay = true, srcset, sizes, bg, full, description }) {
  const empty = () => { const d = impactEl('div', 'impact-shot is-empty'); d.setAttribute('aria-hidden', 'true'); d.appendChild(impactIcon('image')); return d; };
  if (!image) return SHOW_IMAGE_PLACEHOLDERS ? empty() : null;
  const mode = ['contain', 'native', 'art'].includes(fit) ? fit : 'cover';
  // photos open in the site's lightbox, like the conference photos: the slot is a button with the same expand cue.
  // Logos (fit 'contain') stay a plain figure.
  const zoomable = mode !== 'contain';
  const fig = impactEl(zoomable ? 'button' : 'figure', 'impact-shot is-' + mode + (mode === 'cover' && overlay === false ? ' no-overlay' : '') + (zoomable ? ' is-zoomable' : ''));
  const img = impactEl('img');
  if (mode === 'art' && bg) fig.style.setProperty('--shot-bg', bg);
  if (zoomable) {
    fig.type = 'button';
    fig.setAttribute('aria-label', 'View larger: ' + (alt || 'photo'));
    fig.setAttribute('aria-haspopup', 'dialog');
    // the lightbox shows the largest file in srcset (the -1600 version), uncropped
    const largest = srcset ? srcset.split(',').map(e => e.trim().split(/\s+/)).sort((x, y) => parseInt(y[1]) - parseInt(x[1]))[0][0] : image;
    img.dataset.full = full || largest;
    if (description) fig.dataset.lbDesc = description;
  }
  img.src = image; img.alt = alt || ''; img.loading = 'lazy'; img.decoding = 'async'; img.width = 1200; img.height = 900;
  if (srcset) { img.srcset = srcset; img.sizes = sizes || '100vw'; }
  if (position) img.style.objectPosition = position;
  img.onerror = () => {
    const at = IMPACT_SHOTS.indexOf(fig); if (at > -1) IMPACT_SHOTS.splice(at, 1);   // drops out of the lightbox
    if (SHOW_IMAGE_PLACEHOLDERS) fig.replaceWith(empty()); else fig.remove();
  };
  fig.appendChild(img);
  if (zoomable) {
    const cue = impactEl('span', 'conf-zoom'); cue.setAttribute('aria-hidden', 'true'); cue.appendChild(impactIcon('expand'));
    fig.appendChild(cue);
    IMPACT_SHOTS.push(fig);
  }
  return fig;
}

// The image cell of a row: the slot, plus the optional caption under it. Returns null when the row has no slot.
function impactMedia(shot, caption) {
  if (!shot) return null;
  const media = impactEl('div', 'impact-media');
  const frame = impactEl('div', 'impact-frame');   // holds the image (its 1px gold outline is on .impact-shot)
  frame.appendChild(shot);
  media.appendChild(frame);
  if (shot.classList.contains('is-cover')) shot.classList.add('has-parallax');   // photos drift on scroll; logos/art don't
  if (caption) media.appendChild(impactEl('p', 'impact-caption', caption));
  return media;
}

// The constellation marks above the focus-area headings: hand-drawn arrangements (x, y, r in a 72 × 16 box), a different
// one for each heading (the four case studies, then the commitments), drawn in when the heading scrolls into view
// (constellationMark in Assets/js/site.js; the same draw-in as the homepage's section marks)
const IMPACT_MARKS = [
  [[4, 11, 1.5], [22, 5, 2.6], [41, 9, 1.3], [68, 6, 1.6]],
  [[4, 6, 1.4], [19, 12, 1.7], [37, 8, 1.3], [52, 3.5, 2.5], [68, 10, 1.4]],
  [[4, 9, 2.4], [30, 4, 1.4], [68, 11, 1.6]],
  [[4, 4, 1.3], [17, 10, 1.6], [33, 12, 1.3], [50, 6, 1.5], [68, 7, 2.5]],
  [[4, 12, 1.6], [24, 7, 1.3], [44, 10, 2.5], [68, 4, 1.4]],
  [[4, 7, 1.5], [21, 4, 1.3], [40, 11, 1.7], [56, 8, 2.4], [68, 12, 1.3]],
  [[4, 5, 2.5], [35, 11, 1.4], [68, 7, 1.6]],
  [[4, 10, 1.3], [16, 5, 1.6], [34, 7, 2.4], [52, 12, 1.3], [68, 6, 1.5]],
  [[4, 8, 1.6], [26, 12, 1.3], [47, 5, 2.5], [68, 9, 1.4]],
];
const impactMark = i => {
  const d = impactEl('div', 'impact-mark'); d.setAttribute('aria-hidden', 'true');
  if (typeof constellationMark === 'function') d.innerHTML = constellationMark(null, { points: IMPACT_MARKS[i % IMPACT_MARKS.length] });
  return d;
};
// draw each mark in a container as it comes into view (all at once with reduced motion)
function drawImpactMarks(root) {
  root.querySelectorAll('.impact-mark .c-mark').forEach(m => {
    if (reduceMotion || typeof DoveKit === 'undefined') m.classList.add('is-drawn');
    else DoveKit.inViewOnce(m, () => m.classList.add('is-drawn'), { threshold: 0.9 });
  });
}

// The four case-study cards, into an .impact-grid. headingLevel is the card title's heading level.
function renderImpactCases(grid, { headingLevel = 3 } = {}) {
  IMPACT.forEach(({ id, tag, org, orgNote, story, problem, did, stat, statLabel, statText, caption, image, alt, fit, position, overlay, srcset, bg, description }, i) => {
    // One full-width row per case study: the image beside a content column (focus area, org, descriptor, paragraph, then
    // the stat if the row has one). Odd rows put the image on the right (.is-flipped); rows stack on narrow screens.
    const card = impactEl('article', 'impact-row impact-card reveal' + (i % 2 ? ' is-flipped' : '') + (stat ? '' : ' no-stat'));
    card.id = 'impact-' + id;
    const media = impactMedia(impactShot({ image, alt, fit, position, overlay, srcset, sizes: IMPACT_SIZES.case, bg, description }), caption);
    if (media) { card.classList.add('has-shot'); card.appendChild(media); }
    const content = impactEl('div', 'impact-content');
    card.appendChild(content);
    const body = impactEl('div', 'impact-body');
    // hierarchy: focus area (the row's heading) → organization (gold) → descriptor (small, muted)
    body.append(impactMark(i), impactEl('h' + headingLevel, 'impact-focus', tag), impactEl('p', 'impact-org', org));
    if (orgNote) body.appendChild(impactEl('p', 'impact-org-note', orgNote));
    const text = story || [problem, did].filter(Boolean).join(' ');
    if (text) body.appendChild(impactEl('p', 'impact-story', text));
    content.appendChild(body);
    if (stat) {
      const s = impactEl('p', 'impact-stat'), num = impactEl('span', 'impact-num' + (statText ? ' impact-num-text' : ''));
      const m = !statText && /^(.*?)([+%])$/.exec(stat);
      if (m) {
        // the number counts up from 0 when it scrolls into view (data-target; see countUp in Assets/js/site.js)
        const n = impactEl('span', '', m[1]), v = +m[1].replace(/,/g, '');
        if (Number.isFinite(v)) { n.dataset.target = v; n.dataset.duration = 1200; }
        num.append(n, impactEl('span', 'impact-unit', m[2]));
      } else num.textContent = stat;
      s.append(num, impactEl('span', 'impact-stat-label', statLabel || ''));
      content.appendChild(s);
    }
    grid.appendChild(card);
  });
  drawImpactMarks(grid);
}

// The "Long-term commitments" block: its label (a heading at labelLevel), then a vertical timeline, most recent at the
// top, drawn with the site's timeline component (initTimeline in Assets/js/site.js: the line draws in as you scroll and
// each node lights up as it's reached). Each node: the year (gold), the focus area, the organization (gold), the role,
// the one-line description, and a small photo that opens in the lightbox.
function renderImpactCommitments(container, { labelLevel = 2, headingLevel = 3 } = {}) {
  if (!IMPACT_COMMITMENTS.length) return;
  const wrap = impactEl('div', 'impact-commit');
  wrap.id = 'commitments';
  wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-labelledby', 'commitTitle');
  const label = impactEl('h' + labelLevel, 'impact-commit-label reveal', 'Long-term commitments');
  label.id = 'commitTitle';
  const tl = impactEl('div', 'timeline impact-timeline');
  const progress = impactEl('div', 'timeline-progress'); progress.setAttribute('aria-hidden', 'true');
  tl.appendChild(progress);
  IMPACT_COMMITMENTS.forEach(({ id, tag, role, org, orgNote, since, line, image, alt, fit, position, overlay, srcset, full, description }, idx) => {
    const item = impactEl('article', 'timeline-item impact-tl-item reveal');
    item.id = 'commit-' + id;
    const dot = impactEl('div', 'timeline-dot'); dot.setAttribute('aria-hidden', 'true');
    const body = impactEl('div', 'impact-tl-body');
    body.appendChild(dot);   // inside the text column, so it lines up with the year whether the photo is beside or above
    const yearRow = impactEl('div', 'impact-tl-head');   // the year, with the heading's constellation mark beside it
    if (since) yearRow.appendChild(impactEl('p', 'impact-tl-year', since));
    yearRow.appendChild(impactMark(IMPACT.length + idx));
    body.appendChild(yearRow);
    body.append(impactEl('h' + headingLevel, 'impact-focus', tag), impactEl('p', 'impact-org', org),
      impactEl('p', 'impact-org-note', [role, orgNote].filter(Boolean).join(' · ')), impactEl('p', 'impact-commit-line', line));
    item.append(body);
    // the timeline photo loads the -800 file (image); the lightbox still opens the largest file in srcset (or full)
    const largest = srcset ? srcset.split(',').map(e => e.trim().split(/\s+/)).sort((x, y) => parseInt(y[1]) - parseInt(x[1]))[0][0] : image;
    const shot = impactShot({ image, alt, fit, position, overlay, full: full || largest, description });
    if (shot) {
      const th = impactEl('div', 'impact-tl-thumb'), fr = impactEl('div', 'impact-frame');
      fr.appendChild(shot); th.appendChild(fr); item.appendChild(th); item.classList.add('has-thumb');
    }
    tl.appendChild(item);
  });
  wrap.append(label, tl);
  container.appendChild(wrap);
  if (typeof initTimeline === 'function') initTimeline(tl);
  drawImpactMarks(wrap);
}

// ── Hero constellation: an original line drawing (two cupped hands holding a globe, a three-leaf sprout on top, small
// circuit traces at the fingertips) drawn as a gold dot-and-line constellation in the homepage hero motif's style.
// Each path below is sampled into evenly spaced dots, and consecutive dots are joined by thin lines. The nine Impact
// entries are larger "anchor" dots on the drawing: hover or focus one for the organization, click / Enter to jump to
// its row. Coordinates are in a 400 × 440 box.
// The globe inside the hands is a real sphere (see globe below): it turns on drag, and four entries are pinned to it.
const IMPACT_CONSTELLATION = {
  // dot spacing along each line weight (drawing units); joints are always dotted
  spacing: { main: 20, detail: 26, fine: 34 },
  // each line: its path, weight ('main' outlines, 'detail' fingers and land, 'fine' grid and circuit traces), when
  // it draws during the grow-in (ms, from its start point), joint nodes (medium dots) and whether it ends in a hollow node
  paths: [
    { d: 'M121,440 L119,414', w: 'main', at: [1300, 1420] },   // left forearm, outer
    { d: 'M179,440 L181,414', w: 'main', at: [1300, 1420] },   // left forearm, inner
    { d: 'M116,414 L184,414 L184,404 L116,404 Z', w: 'main', at: [1380, 1520], closed: true, joints: [[116,414],[184,414]] },   // left cuff
    { d: 'M122,398 C106,372 98,338 104.9,313.4 L136.4,275.8 A99,99 0 0,0 186.2,298 C190,322 186,370 178,398 Z', w: 'main', at: [1450, 1800], closed: true, joints: [[122,398],[178,398]] },   // left palm
    { d: 'M132.3,386.6 Q152,369.6 167.3,348.6 A5,5 0 0,1 174.7,355.4 Q159.4,376.4 139.7,393.4 Z', w: 'main', at: [1650, 1850], closed: true, joints: [[136,390],[174.4,348.3]] },   // left thumb
    { d: 'M136.4,275.8 A99,99 0 0,1 107,166.1 A5,5 0 0,0 97.6,162.7 A109,109 0 0,0 129.9,283.5 Z', w: 'detail', at: [1650, 1950], closed: true, joints: [[125.2,272.2],[104.1,159.8]] },   // left index finger
    { d: 'M128,285.8 A112,112 0 0,1 92.3,169.1 A5,5 0 0,0 82.7,166.4 A122,122 0 0,0 121.6,293.5 Z', w: 'detail', at: [1690, 1960], closed: true, joints: [[115.8,281.3],[89.0,163.0]] },   // left middle finger
    { d: 'M119.7,295.8 A125,125 0 0,1 76.2,182.6 A5,5 0 0,0 66.3,181.2 A135,135 0 0,0 113.2,303.4 Z', w: 'detail', at: [1730, 1970], closed: true, joints: [[106.5,290.3],[72.1,177.0]] },   // left ring finger
    { d: 'M111.3,305.7 A138,138 0 0,1 62.3,209.6 A5,5 0 0,0 52.4,210.3 A148,148 0 0,0 104.9,313.4 Z', w: 'detail', at: [1770, 1980], closed: true, joints: [[97.1,299.3],[57.1,205.0]] },   // left little finger
    { d: 'M102.3,235.6 A104,104 0 0,1 105,157.7 L97,149.7 L85,149.7', w: 'fine', at: [2650, 2950], kind: 'trace', joints: [[102.3,235.6]], hollowEnd: true },   // left circuit trace (index)
    { d: 'M77.8,244.5 A130,130 0 0,1 72.8,173 L64.8,165 L52.8,165', w: 'fine', at: [2650, 2950], kind: 'trace', joints: [[77.8,244.5]], hollowEnd: true },   // left circuit trace (ring)
    { d: 'M279,440 L281,414', w: 'main', at: [1300, 1420] },   // right forearm, outer
    { d: 'M221,440 L219,414', w: 'main', at: [1300, 1420] },   // right forearm, inner
    { d: 'M284,414 L216,414 L216,404 L284,404 Z', w: 'main', at: [1380, 1520], closed: true, joints: [[284,414],[216,414]] },   // right cuff
    { d: 'M278,398 C294,372 302,338 295.1,313.4 L263.6,275.8 A99,99 0 0,1 213.8,298 C210,322 214,370 222,398 Z', w: 'main', at: [1450, 1800], closed: true, joints: [[278,398],[222,398]] },   // right palm
    { d: 'M260.3,393.4 Q240.6,376.4 225.3,355.4 A5,5 0 0,1 232.7,348.6 Q248,369.6 267.7,386.6 Z', w: 'main', at: [1650, 1850], closed: true, joints: [[264,390],[225.6,348.3]] },   // right thumb
    { d: 'M263.6,275.8 A99,99 0 0,0 293,166.1 A5,5 0 0,1 302.4,162.7 A109,109 0 0,1 270.1,283.5 Z', w: 'detail', at: [1650, 1950], closed: true, joints: [[274.8,272.2],[295.9,159.8]] },   // right index finger
    { d: 'M272,285.8 A112,112 0 0,0 307.7,169.1 A5,5 0 0,1 317.3,166.4 A122,122 0 0,1 278.4,293.5 Z', w: 'detail', at: [1690, 1960], closed: true, joints: [[284.2,281.3],[311.0,163.0]] },   // right middle finger
    { d: 'M280.3,295.8 A125,125 0 0,0 323.8,182.6 A5,5 0 0,1 333.7,181.2 A135,135 0 0,1 286.8,303.4 Z', w: 'detail', at: [1730, 1970], closed: true, joints: [[293.5,290.3],[327.9,177.0]] },   // right ring finger
    { d: 'M288.7,305.7 A138,138 0 0,0 337.7,209.6 A5,5 0 0,1 347.6,210.3 A148,148 0 0,1 295.1,313.4 Z', w: 'detail', at: [1770, 1980], closed: true, joints: [[302.9,299.3],[342.9,205.0]] },   // right little finger
    { d: 'M297.7,235.6 A104,104 0 0,0 295,157.7 L303,149.7 L315,149.7', w: 'fine', at: [2650, 2950], kind: 'trace', joints: [[297.7,235.6]], hollowEnd: true },   // right circuit trace (index)
    { d: 'M322.2,244.5 A130,130 0 0,0 327.2,173 L335.2,165 L347.2,165', w: 'fine', at: [2650, 2950], kind: 'trace', joints: [[322.2,244.5]], hollowEnd: true },   // right circuit trace (ring)
    { d: 'M200,292 A92,92 0 0,1 200,108', w: 'main', at: [1800, 2200], kind: 'limb' },   // globe rim, left half (fixed: the globe turns inside it)
    { d: 'M200,292 A92,92 0 0,0 200,108', w: 'main', at: [1800, 2200], kind: 'limb' },   // globe rim, right half
    { globe: true },   // the turning globe (IMPACT_CONSTELLATION.globe) is drawn here, between the hands and the sprout
    { d: 'M200,108 C198,90 202,66 200,44', w: 'main', at: [2500, 2650], joints: [[200,108]] },   // sprout stem
    { d: 'M200,86 C195.8,70 174,62.1 160,64 C166,76.9 184.2,91 200,86 Z', w: 'main', at: [2600, 2820], closed: true, joints: [[160,64]] },   // left leaf
    { d: 'M197.6,84.7 L168,68.4', w: 'detail', at: [2720, 2880] },   // left leaf vein
    { d: 'M200,72 C215.4,77.7 233.8,64.5 240,52 C226.2,49.5 204.6,56.3 200,72 Z', w: 'main', at: [2640, 2860], closed: true, joints: [[240,52]] },   // right leaf
    { d: 'M202.4,70.8 L232,56', w: 'detail', at: [2760, 2920] },   // right leaf vein
    { d: 'M200,44 C210,36 207,20 200,12 C193,20 190,36 200,44 Z', w: 'main', at: [2680, 2900], closed: true, joints: [[200,12]] },   // top leaf
    { d: 'M200,42.1 L200,18.4', w: 'detail', at: [2800, 2960] },   // top leaf vein
  ],
  seed: [200, 302],   // where the dove's seed lands, between the palms
  anchors: {   // where each entry sits on the hands (snapped to the nearest dot on a main or detail line)
    'grace-community': [104.1, 159.8],
    'greenwich-first-selectman': [295.9, 159.8],
    'mothers-for-others': [57.1, 205],
    'harvest-time-vbs': [342.9, 205],
    'operation-smile': [174.4, 348.3],
  },
  // The globe: a sphere in orthographic projection that turns inside the fixed rim. Drag (or the arrow keys) turns it;
  // idle, it turns once every revSeconds. rot0 is the longitude (degrees west) facing the viewer at rest, tilt0 the
  // latitude at the centre of the view (dragging vertically tilts it within ±tiltMax). Lines: latitudes every 30°,
  // meridians every 30°, and the coastlines below, with a dot every landStep degrees along the coast.
  globe: {
    cx: 200, cy: 200, r: 92, rot0: 95, tilt0: 22, tiltMax: 25, revSeconds: 75, landStep: 9,
    // land outlines: Natural Earth 1:110m land (public domain, naturalearthdata.com), islands under ~8 sq° dropped,
    // simplified (Douglas-Peucker, 1°) and rounded to whole degrees. Lines are separated by ';', each a flat list
    // of lon,lat pairs.
    land: '-45,-78,-43,-80,-54,-81,-45,-78;-68,-71,-71,-73,-75,-72,-72,-71,-70,-69,-68,-71;-151,-84,-157,-81,-147,-80,-155,-79,-158,-77,-151,-77,-145,-75,-114,-74,-101,-75,-104,-73,-75,-74,-67,-72,-68,-67,-58,-63,-66,-68,-62,-71,-61,-74,-71,-77,-77,-77,-74,-78,-78,-79,-58,-83,-29,-80,-36,-79,-35,-78,-18,-75,-15,-73,-7,-71,27,-70,34,-69,39,-70,55,-66,61,-68,69,-68,70,-69,68,-72,70,-72,74,-70,88,-66,96,-67,103,-66,106,-67,114,-66,120,-67,135,-65,137,-67,145,-67,171,-72,164,-76,167,-79,162,-79,160,-81,169,-84;-180,-17,179,-16,-180,-17;50,-14,47,-25,44,-25,44,-16,49,-12,50,-14;144,-14,153,-26,153,-31,150,-37,146,-39,141,-38,138,-34,137,-35,138,-33,136,-35,131,-31,118,-35,115,-34,116,-32,113,-26,114,-22,121,-20,126,-14,130,-15,132,-11,136,-12,135,-15,140,-18,142,-11,144,-14;109,-7,116,-8,108,-8,105,-7,109,-7;134,-1,135,-3,138,-2,145,-4,151,-11,145,-8,143,-9,138,-8,138,-5,133,-4,132,-3,134,-2,131,-1,134,-1;125,1,120,0,121,-1,123,-1,122,-2,123,-5,121,-3,119,-5,120,1,125,1;106,-6,103,-4,95,5,104,0,106,-3,106,-6;118,2,119,1,116,-4,110,-3,109,0,110,2,113,3,117,7,119,5,117,3,118,2;126,8,125,6,124,8,122,7,125,10,126,8;121,19,123,17,122,14,124,13,120,15,121,19;141,37,140,35,136,33,135,35,131,34,132,33,130,31,129,33,139,38,140,41,142,40,141,37;-15,66,-14,65,-19,63,-24,66,-15,66;-180,69,-170,66,-173,64,-179,66,-180,65,180,65,177,65,179,62,170,60,164,60,162,58,163,58,162,55,157,51,156,57,164,63,160,61,157,61,154,60,155,59,142,59,135,55,140,54,141,52,138,46,128,40,129,35,126,34,125,40,121,39,122,41,118,39,119,37,122,37,119,35,122,32,122,28,116,23,110,20,109,22,106,20,109,13,109,12,105,9,100,13,99,9,103,6,104,1,101,3,98,8,97,17,94,16,91,23,87,21,80,16,80,10,78,8,73,21,70,21,66,25,57,26,56,27,52,28,50,30,48,30,52,24,56,26,57,24,60,22,55,17,43,13,43,17,35,30,34,28,32,30,37,19,43,12,45,10,51,12,51,11,48,4,39,-5,41,-15,35,-20,35,-24,33,-26,32,-29,28,-33,20,-35,12,-18,14,-11,12,-5,9,-1,9,4,6,4,4,6,-9,5,-17,12,-17,22,-6,36,10,37,11,37,10,34,19,30,22,33,34,31,36,37,28,37,26,39,34,42,38,41,42,42,37,45,39,47,35,46,36,45,34,44,32,45,33,46,31,47,28,43,29,41,23,40,24,38,22,36,20,42,13,46,13,44,18,40,17,40,16,38,15,40,9,44,3,43,-2,37,-9,37,-9,43,-1,44,-1,46,-5,49,-2,49,-2,50,8,54,9,57,11,58,10,55,11,54,20,54,22,57,24,57,23,59,29,60,21,61,22,63,25,65,22,66,18,63,17,61,19,60,16,56,13,55,10,59,6,59,6,63,19,70,25,71,40,68,41,67,40,66,33,67,37,64,37,65,44,66,43,69,46,68,46,67,54,69,60,68,61,70,69,68,67,71,69,73,73,73,72,71,74,68,71,66,72,66,75,68,73,71,75,73,76,71,81,72,81,74,104,78,114,76,109,74,127,74,131,71,140,71,139,72,140,73,159,71,161,69,179,69,-180,69;-180,72,180,71,-180,72;-91,69,-87,67,-86,70,-83,70,-81,68,-93,62,-95,59,-92,57,-82,55,-80,51,-79,53,-80,55,-77,57,-79,59,-77,60,-78,62,-74,62,-70,61,-68,58,-65,60,-62,56,-57,55,-56,52,-60,50,-66,50,-71,47,-65,49,-64,46,-61,47,-60,46,-65,44,-66,44,-64,45,-67,45,-71,43,-70,42,-76,39,-76,37,-76,39,-76,36,-81,31,-80,25,-84,30,-94,30,-97,28,-98,22,-96,19,-92,19,-90,21,-87,22,-89,16,-83,15,-84,11,-81,9,-77,9,-72,12,-72,9,-70,12,-68,11,-62,11,-57,6,-51,4,-50,0,-45,-3,-40,-3,-36,-5,-35,-7,-39,-13,-41,-22,-48,-25,-49,-29,-54,-34,-58,-34,-57,-37,-62,-39,-63,-41,-65,-41,-63,-43,-67,-46,-66,-48,-69,-51,-68,-52,-71,-54,-75,-52,-76,-49,-74,-47,-76,-47,-73,-42,-74,-43,-70,-20,-76,-15,-81,-6,-80,-3,-81,-1,-77,4,-78,8,-80,9,-81,7,-86,10,-87,13,-103,18,-114,32,-115,30,-109,23,-112,25,-117,33,-121,35,-124,40,-125,48,-123,47,-123,49,-127,51,-134,58,-147,61,-152,59,-151,61,-158,56,-165,54,-157,59,-162,59,-166,61,-161,65,-168,66,-162,66,-167,68,-157,71,-137,69,-128,70,-109,67,-106,69,-101,68,-98,69,-96,67,-94,69,-96,70,-95,72,-91,69;-114,73,-108,72,-108,73,-107,73,-101,70,-102,69,-116,69,-117,70,-112,70,-119,72,-114,73;-87,73,-82,74,-81,72,-72,72,-68,70,-67,69,-69,69,-62,67,-64,65,-68,66,-65,63,-69,64,-66,62,-75,65,-78,64,-78,65,-74,65,-73,68,-79,70,-89,70,-90,72,-87,73;-100,74,-97,74,-97,72,-102,73,-100,74;-120,71,-126,72,-124,74,-125,74,-118,74,-116,73,-120,71;145,76,137,75,145,76;-108,76,-106,76,-106,75,-118,75,-115,76,-108,76;58,71,52,71,56,75,69,77,58,74,55,72,58,71;-95,77,-80,75,-92,75,-97,77,-95,77;18,80,22,79,16,77,10,80,18,80;25,80,17,80,25,80;100,79,91,80,96,81,100,79;-87,80,-91,78,-97,80,-92,81,-87,80;-68,83,-62,82,-77,79,-75,79,-81,76,-89,76,-88,78,-85,78,-88,78,-85,79,-87,80,-82,80,-92,82,-68,83;-27,84,-21,83,-31,82,-12,81,-20,80,-18,80,-20,79,-18,77,-22,77,-19,74,-25,72,-22,71,-26,71,-26,70,-22,70,-40,65,-43,60,-48,61,-52,64,-54,67,-51,70,-55,70,-54,71,-51,71,-56,72,-55,73,-59,76,-69,76,-71,77,-67,77,-73,78,-66,79,-68,80,-63,82,-27,84',
  },
  // entries pinned to the globe at their real coordinates [lat, lon]. The three New York-area places are a few miles
  // apart, so each pin carries its dot out on a short leader by off (drawing units, on screen) to keep them apart.
  globeAnchors: {
    'cpc': { at: [40.71, -74.01], off: [4, 17] },   // Community Preservation Corporation, New York City
    'stackhacks': { at: [42.10, -75.91], off: [-16, -10] },   // StackHacks, Binghamton NY
    'pathways-inc': { at: [41.03, -73.63], off: [16, -10] },   // Pathways Inc., Greenwich CT
    'code-with-claude': { at: [37.77, -122.42], off: [0, 0] },   // Anthropic's hackathon, San Francisco
  },
};
// The constellation's grow-in, in ms (scaled down on phones). A small vector dove (the nav logo's dove) flies in from
// the hero's left edge and hovers above the palms, drops a seed that falls between them, then rises and waits while
// the drawing grows from the seed: the hands draw up from the wrists, the globe grows outward from the seed, the
// sprout's stem draws up and its leaves unfurl. The dove perches on the top leaf and the nine entries pulse in.
const CONSTELLATION_STEPS = {
  fly: [0, 900], plant: [900, 1300], seedFall: [950, 1200], seedBounce: [1200, 1320], glow: [1250, 1750],
  rise: [1300, 2300], hands: [1300, 2000], globe: [1800, 2600], sprout: [2500, 3000], perch: [2800, 3300],
  anchors: [3000, 3400], total: 3450,
};

// Renders the constellation into holder. Plays the grow-in once per session (?intro=1 replays it; so does clicking
// the dove); otherwise, and with reduced motion, it starts finished. Afterwards: a gentle drift and twinkle on the
// dots (not on phones or with reduced motion) and the dove's own blink and wing flutter.
// opts.teaser: the homepage's decorative copy (no entries, no seed or flight, no replay, a still globe): the drawing
// draws itself in once when it scrolls into view, the dove already resting on the sprout.
function renderImpactConstellation(holder, opts = {}) {
  if (!holder) return;
  try { buildConstellation(holder, opts); }
  catch (e) {   // fail-safe: anything going wrong leaves the finished drawing (or at least nothing broken)
    console.error('Constellation animation failed; showing it finished', e);
    try { holder.replaceChildren(); buildConstellation(holder, { ...opts, forceStill: true }); } catch (e2) { console.error(e2); }
  }
}
function buildConstellation(holder, { forceStill = false, teaser = false } = {}) {
  const NS = 'http://www.w3.org/2000/svg', C = IMPACT_CONSTELLATION, W = 400, H = 440, S = CONSTELLATION_STEPS;
  const phone = window.matchMedia('(max-width: 900px)').matches;
  const still = forceStill || reduceMotion;
  let replay = false;
  if (!teaser) try { replay = /[?&]intro=1\b/.test(location.search) || sessionStorage.getItem('apImpactIntroSeen') !== '1'; sessionStorage.setItem('apImpactIntroSeen', '1'); } catch (e) {}
  const K = phone ? 2.5 / 3.45 : 1;   // phones: the same sequence, ~2.5s
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'impact-constellation');
  if (teaser) { svg.setAttribute('aria-hidden', 'true'); svg.classList.add('is-teaser'); }
  else { svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'Impact entries drawn as hands holding a globe: choose one to jump to it'); }
  const mk = (tag, cls, parent = svg) => { const n = document.createElementNS(NS, tag); if (cls) n.setAttribute('class', cls); parent.appendChild(n); return n; };
  holder.appendChild(svg);
  const clamp01 = x => Math.max(0, Math.min(1, x));

  // 1. the lines: each part of the drawing is a smooth path, drawn on by its stroke dash during the grow-in, with dots
  //    spaced along it by line weight, medium joint nodes (knuckles, fingertips, leaf tips) and a hollow node where a
  //    circuit trace ends. Each part is one group, so the idle drift moves a line and its dots together (not the globe's
  //    rim, which holds still around the turning globe). Phones leave out the circuit traces.
  const parts = C.paths.filter(p => !(phone && p.kind === 'trace'));
  const pts = [], groups = [];
  let globeG = null;
  parts.forEach(p => {
    if (p.globe) { globeG = mk('g', 'c-globe'); return; }
    const g = mk('g', 'c-part w-' + p.w + (p.kind ? ' k-' + p.kind : ''));
    const path = mk('path', 'c-path', g); path.setAttribute('d', p.d); path.setAttribute('pathLength', '1');
    const len = path.getTotalLength();
    const grp = { el: g, path, t0: p.at[0], t1: p.at[1], tf: '', fixed: p.kind === 'limb' };
    groups.push(grp);
    const along = (x, y) => {   // how far along the path (0–1) a point sits: the nearest of 240 samples
      let best = 0, bd = Infinity;
      for (let i = 0; i <= 240; i++) { const q = path.getPointAtLength(len * i / 240), d = (q.x - x) ** 2 + (q.y - y) ** 2; if (d < bd) { bd = d; best = i / 240; } }
      return best;
    };
    const spacing = C.spacing[p.w];
    const own = (p.joints || []).map(([x, y]) => ({ x, y, frac: along(x, y), size: 'joint' }));
    if (p.kind !== 'trace') {   // traces carry only their joints and the hollow end
      const n = Math.max(1, Math.round(len / spacing)), count = p.closed ? n : n + 1;
      for (let i = 0; i < count; i++) {
        const frac = i / n, q = path.getPointAtLength(len * frac);
        if (own.some(o => Math.hypot(o.x - q.x, o.y - q.y) < spacing * 0.45)) continue;   // no dot crowding a joint
        own.push({ x: q.x, y: q.y, frac, size: p.w });
      }
    }
    if (p.hollowEnd) { const q = path.getPointAtLength(len); own.push({ x: q.x, y: q.y, frac: 1, size: 'ring' }); }
    own.forEach(o => {
      o.appear = grp.t0 + (grp.t1 - grp.t0) * o.frac; o.group = grp; o.canAnchor = !p.kind && o.size !== 'ring';
      o.r = { main: 1.6, detail: 1.35, fine: 1.1, joint: 2.5, ring: 2.6 }[o.size];
      o.el = mk('circle', 'c-dot d-' + o.size, g); o.el.setAttribute('cx', o.x.toFixed(1)); o.el.setAttribute('cy', o.y.toFixed(1));
      pts.push(o);
    });
  });
  const [SX, SY] = C.seed;
  const pop = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 + 1.7 * Math.pow(x - 1, 3) + 0.7 * Math.pow(x - 1, 2);   // 0 → 1, a small overshoot

  // 2. the globe: unit vectors for every line point and dot, rotated about the vertical axis (rot), tilted about the
  //    horizontal one (tilt) and projected orthographically. A point faces the viewer when z > 0; it fades out over the
  //    last stretch before the edge (z < FADE) so the sphere reads as round, and is hidden behind it.
  const G = C.globe, DEG = Math.PI / 180, FADE = 0.32;
  const vec = (lat, lon) => { const f = lat * DEG, l = lon * DEG; return [Math.cos(f) * Math.sin(l), Math.sin(f), Math.cos(f) * Math.cos(l)]; };
  const angle = (a, b) => Math.acos(Math.max(-1, Math.min(1, a[0] * b[0] + a[1] * b[1] + a[2] * b[2])));
  const densify = (vs, maxStep) => {   // extra points along each great-circle step, so no step is longer than maxStep
    const out = [vs[0]];
    for (let i = 1; i < vs.length; i++) {
      const a = vs[i - 1], b = vs[i], n = Math.ceil(angle(a, b) / maxStep);
      for (let k = 1; k <= n; k++) {
        const u = k / n, v = [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u], m = Math.hypot(...v);
        out.push([v[0] / m, v[1] / m, v[2] / m]);
      }
    }
    return out;
  };
  const gLines = [], gDots = [];
  for (let lat = -60; lat <= 60; lat += 30) { const vs = []; for (let lon = -180; lon <= 180; lon += 4) vs.push(vec(lat, lon)); gLines.push({ kind: 'grid', vs }); }
  for (let lon = -180; lon < 180; lon += 30) { const vs = []; for (let lat = -90; lat <= 90; lat += 4) vs.push(vec(lat, lon)); gLines.push({ kind: 'grid', vs }); }
  for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon < 180; lon += 30) gDots.push({ kind: 'grid', v: vec(lat, lon), r: 1.1, appear: 2350 + 450 * ((lon + 180) / 360) });
  const coasts = G.land.split(';').map(line => { const n = line.split(',').map(Number), vs = []; for (let i = 0; i < n.length; i += 2) vs.push(vec(n[i + 1], n[i])); return densify(vs, 3 * DEG); });
  coasts.forEach((vs, li) => {
    gLines.push({ kind: 'land', vs });
    let acc = G.landStep * DEG;   // a dot at the start of each coastline, then every landStep degrees along it
    for (let i = 0; i < vs.length; i++) {
      if (i) acc += angle(vs[i - 1], vs[i]);
      if (acc >= G.landStep * DEG) { acc = 0; gDots.push({ kind: 'land', v: vs[i], r: 1.35, appear: 2050 + 450 * (li / coasts.length) }); }
    }
  });
  // layers: grid lines, grid dots, coast lines, coast dots; each kind's lines are four paths, one per opacity step
  const BUCKETS = [0.25, 0.5, 0.75, 1];
  const gPaths = {};
  ['grid', 'land'].forEach(kind => {
    gPaths[kind] = BUCKETS.map(() => mk('path', 'g-line g-' + kind, globeG));
    gDots.filter(d => d.kind === kind).forEach(d => { d.el = mk('circle', 'g-dot k-' + kind, globeG); d.o = {}; });
  });
  const gHit = mk('circle', 'globe-hit', globeG);   // the drag and keyboard target (focusable once the drawing is done)
  gHit.setAttribute('cx', G.cx); gHit.setAttribute('cy', G.cy); gHit.setAttribute('r', G.r + 2);
  gHit.setAttribute('role', 'slider'); gHit.setAttribute('aria-label', 'Interactive globe. Use arrow keys or drag to rotate.');
  gHit.setAttribute('aria-valuemin', '-180'); gHit.setAttribute('aria-valuemax', '180'); gHit.setAttribute('tabindex', '-1');
  // the view: rotation and tilt (radians), and the projection's centre and radius (they grow from the seed in the intro)
  const view = { cr: 1, sr: 0, ct: 1, st: 0, cx: G.cx, cy: G.cy, R: G.r };
  const setView = (rot, tilt, cx, cy, R) => Object.assign(view, { cr: Math.cos(rot), sr: Math.sin(rot), ct: Math.cos(tilt), st: Math.sin(tilt), cx, cy, R });
  const proj = (v, o) => {
    const x = v[0] * view.cr + v[2] * view.sr, z0 = v[2] * view.cr - v[0] * view.sr;
    const y = v[1] * view.ct - z0 * view.st;
    o.z = v[1] * view.st + z0 * view.ct; o.x = view.cx + view.R * x; o.y = view.cy - view.R * y;
    o.a = o.z <= 0 ? 0 : o.z >= FADE ? 1 : (u => u * u * (3 - 2 * u))(o.z / FADE);
    return o;
  };
  const setAttr = (el, cache, k, v) => { if (cache[k] !== v) { el.setAttribute(k, v); cache[k] = v; } };
  // the interactive state: rot/tilt now, the spin left over from a drag (vel, radians per ms), a keyboard turn still to
  // ease out (keyLeft), and when the idle turn may resume
  const AUTO = still ? 0 : Math.PI * 2 / (G.revSeconds * 1000);   // radians per ms
  const TILT_MAX = G.tiltMax * DEG;
  const gs = { rot: G.rot0 * DEG, tilt: G.tilt0 * DEG, vel: 0, keyLeft: 0, dragging: false, hover: false, focus: false, resumeAt: 0, autoK: 0, dirty: false };
  let globeLive = false;   // draggable and focusable once the intro is done
  const gAnchors = [];   // entries pinned to the globe (step 3)
  let tipOwner = null;
  function drawGlobe(t) {
    // the intro: the globe grows out of the seed (centre rising from the seed, radius growing), spinning into place;
    // coastlines fade in, then the grid
    const live = t >= S.total, u = live ? 1 : clamp01((t - S.globe[0]) / 700), e = 1 - Math.pow(1 - u, 3);
    const spin = live ? 0 : (1 - (u => 1 - Math.pow(1 - u, 3))(clamp01((t - S.globe[0]) / 1500))) * 1.7;
    const R = G.r * (0.08 + 0.92 * e);
    setView(live ? gs.rot : G.rot0 * DEG - spin, live ? gs.tilt : G.tilt0 * DEG, G.cx, SY + (G.cy - SY) * e, R);
    const kindA = { land: live ? 1 : clamp01((t - 2000) / 450), grid: live ? 1 : clamp01((t - 2300) / 500) };
    globeG.style.visibility = t >= S.globe[0] ? 'visible' : 'hidden';
    const q = {}, p0 = {};
    ['grid', 'land'].forEach(kind => {
      const d = BUCKETS.map(() => []), A = kindA[kind];
      gLines.forEach(L => {
        if (L.kind !== kind) return;
        let lastB = -1;
        L.vs.forEach((v, i) => {
          proj(v, q);
          if (i) {
            const a = Math.min(p0.a, q.a);
            if (a > 0.04) {
              const b = a > 0.75 ? 3 : a > 0.5 ? 2 : a > 0.25 ? 1 : 0;
              if (b !== lastB) d[b].push(`M${p0.x.toFixed(1)} ${p0.y.toFixed(1)}`);
              d[b].push(`L${q.x.toFixed(1)} ${q.y.toFixed(1)}`);
              lastB = b;
            } else lastB = -1;
          }
          p0.x = q.x; p0.y = q.y; p0.a = q.a;
        });
      });
      gPaths[kind].forEach((path, b) => { path.setAttribute('d', d[b].join('') || 'M0 0'); path.style.opacity = (BUCKETS[b] * A).toFixed(2); });
    });
    gDots.forEach(dot => {
      proj(dot.v, q);
      const a = q.a * kindA[dot.kind], sc = live ? 1 : pop((t - dot.appear) / 180);
      if (a < 0.03 || sc <= 0) { setAttr(dot.el, dot.o, 'visibility', 'hidden'); return; }
      setAttr(dot.el, dot.o, 'visibility', 'visible');
      setAttr(dot.el, dot.o, 'cx', q.x.toFixed(1)); setAttr(dot.el, dot.o, 'cy', q.y.toFixed(1));
      setAttr(dot.el, dot.o, 'r', (dot.r * sc).toFixed(2)); setAttr(dot.el, dot.o, 'opacity', a.toFixed(2));
    });
    gAnchors.forEach(p => {   // pinned entries: placed, faded near the edge; clickable and in the tab order only on the near side
      proj(p.v, q);
      p.x = q.x + p.off[0]; p.y = q.y + p.off[1];
      setAttr(p.pin, p.c, 'cx', q.x.toFixed(1)); setAttr(p.pin, p.c, 'cy', q.y.toFixed(1));
      if (p.leader) { setAttr(p.leader, p.c, 'x1', q.x.toFixed(1)); setAttr(p.leader, p.c, 'y1', q.y.toFixed(1)); setAttr(p.leader, p.c, 'x2', p.x.toFixed(1)); setAttr(p.leader, p.c, 'y2', p.y.toFixed(1)); }
      ['hit', 'node'].forEach(k => { setAttr(p[k], p.c[k] || (p.c[k] = {}), 'cx', p.x.toFixed(1)); setAttr(p[k], p.c[k], 'cy', p.y.toFixed(1)); });
      setAttr(p.link, p.c, 'opacity', q.a.toFixed(2));
      setAttr(p.link, p.c, 'visibility', q.a > 0.02 ? 'visible' : 'hidden');
      const near = live && globeLive && q.z > 0.2;
      if (near !== p.near) {
        p.near = near;
        p.link.style.pointerEvents = near ? '' : 'none';
        if (near) p.link.removeAttribute('tabindex'); else p.link.setAttribute('tabindex', '-1');
        if (!near && document.activeElement === p.link) gHit.focus({ preventScroll: true });   // never leave focus on a hidden pin
      }
      if (tipOwner === p) { if (near) { tip.style.left = (p.x / W * 100) + '%'; tip.style.top = (p.y / H * 100) + '%'; } else hideTip(); }
    });
    if (live) {   // the slider's value: the longitude facing the viewer
      const lon = Math.round((((-gs.rot / DEG) % 360) + 540) % 360 - 180);
      if (lon !== gs.lon) {
        gs.lon = lon; gHit.setAttribute('aria-valuenow', lon);
        gHit.setAttribute('aria-valuetext', `Centred on longitude ${Math.abs(lon)}° ${lon < 0 ? 'west' : lon > 0 ? 'east' : ''}`.trim());
      }
    }
  }
  // advances the interactive state by dt ms; true when the globe moved
  function stepGlobe(dt, now) {
    let moved = gs.dirty; gs.dirty = false;
    if (gs.dragging) return moved;
    if (gs.keyLeft) {
      const d = still ? gs.keyLeft : gs.keyLeft * Math.min(1, dt / 110);
      gs.rot += d; gs.keyLeft -= d; if (Math.abs(gs.keyLeft) < 1e-4) gs.keyLeft = 0; moved = true;
    }
    if (gs.vel) { gs.rot += gs.vel * dt; gs.vel *= Math.exp(-dt / 320); if (Math.abs(gs.vel) < 3e-6) gs.vel = 0; moved = true; }
    const autoOn = AUTO && !gs.hover && !gs.focus && now >= gs.resumeAt;
    gs.autoK = autoOn ? Math.min(1, gs.autoK + dt / 1500) : 0;   // eases back in when it resumes
    if (gs.autoK) { gs.rot += AUTO * gs.autoK * gs.autoK * dt; moved = true; }
    return moved;
  }
  const globeBusy = () => globeLive && (gs.dragging || gs.dirty || !!gs.vel || !!gs.keyLeft || !!AUTO);

  // 3. anchors: entries on the hands take the nearest free dot on a main or detail line; entries on the globe are pinned
  //    at their coordinates and turn with it
  const rows = teaser ? [] : [...IMPACT.map(r => ({ ...r, anchor: 'impact-' + r.id })), ...IMPACT_COMMITMENTS.map(r => ({ ...r, anchor: 'commit-' + r.id }))];
  const taken = new Set(), placed = [];
  rows.forEach(r => {
    const ga = C.globeAnchors[r.id];
    if (ga) {
      const off = ga.off || [0, 0];
      placed.push({ row: r, globe: true, v: vec(ga.at[0], ga.at[1]), off, x: G.cx, y: G.cy, group: { el: globeG }, c: {}, near: null, hasLeader: Math.hypot(off[0], off[1]) > 1 });
      return;
    }
    const at = C.anchors[r.id]; if (!at) return;
    let best = -1, bd = Infinity;
    pts.forEach((p, i) => { if (!p.canAnchor || taken.has(i)) return; const d = (p.x - at[0]) ** 2 + (p.y - at[1]) ** 2; if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { taken.add(best); pts[best].row = r; placed.push(pts[best]); }
  });

  // 4. the seed, then the anchors as links above the drawing (hovering one lights its line)
  const seedRing = mk('circle', 'c-seed-ring'), seed = mk('circle', 'c-seed');
  seed.setAttribute('r', 3.4); seedRing.setAttribute('r', 3.4);
  const tip = impactEl('div', 'constellation-tip'); tip.setAttribute('aria-hidden', 'true');
  holder.appendChild(tip);
  const hideTip = () => { if (tipOwner) tipOwner.group.el.classList.remove('is-lit'); tipOwner = null; tip.classList.remove('is-on'); };
  const anchors = [];
  placed.forEach(p => {
    const r = p.row, a = mk('a', 'constellation-node' + (p.globe ? ' is-globe' : ''));
    a.setAttribute('href', '#' + r.anchor); a.setAttribute('aria-label', `${r.org}: jump to its ${r.since !== undefined ? 'commitment' : 'case study'}`);
    if (p.globe) {   // the pin at the real coordinates, and a leader out to the entry's dot
      if (p.hasLeader) p.leader = mk('line', 'c-leader', a);
      p.pin = mk('circle', 'c-pin', a); p.pin.setAttribute('r', 1.9);
      gAnchors.push(p);
    } else p.el.style.display = 'none';   // the anchor's large dot stands in for the small one
    p.hit = mk('circle', 'node-hit', a); p.hit.setAttribute('r', p.globe ? 9 : 14); p.hit.setAttribute('cx', p.x.toFixed(1)); p.hit.setAttribute('cy', p.y.toFixed(1));
    p.node = mk('circle', 'node-dot', a); p.node.setAttribute('r', (4.2 + 0.9 * Math.sqrt(Math.max(0, r.years || 0))).toFixed(1));
    p.node.setAttribute('cx', p.x.toFixed(1)); p.node.setAttribute('cy', p.y.toFixed(1));
    p.node.style.animationDelay = (anchors.length * 45) + 'ms';
    p.link = a;
    const show = on => {
      if (!on) { if (tipOwner === p) hideTip(); return; }
      if (gs.dragging || (p.globe && !p.near)) return;
      hideTip(); tipOwner = p;
      p.group.el.classList.add('is-lit'); tip.classList.add('is-on');
      tip.textContent = r.org; tip.style.left = (p.x / W * 100) + '%'; tip.style.top = (p.y / H * 100) + '%';
    };
    a.addEventListener('mouseenter', () => { show(true); if (p.globe) gs.hover = true; });   // the globe holds still under the pointer
    a.addEventListener('mouseleave', () => { show(false); if (p.globe) gs.hover = false; });
    a.addEventListener('focus', () => show(true)); a.addEventListener('blur', () => show(false));
    a.addEventListener('click', e => {
      e.preventDefault(); show(false);
      const el = document.getElementById(r.anchor); if (!el) return;
      scrollToSection(el, 24); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true });
    });
    anchors.push(a);
  });
  // the anchors (and the globe) join the tab order only once the drawing is complete; pins on the globe's far side stay out
  const setAnchorsLive = live => {
    live = live && !teaser;   // the teaser's globe stays still
    globeLive = live; svg.classList.toggle('is-globe-live', live);
    gHit.setAttribute('tabindex', live ? '0' : '-1');
    placed.forEach(p => { if (p.globe) p.near = null; else if (live) p.link.removeAttribute('tabindex'); else p.link.setAttribute('tabindex', '-1'); });
  };

  // 5. the dove: the nav logo's vector dove, positioned over the drawing in the drawing's own units
  const bird = document.createElement('button');
  bird.type = 'button'; bird.className = 'const-bird';
  if (teaser) { bird.setAttribute('aria-hidden', 'true'); bird.tabIndex = -1; bird.classList.add('is-teaser'); }
  else bird.setAttribute('aria-label', 'Replay the constellation animation');
  holder.appendChild(bird);
  const dove = mountDove(bird, { hoverEl: null });
  const doveSvg = dove && dove.svg;
  const BIRD_W = phone ? 36 : 48, BIRD_FOOT = [0.6, 0.8];   // the point of the dove (share of its box) that perches
  // perch on the sprout's highest dot (just above it, so the dot and its link stay visible and clickable)
  // (the tip can fall between two sampled dots at the same height: take the middle of the highest ones)
  const topY = Math.min(...pts.map(q => q.y)), tops = pts.filter(q => q.y < topY + 1);
  const PERCH = [tops.reduce((a, q) => a + q.x, 0) / tops.length, topY - 5], HOVER = [SX, C.seed[1] - 58], HOLD = [PERCH[0] + 34, PERCH[1] - 34];
  const ease = { out: x => 1 - Math.pow(1 - x, 3), inOut: x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, in2: x => x * x,
    back: x => { const c1 = 1.4, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); } };
  // the flight in: an invisible path from the hero's left edge to the hover point above the palms
  const flight = mk('path', 'c-flight');
  const flightPath = () => {
    const sr = svg.getBoundingClientRect(), hr = (holder.closest('.hero') || holder).getBoundingClientRect();
    const sx = (hr.left - sr.left) * W / sr.width - 30;
    flight.setAttribute('d', `M ${sx.toFixed(1)},${H * 0.22} C ${(sx * 0.45).toFixed(1)},${H * 0.05} ${HOVER[0] - 150},${HOVER[1] - 70} ${HOVER[0]},${HOVER[1]}`);
    return flight.getTotalLength();
  };
  let flightLen = flightPath();
  window.addEventListener('resize', () => { flightLen = flightPath(); });
  const placeBird = (x, y, flap) => {
    // measured on screen, applied inside the holder: divide by the page's content zoom (screen px per CSS px), read
    // off the dove's own box (its CSS width is BIRD_W)
    const bh = BIRD_W * 1338 / 1486;
    bird.style.width = BIRD_W + 'px'; bird.style.height = bh + 'px';
    const sr = svg.getBoundingClientRect(), hr = holder.getBoundingClientRect(), z = bird.getBoundingClientRect().width / BIRD_W || 1;
    const k = sr.width / W / z;
    bird.style.transform = `translate(${((sr.left - hr.left) / z + x * k - BIRD_W * BIRD_FOOT[0]).toFixed(1)}px, ${((sr.top - hr.top) / z + y * k - bh * BIRD_FOOT[1]).toFixed(1)}px)`;
    if (doveSvg) doveSvg.classList.toggle('is-flapping', !!flap);
  };

  // 6. one frame of the sequence at time t (ms of the sequence, unscaled; S.total and after is the finished drawing)
  let drift = 0, tIdle = 0;
  function render(t) {
    groups.forEach(gp => {   // each line draws on; while idle, each part drifts as a whole
      const u = clamp01((t - gp.t0) / (gp.t1 - gp.t0));
      gp.path.style.strokeDashoffset = (1 - u).toFixed(4);
      gp.path.style.visibility = u > 0 ? 'visible' : 'hidden';
      const tf = drift && !gp.fixed ? `translate(${(Math.sin(tIdle * gp.w + gp.ph) * drift).toFixed(2)} ${(Math.cos(tIdle * gp.w * 1.3 + gp.ph) * drift).toFixed(2)})` : '';
      if (tf !== gp.tf) { gp.el.setAttribute('transform', tf); gp.tf = tf; }
    });
    pts.forEach(p => {   // dots pop in as their line reaches them
      const sc = pop((t - p.appear) / 180);
      if (sc !== p.sc) { p.el.setAttribute('r', (p.r * sc).toFixed(2)); p.sc = sc; }
      if (p.link && p.group.tf !== p.ltf) { p.link.setAttribute('transform', p.group.tf); p.ltf = p.group.tf; }
    });
    drawGlobe(t);
    // the seed: falls with gravity, a small bounce, a glow ring, then fades into the globe
    let sy = -999, so = 0;
    if (t >= S.seedFall[0]) {
      const fromY = HOVER[1] + 6;
      if (t < S.seedFall[1]) { sy = fromY + (SY - fromY) * ease.in2((t - S.seedFall[0]) / (S.seedFall[1] - S.seedFall[0])); }
      else if (t < S.seedBounce[1]) { const b = (t - S.seedBounce[0]) / (S.seedBounce[1] - S.seedBounce[0]); sy = SY - Math.sin(Math.PI * b) * 7; }
      else sy = SY;
      so = t < 2100 ? 1 : clamp01(1 - (t - 2100) / 400);
    }
    seed.setAttribute('cx', SX); seed.setAttribute('cy', sy.toFixed(1)); seed.style.opacity = so;
    const g = clamp01((t - S.glow[0]) / (S.glow[1] - S.glow[0]));
    seedRing.setAttribute('cx', SX); seedRing.setAttribute('cy', SY); seedRing.setAttribute('r', (3.4 + 16 * ease.out(g)).toFixed(1));
    seedRing.style.opacity = t >= S.glow[0] && g < 1 ? (0.7 * (1 - g)).toFixed(2) : 0;
    // the dove
    let bx, by, flap = false;
    if (t < S.fly[1]) {
      const q = flight.getPointAtLength(flightLen * ease.out(clamp01(t / S.fly[1])));
      bx = q.x; by = q.y; flap = true;
    } else if (t < S.rise[0]) {   // hovering while the seed drops
      bx = HOVER[0]; by = HOVER[1] + Math.sin((t - S.plant[0]) / 70) * 1.5; flap = true;
    } else if (t < S.rise[1]) {   // rising out of the way, gliding the last stretch
      const u = ease.inOut((t - S.rise[0]) / (S.rise[1] - S.rise[0]));
      bx = HOVER[0] + (HOLD[0] - HOVER[0]) * u; by = HOVER[1] + (HOLD[1] - HOVER[1]) * u - Math.sin(Math.PI * u) * 30; flap = u < 0.55;
    } else if (t < S.perch[0]) {   // waiting above the sprout
      bx = HOLD[0]; by = HOLD[1] + Math.sin((t - S.rise[1]) / 260) * 2;
    } else {   // perching, with a soft settle
      const u = clamp01((t - S.perch[0]) / (S.perch[1] - S.perch[0])), v = ease.back(u);
      bx = HOLD[0] + (PERCH[0] - HOLD[0]) * v; by = HOLD[1] + (PERCH[1] - HOLD[1]) * v;
    }
    if (teaser) { bx = PERCH[0]; by = PERCH[1]; flap = false; bird.style.opacity = t >= S.perch[0] ? 1 : 0; }   // the teaser's dove is simply there, on the sprout
    placeBird(bx, by, flap);
    svg.classList.toggle('is-settled', t >= S.anchors[0]);
  }

  // 7. run: the sequence (or the finished state), then idle; paused while hidden or off screen
  const rnd = (a, b) => a + Math.random() * (b - a);
  groups.forEach(gp => { gp.ph = rnd(0, Math.PI * 2); gp.w = rnd(0.0006, 0.0011); });
  const idleMotion = !still && !phone && !teaser;
  let seqT = 0, mode = 'idle', nextTwinkle = 0, perched = false;
  const finishState = () => {
    seqT = S.total; mode = 'idle'; drift = 0;
    setAnchorsLive(true); render(S.total); svg.classList.add('is-settled');
    if (!teaser) { bird.classList.add('is-perched'); bird.tabIndex = 0; }
    if (still) svg.classList.add('is-still');
    // the drawing is complete (its sequence ended, or it started finished): tell the page (the Highlights wait for it)
    holder.dataset.drawn = '1'; holder.dispatchEvent(new CustomEvent('constellation:done', { bubbles: true }));
  };
  // one frame (the shared DoveKit ticker calls it, paused while the tab is hidden or the drawing is off screen);
  // returns false when there's nothing left to animate
  const frame = (dt, now) => {
    try {
      if (mode === 'seq') {
        seqT += dt / K;
        render(Math.min(seqT, S.total));
        if (!perched && seqT >= S.perch[1]) { perched = true; if (dove) dove.flutter(); }   // a small fold on landing
        if (seqT >= S.total) { mode = 'idle'; finishState(); }
      } else {
        const turned = globeLive && stepGlobe(dt, now);
        if (idleMotion) {
          tIdle += dt; drift = Math.min(1, tIdle / 800) * 1.5; render(S.total);
          if (tIdle > nextTwinkle) {
            nextTwinkle = tIdle + rnd(1100, 2200);
            const plain = pts.filter(p => !p.row && p.size !== 'ring');
            for (let n = 0; n < 2; n++) { const p = plain[Math.floor(Math.random() * plain.length)]; p.el.classList.remove('twinkle'); void p.el.getBBox; p.el.classList.add('twinkle'); setTimeout(() => p.el.classList.remove('twinkle'), 1600); }
          }
        } else if (turned) drawGlobe(S.total);
        if (!idleMotion && !globeBusy()) return false;
      }
      return true;
    } catch (e) { console.error('Constellation animation failed; showing it finished', e); finishState(); return false; }
  };
  const tk = DoveKit.ticker(frame, { el: svg }), run = tk.start, stop = tk.stop;

  // 8. turning the globe: drag (mouse, pen or a horizontal touch drag; vertical swipes still scroll the page, see
  //    touch-action in the CSS), with a little spin left over on release; arrow keys when it's focused. The idle turn
  //    pauses while dragging and resumes ~3s after.
  const fit = () => {   // the drawing's scale on screen (px per drawing unit) and its top-left corner
    const b = svg.getBoundingClientRect(), k = Math.min(b.width / W, b.height / H);
    return { k, left: b.left + (b.width - W * k) / 2, top: b.top + (b.height - H * k) / 2 };
  };
  let drag = null, suppressClickUntil = 0;
  const endDrag = e => {
    if (!drag || (e && e.pointerId !== drag.id)) return;
    if (drag.moved) {
      const stale = e && e.type === 'pointerup' && performance.now() - drag.t > 90;   // held still before letting go: no spin
      gs.vel = still || stale || !e || e.type === 'pointercancel' ? 0 : Math.max(-0.008, Math.min(0.008, drag.v));
      gs.dragging = false; gs.resumeAt = performance.now() + 3000;
      suppressClickUntil = performance.now() + 300;   // the click that ends a drag doesn't open a pin
      document.documentElement.classList.remove('globe-grabbing'); svg.classList.remove('is-grabbing');
      run();
    }
    drag = null;
  };
  svg.addEventListener('pointerdown', e => {
    if (!globeLive || drag || (e.pointerType === 'mouse' && e.button !== 0)) return;
    const f = fit(), x = (e.clientX - f.left) / f.k, y = (e.clientY - f.top) / f.k;
    if (Math.hypot(x - G.cx, y - G.cy) > G.r + 6) return;   // only on the globe
    drag = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t: performance.now(), k: f.k, moved: false, v: 0 };
    if (e.pointerType === 'mouse') e.preventDefault();   // no text selection
  });
  window.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.moved) {
      if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 4) return;   // a tap or click, not a drag (yet)
      drag.moved = true; gs.dragging = true; gs.vel = 0; gs.keyLeft = 0; gs.autoK = 0; hideTip();
      document.documentElement.classList.add('globe-grabbing'); svg.classList.add('is-grabbing');
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
      run();
    }
    const now = performance.now(), per = 1 / (G.r * drag.k);   // radians per screen px: the surface follows the pointer
    const dRot = (e.clientX - drag.x) * per, dt = Math.max(1, now - drag.t);
    gs.rot += dRot;
    gs.tilt = Math.max(-TILT_MAX, Math.min(TILT_MAX, gs.tilt + (e.clientY - drag.y) * per));
    drag.v = drag.v * 0.5 + (dRot / dt) * 0.5;
    drag.x = e.clientX; drag.y = e.clientY; drag.t = now;
    gs.dirty = true; run();
  });
  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);
  window.addEventListener('blur', () => endDrag(null));
  svg.addEventListener('click', e => { if (performance.now() < suppressClickUntil) { e.preventDefault(); e.stopPropagation(); } }, true);
  svg.addEventListener('dragstart', e => e.preventDefault());
  gHit.addEventListener('keydown', e => {
    if (!globeLive || (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight')) return;
    e.preventDefault();
    gs.keyLeft += (e.key === 'ArrowRight' ? 1 : -1) * 15 * DEG; gs.vel = 0; gs.resumeAt = performance.now() + 3000;
    gs.dirty = true; run();
  });
  // the idle turn holds while anything in the drawing has keyboard focus
  svg.addEventListener('focusin', () => { gs.focus = true; });
  svg.addEventListener('focusout', () => setTimeout(() => { gs.focus = svg.contains(document.activeElement); if (!gs.focus) { gs.resumeAt = performance.now() + 1000; run(); } }, 0));

  const play = () => {
    if (still) return finishState();
    endDrag(null); hideTip();
    seqT = 0; perched = false; mode = 'seq'; svg.classList.remove('is-settled'); setAnchorsLive(false);
    gs.rot = G.rot0 * DEG; gs.tilt = G.tilt0 * DEG; gs.vel = 0; gs.keyLeft = 0; gs.autoK = 0; gs.resumeAt = 0;
    bird.classList.remove('is-perched'); bird.tabIndex = -1;
    stop(); run();
  };
  bird.addEventListener('click', () => { if (bird.classList.contains('is-perched')) play(); });   // Enter / Space click it too
  window.addEventListener('resize', () => { if (mode !== 'seq') render(S.total); });
  if (teaser && !still) {   // drawn in from the hands on, once, when it comes into view
    render(S.hands[0] - 1);
    DoveKit.inViewOnce(holder, () => { seqT = S.hands[0] - 50; perched = true; mode = 'seq'; stop(); run(); }, { threshold: 0.35 });
  } else if (replay && !still) play(); else { finishState(); run(); }
  // fail-safe: if the sequence is still running long after it should have ended (and the page is visible), finish it
  if (!teaser) setTimeout(() => { if (mode === 'seq' && !document.hidden) finishState(); }, (S.total / 1000 * K + 3) * 1000);
}

// The /impact page's "Highlights" carousel (its own section right under the hero): one card per organization, in this
// order. Each card: the organization's logo on a cream tile (or a monogram until the logo file is added), the
// organization (serif), its type of nonprofit (small gold label), an optional distinction line, my role (a pill), one
// line about the work, and a link to its detailed row further down the page (target: that row's id).
//   logo         the logo file. Logos go in /public/logos/ (see the IMAGES notes at the top). Empty: a monogram of the
//                organization's initials stands in, in the same tile.
//   logoClass    optional extra class on the logo box, e.g. 'is-roomy' (smaller, with more breathing room)
//   lockup       optional: the logo file is just the icon, and these lines of the name are set beside it as text (a
//                horizontal lockup), e.g. ['Harvest Time', 'Church']
//   distinction  optional one-line credibility statement shown under the type; leave it '' and no line is drawn
const IMPACT_HIGHLIGHTS = [
  { org: 'Community Preservation Corporation', type: 'Nonprofit affordable housing lender',
    distinction: 'The #1 CDFI in the U.S. for multifamily affordable housing',
    role: 'Summer Analyst', logo: '../public/logos/cpc-trim.png', logoClass: 'is-roomy',
    line: 'Monitored a $353M portfolio of 10,000+ units and supported 35,000+ rent-regulated units.', target: 'impact-cpc' },
  { org: 'Pathways Inc.', type: 'Nonprofit behavioral health services', distinction: '',
    role: 'Summer Intern', logo: '../Assets/img/pathways-logo-trim.png',
    line: 'Built one-on-one relationships with 15+ residents and led 10+ workshops on independence and daily living skills.', target: 'impact-pathways-inc' },
  { org: 'Operation Smile', type: 'Global health nonprofit', distinction: '',
    role: 'Fundraising Volunteer (2014 – Present)', logo: '../operationsmile-trim.png',   // (files in the site's root, margins trimmed; the path is relative to /impact/)
    line: 'Raised $75,000+ toward free cleft lip and palate surgeries for 250+ children without access to care.', target: 'commit-operation-smile' },
  { org: 'Harvest Time Church', type: 'Faith-based youth ministry', distinction: '',
    role: 'VBS Camp Counselor (2019 – 2024)', logo: '../harvesttimechurch-icon.png', lockup: ['Harvest Time', 'Church'],   // the icon, with the name set beside it as text
    line: 'Mentored campers ages 4 to 12 in an inclusive, safe, and welcoming environment.', target: 'commit-harvest-time-vbs' },
  { org: 'Grace Community Church', orgNote: 'Feed My Starving Children MobilePack', type: 'Faith-based hunger relief', distinction: '',
    role: 'Volunteer (2024 – Present)', logo: '../gracecommunitychurch-trim.jpg',
    line: 'Packed nutritionally complete meals for children facing hunger around the world.', target: 'commit-grace-community' },
  { org: 'Mothers for Others', type: 'Family support nonprofit, Fairfield County diaper bank',
    distinction: "Fairfield County's largest independent diaper bank",
    role: 'Youth Volunteer', logo: '../mothersforothers-trim.png',
    line: "Recruited and led youth volunteers and accepted the 2023 Proclamation on the organization's behalf.", target: 'commit-mothers-for-others' },
];

// Renders the carousel into holder (the section's eyebrow and heading are in the page's HTML) as a spotlight: the active
// card centred at full size, the previous and next cards scaled down behind it on either side, tucked under its edges
// (phones: the active card only). Every card is the same height, so nothing jumps between slides. Previous / next and
// a dot per card sit in one row below; ←/→ while it has focus and swipe on touch screens move it too. It loops (the side
// cards wrap), never autoplays, and moves without animation under reduced motion. The active card jumps to its detailed
// row; a side card comes to the centre when clicked. Only the active card is in the tab order; the current card is
// announced politely (a visually hidden count).
// A horizontal logo lockup as one small SVG, so it scales inside the logo box exactly like an image logo: the icon file
// on the left and the name as real text on the right (one line per entry of h.lockup). Once the text has its font,
// the viewBox is fitted to the drawing, icon and text sized so the text block is ~85% of the icon's height.
function lockupSvg(h, onFail) {
  const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('class', 'hl-lockup'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `${h.org} logo`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  const IH = 170, IW = 322, GAP = 30, FS = 70, LH = 0.98;   // icon at its file size; text in the same units
  const icon = document.createElementNS(NS, 'image');
  icon.setAttribute('href', h.logo); icon.setAttribute('width', IW); icon.setAttribute('height', IH);
  icon.addEventListener('error', onFail);
  const text = document.createElementNS(NS, 'text'); text.setAttribute('class', 'hl-lockup-text');
  const lines = h.lockup, block = FS * LH * (lines.length - 1), top = (IH - block) / 2 + FS * 0.36;
  lines.forEach((t, k) => {
    const ts = document.createElementNS(NS, 'tspan'); ts.setAttribute('x', IW + GAP); ts.setAttribute('y', (top + k * FS * LH).toFixed(1));
    ts.setAttribute('class', k ? 'hl-lockup-sub' : 'hl-lockup-main'); ts.textContent = t; text.appendChild(ts);
  });
  svg.append(icon, text);
  const fitBox = () => { try { const b = text.getBBox(); if (b.width) svg.setAttribute('viewBox', `0 ${Math.min(0, b.y).toFixed(1)} ${(b.x + b.width + 2).toFixed(1)} ${Math.max(IH, b.y + b.height).toFixed(1)}`); } catch (e) {} };
  svg.setAttribute('viewBox', `0 0 ${IW + GAP + FS * 5.6} ${IH}`);   // a close guess until the text can be measured
  requestAnimationFrame(fitBox); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBox);
  return svg;
}

function renderImpactHighlights(holder) {
  if (!holder || !IMPACT_HIGHLIGHTS.length) return;
  const n = IMPACT_HIGHLIGHTS.length;
  const region = impactEl('div', 'hl');
  region.setAttribute('role', 'region'); region.setAttribute('aria-roledescription', 'carousel'); region.setAttribute('aria-label', 'Highlights');
  const stage = impactEl('ul', 'hl-stage');
  const monogram = org => org.split(/\s+/).filter(w => /^[A-Z]/.test(w)).map(w => w[0]).join('').slice(0, 3);
  let cur = 0;
  const slides = IMPACT_HIGHLIGHTS.map((h, i) => {
    const li = impactEl('li', 'hl-slide');
    li.setAttribute('role', 'group'); li.setAttribute('aria-roledescription', 'slide'); li.setAttribute('aria-label', `${i + 1} of ${n}: ${h.org}`);
    const card = impactEl('a', 'hl-card'); card.href = '#' + h.target;
    // the logo tile: the logo, or a monogram (also if the file fails to load)
    const tile = impactEl('div', 'hl-logo' + (h.logoClass ? ' ' + h.logoClass : ''));   // logoClass: optional per-logo sizing (see .hl-logo.is-roomy)
    const mono = () => { tile.replaceChildren(impactEl('span', 'hl-monogram', monogram(h.org))); tile.classList.add('is-monogram'); tile.setAttribute('aria-hidden', 'true'); };
    if (h.logo) {
      const img = impactEl('img'); img.src = h.logo; img.alt = `${h.org} logo`; img.loading = 'lazy'; img.decoding = 'async'; img.onerror = mono; img.onload = () => fit();
      if (h.lockup) {   // icon on the left, the name as real text on the right
        tile.classList.add('is-lockup');
        tile.appendChild(lockupSvg(h, () => mono()));
      } else tile.appendChild(img);
    }
    else mono();
    card.append(tile, impactEl('h3', 'hl-org', h.org));
    if (h.orgNote) card.appendChild(impactEl('p', 'hl-org-note', h.orgNote));
    card.appendChild(impactEl('p', 'hl-type', h.type));
    if (h.distinction) card.appendChild(impactEl('p', 'hl-distinction', h.distinction));
    card.append(impactEl('span', 'hl-role', h.role), impactEl('p', 'hl-line', h.line));
    const more = impactEl('span', 'hl-more', 'View details'); more.appendChild(impactEl('span', 'hl-more-arrow', ' →')).setAttribute('aria-hidden', 'true');
    card.appendChild(more);
    card.addEventListener('click', e => {
      e.preventDefault();
      if (i !== cur) return go(i);   // a side card comes to the centre
      const el = document.getElementById(h.target); if (!el) return;
      scrollToSection(el, 24); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true });
    });
    li.appendChild(card); stage.appendChild(li);
    return li;
  });
  // the controls, in one centred row under the cards: previous, the dots, next
  const nav = impactEl('div', 'hl-nav');
  const arrow = (dir, label) => { const b = impactEl('button', 'hl-arrow hl-' + dir); b.type = 'button'; b.setAttribute('aria-label', label); b.appendChild(impactIcon(dir === 'prev' ? 'chevron-left' : 'chevron-right')); return b; };
  const prev = arrow('prev', 'Previous highlight'), next = arrow('next', 'Next highlight');
  const dots = impactEl('div', 'hl-dots'); dots.setAttribute('role', 'group'); dots.setAttribute('aria-label', 'Choose a highlight');
  const dotBtns = IMPACT_HIGHLIGHTS.map((h, i) => { const b = impactEl('button', 'hl-dot'); b.type = 'button'; b.setAttribute('aria-label', `Show highlight ${i + 1}: ${h.org}`); b.addEventListener('click', () => go(i)); dots.appendChild(b); return b; });
  nav.append(prev, dots, next);
  const live = impactEl('p', 'sr-only'); live.setAttribute('aria-live', 'polite'); live.setAttribute('aria-atomic', 'true');   // the count, for screen readers only
  region.append(stage, nav, live);
  holder.appendChild(region);

  // every card as tall as the tallest, so the stage never changes height between slides
  function fit() {
    const cards = slides.map(s => s.querySelector('.hl-card'));
    cards.forEach(c => { c.style.height = 'auto'; });
    const h = Math.max(...cards.map(c => c.offsetHeight));
    cards.forEach(c => { c.style.height = h + 'px'; });
    stage.style.height = h + 'px';
  }
  function go(i, announce = true) {
    cur = (i + n) % n;   // loops both ways; the side cards wrap with it
    slides.forEach((s, k) => {
      const d = (k - cur + n) % n, pos = d === 0 ? 0 : d === 1 ? 1 : d === n - 1 ? -1 : null;
      s.dataset.pos = pos === null ? 'off' : String(pos);
      s.setAttribute('aria-hidden', pos === 0 ? 'false' : 'true');
      s.querySelector('.hl-card').tabIndex = pos === 0 ? 0 : -1;
    });
    dotBtns.forEach((b, k) => { if (k === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
    if (announce) live.textContent = `Highlight ${cur + 1} of ${n}: ${IMPACT_HIGHLIGHTS[cur].org}`;
  }
  prev.addEventListener('click', () => go(cur - 1));
  next.addEventListener('click', () => go(cur + 1));
  region.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(cur - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); go(cur + 1); }
  });
  // swipe: a horizontal drag of 40px+ on the cards (vertical swipes still scroll the page)
  let sx = null, sy = 0;
  stage.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') { sx = e.clientX; sy = e.clientY; } });
  stage.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) { go(cur + (dx < 0 ? 1 : -1)); stage.dataset.swiped = '1'; setTimeout(() => delete stage.dataset.swiped, 50); }
  });
  stage.addEventListener('pointercancel', () => { sx = null; });
  stage.addEventListener('click', e => { if (stage.dataset.swiped) { e.preventDefault(); e.stopPropagation(); } }, true);   // a swipe isn't a tap on a card
  window.addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  go(0, false); fit();
}

// Search entries for every case study and commitment. go(anchorId) takes the visitor there.
function impactSearchItems(go) {
  return [
    ...IMPACT.map(c => ({ group: 'Impact', label: c.org, hint: c.tag, keywords: `${c.orgNote || ''} ${c.story || ''} ${c.problem || ''} ${c.did || ''} ${c.stat || ''} ${c.statLabel || ''}`, run: () => go('impact-' + c.id) })),
    ...IMPACT_COMMITMENTS.map(c => ({ group: 'Impact', label: c.org, hint: c.since ? `${c.role} · since ${c.since}` : c.role, keywords: `${c.tag} ${c.orgNote || ''} ${c.line} long-term commitments`, run: () => go('commit-' + c.id) })),
  ];
}
