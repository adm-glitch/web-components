# `<fd-steer>`

The steer box on a front's page: he writes what Friday should change; Ctrl/Cmd + Enter sends (Enter is a new line). States: empty, typing, sending (still, slow line after a few seconds), sent (his text stays readable with the time), unsent (text kept).

Part of the Friday design system (v0.3, stage S5, component 7). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-steer/fd-steer.js"></script>
<fd-steer company="mq" front="Lead research"></fd-steer>
```

Load Figtree on the page (or `fd-tokens/fd-tokens.css`, which imports it).

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `company` | mq · at · ps | mq | Owner dot and word. |
| `name` | string | company name | Owner word. |
| `front` | string | — | The front being steered (in the label). |
| `placeholder` | string | What should Friday change here? | Placeholder. |
| `state` | open · sending · sent · unsent | open | Set by the box; the host sets sent/unsent after a confirm. |
| `sent-at` | hh:mm | — | Time shown on the sent note. |
| `confirm` | boolean | off | Send only sets sending; the host confirms. |
| `slow-after` | ms | 4000 | When the slow line appears while sending. |
| `label` | html-free string | Steer <front> | Label text. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Events

All bubble and are composed.

| Event | detail | When |
|---|---|---|
| `fd-steer` | `{text}` | He sent. Cancelable: preventDefault keeps the text in the box. |

## Theming

`--fd-<token>` from the page (`fd-tokens/fd-tokens.css`), else its own copy following `prefers-color-scheme`; `theme` pins one element. Parts: `input`, `send`, `sent`.

## Accessibility

44 × 44 targets on phone, dashed focus ring, reduced motion = nothing moves, states announced politely. Checked by `tools/fd-test.mjs`.
