# `fd-tokens`

The Friday design system tokens (v0.3) as files a page can use.

- `tokens/*.json`: the tokens in the W3C Design Tokens (DTCG) format, copied from Friday's design system (the source of truth). Do not edit here.
- `fd-tokens.css`: every token as a `--fd-<name>` custom property. Dark on `:root`; paper light under `[data-theme=light]`. Generated.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/fd-tokens/fd-tokens.css">
<html data-theme="light"> … every fd-* component on the page follows.
```

Updating: `node tools/fd-sync.mjs --from <path to the DS tokens folder>` copies the JSON, rewrites `fd-tokens.css`, pastes the shared block (tokens, base styles, icons) into every `fd-*/fd-*.js`, refreshes each `example.html` and `playground/standalone.html`. Then `node tools/fd-test.mjs` (Playwright) and `node tools/fd-shots.mjs <dir>` for screenshots.
