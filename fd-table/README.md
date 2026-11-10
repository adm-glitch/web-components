# `<fd-table>`

A table that becomes cards on a narrow screen: a real <table> when the container is wide, one stacked card per row when it is narrow (first column = card title), so nothing scrolls sideways.

Part of the Friday design system (v0.3, stage S5, component 7). Tokens come from [`fd-tokens`](../fd-tokens/); the component carries its own copy, so it works alone.

## Use

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-table/fd-table.js"></script>
<fd-table caption="Receipts this week" columns='[{"key":"item","label":"Item"},{"key":"value","label":"R$","num":true}]' rows='[{"item":"Groceries","value":"412.00"},{"item":"Pharmacy","value":"38.90"}]'></fd-table>
```

Load Figtree on the page (or `fd-tokens/fd-tokens.css`, which imports it).

## Attributes

Every attribute is also a camelCase property.

| Attribute | Values | Default | What it does |
|---|---|---|---|
| `columns` | JSON array | [] | `[{key, label, num}]`; num = right-aligned tabular figures. Also a property. |
| `rows` | JSON array | [] | Row objects; optional `company` (owner dot) and `href` (first cell links). Also a property. |
| `caption` | string | — | Table caption / card list name. |
| `break` | px | 560 | Container width below which rows become cards. |
| `theme` | dark · light | page / OS | Pins the theme. |

## Theming

`--fd-<token>` from the page (`fd-tokens/fd-tokens.css`), else its own copy following `prefers-color-scheme`; `theme` pins one element. Parts: `table`, `cards`, `caption`.

## Accessibility

44 × 44 targets on phone, dashed focus ring, reduced motion = nothing moves, states announced politely. Checked by `tools/fd-test.mjs`.
