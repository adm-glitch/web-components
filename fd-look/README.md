# `<fd-look>`

The image card he reacts to (S6 gap G6): every image whole with its label, tap = full size (a dialog) and back, optional Like / Don't like, a large comment box, Send once there is a reaction or words; sent shows what he said and Change.

Part of the Friday design system (v0.3, stage S6). Tokens from [`fd-tokens`](../fd-tokens/); the component carries its own copy.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-look/fd-look.js"></script>
<fd-look question="The panel, built from its own parts" why="Tap an image to open it full size." imgs='[{"src":"../playground/img/panel-dark-desktop.webp","alt":"Panel, dark","label":"Dark · computer"}]'></fd-look>
```

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `company` | mq · at · ps | ps | Owner dot and word. |
| `name` | string | company name | Owner word. |
| `question` | string | — | The card's question. |
| `why` | string | — | One line: what to look at. |
| `imgs` | JSON array | [] | `[{src, alt, label}]`. Also a property. |
| `minutes` | number | — | About how long. |
| `state` | open · sent | open | Set by the card. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Events

All bubble and are composed.

| Event | detail | When |
|---|---|---|
| `fd-look` | `{like, text}` | He sent (like = true, false or null). Cancelable. |
| `fd-undo` | `{like, text}` | He pressed Change. |

## Theming

`--fd-<token>` from the page (`fd-tokens/fd-tokens.css`), else its own copy; `theme` pins one element. Parts: `question`, `images`, `comment`, `send`, `zoom`.

## Accessibility

44 px targets, dashed focus ring, reduced motion = nothing moves. Checked by `tools/fd-test.mjs` (console section).
