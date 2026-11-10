# `fd-app`

Friday's app icon, PWA manifest and start screen (Friday design system v0.3, stage S5, component 9). Drawn by
`tools/fd-app.mjs` from the dial mark and the tokens: one segment per company in its lit colour, in the fixed dial order
(Marquatica · Atípica · Pessoal), fine bezel ticks, on the dark field. No amber: the icon never asks for anything.

| File | Use |
|---|---|
| `icon.svg` | any size, browsers that take SVG icons |
| `icon-192.png`, `icon-512.png` | manifest `purpose: any` |
| `icon-maskable.svg`, `icon-maskable-512.png` | manifest `purpose: maskable` (mark inside the 80 % safe circle) |
| `apple-touch-icon.png` | 180 × 180, iOS home screen |
| `splash-1290x2796.png` | iOS start screen (`apple-touch-startup-image`); Android builds its own from the manifest colours |
| `manifest.webmanifest` | name Friday, `display: standalone`, theme and background = the field colours |

```html
<link rel="manifest" href="/fd-app/manifest.webmanifest">
<link rel="icon" href="/fd-app/icon.svg">
<link rel="apple-touch-icon" href="/fd-app/apple-touch-icon.png">
<link rel="apple-touch-startup-image" href="/fd-app/splash-1290x2796.png" media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)">
<meta name="theme-color" content="#141619">
```

Regenerate after a token change: `PLAYWRIGHT_CORE=… node tools/fd-app.mjs`. See `example.html`.
