#!/usr/bin/env node
// Friday DS · component 9: app icon, PWA manifest and splash, drawn from the dial mark and the tokens (no hand colours).
// The icon is the instrument at rest: three segments, one per company in its lit colour, in the fixed dial order
// (Marquatica · Atípica · Pessoal), fine bezel ticks, on the dark field. No amber: the icon never says "needs you".
// Writes fd-app/icon.svg, icon-maskable.svg, icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png (180),
// splash-1290x2796.png (iOS), manifest.webmanifest.
//   PLAYWRIGHT_CORE=/path/to/playwright-core/index.mjs node tools/fd-app.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'fd-app');
const J = (f) => JSON.parse(fs.readFileSync(path.join(ROOT, 'fd-tokens/tokens', f), 'utf8'));
const C = J('color.dark.json').color, SH = J('shape.json').stroke;
const hex = (t) => t.$value.hex;
const field = hex(C.neutral.field), deep = hex(C.neutral['field-deep']), surface = hex(C.neutral.surface), muted = hex(C.neutral.muted), dimT = hex(C['mark-dim'].text);
const marks = ['mq', 'at', 'ps'].map((k) => hex(C.mark[k]));

// the mark on a 512 grid; `safe` shrinks it into the maskable safe zone (80 % circle)
function mark({ size = 512, safe = false, bg = true, rounded = true } = {}) {
  const s = size, c = s / 2, R = s * (safe ? 0.25 : 0.31);
  const a0 = Math.PI * 0.78, a1 = Math.PI * 2.22, sw = R * SH['segment-lit'].$value * 1.35, gap = (sw + s * 0.02) / 2 / R;
  const P = (a, r) => [c + r * Math.cos(a), c + r * Math.sin(a)], f = (v) => v.toFixed(1);
  const arc = (x, y, r) => { const [x0, y0] = P(x, r), [x1, y1] = P(y, r); return `M${f(x0)} ${f(y0)}A${r} ${r} 0 0 1 ${f(x1)} ${f(y1)}`; };
  const seg = (a1 - a0) / 3;
  let g = '';
  for (let j = 0; j <= 3; j++) for (let q = 0; q < (j < 3 ? 4 : 1); q++) {
    const maj = q === 0, a = a0 + seg * (j + q / 4), [x1, y1] = P(a, R * 1.24), [x2, y2] = P(a, R * (maj ? 1.4 : 1.31));
    g += `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${maj ? muted : dimT}" stroke-width="${f(s * (maj ? 0.008 : 0.005))}" stroke-linecap="round"/>`;
  }
  g += `<circle cx="${c}" cy="${c}" r="${f(R * 0.74)}" fill="${surface}"/>`;
  marks.forEach((m, j) => { g += `<path d="${arc(a0 + j * seg + gap, a0 + (j + 1) * seg - gap, R)}" fill="none" stroke="${m}" stroke-width="${f(sw)}" stroke-linecap="round"/>`; });
  const back = bg ? `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${field}"/><stop offset="1" stop-color="${deep}"/></linearGradient></defs><rect width="${s}" height="${s}"${rounded ? ` rx="${s * 0.22}"` : ''} fill="url(#g)"/>` : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">${back}${g}</svg>`;
}
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'icon.svg'), mark() + '\n');
fs.writeFileSync(path.join(OUT, 'icon-maskable.svg'), mark({ safe: true, rounded: false }) + '\n');
const manifest = {
  name: 'Friday', short_name: 'Friday', description: 'Mauricio’s instrument panel', start_url: '/', scope: '/', display: 'standalone',
  orientation: 'any', background_color: deep, theme_color: field, lang: 'en',
  icons: [
    { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
  ],
};
fs.writeFileSync(path.join(OUT, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2) + '\n');
// rasterise in Chromium (exact sizes, no device scale)
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const b = await chromium.launch();
const png = async (svg, w, h, name, bgc = 'transparent') => {
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await p.setContent(`<html><body style="margin:0;background:${bgc};width:${w}px;height:${h}px;display:grid;place-items:center;overflow:hidden">${svg}</body></html>`);
  await p.screenshot({ path: path.join(OUT, name), omitBackground: bgc === 'transparent' }); await p.close(); console.log('fd-app/' + name);
};
const sized = (svg, n) => svg.replace(/width="512" height="512"/, `width="${n}" height="${n}"`);
await png(sized(mark(), 192), 192, 192, 'icon-192.png');
await png(mark(), 512, 512, 'icon-512.png');
await png(mark({ safe: true, rounded: false }), 512, 512, 'icon-maskable-512.png');
await png(sized(mark({ rounded: false }), 180), 180, 180, 'apple-touch-icon.png');
// splash: the field, the mark at rest in the middle, nothing moving (S5 research: splash = field colour, no animation)
await png(sized(mark({ bg: false }), 420), 1290, 2796, 'splash-1290x2796.png', `linear-gradient(180deg,${field},${deep})`);
await b.close();
console.log('fd-app/manifest.webmanifest');
