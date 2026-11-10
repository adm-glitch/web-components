# `<fd-run-row>`

One "in progress" row, a link to its front. A meter only when a real count exists; nothing on it moves.

Part of the Friday design system (v0.3, stage S5). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-run-row/fd-run-row.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css"> <!-- optional: themes every fd-* on the page -->
<fd-run-row company="mq" text="Lead research" status="14 of 30" count="14" total="30" href="#"></fd-run-row>
<fd-run-row company="at" text="Post approvals" status="running" href="#"></fd-run-row>
```

Load Figtree on the page (Google Fonts, weights 400/500/600); without it the components fall back to `sans-serif`.

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `company` | mq · at · ps | mq | Owner dot and word. |
| `name` | string | company name | Owner word. |
| `text` | string | — | What is running. |
| `href` | URL | — | Its front (the row becomes a link). |
| `status` | string | — | Status in words next to the text ("running", "14 of 30"). |
| `count / total` | numbers | — | Both set = a meter (role=meter). Otherwise no bar. |
| `front` | id | — | Fires fd-front-hover with this id (row → dial). |
| `highlight` | boolean | off | Lit from outside (dial → row). |
| `icon` | icon name | run | Row mark. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Events

All bubble and cross the shadow boundary (`composed`).

| Event | detail | When |
|---|---|---|
| `fd-front-hover` | `{id}` | Pointed at / focused (id) or left (null), when `front` is set. |

## Theming

The page sets `--fd-<token>` (all of them in `fd-tokens/fd-tokens.css`: dark on `:root`, paper light on `[data-theme=light]`). Without them the component uses its own copy of the tokens and follows `prefers-color-scheme`; `theme="dark|light"` pins one element.

Parts for `::part()`: `row`, `meter`.

## Accessibility

See the component header comment and `tools/fd-test.mjs`: names generated from content, 44 × 44 targets on phone, focus ring 2 px in the text colour, reduced motion = nothing moves, answers announced in a polite live region where they happen.
