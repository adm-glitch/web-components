# `<fd-ask-row>`

One "needs you" row with its answers. Yes/No equal; Friday's suggestion is an outline plus "Friday suggests …"; a single action is the amber button. open → (busy) → answered with Undo → leaves.

Part of the Friday design system (v0.3, stage S5). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-ask-row/fd-ask-row.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css"> <!-- optional: themes every fd-* on the page -->
<fd-ask-row company="mq" question="OK to rotate 6 clients?" note="answer right here" options='["No","Yes"]' suggest="Yes"></fd-ask-row>
<fd-ask-row company="ps" question="Which of these looks like Friday?" note="1 tap · 4 images" options='["Open"]'></fd-ask-row>
<fd-ask-row company="at" question="Which week for the review?" options='["This week","Next week","After the 20th"]' suggest="Next week"></fd-ask-row>
```

Load Figtree on the page (Google Fonts, weights 400/500/600); without it the components fall back to `sans-serif`.

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `company` | mq · at · ps | mq | Owner dot and word. |
| `name` | string | company name | Owner word. |
| `question` | string | — | The question. |
| `note` | string | — | Small text after the owner (the cost first: "1 tap · 4 images"). |
| `options` | JSON array or comma list | ["No","Yes"] | The answers, in order. One option = the amber single action. Also a property. |
| `suggest` | option | — | The option Friday recommends: outline + "Friday suggests …". |
| `state` | open · busy · answered · leaving | open | Set by the row; the host sets `answered` or `open` after a `confirm`. |
| `answer` | option | — | The chosen answer. |
| `confirm` | boolean | off | A click only sets busy (buttons disabled, "Sending…"); the host confirms. |
| `undo-window` | ms | 6000 (token) | How long Undo stays before the row leaves. |
| `keep` | boolean | off | Never leave (specimens). |
| `icon` | icon name | ask | Row mark (amber). |
| `theme` | dark · light | page / OS | Pins the theme. |

## Events

All bubble and cross the shadow boundary (`composed`).

| Event | detail | When |
|---|---|---|
| `fd-answer` | `{value}` | He chose. Cancelable: preventDefault keeps the row open. |
| `fd-undo` | `{value}` | He pressed Undo. |
| `fd-leave` | `{value}` | The row left (now hidden). |

## Theming

The page sets `--fd-<token>` (all of them in `fd-tokens/fd-tokens.css`: dark on `:root`, paper light on `[data-theme=light]`). Without them the component uses its own copy of the tokens and follows `prefers-color-scheme`; `theme="dark|light"` pins one element.

Parts for `::part()`: `row`, `undo`, `status`.

## Accessibility

See the component header comment and `tools/fd-test.mjs`: names generated from content, 44 × 44 targets on phone, focus ring 2 px in the text colour, reduced motion = nothing moves, answers announced in a polite live region where they happen.
