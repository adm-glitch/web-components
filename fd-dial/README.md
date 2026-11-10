# `<fd-dial>`

One company dial: a ring of segments, one per front, in fixed places. Lit = working now, idle = lighter step + thinner stroke, done = grey thin, need = amber with a slow breath (the only loop), fault = muted dashed.

Part of the Friday design system (v0.3, stage S5). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-dial/fd-dial.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css"> <!-- optional: themes every fd-* on the page -->
<fd-dial company="mq" href="#mq" fronts='[{"id":"m1","t":"Monthly report","s":"run"},{"id":"m2","t":"CRM check","s":"done"},{"id":"m3","t":"Client rotation","s":"need"},{"id":"m4","t":"Lead research","s":"run"},{"id":"m5","t":"New proposal","s":"rest"}]'></fd-dial>
<fd-dial company="ps" center="for-you" note="backup stopped · Friday fixing it" fronts='[{"t":"Design System","s":"need"},{"t":"Backup","s":"fault"},{"t":"Brain map","s":"run"}]'></fd-dial>
```

Load Figtree on the page (Google Fonts, weights 400/500/600); without it the components fall back to `sans-serif`.

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `company` | mq · at · ps | mq | Which company (colour and default name). |
| `name` | string | Marquatica / Atípica / Personal | Name under the dial. |
| `href` | URL | — | The company page. Without per-segment the whole dial is this one link; without href the dial is an image. |
| `fronts` | JSON array | [] | `[{id, t, s, href}]`, s = run · rest · done · need · fault. Also a property (array). |
| `size` | auto · phone · desktop | auto | Radius from tokens (36 / 64); auto switches below 900 px. |
| `center` | count · for-you | count | Centre shows the number of fronts, or "n for you" in words when something needs him. |
| `note` | text | — | One line under the dial (e.g. `backup stopped · Friday fixing it`; `·` breaks the line). |
| `per-segment` | boolean | off | With a fine pointer on desktop, each segment is its own link to its front (`href` per front); the name stays the company link. |
| `highlight` | front id | — | Lights that segment (row → dial). |
| `label` | string | generated | Overrides the generated accessible name ("Marquatica: 5 fronts, 2 running, …"). |
| `theme` | dark · light | page / OS | Pins the theme. |

## Events

All bubble and cross the shadow boundary (`composed`).

| Event | detail | When |
|---|---|---|
| `fd-front-hover` | `{id}` | A segment is pointed at or focused (id) or left (null). Per-segment mode only. |

## Theming

The page sets `--fd-<token>` (all of them in `fd-tokens/fd-tokens.css`: dark on `:root`, paper light on `[data-theme=light]`). Without them the component uses its own copy of the tokens and follows `prefers-color-scheme`; `theme="dark|light"` pins one element.

Parts for `::part()`: `dial`, `name`, `note`.

## Accessibility

See the component header comment and `tools/fd-test.mjs`: names generated from content, 44 × 44 targets on phone, focus ring 2 px in the text colour, reduced motion = nothing moves, answers announced in a polite live region where they happen.
