# `<fd-button>`

Friday's buttons: plain (ordinary), suggest (Friday's recommendation, an outline), primary (amber, only a single action on what needs him), quiet. States from tokens.

Part of the Friday design system (v0.3, stage S5). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-button/fd-button.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css"> <!-- optional: themes every fd-* on the page -->
<fd-button>No</fd-button> <fd-button variant="suggest">Yes</fd-button> <fd-button variant="primary">Open</fd-button>
```

Load Figtree on the page (Google Fonts, weights 400/500/600); without it the components fall back to `sans-serif`.

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `variant` | plain · suggest · primary · quiet | plain | Kind. |
| `disabled` | boolean | off | Disabled (never the only feedback). |
| `href` | URL | — | Renders a link instead of a button. |
| `type` | button · submit | button | submit submits the surrounding form (form-associated). |
| `label` | string | — | Accessible name when the text is not enough. |
| `show-state` | hover · pressed · focus | — | Draws a state still, for specimens only. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Theming

The page sets `--fd-<token>` (all of them in `fd-tokens/fd-tokens.css`: dark on `:root`, paper light on `[data-theme=light]`). Without them the component uses its own copy of the tokens and follows `prefers-color-scheme`; `theme="dark|light"` pins one element.

Parts for `::part()`: `control`.

## Accessibility

See the component header comment and `tools/fd-test.mjs`: names generated from content, 44 × 44 targets on phone, focus ring 2 px in the text colour, reduced motion = nothing moves, answers announced in a polite live region where they happen.
