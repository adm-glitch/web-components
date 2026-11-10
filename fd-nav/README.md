# `<fd-nav>`

The Console's site plan (S6 gap G1): app header with the dial mark and "Friday", tabs in words (current = text colour + a rule, never amber; a small amber dot where something is his), tabs at the bottom on the phone, and the way back on inner pages.

Part of the Friday design system (v0.3, stage S6). Tokens from [`fd-tokens`](../fd-tokens/); the component carries its own copy.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-nav/fd-nav.js"></script>
<fd-nav current="decide" tabs='[{"id":"decide","label":"Decide","href":"#","need":true},{"id":"work","label":"Work","href":"#"},{"id":"did","label":"Friday did","href":"#"}]' back-href="#" back-label="Panel"></fd-nav>
```

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `tabs` | JSON array | [] | `[{id, label, href, need}]`. Also a property. |
| `current` | tab id | — | The current tab (aria-current=page). |
| `back-href` | URL | — | Draws "← label" under the header. |
| `back-label` | string | Back | Text of the way back. |
| `title` | string | — | A short page title next to the way back. |
| `position` | auto · top | auto | auto = tabs at the bottom below 900 px; top keeps them in the header. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Events

All bubble and are composed.

| Event | detail | When |
|---|---|---|
| `fd-nav` | `{id}` | A tab is chosen. Cancelable (single-page hosts route themselves). |

## Theming

`--fd-<token>` from the page (`fd-tokens/fd-tokens.css`), else its own copy; `theme` pins one element. Parts: `header`, `tabs`, `tab`, `end`, `back`.

## Accessibility

44 px targets, dashed focus ring, reduced motion = nothing moves. Checked by `tools/fd-test.mjs` (console section).
