# `<fd-panel>`

The one card component of Friday's panel: every block sits in it (dials, needs you, in progress, done today, states).

Part of the Friday design system (v0.3, stage S5). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-panel/fd-panel.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css"> <!-- optional: themes every fd-* on the page -->
<fd-panel label="Needs you" pad="row">
  <fd-ask-row company="mq" question="OK to rotate 6 clients?" suggest="Yes"></fd-ask-row>
</fd-panel>
<fd-panel label="Dials" stale="09:58">
  <fd-dial company="ps" fronts='[{"t":"Backup","s":"fault"},{"t":"Receipts","s":"done"}]'></fd-dial>
</fd-panel>
```

Load Figtree on the page (Google Fonts, weights 400/500/600); without it the components fall back to `sans-serif`.

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `label` | string | — | Section label above the panel (uppercase, hairline rule). Also the panel's accessible name. |
| `pad` | block · row · none | block | Inner padding: `block` 16 px all round, `row` sides only (for row lists), `none`. |
| `stale` | time text | — | Data are old: dashed frame, colours and amber off for everything inside, "Data from <time> · not live" next to the label. |
| `heading-level` | 2–6 | 2 | aria-level of the label. |
| `theme` | dark · light | page / OS | Pins this panel's theme. |

## Theming

The page sets `--fd-<token>` (all of them in `fd-tokens/fd-tokens.css`: dark on `:root`, paper light on `[data-theme=light]`). Without them the component uses its own copy of the tokens and follows `prefers-color-scheme`; `theme="dark|light"` pins one element.

Parts for `::part()`: `box`, `body`, `label`, `stale`, `texture`, `section`.

## Accessibility

See the component header comment and `tools/fd-test.mjs`: names generated from content, 44 × 44 targets on phone, focus ring 2 px in the text colour, reduced motion = nothing moves, answers announced in a polite live region where they happen.
