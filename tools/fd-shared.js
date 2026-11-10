// Shared code for every fd-* component (Friday DS). tools/fd-sync.mjs pastes this file, with the token table filled in,
// between the fd-shared markers of each component, so every component stays one standalone file (no imports, no build
// step for whoever uses it). Edit this file or the tokens (fd-tokens/tokens/*.json), then run `node tools/fd-sync.mjs`.
const FD_T = /*@TOKENS@*/ {};
// Every token becomes --_<name> inside the shadow root. A page themes all components at once with --fd-<name> (fd-tokens.css
// sets them for dark and for [data-theme=light]); theme="dark|light" on one element pins its own values.
const FD_V = (o, pinned) => Object.entries(o).map(([k, v]) => `--_${k}:${pinned ? v : `var(--fd-${k},${v})`};`).join('');
const FD_TOKENS = `:host{${FD_V(FD_T.base)}${FD_V(FD_T.dark)}color-scheme:dark}`
  + `:host([theme=dark]){${FD_V(FD_T.dark, 1)}color-scheme:dark}`
  + `:host([theme=light]){${FD_V(FD_T.light, 1)}color-scheme:light}`
  + `@media (prefers-color-scheme:light){:host(:not([theme])){${FD_V(FD_T.light)}}}`;
const FD_CSS = FD_TOKENS + `
:host{font-family:var(--_ff);color:var(--_text);font-variant-numeric:tabular-nums;-webkit-font-smoothing:antialiased;box-sizing:border-box}
:host([hidden]){display:none!important}
*,*::before,*::after{box-sizing:border-box}
.lbl{font-size:var(--_fs-xs);letter-spacing:var(--_tr-label);text-transform:uppercase;color:var(--_muted);font-weight:var(--_fw-medium);margin:0 0 var(--_sp-3);display:flex;align-items:center;gap:var(--_sp-3);line-height:1.2}
.lbl::after{content:"";flex:1;height:var(--_st-hair);background:var(--_line)}
.dot{display:inline-block;width:8px;height:8px;border-radius:var(--_r-round);vertical-align:1px;margin-right:var(--_sp-2);flex:none}
.mu{color:var(--_muted)}
.ic{flex:none;display:inline-grid;place-items:center}
.ic svg{display:block}
.ic path{fill:none;stroke-width:var(--_st-icon);stroke-linecap:round;stroke-linejoin:round}
/* buttons (component 8): primary = amber, only for a single action on what needs him; outline = Friday's suggestion;
   plain = everything else. Yes and No are always two plain buttons of equal weight (his ds-s4-18). */
.btn{font:var(--_fw-strong) var(--_fs-sm)/1 var(--_ff);min-height:var(--_sz-target);min-width:var(--_sz-target);padding:0 var(--_sp-5);
 border-radius:var(--_r-md);border:var(--_st-hair) solid var(--_line);color:var(--_text);background:transparent;display:inline-flex;
 align-items:center;justify-content:center;gap:var(--_sp-2);cursor:pointer;white-space:nowrap;text-decoration:none;
 transition:background-color var(--_d-change) var(--_e-out),border-color var(--_d-change) var(--_e-out)}
@media (min-width:900px) and (pointer:fine){.btn{min-height:var(--_sz-target-dense)}}
.btn:hover{background:var(--_hover-bg);border-color:var(--_hover-line)}
.btn:active{background:var(--_pressed-bg)}
/* focus is dashed with a gap, so it never reads as Friday's solid suggestion outline (S5 lenses 3, 4, 11) */
.btn:focus-visible{outline:var(--_sz-focus-ring) dashed var(--_focus);outline-offset:3px}
.btn.primary{background:var(--_amb);border-color:var(--_amb);color:var(--_amber-ink);box-shadow:var(--_btn-glow)}
.btn.primary:hover{background:var(--_amb);border-color:var(--_amber-ink)}
.btn.primary:active{background:var(--_amber-pressed);border-color:var(--_amber-pressed)}
.btn.suggest{border:2px solid var(--_text);padding:0 calc(var(--_sp-5) - 1px)}
.btn.plain{border-color:transparent}
.btn.plain:hover{border-color:var(--_line)}
.btn:disabled,.btn[aria-disabled=true]{cursor:default;color:var(--_disabled-text);border-color:var(--_disabled-line);background:transparent;box-shadow:none}
.btn.primary:disabled{background:transparent;border-color:var(--_disabled-line)}
.vh{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
@media (prefers-reduced-motion:reduce){*{transition-duration:var(--_d-reduced-fade)!important;animation:none!important}}
`;
// thin outline icons, 1.6 px on a 24 grid (his S3 pick B). "run" was redrawn twice in S5: the S4 circle-arrow read as
// "refresh" (S4 lens 10), the first S5 arrow-to-bar read as Tab / skip to end (S5 lenses 2, 3, 10); it is now the dial's own
// sign, a short lit arc, drawn by fd-run-row in the company colour so the row and its segment are one symbol.
// "stale" is a clock (time-based sign for time-based data), never the "!" of an alert (S5 lens 10).
const FD_ICONS = {
  ask: 'M5 5h14v10H10l-5 4z', check: 'M5 12.5l4.2 4.2L19 7', clock: 'M12 4a8 8 0 1 0 .01 0z M12 8v4.5l3 2',
  fix: 'M14.5 5.5a4 4 0 0 0-5 5L4 16v4h4l5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-3-3z', doc: 'M7 3h7l4 4v14H7z M14 3v4h4',
  run: 'M5 16.5a8 8 0 0 1 14 0', 'run-s5a': 'M4 12h12 M12.5 7.5L17 12l-4.5 4.5 M20.5 6v12', 'run-s4': 'M19.5 12a7.5 7.5 0 1 1-2.2-5.3 M19.5 4.5v3.8h-3.8',
  stale: 'M12 4a8 8 0 1 0 .01 0z M12 8v4.5l3 2', empty: 'M5 12h14',
};
const fdIcon = (g, colour, size = 24) => `<span class="ic" style="width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${FD_ICONS[g] || FD_ICONS.doc}" style="stroke:${colour}"/></svg></span>`;
const FD_NAME = { mq: 'Marquatica', at: 'Atípica', ps: 'Personal' };
const fdEsc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fdCamel = (a) => a.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const fdJSON = (v, d) => { if (v == null || v === '') return d; if (typeof v !== 'string') return v; try { return JSON.parse(v); } catch { return d; } };
const fdReduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
// every observed attribute is also a camelCase property; JSON attributes accept arrays/objects as properties
function fdProps(Cls, attrs, json = []) {
  for (const a of attrs) {
    const p = fdCamel(a);
    if (Object.prototype.hasOwnProperty.call(Cls.prototype, p)) continue;
    Object.defineProperty(Cls.prototype, p, {
      get() { return json.includes(a) ? fdJSON(this.getAttribute(a), this['_' + p]) : this.getAttribute(a); },
      set(v) {
        if (json.includes(a) && v && typeof v === 'object') { this['_' + p] = v; this.removeAttribute(a); this.render?.(); return; }
        if (v === null || v === undefined || v === false) this.removeAttribute(a); else this.setAttribute(a, v === true ? '' : v);
      },
      configurable: true,
    });
  }
}
const fdDefine = (name, Cls) => { if (typeof customElements !== 'undefined' && !customElements.get(name)) customElements.define(name, Cls); };
