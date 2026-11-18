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
    { d: 'M200,292 A92,92 0 0,1 200,108', w: 'main', at: [1800, 2200] },   // globe, left half
    { d: 'M200,292 A92,92 0 0,0 200,108', w: 'main', at: [1800, 2200] },   // globe, right half
    { d: 'M118.1,158 A81.9,13 0 0,0 281.9,158', w: 'fine', at: [2350, 2750], kind: 'grid' },   // globe grid, latitude 1
    { d: 'M108,200 A92,18 0 0,0 292,200', w: 'fine', at: [2410, 2790], kind: 'grid' },   // globe grid, latitude 2
    { d: 'M118.1,242 A81.9,13 0 0,0 281.9,242', w: 'fine', at: [2470, 2830], kind: 'grid' },   // globe grid, latitude 3
    { d: 'M200,108 A46,92 0 0,0 200,292', w: 'fine', at: [2400, 2850], kind: 'grid' },   // globe grid, meridian west
    { d: 'M200,108 A46,92 0 0,1 200,292', w: 'fine', at: [2400, 2850], kind: 'grid' },   // globe grid, meridian east
    { d: 'M130,146 C131.2,142.5 135.7,135.7 140,133 C144.3,130.3 151,131.2 156,130 C161,128.8 165.3,127 170,126 C174.7,125 180.3,123.2 184,124 C187.7,124.8 191.7,128.2 192,131 C192.3,133.8 188,137.8 186,141 C184,144.2 181.3,146.8 180,150 C178.7,153.2 179.5,157 178,160 C176.5,163 172.2,165 171,168 C169.8,171 172,177 171,178 C170,179 167.2,174.2 165,174 C162.8,173.8 159.2,175 158,177 C156.8,179 157.2,183.3 158,186 C158.8,188.7 160.7,191.5 163,193 C165.3,194.5 168.7,193.5 172,195 C175.3,196.5 180.5,199.2 183,202 C185.5,204.8 187.2,208 187,212 C186.8,216 184.5,221.3 182,226 C179.5,230.7 175,235 172,240 C169,245 166,255 164,256 C162,257 160.8,250.3 160,246 C159.2,241.7 159.5,235.3 159,230 C158.5,224.7 157,218.8 157,214 C157,209.2 159.5,204 159,201 C158.5,198 156,198.5 154,196 C152,193.5 148.8,189.7 147,186 C145.2,182.3 144.5,178 143,174 C141.5,170 139.7,165.3 138,162 C136.3,158.7 134.3,156.7 133,154 C131.7,151.3 128.8,149.5 130,146 Z', w: 'detail', at: [2100, 2500], closed: true },   // the Americas
    { d: 'M214,170 C217,168.2 221.7,165.7 226,165 C230.3,164.3 235.7,165.2 240,166 C244.3,166.8 249,167.7 252,170 C255,172.3 255.3,176.7 258,180 C260.7,183.3 267.3,187 268,190 C268.7,193 263.7,194 262,198 C260.3,202 259.7,208.7 258,214 C256.3,219.3 254.3,224.7 252,230 C249.7,235.3 246.7,243.3 244,246 C241.3,248.7 238.3,248.3 236,246 C233.7,243.7 231.7,237.3 230,232 C228.3,226.7 227.7,218.7 226,214 C224.3,209.3 222.7,206.7 220,204 C217.3,201.3 212.3,201 210,198 C207.7,195 206.3,189.7 206,186 C205.7,182.3 206.7,178.7 208,176 C209.3,173.3 211,171.8 214,170 Z', w: 'detail', at: [2150, 2500], closed: true },   // Africa
    { d: 'M214,150 C215,147 217.7,142.7 220,140 C222.3,137.3 225.3,136.7 228,134 C230.7,131.3 233.7,126.2 236,124 C238.3,121.8 239.7,120.7 242,121 C244.3,121.3 249.3,123.5 250,126 C250.7,128.5 245,133.7 246,136 C247,138.3 253.3,137.7 256,140 C258.7,142.3 263,147.3 262,150 C261,152.7 253.7,155 250,156 C246.3,157 243,155.3 240,156 C237,156.7 235,159.7 232,160 C229,160.3 225,158.3 222,158 C219,157.7 215.3,159.3 214,158 C212.7,156.7 213,153 214,150 Z', w: 'detail', at: [2200, 2480], closed: true },   // Europe
    { d: 'M200,108 C198,90 202,66 200,44', w: 'main', at: [2500, 2650], joints: [[200,108]] },   // sprout stem
    { d: 'M200,86 C195.8,70 174,62.1 160,64 C166,76.9 184.2,91 200,86 Z', w: 'main', at: [2600, 2820], closed: true, joints: [[160,64]] },   // left leaf
    { d: 'M197.6,84.7 L168,68.4', w: 'detail', at: [2720, 2880] },   // left leaf vein
    { d: 'M200,72 C215.4,77.7 233.8,64.5 240,52 C226.2,49.5 204.6,56.3 200,72 Z', w: 'main', at: [2640, 2860], closed: true, joints: [[240,52]] },   // right leaf
    { d: 'M202.4,70.8 L232,56', w: 'detail', at: [2760, 2920] },   // right leaf vein
    { d: 'M200,44 C210,36 207,20 200,12 C193,20 190,36 200,44 Z', w: 'main', at: [2680, 2900], closed: true, joints: [[200,12]] },   // top leaf
    { d: 'M200,42.1 L200,18.4', w: 'detail', at: [2800, 2960] },   // top leaf vein
  ],
  seed: [200, 302],   // where the dove's seed lands, between the palms
  anchors: {   // where each entry sits (snapped to the nearest dot on a main or detail line)
    'cpc': [178, 150],
    'stackhacks': [258, 214],
    'pathways-inc': [236, 124],
    'code-with-claude': [240, 52],
    'grace-community': [104.1, 159.8],
    'greenwich-first-selectman': [295.9, 159.8],
    'mothers-for-others': [57.1, 205],
    'harvest-time-vbs': [342.9, 205],
    'operation-smile': [174.4, 348.3],
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

  // 1. the lines: each part of the drawing is a smooth path, drawn on by its stroke dash during the grow-in, with dots
  //    spaced along it by line weight, medium joint nodes (knuckles, fingertips, leaf tips) and a hollow node where a
  //    circuit trace ends. Each part is one group, so the idle drift moves a line and its dots together. Phones leave
  //    out the faint globe grid and the circuit traces.
  const parts = C.paths.filter(p => !(phone && (p.kind === 'grid' || p.kind === 'trace')));
  const pts = [], groups = [];
  parts.forEach(p => {
    const g = mk('g', 'c-part w-' + p.w + (p.kind ? ' k-' + p.kind : ''));
    const path = mk('path', 'c-path', g); path.setAttribute('d', p.d); path.setAttribute('pathLength', '1');
    const len = path.getTotalLength();
    const grp = { el: g, path, t0: p.at[0], t1: p.at[1], tf: '' };
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

  // 2. anchors: each entry takes the nearest free dot on a main or detail line
  const rows = [...IMPACT.map(r => ({ ...r, anchor: 'impact-' + r.id })), ...IMPACT_COMMITMENTS.map(r => ({ ...r, anchor: 'commit-' + r.id }))];
  const taken = new Set();
  rows.forEach(r => {
    const at = C.anchors[r.id]; if (!at) return;
    let best = -1, bd = Infinity;
    pts.forEach((p, i) => { if (!p.canAnchor || taken.has(i)) return; const d = (p.x - at[0]) ** 2 + (p.y - at[1]) ** 2; if (d < bd) { bd = d; best = i; } });
    if (best >= 0) { taken.add(best); pts[best].row = r; }
  });

  // 3. the seed, then the anchors as links above the drawing (hovering one lights its line)
  const seedRing = mk('circle', 'c-seed-ring'), seed = mk('circle', 'c-seed');
  seed.setAttribute('r', 3.4); seedRing.setAttribute('r', 3.4);
  const tip = impactEl('div', 'constellation-tip'); tip.setAttribute('aria-hidden', 'true');
  holder.appendChild(tip);
  const anchors = [];
  pts.forEach(p => {
    if (!p.row) return;
    const r = p.row, a = mk('a', 'constellation-node');
    p.el.style.display = 'none';   // the anchor's large dot stands in for the small one
    a.setAttribute('href', '#' + r.anchor); a.setAttribute('aria-label', `${r.org}: jump to its ${r.since !== undefined ? 'commitment' : 'case study'}`);
    p.hit = mk('circle', 'node-hit', a); p.hit.setAttribute('r', 14); p.hit.setAttribute('cx', p.x.toFixed(1)); p.hit.setAttribute('cy', p.y.toFixed(1));
    p.node = mk('circle', 'node-dot', a); p.node.setAttribute('r', (4.2 + 0.9 * Math.sqrt(Math.max(0, r.years || 0))).toFixed(1));
    p.node.setAttribute('cx', p.x.toFixed(1)); p.node.setAttribute('cy', p.y.toFixed(1));
    p.node.style.animationDelay = (anchors.length * 45) + 'ms';
    p.link = a;
    const show = on => {
      p.group.el.classList.toggle('is-lit', on);
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
    groups.forEach(gp => {   // each line draws on; while idle, each part drifts as a whole
      const u = clamp01((t - gp.t0) / (gp.t1 - gp.t0));
      gp.path.style.strokeDashoffset = (1 - u).toFixed(4);
      gp.path.style.visibility = u > 0 ? 'visible' : 'hidden';
      const tf = drift ? `translate(${(Math.sin(tIdle * gp.w + gp.ph) * drift).toFixed(2)} ${(Math.cos(tIdle * gp.w * 1.3 + gp.ph) * drift).toFixed(2)})` : '';
      if (tf !== gp.tf) { gp.el.setAttribute('transform', tf); gp.tf = tf; }
    });
    pts.forEach(p => {   // dots pop in as their line reaches them
      const sc = pop((t - p.appear) / 180);
      if (sc !== p.sc) { p.el.setAttribute('r', (p.r * sc).toFixed(2)); p.sc = sc; }
      if (p.link && p.group.tf !== p.ltf) { p.link.setAttribute('transform', p.group.tf); p.ltf = p.group.tf; }
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
  groups.forEach(gp => { gp.ph = rnd(0, Math.PI * 2); gp.w = rnd(0.0006, 0.0011); });
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
          const plain = pts.filter(p => !p.row && p.size !== 'ring');
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
