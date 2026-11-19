# `fd-tokens`

The Friday design system tokens (v0.3) as files a page can use.

- `tokens/*.json`: the tokens in the W3C Design Tokens (DTCG) format, copied from Friday's design system (the source of truth). Do not edit here.
- `fd-tokens.css`: every token as a `--fd-<name>` custom property. Dark on `:root`; paper light under `[data-theme=light]`. Generated.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css">
<html data-theme="light"> … every fd-* component on the page follows.
```

Updating: `node tools/fd-sync.mjs --from <path to the DS tokens folder>` copies the JSON, rewrites `fd-tokens.css`, pastes the shared block (tokens, base styles, icons) into every `fd-*/fd-*.js`, refreshes each `example.html` and `playground/standalone.html`. Then `node tools/fd-test.mjs` (Playwright) and `node tools/fd-shots.mjs <dir>` for screenshots.

## Motion recipes

The only five named transitions, each built from the tokens. One easing per screen; under `prefers-reduced-motion: reduce` each one is the final frame (or a `--fd-d-reduced-fade` cross-fade). No hover motion. Timings referenced from transitions.dev and reimplemented here; its collection is never pasted (its licence forbids redistribution).

| Recipe | Duration | Easing | Shape |
|---|---|---|---|
| Status text swap | `--fd-d-leave` out, then `--fd-d-enter` in | `--fd-e-in` / `--fd-e-out` | old label fades and moves 4 px up, new one comes from 4 px below; the box keeps its width |
| Panel open / close | `--fd-d-panel` | `--fd-e-out` | container height first, content fades in after; closing: content leaves first |
| Menu from its button | `--fd-d-menu` | `--fd-e-out` | scale 0.96 → 1 and fade, `transform-origin` at the button |
| Press / tap answer | `--fd-d-press` | `--fd-e-out` | background to `--fd-pressed-bg`, no scale |
| Success check | `--fd-d-enter` | `--fd-e-out` | stroke draws once (`stroke-dashoffset`), never loops |
| Field error | `--fd-d-change` | `--fd-e-out` | three 4 px side moves that settle, plus the error text; never colour alone |
