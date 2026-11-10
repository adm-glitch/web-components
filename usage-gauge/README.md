# `<usage-gauge>`

The Claude usage glyph as a **Web Component**: one JavaScript file, no dependencies. Load it once and the page gets a new HTML tag, `<usage-gauge>`, that works in plain HTML, React, Vue, Svelte, Astro, Electron/Tauri apps, PWAs and anything else that renders web pages.

```html
<script type="module" src="usage-gauge.js"></script>

<usage-gauge weekly="41" session="62" pace="57" reset-minutes="110" monogram="M"></usage-gauge>
```

**From the CDN** (pin a release tag):

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@v1.0.1/usage-gauge/usage-gauge.js"></script>
```

Open `example.html` to see every option. It carries its own copy of the component, so it works straight from disk.

## Data

Pass percentages **used**, the way usage numbers usually come in. The gauge draws what's **left**: both rings start full and empty right to left.

| Attribute | Value | Meaning |
|---|---|---|
| `weekly` | 0–100 | Weekly limit used. Outer ring. |
| `session` | 0–100 | Current 5-hour window used. Inner ring. |
| `pace` | 0–100 | How much of the week has passed, as a %. Draws the pace tick; leave it out for no tick. |
| `reset-minutes` | 0–300 | Minutes until the 5h window resets. Lights the dots, one per hour. `0` = no window running (idle, blue). |
| `status` | `ok` · `stale` · `error` | `stale` = last refresh failed, older values dimmed with a clock badge (`stale-color`, amber by default). `error` = no data, dashed rings and a red badge. |

## Look

| Attribute | Default | |
|---|---|---|
| `monogram` | none | 1–2 characters, for example `M`. |
| `monogram-position` | `center` | `center`, `left`, `right` or `none`. |
| `size` | `44` | Width and height in px. |
| `sweep` | `270` | Gauge angle in degrees (180–330). The opening is centred at the bottom and holds the dots. |
| `ring-width` | `3.5` | Ring thickness on a 48-unit grid (1–6). Dots scale with it. |
| `ring-gap` | `3.5` | Space between the rings (0–8). |
| `warn-at` | `20` | Ring turns amber at this % **left**. |
| `show-tick` | `true` | `"false"` hides the pace tick. |
| `show-dots` | `true` | `"false"` hides the hour dots. |
| `theme` | auto | `dark`, `light`, or leave it out to follow the system setting. |
| `label` | auto | Overrides the screen-reader description. |

## Colours

Every colour has a default for dark and for light (the current design). Override it with an attribute, or with the matching CSS custom property (`--ug-` plus the attribute name). CSS can theme many gauges at once.

| Attribute | CSS property | Controls |
|---|---|---|
| `weekly-color` | `--ug-weekly-color` | Outer ring |
| `session-color` | `--ug-session-color` | Inner ring |
| `tick-color` | `--ug-tick-color` | Pace tick |
| `tick-ahead-color` | `--ug-tick-ahead-color` | Tick when you're ahead of pace (defaults to the warning colour) |
| `dot-color` | `--ug-dot-color` | Lit hour dots |
| `dot-empty-color` | `--ug-dot-empty-color` | Spent hour dots |
| `track-color` | `--ug-track-color` | Empty part of both rings |
| `warn-color` | `--ug-warn-color` | Low (≤ `warn-at` left) |
| `stale-color` | `--ug-stale-color` | Stale badge (a clock). Defaults to `warn-color`. |
| `critical-color` | `--ug-critical-color` | Empty ring, error badge |
| `critical-track-color` | `--ug-critical-track-color` | Track of an empty ring |
| `idle-color` | `--ug-idle-color` | Inner ring and dots when no window is running |
| `monogram-color` | `--ug-monogram-color` | Letter |
| `monogram-muted-color` | `--ug-monogram-muted-color` | Letter in the error state |
| `background` | `--ug-background` | Colour behind the gauge, used for the badge's cut-out edge |

```css
.my-dashboard usage-gauge {
  --ug-weekly-color: #D97757;
  --ug-session-color: #F0B9A3;
}
```

## Updating from JavaScript

```js
const g = document.querySelector('usage-gauge');
g.update({ weekly: 44, session: 70, resetMinutes: 95, status: 'ok' }); // several at once
g.weekly = 45;                                                        // or one property at a time
```

Every attribute is also a camelCase property (`resetMinutes`, `monogramPosition`, `weeklyColor`, …).

## In frameworks

**React 19+**: use it like any tag. Values pass straight through.

```jsx
import './usage-gauge.js';
<usage-gauge weekly={41} session={62} pace={57} reset-minutes={110} monogram="M" />
```

(React 18 also works with these string/number attributes.)

**Vue**: tell Vue the tag is a custom element (`compilerOptions.isCustomElement: tag => tag === 'usage-gauge'`), then `<usage-gauge :weekly="41" … />`.

**Svelte / Astro / plain HTML**: import the file once and use the tag.

## Native apps

Anything that shows web content (Electron, Tauri, Capacitor, a WebView) can use it as is. A fully native SwiftUI or Jetpack Compose version would be a small port of the same geometry. `_render()` in `usage-gauge.js` is the reference.
