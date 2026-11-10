# `<fd-state>`

The four panel states, each with its own look: empty (nothing for you), loading (still skeleton), stale (hatched, "Data from 09:58"), fixing (Friday is fixing something not his).

Part of the Friday design system (v0.3, stage S5). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-state/fd-state.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css"> <!-- optional: themes every fd-* on the page -->
<fd-state kind="empty" note="13 fronts running · 3 done today"></fd-state>
<fd-state kind="loading"></fd-state>
<fd-state kind="stale" since="09:58"></fd-state>
<fd-state kind="fixing" company="ps" text="Backup stopped at 3 am"></fd-state>
```

Load Figtree on the page (Google Fonts, weights 400/500/600); without it the components fall back to `sans-serif`.

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `kind` | empty · loading · stale · fixing | empty | Which state. |
| `since` | time text | — | Stale: the time of the data. |
| `text` | string | per kind | Main line. |
| `note` | string | per kind | Second line. |
| `company / name` | mq · at · ps / string | ps | Fixing: owner dot and word. |
| `slow-after` | ms | 4000 | Loading: after this a plain line says Friday is checking the connection. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Theming

The page sets `--fd-<token>` (all of them in `fd-tokens/fd-tokens.css`: dark on `:root`, paper light on `[data-theme=light]`). Without them the component uses its own copy of the tokens and follows `prefers-color-scheme`; `theme="dark|light"` pins one element.

Parts for `::part()`: `slow`.

## Accessibility

See the component header comment and `tools/fd-test.mjs`: names generated from content, 44 × 44 targets on phone, focus ring 2 px in the text colour, reduced motion = nothing moves, answers announced in a polite live region where they happen.
