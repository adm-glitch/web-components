#!/usr/bin/env node
// Friday DS · surface lint: the CSS of every fd-* component (and tools/fd-shared.js) against the fd-tokens, so the DS does
// not slide back to the generic look between rounds. No browser, no dependencies. Rules adapted from unslop-ui's surface
// tells U17-U20 (MIT, github.com/felipebasurto/unslop-ui), reimplemented for the tokens here:
//   gradient     linear/radial/conic-gradient( (a repeating- hatch is a pattern, not a gradient) or background-clip:text
//   glow         a coloured 0 0 Npx box-shadow/text-shadow or drop-shadow( typed by hand; var(--_btn-glow) is the token
//   off-scale    margin/padding/gap/inset in px outside the --fd-sp-* scale (0 1 2 4 8 12 16 24 32 48 64)
//   heavy        font-weight 800/900 (the DS stops at --fd-fw-strong 600)
//   transition   transition: all / transition-property: all
//   hover-move   a :hover rule that scales, translates or changes layout (phone first: hover never moves anything)
// Known, deliberate exceptions live in tools/fd-lint-allow.json (file + rule + the matched text + why); anything new fails.
//   node tools/fd-lint.mjs [--json]      exit 0 clean · 1 findings. Also run first by tools/fd-test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCALE = new Set([0, 1, 2, 4, 8, 12, 16, 24, 32, 48, 64]);
const SP = /(?:^|[;{\s"'])((?:margin|padding|gap|row-gap|column-gap|inset)(?:-[a-z]+)*)\s*:\s*([^;}`"]+)/g;

export function files(root = ROOT) {
  const out = [];
  for (const d of fs.readdirSync(root)) {
    if (!/^fd-/.test(d) || !fs.statSync(path.join(root, d)).isDirectory()) continue;
    const f = path.join(root, d, d + '.js'); if (fs.existsSync(f)) out.push(f);
  }
  const shared = path.join(root, 'tools/fd-shared.js'); if (fs.existsSync(shared)) out.push(shared);
  return out;
}

/** findings for one file's text: [{ rule, line, match }] */
export function lint(src) {
  const out = [], lines = String(src).split('\n');
  const push = (rule, i, match) => out.push({ rule, line: i + 1, match: match.trim().slice(0, 90) });
  lines.forEach((l, i) => {
    for (const m of l.matchAll(/(?<!repeating-)\b(linear|radial|conic)-gradient\(/g)) push('gradient', i, l.slice(m.index, m.index + 70));
    for (const m of l.matchAll(/background-clip\s*:\s*text/g)) push('gradient', i, m[0]);
    for (const m of l.matchAll(/(box-shadow|text-shadow)\s*:\s*([^;}`]*)/g)) if (/(^|,|\s)0(px)?\s+0(px)?\s+([4-9]|\d{2,})px/.test(m[2])) push('glow', i, m[0]);
    for (const m of l.matchAll(/drop-shadow\([^)]*\)/g)) push('glow', i, m[0]);
    for (const m of l.matchAll(SP)) {
      const bad = [...m[2].matchAll(/(-?\d+(?:\.\d+)?)px/g)].map((x) => Math.abs(+x[1])).filter((v) => !SCALE.has(v));
      if (bad.length) push('off-scale', i, `${m[1]}:${m[2]}`);
    }
    for (const m of l.matchAll(/font-weight\s*:\s*([89]00)\b/g)) push('heavy', i, m[0]);
    for (const m of l.matchAll(/transition(-property)?\s*:\s*all\b/g)) push('transition', i, m[0]);
    for (const m of l.matchAll(/:hover[^{]*\{([^}]*)\}/g)) if (/\b(transform|scale|translate|width|height|margin|padding|top|left|right|bottom|font-size)\s*:/.test(m[1])) push('hover-move', i, m[0]);
  });
  return out;
}

export function run(root = ROOT) {
  const allowFile = path.join(root, 'tools/fd-lint-allow.json');
  const allow = fs.existsSync(allowFile) ? JSON.parse(fs.readFileSync(allowFile, 'utf8')).allow || [] : [];
  const used = new Set(), found = [];
  for (const f of files(root)) {
    const rel = path.relative(root, f);
    for (const x of lint(fs.readFileSync(f, 'utf8'))) {
      const a = allow.findIndex((e) => e.file === rel && e.rule === x.rule && x.match.includes(e.match));
      if (a >= 0) { used.add(a); continue; }
      found.push({ file: rel, ...x });
    }
  }
  const stale = allow.filter((_, i) => !used.has(i));
  return { found, stale };
}

const real = (p) => { try { return fs.realpathSync(p); } catch { return path.resolve(p); } };
if (process.argv[1] && real(process.argv[1]) === real(fileURLToPath(import.meta.url))) {
  const { found, stale } = run();
  if (process.argv.includes('--json')) console.log(JSON.stringify({ found, stale }, null, 2));
  else {
    for (const f of found) console.log(`${f.file}:${f.line} [${f.rule}] ${f.match}`);
    for (const s of stale) console.log(`allow entry no longer matches (remove it): ${s.file} [${s.rule}] ${s.match}`);
    console.log(found.length ? `fd-lint: ${found.length} finding(s)` : 'fd-lint: clean');
  }
  process.exit(found.length ? 1 : 0);
}
