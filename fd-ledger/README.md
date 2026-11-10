# `<fd-ledger>`

"Done today": one quiet ledger. With reward (nothing needs him) it takes full weight.

Part of the Friday design system (v0.3, stage S5). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-ledger/fd-ledger.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css"> <!-- optional: themes every fd-* on the page -->
<fd-ledger items='[{"company":"ps","text":"DS questionnaire","meta":"18 answers"},{"company":"at","text":"Management report","meta":"page"}]'></fd-ledger>
<fd-ledger reward items='[{"company":"ps","text":"Receipts","meta":"3 photos"}]'></fd-ledger>
```

Load Figtree on the page (Google Fonts, weights 400/500/600); without it the components fall back to `sans-serif`.

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `items` | JSON array | [] | `[{company, text, meta, href}]`. Also a property. |
| `reward` | boolean | off | Full weight + a one-line total. |
| `label` | string | Done today | List name. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Theming

The page sets `--fd-<token>` (all of them in `fd-tokens/fd-tokens.css`: dark on `:root`, paper light on `[data-theme=light]`). Without them the component uses its own copy of the tokens and follows `prefers-color-scheme`; `theme="dark|light"` pins one element.

Parts for `::part()`: `list`, `sum`.

## Accessibility

See the component header comment and `tools/fd-test.mjs`: names generated from content, 44 × 44 targets on phone, focus ring 2 px in the text colour, reduced motion = nothing moves, answers announced in a polite live region where they happen.
