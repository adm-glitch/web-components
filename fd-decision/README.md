# `<fd-decision>`

A decision card with doc slots: question, why it is his, about how long, documents to read (slotted links), equal options with Friday's suggestion as an outline, an optional note box; answered shows what he chose, when, and Change.

Part of the Friday design system (v0.3, stage S5, component 7). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-decision/fd-decision.js"></script>
<fd-decision company="mq" question="Which CRM for the pilot?" why="It sets the next three months." minutes="3" options='["GoHighLevel","HubSpot"]' suggest="GoHighLevel" note-box>
  <a slot="doc" href="#">Comparison · 2 pages</a>
</fd-decision>
```

Load Figtree on the page (or `fd-tokens/fd-tokens.css`, which imports it).

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `company` | mq · at · ps | mq | Owner dot and word. |
| `name` | string | company name | Owner word. |
| `question` | string | — | The decision. |
| `why` | string | — | One or two lines: why it is his. |
| `minutes` | number | — | About how long it takes (the cost first). |
| `options` | JSON array or comma list | ["No","Yes"] | The options. Also a property. |
| `suggest` | option | — | Friday's recommendation: outline + "Friday suggests …". |
| `note-box` | boolean | off | Shows an optional note for Friday; it travels with the answer. |
| `state` | open · busy · answered | open | Set by the card; the host sets it after a confirm. |
| `answer` | option | — | The chosen option. |
| `confirm` | boolean | off | A click only sets busy. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Events

All bubble and are composed.

| Event | detail | When |
|---|---|---|
| `fd-answer` | `{value, note}` | He chose. Cancelable. |
| `fd-undo` | `{value}` | He pressed Change. |

## Theming

`--fd-<token>` from the page (`fd-tokens/fd-tokens.css`), else its own copy following `prefers-color-scheme`; `theme` pins one element. Parts: `question`, `why`, `docs`, `note`.

## Accessibility

44 × 44 targets on phone, dashed focus ring, reduced motion = nothing moves, states announced politely. Checked by `tools/fd-test.mjs`.
