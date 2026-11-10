# `<fd-rail>`

"Just now": a short time-ordered list; his own confirmed answers read "You: …".

Part of the Friday design system (v0.3, stage S5). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-rail/fd-rail.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css"> <!-- optional: themes every fd-* on the page -->
<fd-rail items='[{"at":"09:12","text":"receipt read"},{"at":"09:41","text":"backup stopped · Friday fixing it"},{"at":"10:02","text":"yes to the rotation","you":true}]'></fd-rail>
```

Load Figtree on the page (Google Fonts, weights 400/500/600); without it the components fall back to `sans-serif`.

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `items` | JSON array | [] | `[{at, text, you}]`, oldest first. Also a property. |
| `max` | number | 6 | Keeps the last n. |
| `label` | string | Just now | List name. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Theming

The page sets `--fd-<token>` (all of them in `fd-tokens/fd-tokens.css`: dark on `:root`, paper light on `[data-theme=light]`). Without them the component uses its own copy of the tokens and follows `prefers-color-scheme`; `theme="dark|light"` pins one element.

Parts for `::part()`: `list`.

## Accessibility

See the component header comment and `tools/fd-test.mjs`: names generated from content, 44 × 44 targets on phone, focus ring 2 px in the text colour, reduced motion = nothing moves, answers announced in a polite live region where they happen.
