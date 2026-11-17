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
//   5. Optionally set  full  to a different file for the lightbox (e.g. the uncropped original when the slot's
//      files are a crop); otherwise the lightbox shows the largest file in srcset.
//   If a file is missing or fails to load, the row falls back to the empty slot.
//
// SHOW_IMAGE_PLACEHOLDERS: true shows an empty framed slot on rows that have no image yet; false leaves those rows
// without a slot (the content takes the full width; rows with an image still show it), so the page can ship before the
// images are ready.
const SHOW_IMAGE_PLACEHOLDERS = true;

// The /impact page hero: the label, headline and subhead (the page's HTML holds the same text as a no-script fallback;
// what's here wins).
const IMPACT_PAGE = {
  label: 'Impact',
  title: 'Getting resources to the people markets underserve',
  sub: 'I use finance and AI to strengthen the organizations that serve communities the market reaches last.',
};

// One case-study row per focus area. The body is one paragraph: story when it's filled in, otherwise problem and did
// joined (they also feed the site search). stat is optional: a row without one is simply shorter. When set, a
// trailing "+" or "%" is drawn in gold like the hero's, and statLabel is its caption (sentence case). caption is an
// optional line under the image (e.g. place and date). id names the row's anchor (/impact/#impact-<id>).
const IMPACT = [
  {
    id: 'cpc',
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
    image: '/Assets/img/cpc-photo-800.jpg', position: 'center 33%',
    srcset: '/Assets/img/cpc-photo-800.jpg 800w, /Assets/img/cpc-photo-1600.jpg 1232w',   // source is 1232px wide (not upscaled)
    alt: 'Angelina in a hard hat and safety vest during a CPC property inspection.',
  },
  {
    id: 'stackhacks',
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
    caption: '',
    tag: 'Economic Mobility',
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
// Fills the /impact hero from IMPACT_PAGE (elements with data-impact="label" / "title" / "sub")
function renderImpactHero() {
  for (const k of ['label', 'title', 'sub']) {
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
// organization only (the alt text stays on the <img> for screen readers, but isn't shown as a caption).
function impactLightbox() {
  if (typeof addLightboxGallery !== 'function') return;
  addLightboxGallery(IMPACT_SHOTS, btn => {
    const row = btn.closest('.impact-row');
    const title = row.querySelector('.impact-commit-org') ? row.querySelector('.impact-commit-org').firstChild.textContent : row.querySelector('h3').textContent;
    return [title, ''];
  });
}
// sizes: the slot's rendered width, so the browser picks the right file from srcset
const IMPACT_SIZES = { case: '(max-width: 900px) 100vw, 460px', commit: '(max-width: 900px) 100vw, 400px' };
function impactShot({ image, alt, fit = 'cover', position, overlay = true, srcset, sizes, bg, full }) {
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
  media.appendChild(shot);
  if (caption) media.appendChild(impactEl('p', 'impact-caption', caption));
  return media;
}

// The four case-study cards, into an .impact-grid. headingLevel is the card title's heading level.
function renderImpactCases(grid, { headingLevel = 3 } = {}) {
  IMPACT.forEach(({ id, tag, org, orgNote, story, problem, did, stat, statLabel, statText, caption, image, alt, fit, position, overlay, srcset, bg }, i) => {
    // One full-width row per case study: the image beside a content column (tag, org, subtitle, one paragraph, then
    // the stat if the row has one). Odd rows put the image on the right (.is-flipped); rows stack on narrow screens.
    const card = impactEl('article', 'impact-row impact-card reveal' + (i % 2 ? ' is-flipped' : '') + (stat ? '' : ' no-stat'));
    card.id = 'impact-' + id;
    const media = impactMedia(impactShot({ image, alt, fit, position, overlay, srcset, sizes: IMPACT_SIZES.case, bg }), caption);
    if (media) { card.classList.add('has-shot'); card.appendChild(media); }
    const content = impactEl('div', 'impact-content');
    card.appendChild(content);
    const body = impactEl('div', 'impact-body');
    body.append(impactEl('p', 'impact-tag', tag), impactEl('h' + headingLevel, 'impact-org', org));
    if (orgNote) body.appendChild(impactEl('p', 'impact-org-note', orgNote));
    const text = story || [problem, did].filter(Boolean).join(' ');
    if (text) body.appendChild(impactEl('p', 'impact-story', text));
    content.appendChild(body);
    if (stat) {
      const s = impactEl('p', 'impact-stat'), num = impactEl('span', 'impact-num' + (statText ? ' impact-num-text' : ''));
      const m = !statText && /^(.*?)([+%])$/.exec(stat);
      if (m) num.append(m[1], impactEl('span', 'impact-unit', m[2])); else num.textContent = stat;
      s.append(num, impactEl('span', 'impact-stat-label', statLabel || ''));
      content.appendChild(s);
    }
    grid.appendChild(card);
  });
}

// The "Long-term commitments" block: its label (a heading at labelLevel), then one row per commitment in the same
// format as the case studies, a step smaller. The image side carries on the zigzag from the case studies above.
function renderImpactCommitments(container, { labelLevel = 2, headingLevel = 3 } = {}) {
  if (!IMPACT_COMMITMENTS.length) return;
  const wrap = impactEl('div', 'impact-commit');
  wrap.id = 'commitments';
  wrap.setAttribute('role', 'group'); wrap.setAttribute('aria-labelledby', 'commitTitle');
  const label = impactEl('h' + labelLevel, 'impact-commit-label reveal', 'Long-term commitments');
  label.id = 'commitTitle';
  const rows = impactEl('div', 'impact-commit-grid');
  IMPACT_COMMITMENTS.forEach(({ id, tag, role, org, orgNote, since, line, caption, image, alt, fit, position, overlay, srcset, full }, i) => {
    const row = impactEl('article', 'impact-row impact-commit-row reveal' + ((IMPACT.length + i) % 2 ? ' is-flipped' : ''));
    row.id = 'commit-' + id;
    const media = impactMedia(impactShot({ image, alt, fit, position, overlay, srcset, sizes: IMPACT_SIZES.commit, full }), caption);
    if (media) { row.classList.add('has-shot'); row.appendChild(media); }
    const content = impactEl('div', 'impact-content');
    const head = impactEl('div', 'impact-body');
    const orgP = impactEl('p', 'impact-commit-org', org);
    if (orgNote) orgP.appendChild(impactEl('span', 'impact-commit-note', ` (${orgNote})`));
    head.append(impactEl('p', 'impact-tag', tag), impactEl('h' + headingLevel, '', role), orgP);
    content.appendChild(head);
    if (since) {   // no year yet: no "Since" stat
      const stat = impactEl('p', 'impact-stat impact-since');
      stat.append(impactEl('span', 'impact-stat-label', 'Since'), impactEl('span', 'impact-num', since));
      content.appendChild(stat);
    }
    content.appendChild(impactEl('p', 'impact-commit-line', line));
    row.appendChild(content);
    rows.appendChild(row);
  });
  wrap.append(label, rows);
  container.appendChild(wrap);
}

// Search entries for every case study and commitment. go(anchorId) takes the visitor there.
function impactSearchItems(go) {
  return [
    ...IMPACT.map(c => ({ group: 'Impact', label: c.org, hint: c.tag, keywords: `${c.orgNote || ''} ${c.story || ''} ${c.problem || ''} ${c.did || ''} ${c.stat || ''} ${c.statLabel || ''}`, run: () => go('impact-' + c.id) })),
    ...IMPACT_COMMITMENTS.map(c => ({ group: 'Impact', label: c.org, hint: c.since ? `${c.role} · since ${c.since}` : c.role, keywords: `${c.tag} ${c.orgNote || ''} ${c.line} long-term commitments`, run: () => go('commit-' + c.id) })),
  ];
}
