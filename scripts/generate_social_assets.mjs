import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'public/images/social');

const palette = {
  ink: '#0b1016',
  panel: '#111827',
  panelSoft: '#151f2e',
  text: '#f6f7fb',
  muted: '#c5cbd6',
  faint: '#7d8594',
  red: '#c9342d',
  redSoft: '#e59a96',
  blue: '#6ea1ff',
};

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(text, maxChars) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function textLines(lines, x, y, size, lineHeight, fill, weight = 600) {
  return lines
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" class="sans" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(line)}</text>`
    )
    .join('\n');
}

async function imageDataUri(relativePath) {
  const absolutePath = path.join(root, 'public', relativePath);
  const ext = path.extname(relativePath).toLowerCase();
  const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png';
  const data = await fs.readFile(absolutePath);
  return `data:${mime};base64,${data.toString('base64')}`;
}

async function resizedJpegDataUri(relativePath, width, height) {
  const absolutePath = path.join(root, 'public', relativePath);
  const data = await sharp(absolutePath)
    .resize(width, height, { fit: 'cover', position: sharp.strategy.attention })
    .jpeg({ quality: 86, mozjpeg: true })
    .toBuffer();

  return `data:image/jpeg;base64,${data.toString('base64')}`;
}

function initialsForName(name) {
  const cleaned = name.replace(/\b(dr|prof|professor)\.?\s+/gi, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function shellSvg({ title, kicker, description, sideNotes, logoDataUri }) {
  const titleLines = wrapText(title, 26).slice(0, 3);
  const descLines = wrapText(description, 58).slice(0, 2);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      .sans { font-family: -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif; letter-spacing: 0; }
    </style>
    <linearGradient id="glow" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1b2637"/>
      <stop offset="1" stop-color="#0b1016"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="rgba(255,255,255,0.055)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${palette.ink}"/>
  <rect width="1200" height="630" fill="url(#glow)" opacity="0.96"/>
  <rect x="0" y="0" width="1200" height="630" fill="url(#grid)" opacity="0.42"/>
  <path d="M80 104H1120M80 588H1120" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>
  <path d="M80 104H250" stroke="${palette.red}" stroke-width="4"/>
  <path d="M912 104V588" stroke="rgba(255,255,255,0.10)" stroke-width="1"/>

  <image href="${logoDataUri}" x="78" y="145" width="500" height="150" preserveAspectRatio="xMinYMid meet"/>
  <text x="82" y="340" class="sans" font-size="24" font-weight="700" fill="${palette.redSoft}" letter-spacing="4">${escapeXml(kicker)}</text>
  ${textLines(titleLines, 82, 410, 52, 60, palette.text, 750)}
  ${textLines(descLines, 82, 512, 26, 34, palette.muted, 430)}

  ${sideNotes
    .map(
      (note, index) =>
        `<text x="938" y="${170 + index * 52}" class="sans" font-size="24" font-weight="700" fill="${palette.redSoft}">${escapeXml(note)}</text>`
    )
    .join('\n')}
  <text x="938" y="430" class="sans" font-size="21" font-weight="500" fill="${palette.faint}">iotrustlab.com</text>
</svg>`;
}

function newsSvg({ logoDataUri, portraitDataUri }) {
  const titleLines = wrapText('Luis Garcia Breaks Down AI Guardrails and Mythos on KPCW', 25).slice(0, 4);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      .sans { font-family: -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif; letter-spacing: 0; }
    </style>
    <linearGradient id="fade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="rgba(11,16,22,0.12)"/>
      <stop offset="0.58" stop-color="rgba(11,16,22,0.82)"/>
      <stop offset="1" stop-color="#0b1016"/>
    </linearGradient>
    <pattern id="paper" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M42 0H0v42" fill="none" stroke="rgba(255,255,255,0.045)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="${palette.ink}"/>
  <image href="${portraitDataUri}" x="0" y="-72" width="510" height="765" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1200" height="630" fill="url(#fade)"/>
  <rect x="454" y="0" width="746" height="630" fill="url(#paper)" opacity="0.55"/>
  <path d="M530 96H1108M530 530H1108M530 550H1108" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
  <path d="M530 96H668M530 530H720" stroke="${palette.red}" stroke-width="4"/>

  <image href="${logoDataUri}" x="530" y="132" width="340" height="102" preserveAspectRatio="xMinYMid meet"/>
  <text x="532" y="288" class="sans" font-size="24" font-weight="800" fill="${palette.redSoft}" letter-spacing="4">MEDIA NOTE</text>
  ${textLines(titleLines, 532, 358, 48, 56, palette.text, 780)}
  <text x="532" y="558" class="sans" font-size="24" font-weight="500" fill="${palette.muted}">KPCW Mountain Money  |  May 18, 2026</text>
</svg>`;
}

function profileSvg({ logoDataUri, person, portraitDataUri }) {
  const hasPortrait = Boolean(portraitDataUri);
  const nameLines = wrapText(person.name, 22).slice(0, 2);
  const title = person.title || person.role;
  const department = person.department || 'Kahlert School of Computing';
  const affiliation = person.university || 'University of Utah';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <style>
      .sans { font-family: -apple-system, BlinkMacSystemFont, "Inter", "Helvetica Neue", Arial, sans-serif; letter-spacing: 0; }
    </style>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#151f2e"/>
      <stop offset="1" stop-color="#0b1016"/>
    </linearGradient>
    <linearGradient id="portraitFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="rgba(11,16,22,0.02)"/>
      <stop offset="0.64" stop-color="rgba(11,16,22,0.16)"/>
      <stop offset="1" stop-color="#0b1016"/>
    </linearGradient>
    <pattern id="profileGrid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#profileGrid)" opacity="0.45"/>
  ${
    hasPortrait
      ? `<image href="${portraitDataUri}" x="0" y="0" width="452" height="630" preserveAspectRatio="xMidYMid slice"/>
  <rect x="0" y="0" width="520" height="630" fill="url(#portraitFade)"/>
  <path d="M452 72V558" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>`
      : `<rect x="82" y="136" width="328" height="328" rx="24" fill="#a9d0bd"/>
  <text x="246" y="332" text-anchor="middle" dominant-baseline="middle" class="sans" font-size="106" font-weight="800" fill="#102019">${escapeXml(initialsForName(person.name))}</text>
  <path d="M82 500H410" stroke="rgba(255,255,255,0.14)" stroke-width="1"/>`
  }

  <path d="M500 96H1110M500 548H1110" stroke="rgba(255,255,255,0.11)" stroke-width="1"/>
  <path d="M500 96H660" stroke="${palette.red}" stroke-width="4"/>
  <image href="${logoDataUri}" x="500" y="132" width="330" height="100" preserveAspectRatio="xMinYMid meet"/>
  <text x="502" y="286" class="sans" font-size="24" font-weight="800" fill="${palette.redSoft}" letter-spacing="4">${escapeXml(person.role.toUpperCase())}</text>
  ${textLines(nameLines, 500, 362, 58, 66, palette.text, 800)}
  <text x="502" y="${nameLines.length > 1 ? 494 : 430}" class="sans" font-size="30" font-weight="520" fill="${palette.muted}">${escapeXml(title)}</text>
  <text x="502" y="${nameLines.length > 1 ? 536 : 474}" class="sans" font-size="24" font-weight="430" fill="${palette.faint}">${escapeXml(department)}</text>
  <text x="502" y="${nameLines.length > 1 ? 572 : 510}" class="sans" font-size="24" font-weight="430" fill="${palette.faint}">${escapeXml(affiliation)}</text>
</svg>`;
}

async function renderPng(svg, outputName) {
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(path.join(outDir, outputName));
}

async function loadProfiles() {
  const profilesDir = path.join(root, 'src/data/profiles');
  const files = (await fs.readdir(profilesDir)).filter((file) => file.endsWith('.json')).sort();

  return Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(profilesDir, file), 'utf8');
      return JSON.parse(raw);
    })
  );
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });

  const logoDataUri = await imageDataUri('images/iotrust-logo-dark.png');
  const portraitDataUri = await imageDataUri('images/news/luis-garcia-kpcw-mythos.jpg');

  await renderPng(
    shellSvg({
      logoDataUri,
      kicker: 'UNIVERSITY OF UTAH RESEARCH LAB',
      title: 'Trustworthy cyber-physical systems research',
      description: 'Security, formal methods, digital twins, sensing, and resilient autonomy.',
      sideNotes: ['CPS SECURITY', 'DIGITAL TWINS', 'FORMAL METHODS', 'SENSING'],
    }),
    'iotrust-lab-og.png'
  );

  await renderPng(
    shellSvg({
      logoDataUri,
      kicker: 'RESEARCH THEMES',
      title: 'Semantics, verification, and sensing for CPS',
      description: 'A structured map of active IoTrust Lab research directions and funded systems work.',
      sideNotes: ['SECURITY', 'VERIFICATION', 'PRIVACY', 'NEURO IOT'],
    }),
    'iotrust-research-og.png'
  );

  await renderPng(
    shellSvg({
      logoDataUri,
      kicker: 'PUBLICATIONS',
      title: 'Recent papers and lab results',
      description: 'A searchable index of IoTrust Lab work across CPS security and trustworthy autonomy.',
      sideNotes: ['PAPERS', 'VENUES', 'AUTHORS', 'ARTIFACTS'],
    }),
    'iotrust-publications-og.png'
  );

  await renderPng(
    shellSvg({
      logoDataUri,
      kicker: 'NEWS',
      title: 'Lab notes, awards, and research milestones',
      description: 'A running record of IoTrust Lab announcements and media coverage.',
      sideNotes: ['DISPATCHES', 'AWARDS', 'MEDIA', 'RELEASES'],
    }),
    'iotrust-news-og.png'
  );

  await renderPng(newsSvg({ logoDataUri, portraitDataUri }), 'iotrust-news-mythos-og.png');

  const profiles = await loadProfiles();
  for (const person of profiles) {
    const hasUsablePhoto =
      person.image &&
      person.image !== '/images/profile-avatar-placeholder.png' &&
      !person.image.includes('profile-avatar-placeholder');
    const personPortraitDataUri = hasUsablePhoto
      ? await resizedJpegDataUri(person.image.replace(/^\//, ''), 452, 630)
      : null;

    await renderPng(
      profileSvg({
        logoDataUri,
        person,
        portraitDataUri: personPortraitDataUri,
      }),
      `profile-${person.id}.png`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
