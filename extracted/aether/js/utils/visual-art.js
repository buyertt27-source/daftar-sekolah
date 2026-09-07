// Visual Art — procedural SVG "product photography" stand-ins.
// Abstract, material-driven compositions (titanium / brass / sapphire) instead
// of stock photography: zero copyright risk, perfectly on-brand, and crisp
// at any resolution or screen size since SVG has no fixed pixel dimensions.

function grad(id, from, to, angle = 135) {
  return `<linearGradient id="${id}" gradientTransform="rotate(${angle})">
    <stop offset="0%" stop-color="${from}"/>
    <stop offset="100%" stop-color="${to}"/>
  </linearGradient>`;
}

const BASE = { bg: '#0d0f14', ring: '#c9a876', ring2: '#ddc194', dim: '#262b35', glow: '#6fcfe0' };

function wrap(id, seed, inner) {
  const rot = (seed % 7) - 3; // subtle per-item variance, -3..3 degrees
  return `<svg viewBox="0 0 400 400" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Product visual">
    <defs>
      ${grad(id + '-a', '#1a1d24', '#08090c', 120)}
      ${grad(id + '-b', BASE.ring2, BASE.ring, 100)}
      ${grad(id + '-c', '#3a4150', '#12141a', 60)}
    </defs>
    <rect width="400" height="400" fill="url(#${id}-a)"/>
    <g transform="rotate(${rot} 200 200)">${inner}</g>
  </svg>`;
}

function earbuds(id, seed) {
  return wrap(id, seed, `
    <ellipse cx="150" cy="235" rx="46" ry="60" fill="url(#${id}-c)" stroke="url(#${id}-b)" stroke-width="2"/>
    <ellipse cx="150" cy="205" rx="20" ry="16" fill="${BASE.bg}"/>
    <ellipse cx="250" cy="175" rx="46" ry="60" fill="url(#${id}-c)" stroke="url(#${id}-b)" stroke-width="2"/>
    <ellipse cx="250" cy="145" rx="20" ry="16" fill="${BASE.bg}"/>
    <circle cx="150" cy="205" r="5" fill="url(#${id}-b)"/>
    <circle cx="250" cy="145" r="5" fill="url(#${id}-b)"/>
  `);
}

function watch(id, seed) {
  return wrap(id, seed, `
    <rect x="150" y="40" width="100" height="60" rx="16" fill="url(#${id}-c)"/>
    <rect x="150" y="300" width="100" height="60" rx="16" fill="url(#${id}-c)"/>
    <circle cx="200" cy="200" r="98" fill="url(#${id}-c)" stroke="url(#${id}-b)" stroke-width="3"/>
    <circle cx="200" cy="200" r="76" fill="${BASE.bg}"/>
    <circle cx="200" cy="200" r="76" fill="none" stroke="url(#${id}-b)" stroke-width="1" stroke-dasharray="2 10"/>
    <line x1="200" y1="200" x2="200" y2="150" stroke="${BASE.ring2}" stroke-width="3" stroke-linecap="round"/>
    <line x1="200" y1="200" x2="235" y2="200" stroke="${BASE.glow}" stroke-width="3" stroke-linecap="round"/>
    <circle cx="200" cy="200" r="5" fill="${BASE.ring}"/>
  `);
}

function speaker(id, seed) {
  return wrap(id, seed, `
    <rect x="110" y="60" width="180" height="280" rx="32" fill="url(#${id}-c)" stroke="url(#${id}-b)" stroke-width="2"/>
    <circle cx="200" cy="160" r="58" fill="${BASE.bg}" stroke="url(#${id}-b)" stroke-width="2"/>
    <circle cx="200" cy="160" r="40" fill="none" stroke="${BASE.dim}" stroke-width="1"/>
    <circle cx="200" cy="160" r="24" fill="none" stroke="${BASE.dim}" stroke-width="1"/>
    <circle cx="200" cy="160" r="8" fill="url(#${id}-b)"/>
    <circle cx="200" cy="270" r="30" fill="${BASE.bg}" stroke="url(#${id}-b)" stroke-width="2"/>
    <circle cx="200" cy="270" r="14" fill="none" stroke="${BASE.dim}" stroke-width="1"/>
  `);
}

function headphones(id, seed) {
  return wrap(id, seed, `
    <path d="M110 190 A90 90 0 0 1 290 190" fill="none" stroke="url(#${id}-b)" stroke-width="10" stroke-linecap="round"/>
    <ellipse cx="104" cy="230" rx="34" ry="48" fill="url(#${id}-c)" stroke="url(#${id}-b)" stroke-width="2"/>
    <ellipse cx="296" cy="230" rx="34" ry="48" fill="url(#${id}-c)" stroke="url(#${id}-b)" stroke-width="2"/>
    <circle cx="104" cy="230" r="12" fill="${BASE.bg}"/>
    <circle cx="296" cy="230" r="12" fill="${BASE.bg}"/>
  `);
}

function tracker(id, seed) {
  return wrap(id, seed, `
    <rect x="140" y="120" width="120" height="160" rx="28" fill="url(#${id}-c)" stroke="url(#${id}-b)" stroke-width="2"/>
    <rect x="160" y="145" width="80" height="50" rx="6" fill="${BASE.bg}"/>
    <line x1="170" y1="210" x2="230" y2="210" stroke="${BASE.glow}" stroke-width="3" stroke-linecap="round"/>
    <line x1="170" y1="225" x2="215" y2="225" stroke="${BASE.dim}" stroke-width="3" stroke-linecap="round"/>
    <line x1="170" y1="240" x2="222" y2="240" stroke="${BASE.dim}" stroke-width="3" stroke-linecap="round"/>
    <rect x="160" y="70" width="80" height="50" rx="12" fill="url(#${id}-c)"/>
    <rect x="160" y="280" width="80" height="50" rx="12" fill="url(#${id}-c)"/>
  `);
}

function chargeCase(id, seed) {
  return wrap(id, seed, `
    <rect x="120" y="150" width="160" height="110" rx="20" fill="url(#${id}-c)" stroke="url(#${id}-b)" stroke-width="2"/>
    <rect x="120" y="145" width="160" height="14" rx="7" fill="url(#${id}-b)"/>
    <circle cx="200" cy="205" r="10" fill="${BASE.glow}"/>
    <line x1="150" y1="230" x2="250" y2="230" stroke="${BASE.dim}" stroke-width="2"/>
  `);
}

const BUILDERS = { earbuds, watch, speaker, headphones, tracker, chargeCase };

export function productArt(type, seed = 1) {
  const build = BUILDERS[type] || earbuds;
  return build(`p${type}${seed}`, seed);
}

// ---- Portfolio / case-study art: blueprint & process compositions ----

function blueprint(id, seed) {
  const off = seed % 5;
  return `<svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Case study visual">
    <defs>${grad(id + '-b', '#ddc194', '#c9a876', 100)}</defs>
    <rect width="640" height="480" fill="#0d0f14"/>
    <g stroke="#262b35" stroke-width="1">
      ${Array.from({ length: 12 }).map((_, i) => `<line x1="${i * 54}" y1="0" x2="${i * 54}" y2="480"/>`).join('')}
      ${Array.from({ length: 9 }).map((_, i) => `<line x1="0" y1="${i * 54}" x2="640" y2="${i * 54}"/>`).join('')}
    </g>
    <circle cx="${260 + off * 10}" cy="240" r="120" fill="none" stroke="url(#${id}-b)" stroke-width="1.5"/>
    <circle cx="${260 + off * 10}" cy="240" r="80" fill="none" stroke="#6fcfe0" stroke-width="1" stroke-dasharray="4 6"/>
    <path d="M${140 + off * 10} 240 H${380 + off * 10} M${260 + off * 10} 120 V360" stroke="url(#${id}-b)" stroke-width="1"/>
    <rect x="${200 + off * 10}" y="180" width="120" height="120" fill="none" stroke="#8b8e98" stroke-width="1" transform="rotate(45 ${260 + off * 10} 240)"/>
  </svg>`;
}

function waveform(id, seed) {
  const bars = Array.from({ length: 40 }).map((_, i) => {
    const h = 30 + Math.abs(Math.sin((i + seed) * 0.6)) * 160;
    return `<rect x="${i * 16}" y="${240 - h / 2}" width="8" height="${h}" fill="${i % 5 === 0 ? '#c9a876' : '#383e4b'}" rx="3"/>`;
  }).join('');
  return `<svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Case study visual">
    <rect width="640" height="480" fill="#0d0f14"/>
    <g transform="translate(0 -10)">${bars}</g>
  </svg>`;
}

function sensorGrid(id, seed) {
  const dots = [];
  for (let x = 0; x < 8; x++) for (let y = 0; y < 6; y++) {
    const active = (x + y + seed) % 5 === 0;
    dots.push(`<circle cx="${70 + x * 72}" cy="${60 + y * 72}" r="${active ? 7 : 3}" fill="${active ? '#6fcfe0' : '#383e4b'}"/>`);
  }
  return `<svg viewBox="0 0 640 480" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="display:block" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Case study visual">
    <rect width="640" height="480" fill="#0d0f14"/>
    ${dots.join('')}
  </svg>`;
}

const CASE_BUILDERS = [blueprint, waveform, sensorGrid];

export function portfolioArt(seed = 1) {
  const build = CASE_BUILDERS[seed % CASE_BUILDERS.length];
  return build(`w${seed}`, seed);
}
