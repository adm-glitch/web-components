# `<fd-spotlight>`

The highlight primitive: a ring with a gap and a short caption around the slotted content, one entrance, never a loop, no dimming of the page; it ends by itself after `for` ms or with "Got it". tone="need" (amber glow) only for what needs him.

Part of the Friday design system (v0.3, stage S5, component 7). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-spotlight/fd-spotlight.js"></script>
<fd-spotlight active label="New since 09:58" for="8000"><p style="padding:16px;margin:0">Post approvals · running</p></fd-spotlight>
```

Load Figtree on the page (or `fd-tokens/fd-tokens.css`, which imports it).

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `active` | boolean | off | Shows the ring and caption. |
| `label` | string | — | Caption ("New since 09:58"). |
| `for` | ms | 0 (stays) | Ends by itself after this long. |
| `tone` | plain · need | plain | need = amber ring and glow. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Events

All bubble and are composed.

| Event | detail | When |
|---|---|---|
| `fd-spotlight-end` | `{reason}` | time or dismiss. |

## Theming

`--fd-<token>` from the page (`fd-tokens/fd-tokens.css`), else its own copy following `prefers-color-scheme`; `theme` pins one element. Parts: `ring`, `caption`, `dismiss`.

## Accessibility

44 × 44 targets on phone, dashed focus ring, reduced motion = nothing moves, states announced politely. Checked by `tools/fd-test.mjs`.
