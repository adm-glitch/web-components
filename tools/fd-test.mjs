#!/usr/bin/env node
// Friday DS · component tests in a real browser (Chromium via playwright-core), against playground/standalone.html and a
// blank page. No test framework: each check prints ok/FAIL; exit 1 on any failure.
//   PLAYWRIGHT_CORE=/path/to/playwright-core/index.mjs node tools/fd-test.mjs
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { chromium } = await import(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const PG = 'file://' + path.join(ROOT, 'playground/standalone.html');
let fails = 0, n = 0;
const ok = (cond, name, extra = '') => { n++; if (cond) console.log('ok  ', name); else { fails++; console.log('FAIL', name, extra); } };
const b = await chromium.launch();
const PG6 = 'file://' + path.join(ROOT, 'playground/console-standalone.html');
const open = async ({ w = 1440, h = 900, dpr = 1, th = 'dark', reduced = 'no-preference', touch = false, url = PG } = {}) => {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, reducedMotion: reduced, hasTouch: touch });
  const p = await ctx.newPage(); p._errs = []; p.on('pageerror', (e) => p._errs.push(e.message));
  await p.goto(url + '#' + encodeURIComponent(JSON.stringify({ th })));
  await p.waitForSelector('body[data-ready="1"]', { timeout: 20000 }); await p.waitForTimeout(300);
  return p;
};

// 1 · desktop dark: structure, links, events
{
  const p = await open();
  const tags = ['fd-panel', 'fd-dial', 'fd-ask-row', 'fd-run-row', 'fd-ledger', 'fd-rail', 'fd-state', 'fd-button', 'fd-steer', 'fd-decision', 'fd-table', 'fd-spotlight'];
  ok(await p.evaluate((t) => t.every((x) => !!customElements.get(x)), tags), 'all 12 components defined');
  ok(p._errs.length === 0, 'no page errors', p._errs.join(' | '));
  // dial: per-segment links only with a fine pointer on desktop; the whole dial is one link otherwise
  const seg = await p.evaluate(() => document.querySelector('#dials fd-dial').shadowRoot.querySelectorAll('svg a').length);
  ok(seg === 5, 'desktop + fine pointer: one link per segment (Marquatica 5)', seg);
  const one = await p.evaluate(() => { const d = document.querySelector('#v-count fd-dial'); const a = d.shadowRoot.querySelectorAll('a'); return [a.length, a[0]?.getAttribute('aria-label')]; });
  ok(one[0] === 1 && /5 fronts, 2 running, 1 idle, 1 done today, 1 for you\. Opens the company page/.test(one[1]), 'dial without per-segment: one link with counts in its name', one[1]);
  // many fronts: +k and a need never hidden
  const many = await p.evaluate(() => { const d = document.querySelector('#d-many'); const s = [...d.shadowRoot.querySelectorAll('path.seg')]; return [s.length, s.some((x) => x.dataset.s === 'need'), d.shadowRoot.textContent.match(/\+\d+/)?.[0]]; });
  ok(many[0] + Number(many[2]?.slice(1)) === 16 && many[1], 'many fronts: drawn + "+k" = 16 and the need is drawn', JSON.stringify(many));
  // segment ↔ row
  await p.hover('#dials fd-dial >> svg a[data-id="m4"]');
  ok(await p.evaluate(() => document.querySelector('#p-run fd-run-row[front="m4"]').hasAttribute('highlight')), 'pointing at a segment lights its row');
  await p.hover('#p-run fd-run-row[front="m1"]');
  ok(await p.evaluate(() => document.querySelector('#dials fd-dial').shadowRoot.querySelector('path.seg.hl')?.dataset.id === 'm1'), 'pointing at a row lights its segment');
  // run row: a meter only with a real count
  const meters = await p.evaluate(() => [...document.querySelectorAll('#p-run fd-run-row')].map((r) => !!r.shadowRoot.querySelector('[role=meter]')));
  ok(meters.filter(Boolean).length === 1, 'in progress: exactly one meter (the only row with a real count)', meters);
  // ask row: equal buttons, suggestion outline, single primary
  const ask = await p.evaluate(() => { const r = document.querySelector('#p-need fd-ask-row'); const bs = [...r.shadowRoot.querySelectorAll('button')]; return bs.map((b) => [b.textContent, b.className, Math.round(b.getBoundingClientRect().height)]); });
  ok(ask.length === 2 && ask[0][1] === 'btn' && ask[1][1] === 'btn suggest' && ask[0][2] === ask[1][2], 'yes/no equal size; the suggestion is the outline, not a fill', JSON.stringify(ask));
  const single = await p.evaluate(() => document.querySelectorAll('#p-need fd-ask-row')[1].shadowRoot.querySelector('a.btn, button').className);
  ok(single === 'btn primary', 'a single action is the amber button (a link to its front)', single);
  // answer → answered + Undo + dial need stops + rail "You:" line; Undo → back
  const before = await p.evaluate(() => document.querySelector('#dials fd-dial').shadowRoot.querySelectorAll('.halo').length);
  await p.click('#p-need fd-ask-row >> button[data-v="Yes"]');
  const after = await p.evaluate(() => { const r = document.querySelector('#p-need fd-ask-row'); return { st: r.getAttribute('state'), undo: !!r.shadowRoot.querySelector('[data-undo]'), focus: r.shadowRoot.activeElement?.textContent, live: r.shadowRoot.querySelector('[role=status]').textContent, halo: document.querySelector('#dials fd-dial').shadowRoot.querySelectorAll('.halo').length, rail: document.querySelector('#rail').shadowRoot.querySelector('li:last-child').textContent }; });
  ok(after.st === 'answered' && after.undo && after.focus === 'Undo', 'answered: Undo shown and focused', JSON.stringify(after));
  ok(/Answered .*Yes\. Undo available/.test(after.live), 'answer announced in a polite live region', after.live);
  ok(before === 1 && after.halo === 0, 'the breath on the dial stops when he answers');
  ok(/^09|^\d\d:\d\dYou: yes/.test(after.rail) && after.rail.includes('You:'), 'his answer comes back in Just now as "You: …"', after.rail);
  await p.click('#p-need fd-ask-row >> [data-undo]');
  const undone = await p.evaluate(() => { const r = document.querySelector('#p-need fd-ask-row'); return [r.getAttribute('state'), r.shadowRoot.activeElement?.textContent, document.querySelector('#dials fd-dial').shadowRoot.querySelectorAll('.halo').length]; });
  ok(undone[0] === 'open' && undone[1] === 'Yes' && undone[2] === 1, 'Undo puts the row and the breath back, focus on the chosen button', JSON.stringify(undone));
  // the leave: with a short undo window the row leaves and fires fd-leave
  const left = await p.evaluate(() => new Promise((res) => { const r = document.querySelector('#p-need fd-ask-row'); r.setAttribute('undo-window', '150'); r.addEventListener('fd-leave', () => res(r.hidden), { once: true }); r.shadowRoot.querySelector('button[data-v="No"]').click(); setTimeout(() => res('timeout'), 2000); }));
  ok(left === true, 'after the undo window the row leaves (fd-leave, hidden)', left);
  // confirm flow: busy until the host confirms
  const busy = await p.evaluate(() => { const r = document.createElement('fd-ask-row'); r.setAttribute('confirm', ''); r.setAttribute('question', 'Q?'); r.setAttribute('keep', ''); document.body.append(r); r.shadowRoot.querySelector('button[data-v="Yes"]').click(); const s1 = [r.getAttribute('state'), r.shadowRoot.querySelector('button[data-v="Yes"]').textContent, r.shadowRoot.querySelector('button').disabled]; r.setAttribute('state', 'answered'); const s2 = r.getAttribute('state'); r.remove(); return [...s1, s2]; });
  ok(busy[0] === 'busy' && busy[1] === 'Yes · sending' && busy[2] && busy[3] === 'answered', 'confirm: busy (still, buttons disabled) until the host confirms', JSON.stringify(busy));
  // cancelable
  const cancel = await p.evaluate(() => { const r = document.createElement('fd-ask-row'); r.setAttribute('question', 'Q?'); document.body.append(r); r.addEventListener('fd-answer', (e) => e.preventDefault()); r.shadowRoot.querySelector('button').click(); const s = r.getAttribute('state'); r.remove(); return s; });
  ok(cancel === null || cancel === 'open', 'fd-answer is cancelable (row stays open)', cancel);
  // motion: the only running animations are the breath halos (one loop rule)
  const anims = await p.evaluate(() => { const all = []; const walk = (root) => { root.querySelectorAll('*').forEach((el) => { el.getAnimations?.().filter((a) => a.constructor.name === 'CSSAnimation' && a.effect.getTiming().iterations === Infinity).forEach((a) => all.push((el.getAttribute('class') || el.tagName) + ':' + (a.animationName || a.constructor.name))); if (el.shadowRoot) walk(el.shadowRoot); }); }; walk(document); return all; });
  ok(anims.length > 0 && anims.every((a) => /^halo:breath/.test(a)), 'only the breath loops (one loop only, motion rule)', JSON.stringify([...new Set(anims)]));
  // loading has no shimmer
  ok(await p.evaluate(() => document.querySelector('fd-state[kind=loading]').shadowRoot.querySelector('.sk').getAnimations({ subtree: true }).length === 0), 'loading skeleton is still (no shimmer loop)');
  // stale panel: amber and company colours are off inside it
  const stale = await p.evaluate(() => { const d = document.querySelector('#v-stale fd-dial'); const cs = getComputedStyle(d); return [cs.getPropertyValue('--fd-amb').trim(), cs.getPropertyValue('--fd-mq').trim(), d.shadowRoot.querySelector('.halo'), d.shadowRoot.querySelector('.name').textContent]; });
  ok(stale[0] !== '#E9880B' && stale[1] !== '#4287EB' && stale[2] === null && /1 for you at 09:58/.test(stale[3]), 'stale panel: no amber, no company colour, no light, "for you at 09:58"', JSON.stringify(stale));
  // the breath runs on one clock: every halo on the page is in the same phase (lens 9)
  const phases = await p.evaluate(() => { const t = []; document.querySelectorAll('fd-dial').forEach((d) => d.shadowRoot.querySelectorAll('.halo').forEach((h) => h.getAnimations().forEach((a) => t.push(Number(a.currentTime) % 4500)))); return t; });
  const spread = Math.max(...phases) - Math.min(...phases);
  ok(phases.length >= 4 && (spread < 120 || spread > 4380), 'every breath on the page is in step (one shared clock)', JSON.stringify(phases.map(Math.round)));
  // highlight never rebuilds: keyboard focus on a segment survives the row light (lens 1, 9)
  await p.mouse.move(2, 2); await p.waitForTimeout(100);
  const kept = await p.evaluate(async () => { const d = document.querySelector('#dials fd-dial'); const a = d.shadowRoot.querySelector('svg a[data-id="m4"]'); a.focus(); await new Promise((r) => setTimeout(r, 50)); return [d.shadowRoot.activeElement === a, document.querySelector('#p-run fd-run-row[front="m4"]').hasAttribute('highlight')]; });
  ok(kept[0] && kept[1], 'focus on a dial segment survives the segment ↔ row highlight', JSON.stringify(kept));
  // focus never looks like the suggestion: dashed ring with a gap vs a solid border
  const ring = await p.evaluate(() => { const b = document.querySelector('#btns fd-button[show-state=focus]'); return getComputedStyle(b.shadowRoot.querySelector('.btn')).outlineStyle; });
  ok(ring === 'dashed', 'focus ring is dashed (Friday\'s suggestion is solid)', ring);
  // stale answer rows wait for a confirm
  const sa = await p.evaluate(() => { const r = document.createElement('fd-ask-row'); r.setAttribute('question', 'Q?'); r.setAttribute('stale', '09:58'); r.setAttribute('keep', ''); document.body.append(r); const t = r.shadowRoot.textContent; r.shadowRoot.querySelector('button[data-v="Yes"]').click(); const st = r.getAttribute('state'); r.remove(); return [st, /Friday checks before sending/.test(t)]; });
  ok(sa[0] === 'busy' && sa[1], 'on stale data an answer waits for the confirm and says so', JSON.stringify(sa));
  // a single action with a place to go is a link, not an answer
  const door = await p.evaluate(() => { const r = document.createElement('fd-ask-row'); r.setAttribute('question', 'Q?'); r.setAttribute('options', 'Open'); r.setAttribute('href', '#x'); document.body.append(r); const a = r.shadowRoot.querySelector('a.btn.primary'); const out = [!!a, !r.shadowRoot.querySelector('button[data-v]')]; r.remove(); return out; });
  ok(door[0] && door[1], 'a single action with href is a link (a door, not a vote)', JSON.stringify(door));
  // component 7: steer, decision, table, spotlight, usage-gauge in the language
  const steer = await p.evaluate(async () => { const s = document.querySelector('#steer fd-steer:not([confirm])'); let got = null; s.addEventListener('fd-steer', (e) => (got = e.detail.text), { once: true });
    const t = s.shadowRoot.querySelector('textarea'); t.value = 'Only leads from Belém this week'; t.dispatchEvent(new Event('input'));
    t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true, bubbles: true })); await new Promise((r) => setTimeout(r, 50));
    return [got, s.getAttribute('state'), s.shadowRoot.querySelector('.sent')?.textContent.includes('Only leads from Belém'), s.shadowRoot.querySelector('textarea').value]; });
  ok(steer[0] === 'Only leads from Belém this week' && steer[1] === 'sent' && steer[2] && steer[3] === '', 'steer: Ctrl+Enter sends, the sent text stays readable, the box empties', JSON.stringify(steer));
  const enterNl = await p.evaluate(() => { const s = document.createElement('fd-steer'); document.body.append(s); let fired = false; s.addEventListener('fd-steer', () => (fired = true)); const t = s.shadowRoot.querySelector('textarea'); t.value = 'a'; t.dispatchEvent(new Event('input')); t.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); const b = s.shadowRoot.querySelector('button.send').disabled; s.remove(); return [fired, b]; });
  ok(!enterNl[0] && !enterNl[1], 'steer: Enter alone does not send (dictated notes)', JSON.stringify(enterNl));
  const dec = await p.evaluate(async () => { const d = document.querySelector('#decision fd-decision[note-box]'); const bs = [...d.shadowRoot.querySelectorAll('button[data-v]')].map((b) => b.className); const docs = d.querySelectorAll('[slot^=doc]').length; const ta = d.shadowRoot.querySelector('textarea'); ta.value = 'pilot only'; let got; d.addEventListener('fd-answer', (e) => (got = e.detail), { once: true }); d.shadowRoot.querySelector('button[data-v="HubSpot"]').click(); await new Promise((r) => setTimeout(r, 30)); const done = d.shadowRoot.querySelector('.done')?.textContent; d.shadowRoot.querySelector('[data-change]').click(); return [bs, docs, got, done, d.getAttribute('state')]; });
  ok(dec[0][0] === 'btn suggest' && dec[0][1] === 'btn' && dec[1] === 2 && dec[2]?.note === 'pilot only' && /You chose HubSpot/.test(dec[3]) && dec[4] === 'open', 'decision: equal options + outline, doc slots, note sent, answered, Change reopens', JSON.stringify(dec));
  const tbl = await p.evaluate(() => [...document.querySelectorAll('#table fd-table')].map((t) => [getComputedStyle(t.shadowRoot.querySelector('table')).display, getComputedStyle(t.shadowRoot.querySelector('.cards')).display]));
  ok(tbl[0][0] === 'table' && tbl[0][1] === 'none' && tbl[1][0] === 'none' && tbl[1][1] === 'block', 'table: a real table when wide, cards when narrow', JSON.stringify(tbl));
  const spot = await p.evaluate(() => new Promise((res) => { const s = document.createElement('fd-spotlight'); s.setAttribute('label', 'x'); s.setAttribute('for', '120'); document.body.append(s); s.setAttribute('active', ''); const inf = s.shadowRoot.querySelector('.wrap').getAnimations().some((a) => a.effect.getTiming().iterations === Infinity); s.addEventListener('fd-spotlight-end', (e) => { res([inf, e.detail.reason, s.hasAttribute('active')]); s.remove(); }); setTimeout(() => res('timeout'), 2000); }));
  ok(Array.isArray(spot) && spot[0] === false && spot[1] === 'time' && spot[2] === false, 'spotlight: one entrance (no loop), ends by itself', JSON.stringify(spot));
  const ug = await p.evaluate(() => { const g = document.querySelector('#gauge usage-gauge[weekly="100"]'); const cs = getComputedStyle(g); return [cs.getPropertyValue('--ug-critical-color').trim(), cs.getPropertyValue('--ug-idle-color').trim()]; });
  ok(/fd-text|#ECE8E1/i.test(ug[0]) && /fd-muted|#9A968F/i.test(ug[1]), 'usage-gauge takes the Friday colours (at the limit = text colour, idle = muted, never red)', JSON.stringify(ug));
  // never-words on screen (language.md, English and Portuguese)
  const text = await p.evaluate(() => { let t = document.body.innerText; const walk = (root) => root.querySelectorAll('*').forEach((el) => { if (el.shadowRoot) { t += ' ' + el.shadowRoot.textContent; walk(el.shadowRoot); } }); walk(document); return t; });
  const never = text.match(/\b(overdue|urgent|failed|missed|dashboard|still|again|atrasad[oa]|vencid[oa]|pendente|urgente|falhou|ainda|de novo)\b/i);
  ok(!never, 'no never-word on screen', never?.[0]);
  await p.context().close();
}
// 1b · component 9: manifest and icons
{
  const m = JSON.parse(fs.readFileSync(path.join(ROOT, 'fd-app/manifest.webmanifest'), 'utf8'));
  const miss = m.icons.filter((i) => !fs.existsSync(path.join(ROOT, 'fd-app', i.src)));
  ok(m.name === 'Friday' && m.display === 'standalone' && m.icons.some((i) => i.purpose === 'maskable') && miss.length === 0 && /^#/.test(m.theme_color), 'manifest: name, standalone, maskable icon, every icon file present', JSON.stringify(miss));
  const svg = fs.readFileSync(path.join(ROOT, 'fd-app/icon.svg'), 'utf8');
  const amb = JSON.parse(fs.readFileSync(path.join(ROOT, 'fd-tokens/tokens/color.dark.json'), 'utf8')).color.mark.amb.$value.hex;
  ok(!svg.toUpperCase().includes(amb.toUpperCase()), 'the icon carries no amber (it never asks for anything)');
}
// 2 · phone: targets and the whole dial as one link
for (const th of ['dark', 'light']) {
  const p = await open({ w: 390, h: 844, dpr: 2, th, touch: true });
  const small = await p.evaluate(() => { const bad = []; const walk = (root) => root.querySelectorAll('button, a').forEach((el) => { const r = el.getBoundingClientRect(); if (r.width && r.height && el.closest('.nav') === null && (r.height < 43.5 || r.width < 43.5)) bad.push((el.textContent || el.getAttribute('aria-label') || el.tagName).trim().slice(0, 24) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); }); const all = (root) => { walk(root); root.querySelectorAll('*').forEach((el) => el.shadowRoot && all(el.shadowRoot)); }; all(document); return bad; });
  ok(small.length === 0, `phone ${th}: every control is at least 44 × 44`, JSON.stringify(small.slice(0, 8)));
  const links = await p.evaluate(() => document.querySelector('#dials fd-dial').shadowRoot.querySelectorAll('a').length);
  ok(links === 1, `phone ${th}: the whole dial is one link`, links);
  const wide = await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1);
  ok(wide, `phone ${th}: no sideways scroll`);
  // contrast of every button label on its own background (text ≥ 4.5:1)
  const con = await p.evaluate(() => {
    const rgb = (s) => (s.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
    const L = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
    const cr = (a, b) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
    const surf = rgb(getComputedStyle(document.documentElement).getPropertyValue('--fd-surface').trim().replace('#', '').match(/../g).map((h) => parseInt(h, 16)).join(','));
    const out = [];
    document.querySelectorAll('#btns fd-button:not([disabled])').forEach((f) => { const el = f.shadowRoot.querySelector('.btn'); const cs = getComputedStyle(el); const bg = cs.backgroundColor === 'rgba(0, 0, 0, 0)' ? surf : rgb(cs.backgroundColor); out.push([f.textContent + '/' + (f.getAttribute('show-state') || 'rest'), +cr(rgb(cs.color), bg).toFixed(2)]); });
    return out;
  });
  const low = con.filter(([, r]) => r < 4.5);
  ok(con.length >= 16 && low.length === 0, `${th}: every button label ≥ 4.5:1 in every state`, JSON.stringify(low));
  await p.context().close();
}
// 2b · S6 Console compositions (lens 9: the screens get the same checks)
for (const th of ['dark', 'light']) {
  const p = await open({ url: PG6, th });
  ok(p._errs.length === 0, `console ${th}: no page errors`, p._errs.join(' | '));
  const loops = await p.evaluate(() => { const all = []; const walk = (root) => root.querySelectorAll('*').forEach((el) => { el.getAnimations?.().filter((a) => a.effect.getTiming().iterations === Infinity).forEach((a) => all.push(el.getAttribute('class') || el.tagName)); if (el.shadowRoot) walk(el.shadowRoot); }); walk(document); return [...new Set(all)]; });
  ok(loops.every((c) => c === 'halo'), `console ${th}: only the breath loops`, JSON.stringify(loops));
  const front = await p.evaluate(() => { const d = document.querySelector('#front-dial'); const need = [...d.shadowRoot.querySelectorAll('path.seg[data-s=need]')].map((x) => x.dataset.id); return [need, d.getAttribute('highlight')]; });
  ok(front[0].includes(front[1]), `console ${th}: the front page's dial lights the front the page is about`, JSON.stringify(front));
  // G1 fd-nav and G6 fd-look
  const nav = await p.evaluate(() => { const n = document.querySelector('fd-nav'); const cur = n.shadowRoot.querySelector('[aria-current=page]'); const need = n.shadowRoot.querySelector('.tab .need'); return [cur?.textContent, !!need, getComputedStyle(cur, '::after').backgroundColor !== getComputedStyle(n).getPropertyValue('--fd-amb')]; });
  ok(nav[0].startsWith('Decide') && nav[1] && nav[2], `console ${th}: nav marks the current tab (not amber) and a dot where something is his`, JSON.stringify(nav));
  const look = await p.evaluate(async () => { const l = document.querySelector('fd-look'); const sr = l.shadowRoot; const send = sr.querySelector('.send .btn'); const d0 = send.disabled;
    const imgs = [...sr.querySelectorAll('figure img')].map((i) => [i.naturalWidth, i.naturalHeight, Math.round(i.getBoundingClientRect().width), Math.round(i.getBoundingClientRect().height)]);
    sr.querySelector('figure button').click(); const open = sr.querySelector('dialog').open; sr.querySelector('dialog .close').click(); const back = sr.activeElement === sr.querySelector('figure button');
    sr.querySelector('[data-like="1"]').click(); const d1 = sr.querySelector('.send .btn').disabled; const ta = sr.querySelector('textarea'); const h = ta.getBoundingClientRect().height;
    let got; l.addEventListener('fd-look', (e) => (got = e.detail), { once: true }); ta.value = 'good'; ta.dispatchEvent(new Event('input')); sr.querySelector('.send .btn').click();
    return { d0, d1, open, back, h, got, done: sr.querySelector('.done')?.textContent, imgs }; });
  const whole = look.imgs.every(([nw, nh, w, h]) => Math.abs(nw / nh - w / h) < 0.02);
  ok(look.d0 && !look.d1 && look.open && look.back && look.h >= 140 && look.got?.like === true && look.got?.text === 'good' && /Sent · Like/.test(look.done) && whole, `console ${th}: look card: images whole, tap = full size and back, Send waits, box ≥ 140 px, sent`, JSON.stringify(look));
  await p.context().close();
  const q = await open({ url: PG6, th, w: 390, h: 844, dpr: 2, touch: true });
  const small = await q.evaluate(() => { const bad = []; const all = (root) => { root.querySelectorAll('button, a').forEach((el) => { const r = el.getBoundingClientRect(); if (r.width && r.height && (r.height < 43.5 || r.width < 43.5)) bad.push((el.textContent || '').trim().slice(0, 24) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height)); }); root.querySelectorAll('*').forEach((el) => el.shadowRoot && all(el.shadowRoot)); }; all(document); return bad; });
  ok(small.length === 0, `console phone ${th}: every control ≥ 44 × 44`, JSON.stringify(small.slice(0, 6)));
  ok(await q.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `console phone ${th}: no sideways scroll`);
  const bar = await q.evaluate(() => { const t = document.querySelector('fd-nav').shadowRoot.querySelector('.tabs'); const r = t.getBoundingClientRect(); return [getComputedStyle(t).position, Math.round(innerHeight - r.bottom)]; });
  ok(bar[0] === 'fixed' && bar[1] <= 1, `console phone ${th}: tabs sit at the bottom, in thumb reach`, JSON.stringify(bar));
  await q.context().close();
}
// 3 · reduced motion: nothing moves
{
  const p = await open({ reduced: 'reduce' });
  const anims = await p.evaluate(() => { let c = 0; const walk = (root) => root.querySelectorAll('*').forEach((el) => { c += el.getAnimations?.().filter((a) => a.playState === 'running').length || 0; if (el.shadowRoot) walk(el.shadowRoot); }); walk(document); return c; });
  ok(anims === 0, 'reduced motion: no animation runs', anims);
  await p.context().close();
}
// 4 · a component alone on a blank page (no fd-tokens.css): falls back to its own tokens, theme attribute pins
{
  const ctx = await b.newContext({ colorScheme: 'dark' }); const p = await ctx.newPage();
  const src = fs.readFileSync(path.join(ROOT, 'fd-panel/fd-panel.js'), 'utf8');
  await p.setContent('<fd-panel id="a" label="A">x</fd-panel><fd-panel id="b" label="B" theme="light">y</fd-panel>');
  await p.addScriptTag({ content: src, type: 'module' }); await p.waitForTimeout(200);
  const bg = await p.evaluate(() => ['a', 'b'].map((id) => getComputedStyle(document.getElementById(id).shadowRoot.querySelector('.box')).borderTopColor));
  ok(bg[0] === 'rgb(44, 48, 53)' && bg[1] === 'rgb(214, 208, 198)', 'standalone: own token fallbacks; theme="light" pins paper', JSON.stringify(bg));
  await ctx.close();
}
await b.close();
console.log(`\n${n - fails}/${n} passed`);
process.exit(fails ? 1 : 0);
