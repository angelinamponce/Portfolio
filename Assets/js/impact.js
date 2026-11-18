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
    did: 'Co-founded a student-run engineering org. Direct the executive board and 4 project divisions delivering workshops and product work for 100+ students.',
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
const IMPACT_COMMITMENTS = [   // most recent first; the image side keeps zigzagging on from the case studies
  {
    id: 'grace-community',
    years: 2,   // years of involvement, sizes this row's dot in the hero constellation: since 2024
    caption: '',
    tag: 'Food Security',
    role: 'Volunteer',
    org: 'Grace Community Church, Feed My Starving Children MobilePack',
    since: '2024',
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
    // the slot shows a 62% band of this photo's height; centre 46% keeps the "Town of Greenwich" lettering (23–31%),
    // all four people and the Proclamation (60–78%) in frame. The original is 1290px wide (the -1600 file is not upscaled).
    image: '/Assets/img/mothers-for-others-photo-800.jpg', position: 'center 46%', overlay: false,
    srcset: '/Assets/img/mothers-for-others-photo-800.jpg 800w, /Assets/img/mothers-for-others-photo-1600.jpg 1290w',
    alt: 'Angelina and fellow volunteers at Greenwich Town Hall receiving the 2023 Proclamation honoring Mothers for Others.',
  },
  {
    id: 'greenwich-first-selectman',
    years: null,   // years of involvement, sizes this row's dot in the hero constellation: set it with the start year
    caption: '',
    tag: 'Civic Engagement',
    role: 'Intern & Volunteer',
    org: 'Office of the First Selectman, Town of Greenwich',
    since: null,   // TODO: the start year. Rows with no year show no "Since" stat until it's filled in.
    line: "Supported community outreach in the First Selectman's office, including engagement with Greenwich's Latino residents, and volunteer each year at the town's Independence Day celebration.",
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
    since: '2019',
    line: 'Mentor and support youth each summer, creating an inclusive, safe environment for every camper.',
    image: '/Assets/img/harvest-time-photo-800.jpg', position: 'center 30%', overlay: false,
    srcset: '/Assets/img/harvest-time-photo-800.jpg 800w, /Assets/img/harvest-time-photo-1600.jpg 1600w',   // portrait: both faces and the SCUBA screen stay in frame; the name tag is retouched out of the file
    alt: 'Angelina with a fellow counselor at Harvest Time Church Vacation Bible School.',
  },
  {
    id: 'operation-smile',
    years: 12,   // years of involvement, sizes this row's dot in the hero constellation: since 2014
    caption: '',
    tag: 'Global Health',
    role: 'Fundraising Volunteer',
    org: 'Operation Smile',
    since: '2014',
    line: 'Raising funds toward free cleft lip and palate surgeries for 250+ children without access to care.',
    // landscape, wider than 4:3: the sides are trimmed. 'right center' shifts as far right as the photo allows, which
    // puts the child's face (62% across the source) at ~55% of the slot, with the photo she holds still in frame.
    image: '/Assets/img/operation-smile-photo-800.jpg', position: 'right center', overlay: false,
    srcset: '/Assets/img/operation-smile-photo-800.jpg 800w, /Assets/img/operation-smile-photo-1600.jpg 894w',   // source is 894px wide
    alt: 'A child smiling, representing the patients Operation Smile serves.',
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
  const frame = impactEl('div', 'impact-frame');   // the offset gold frame behind the image
  frame.appendChild(shot);
  media.appendChild(frame);
  if (shot.classList.contains('is-cover')) shot.classList.add('has-parallax');   // photos drift on scroll; logos/art don't
  if (caption) media.appendChild(impactEl('p', 'impact-caption', caption));
  return media;
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
    body.append(impactEl('h' + headingLevel, 'impact-focus', tag), impactEl('p', 'impact-org', org));
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
  IMPACT_COMMITMENTS.forEach(({ id, tag, role, org, orgNote, since, line, image, alt, fit, position, overlay, srcset, full, description }) => {
    const item = impactEl('article', 'timeline-item impact-tl-item reveal');
    item.id = 'commit-' + id;
    const dot = impactEl('div', 'timeline-dot'); dot.setAttribute('aria-hidden', 'true');
    const body = impactEl('div', 'impact-tl-body');
    body.appendChild(dot);   // inside the text column, so it lines up with the year whether the photo is beside or above
    if (since) body.appendChild(impactEl('p', 'impact-tl-year', since));
    body.append(impactEl('h' + headingLevel, 'impact-focus', tag), impactEl('p', 'impact-org', org),
      impactEl('p', 'impact-org-note', [role, orgNote].filter(Boolean).join(' · ')), impactEl('p', 'impact-commit-line', line));
    item.append(body);
    // the timeline photo loads the -800 file (image); the lightbox still opens the largest file in srcset (or full)
    const largest = srcset ? srcset.split(',').map(e => e.trim().split(/\s+/)).sort((x, y) => parseInt(y[1]) - parseInt(x[1]))[0][0] : image;
    const shot = impactShot({ image, alt, fit, position, overlay, full: full || largest, description });
    if (shot) { const th = impactEl('div', 'impact-tl-thumb'); th.appendChild(shot); item.appendChild(th); item.classList.add('has-thumb'); }
    tl.appendChild(item);
  });
  wrap.append(label, tl);
  container.appendChild(wrap);
  if (typeof initTimeline === 'function') initTimeline(tl);
}

// ── Hero constellation: an original line drawing (two cupped hands holding a globe, a three-leaf sprout on top, small
// circuit traces at the fingertips) drawn as a gold dot-and-line constellation in the homepage hero motif's style.
// Each path below is sampled into evenly spaced dots, and consecutive dots are joined by thin lines. The nine Impact
// entries are larger "anchor" dots on the drawing: hover or focus one for the organization, click / Enter to jump to
// its row. Coordinates are in a 400 × 440 box.
const IMPACT_CONSTELLATION = {
  dots: 128,   // roughly how many dots the whole outline is sampled into
  paths: [
    { d: 'M295,205 A95,95 0 1,1 105,205 A95,95 0 1,1 295,205 Z', closed: true, grow: { at: [1800, 2250], from: 'seed' } },   // the globe
    { d: 'M138,150 C160,132 196,138 206,154 C214,168 236,166 240,184 C244,204 222,206 214,222 C206,240 186,232 178,246 C170,262 150,252 152,234 C154,216 132,212 128,194 C124,176 126,160 138,150 Z', closed: true, grow: { at: [2050, 2600] } },   // one large irregular landmass
    { d: 'M248,240 C260,232 276,242 272,258 C268,272 252,278 244,268 C238,258 240,246 248,240 Z', closed: true, grow: { at: [2250, 2600] } },   // and a small island
    { d: 'M200,110 C198,94 202,74 200,54', grow: { at: [2500, 2700] } },   // the sprout stem
    { d: 'M200,90 C186,88 170,78 164,62 C180,60 196,70 200,90 Z', closed: true, grow: { at: [2650, 2950] } },   // left leaf
    { d: 'M200,78 C214,74 230,62 236,46 C220,46 204,56 200,78 Z', closed: true, grow: { at: [2700, 3000] } },   // right leaf
    { d: 'M200,54 C190,42 190,28 200,16 C210,28 210,42 200,54 Z', closed: true, grow: { at: [2750, 3000] } },   // top leaf
    { d: 'M175.7,310.2 A108,108 0 0,1 98.5,168.1', grow: { at: [1450, 1950] } },   // left finger 1
    { d: 'M173.5,320.0 A118,118 0 0,1 83.8,184.5', grow: { at: [1450, 1950] } },   // left finger 2
    { d: 'M171.2,329.7 A128,128 0 0,1 72.0,205.0', grow: { at: [1450, 1950] } },   // left finger 3
    { d: 'M169.0,339.5 A138,138 0 0,1 64.1,229.0', grow: { at: [1450, 1950] } },   // left finger 4
    { d: 'M224.3,310.2 A108,108 0 0,0 301.5,168.1', grow: { at: [1450, 1950] } },   // right finger 1
    { d: 'M226.5,320.0 A118,118 0 0,0 316.2,184.5', grow: { at: [1450, 1950] } },   // right finger 2
    { d: 'M228.8,329.7 A128,128 0 0,0 328.0,205.0', grow: { at: [1450, 1950] } },   // right finger 3
    { d: 'M231.0,339.5 A138,138 0 0,0 335.9,229.0', grow: { at: [1450, 1950] } },   // right finger 4
    { d: 'M64.1,229.0 C52,282 70,342 104,382 C120,402 128,422 130,440', grow: { at: [1300, 1850], from: 'end' } },   // left hand: outer edge to the wrist
    { d: 'M194,316 C190,352 182,400 180,440', grow: { at: [1300, 1550], from: 'end' } },   // left wrist, inside
    { d: 'M98.5,168.1 L84.5,150.1 L70.5,150.1', trace: true, grow: { at: [1850, 2000] } },   // left circuit trace 1
    { d: 'M83.8,184.5 L65.8,176.5 L53.8,176.5', trace: true, grow: { at: [1850, 2000] } },   // left circuit trace 2
    { d: 'M335.9,229.0 C348,282 330,342 296,382 C280,402 272,422 270,440', grow: { at: [1300, 1850], from: 'end' } },   // right hand: outer edge to the wrist
    { d: 'M206,316 C210,352 218,400 220,440', grow: { at: [1300, 1550], from: 'end' } },   // right wrist, inside
    { d: 'M301.5,168.1 L315.5,150.1 L329.5,150.1', trace: true, grow: { at: [1850, 2000] } },   // right circuit trace 1
    { d: 'M316.2,184.5 L334.2,176.5 L346.2,176.5', trace: true, grow: { at: [1850, 2000] } },   // right circuit trace 2
  ],
  // where each entry sits on the drawing (snapped to the nearest dot): case studies on the globe, the hackathon on
  // the sprout, commitments along the hands
  // the grow-in (renderImpactConstellation): each path's grow says when it draws (ms) and from where ('end': from its
  // last point; 'seed': outward from the seed). The seed lands between the palms; the dove perches on the top dot.
  seed: [200, 306],
  anchors: {
    'cpc': [150, 176], 'stackhacks': [226, 196], 'pathways-inc': [258, 256], 'code-with-claude': [200, 18],
    'grace-community': [98, 168], 'greenwich-first-selectman': [302, 168],
    'mothers-for-others': [98, 264], 'harvest-time-vbs': [302, 264], 'operation-smile': [175, 330],
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
function renderImpactConstellation(holder) {
  if (!holder) return;
  try { buildConstellation(holder); }
  catch (e) {   // fail-safe: anything going wrong leaves the finished drawing (or at least nothing broken)
    console.error('Constellation animation failed; showing it finished', e);
    try { holder.replaceChildren(); buildConstellation(holder, { forceStill: true }); } catch (e2) { console.error(e2); }
  }
}
function buildConstellation(holder, { forceStill = false } = {}) {
  const NS = 'http://www.w3.org/2000/svg', C = IMPACT_CONSTELLATION, W = 400, H = 440, S = CONSTELLATION_STEPS;
  const phone = window.matchMedia('(max-width: 900px)').matches;
  const still = forceStill || reduceMotion;
  let replay = false;
  try { replay = /[?&]intro=1\b/.test(location.search) || sessionStorage.getItem('apImpactIntroSeen') !== '1'; sessionStorage.setItem('apImpactIntroSeen', '1'); } catch (e) {}
  const K = phone ? 2.5 / 3.45 : 1;   // phones: the same sequence, ~2.5s
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`); svg.setAttribute('class', 'impact-constellation');
  svg.setAttribute('role', 'group'); svg.setAttribute('aria-label', 'Impact entries drawn as hands holding a globe: choose one to jump to it');
  const mk = (tag, cls, parent = svg) => { const n = document.createElementNS(NS, tag); if (cls) n.setAttribute('class', cls); parent.appendChild(n); return n; };
  holder.appendChild(svg);

  // 1. sample every path into evenly spaced points, and give each point the moment it appears
  const probe = mk('g'); probe.setAttribute('visibility', 'hidden');
  const shapes = C.paths.map(p => { const el = mk('path', '', probe); el.setAttribute('d', p.d); return { ...p, el, len: el.getTotalLength() }; });
  const step = shapes.reduce((t, p) => t + p.len, 0) / C.dots;
  const [SX, SY] = C.seed;
  const pts = [], segs = [];
  shapes.forEach(p => {
    const n = Math.max(2, Math.round(p.len / step)), first = pts.length, count = p.closed ? n : n + 1;
    const [t0, t1] = p.grow.at;
    const own = [];
    for (let i = 0; i < count; i++) {
      const q = p.el.getPointAtLength(p.len * i / n);
      own.push({ x: q.x, y: q.y, ring: p.trace && i === count - 1, ord: i / n });
    }
    // order along the drawing: as written, reversed (drawn from the path's end), or outward from the seed
    if (p.grow.from === 'end') own.forEach(q => { q.ord = 1 - q.ord; });
    if (p.grow.from === 'seed') { const d = own.map(q => Math.hypot(q.x - SX, q.y - SY)), lo = Math.min(...d), hi = Math.max(...d); own.forEach((q, i) => { q.ord = (d[i] - lo) / (hi - lo || 1); }); }
    own.forEach(q => { q.appear = t0 + (t1 - t0) * q.ord; pts.push(q); });
    for (let i = 1; i < count; i++) segs.push({ a: first + i - 1, b: first + i });
    if (p.closed) segs.push({ a: first + count - 1, b: first, closeAt: p.grow.from === 'seed' ? null : (p.grow.from === 'end' ? t0 : t1) });
  });
  probe.remove();
  // each line draws from its earlier end to its later one (a closed path's closing line ends with the path)
  segs.forEach(sg => {
    let A = pts[sg.a], B = pts[sg.b], t0 = A.appear, t1 = B.appear;
    if (sg.closeAt != null) { t1 = sg.closeAt; if (t1 < t0) { [sg.a, sg.b] = [sg.b, sg.a]; t0 = pts[sg.a].appear; } }
    if (t1 < t0) { [sg.a, sg.b] = [sg.b, sg.a]; [t0, t1] = [t1, t0]; }
    sg.t0 = t0; sg.t1 = Math.max(t1, t0 + 40);
  });

  // 2. anchors: each entry takes the nearest free dot
  const rows = [...IMPACT.map(r => ({ ...r, anchor: 'impact-' + r.id })), ...IMPACT_COMMITMENTS.map(r => ({ ...r, anchor: 'commit-' + r.id }))];
  const taken = new Set();
  rows.forEach(r => {
    const at = C.anchors[r.id]; if (!at) return;
    let best = -1, bd = Infinity;
    pts.forEach((p, i) => { const d = (p.x - at[0]) ** 2 + (p.y - at[1]) ** 2; if (!taken.has(i) && !p.ring && d < bd) { bd = d; best = i; } });
    if (best >= 0) { taken.add(best); pts[best].row = r; }
  });

  // 3. draw: lines, the seed, dots, then the anchors as links
  const lines = segs.map(sg => ({ ...sg, el: mk('line', 'c-line') }));
  const seedRing = mk('circle', 'c-seed-ring'), seed = mk('circle', 'c-seed');
  seed.setAttribute('r', 3.4); seedRing.setAttribute('r', 3.4);
  pts.forEach(p => { p.el = mk('circle', p.ring ? 'c-dot c-ring' : 'c-dot'); p.r = p.ring ? 2.6 : 1.7; });
  const tip = impactEl('div', 'constellation-tip'); tip.setAttribute('aria-hidden', 'true');
  holder.appendChild(tip);
  const anchors = [];
  pts.forEach((p, i) => {
    if (!p.row) return;
    const r = p.row, a = mk('a', 'constellation-node');
    a.setAttribute('href', '#' + r.anchor); a.setAttribute('aria-label', `${r.org}: jump to its ${r.since !== undefined ? 'commitment' : 'case study'}`);
    p.hit = mk('circle', 'node-hit', a); p.hit.setAttribute('r', 14);
    p.node = mk('circle', 'node-dot', a); p.node.setAttribute('r', (4.2 + 0.9 * Math.sqrt(Math.max(0, r.years || 0))).toFixed(1));
    p.node.style.animationDelay = (anchors.length * 45) + 'ms';
    const mine = lines.filter(l => l.a === i || l.b === i);
    const show = on => {
      mine.forEach(l => l.el.classList.toggle('is-lit', on));
      tip.classList.toggle('is-on', on);
      if (on) { tip.textContent = r.org; tip.style.left = (p.x / W * 100) + '%'; tip.style.top = (p.y / H * 100) + '%'; }
    };
    a.addEventListener('mouseenter', () => show(true)); a.addEventListener('mouseleave', () => show(false));
    a.addEventListener('focus', () => show(true)); a.addEventListener('blur', () => show(false));
    a.addEventListener('click', e => {
      e.preventDefault(); show(false);
      const el = document.getElementById(r.anchor); if (!el) return;
      scrollToSection(el, 24); el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true });
    });
    anchors.push(a);
  });
  // the anchors join the tab order only once the drawing is complete
  const setAnchorsLive = live => anchors.forEach(a => { if (live) a.removeAttribute('tabindex'); else a.setAttribute('tabindex', '-1'); });

  // 4. the dove: the nav logo's vector dove, positioned over the drawing in the drawing's own units
  const bird = document.createElement('button');
  bird.type = 'button'; bird.className = 'const-bird';
  bird.setAttribute('aria-label', 'Replay the constellation animation');
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
  const clamp01 = x => Math.max(0, Math.min(1, x));
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

  // 5. one frame of the sequence at time t (ms of the sequence, unscaled)
  const pop = x => x <= 0 ? 0 : x >= 1 ? 1 : 1 + 1.7 * Math.pow(x - 1, 3) + 0.7 * Math.pow(x - 1, 2);   // 0 → 1, a small overshoot
  let drift = 0, tIdle = 0;
  function render(t) {
    pts.forEach(p => {
      const dx = drift ? Math.sin(tIdle * p.w + p.ph) * drift : 0, dy = drift ? Math.cos(tIdle * p.w * 1.3 + p.ph) * drift : 0;
      p.cx = p.x + dx; p.cy = p.y + dy;
      const s = pop((t - p.appear) / 180);
      p.el.setAttribute('cx', p.cx.toFixed(1)); p.el.setAttribute('cy', p.cy.toFixed(1)); p.el.setAttribute('r', (p.r * s).toFixed(2));
      if (p.node) { p.node.setAttribute('cx', p.cx.toFixed(1)); p.node.setAttribute('cy', p.cy.toFixed(1)); p.hit.setAttribute('cx', p.cx.toFixed(1)); p.hit.setAttribute('cy', p.cy.toFixed(1)); }
    });
    lines.forEach(l => {
      const A = pts[l.a], B = pts[l.b], u = clamp01((t - l.t0) / (l.t1 - l.t0));
      l.el.setAttribute('x1', A.cx.toFixed(1)); l.el.setAttribute('y1', A.cy.toFixed(1));
      l.el.setAttribute('x2', (A.cx + (B.cx - A.cx) * u).toFixed(1)); l.el.setAttribute('y2', (A.cy + (B.cy - A.cy) * u).toFixed(1));
      l.el.style.visibility = u > 0 ? 'visible' : 'hidden';
    });
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
    placeBird(bx, by, flap);
    svg.classList.toggle('is-settled', t >= S.anchors[0]);
  }

  // 6. run: the sequence (or the finished state), then idle; paused while hidden or off screen
  const rnd = (a, b) => a + Math.random() * (b - a);
  pts.forEach(p => { p.ph = rnd(0, Math.PI * 2); p.w = rnd(0.0006, 0.0011); });
  const idleMotion = !still && !phone;
  let seqT = 0, mode = 'idle', last = null, raf = 0, onScreen = true, nextTwinkle = 0, perched = false;
  const finishState = () => {
    seqT = S.total; mode = 'idle'; drift = 0;
    render(S.total); svg.classList.add('is-settled'); setAnchorsLive(true);
    bird.classList.add('is-perched'); bird.tabIndex = 0;
    if (still) svg.classList.add('is-still');
  };
  const frame = now => {
    try {
      const dt = last === null ? 16 : Math.min(64, now - last); last = now;
      if (mode === 'seq') {
        seqT += dt / K;
        render(Math.min(seqT, S.total));
        if (!perched && seqT >= S.perch[1]) { perched = true; if (dove) dove.flutter(); }   // a small fold on landing
        if (seqT >= S.total) { mode = 'idle'; finishState(); }
      } else if (idleMotion) {
        tIdle += dt; drift = Math.min(1, tIdle / 800) * 1.5; render(S.total);
        if (tIdle > nextTwinkle) {
          nextTwinkle = tIdle + rnd(1100, 2200);
          const plain = pts.filter(p => !p.row);
          for (let n = 0; n < 2; n++) { const p = plain[Math.floor(Math.random() * plain.length)]; p.el.classList.remove('twinkle'); void p.el.getBBox; p.el.classList.add('twinkle'); setTimeout(() => p.el.classList.remove('twinkle'), 1600); }
        }
      } else { raf = 0; return; }
      raf = requestAnimationFrame(frame);
    } catch (e) { console.error('Constellation animation failed; showing it finished', e); finishState(); raf = 0; }
  };
  const run = () => { if (!raf && onScreen && !document.hidden) { last = null; raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; onScreen ? run() : stop(); }).observe(svg);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : run());
  const play = () => {
    if (still) return finishState();
    seqT = 0; perched = false; mode = 'seq'; svg.classList.remove('is-settled'); setAnchorsLive(false);
    bird.classList.remove('is-perched'); bird.tabIndex = -1;
    stop(); run();
  };
  bird.addEventListener('click', () => { if (bird.classList.contains('is-perched')) play(); });   // Enter / Space click it too
  window.addEventListener('resize', () => { if (mode !== 'seq') render(S.total); });
  if (replay && !still) play(); else { finishState(); run(); }
  // fail-safe: if the sequence is still running long after it should have ended (and the page is visible), finish it
  setTimeout(() => { if (mode === 'seq' && !document.hidden) finishState(); }, (S.total / 1000 * K + 3) * 1000);
}

// Search entries for every case study and commitment. go(anchorId) takes the visitor there.
function impactSearchItems(go) {
  return [
    ...IMPACT.map(c => ({ group: 'Impact', label: c.org, hint: c.tag, keywords: `${c.orgNote || ''} ${c.story || ''} ${c.problem || ''} ${c.did || ''} ${c.stat || ''} ${c.statLabel || ''}`, run: () => go('impact-' + c.id) })),
    ...IMPACT_COMMITMENTS.map(c => ({ group: 'Impact', label: c.org, hint: c.since ? `${c.role} · since ${c.since}` : c.role, keywords: `${c.tag} ${c.orgNote || ''} ${c.line} long-term commitments`, run: () => go('commit-' + c.id) })),
  ];
}
