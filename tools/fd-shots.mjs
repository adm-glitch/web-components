#!/usr/bin/env node
// Friday DS · screenshots of the playground (playground/standalone.html, opened from disk): dark + paper, phone 390 @2x +
// desktop 1440 @1x, the panel home and every section, motion reduced (the breath is a still frame) and, with --motion, on.
//   PLAYWRIGHT_CORE=/path/to/playwright-core/index.mjs node tools/fd-shots.mjs <out-dir> [--motion] [--only home,dial]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const OUT = process.argv[2]; if (!OUT) { console.error('usage: fd-shots.mjs <out-dir>'); process.exit(2); }
fs.mkdirSync(OUT, { recursive: true });
const trough = process.argv.includes('--trough');   // the breath at its faintest (t = half the breath): S5 lens 9
const motion = process.argv.includes('--motion') || trough;
const only = process.argv.includes('--only') ? process.argv[process.argv.indexOf('--only') + 1].split(',') : null;
const SECS = ['home', 'dial', 'ask', 'run', 'done', 'states', 'buttons', 'steer', 'decision', 'table', 'gauge', 'spotlight', 'app', 'open'];
const url = 'file://' + path.join(ROOT, 'playground/standalone.html');
const b = await chromium.launch();
const shot = async (th, dev) => {
  const [w, h, dpr] = dev === 'phone' ? [390, 844, 2] : [1440, 900, 1];
  const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: motion ? 'no-preference' : 'reduce', hasTouch: dev === 'phone' });
  const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await p.goto(url + '#' + encodeURIComponent(JSON.stringify({ th })));
  await p.waitForSelector('body[data-ready="1"]', { timeout: 20000 }); await p.waitForTimeout(400);
  if ((await p.evaluate(() => document.body.dataset.face)) === 'missing') throw new Error('Figtree not loaded');
  // --motion = the breath at its brightest (t = 0), --trough = at its faintest (t = half): two different frames (r2 lens 9)
  if (motion) await p.evaluate((tt) => { const walk = (r) => r.querySelectorAll('*').forEach((el) => { if (el.classList?.contains('halo')) el.getAnimations().forEach((a) => { a.pause(); a.currentTime = tt; }); if (el.shadowRoot) walk(el.shadowRoot); }); walk(document); }, trough ? 2250 : 0);
  if (false) await p.evaluate(() => { const walk = (r) => r.querySelectorAll('*').forEach((el) => { if (el.classList?.contains('halo')) el.getAnimations().forEach((a) => { a.pause(); a.currentTime = 2250; }); if (el.shadowRoot) walk(el.shadowRoot); }); walk(document); });
  const t = th === 'light' ? 'papel' : 'dark', tag = trough ? '-trough' : motion ? '-motion' : '';
  for (const s of SECS) {
    if (only && !only.includes(s)) continue;
    await p.evaluate(() => scrollTo(0, 0)); const el = await p.$('#' + s); const bb = await el.boundingBox(), m = 24;
    const f = path.join(OUT, `s5-${s}-${t}-${dev}${tag}.png`);
    await p.screenshot({ path: f, fullPage: true, clip: { x: Math.max(0, bb.x - m), y: Math.max(0, bb.y - m), width: Math.min(w, bb.width + 2 * m), height: bb.height + 2 * m } });
    console.log(f);
  }
  if (!only) { const f = path.join(OUT, `s5-page-${t}-${dev}${tag}.png`); await p.screenshot({ path: f, fullPage: true }); console.log(f); }
  if (errs.length) { console.error('page errors:', errs.join(' | ')); process.exitCode = 1; }
  await p.close();
};
for (const th of ['dark', 'light']) for (const dev of ['desktop', 'phone']) await shot(th, dev);
await b.close();
