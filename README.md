# web-components

Small, dependency-free Web Components. Each folder is one component: a single `.js` file, a `README.md` with its full API, and an `example.html` you can open directly.

## Components

| Component | What it is |
|---|---|
| [`usage-gauge`](usage-gauge/) | Claude account usage glyph: weekly limit, 5-hour window, hours to reset and pace, in one gauge. |

## Using a component

**From the CDN** (recommended): pin a release tag so updates never change a project by surprise.

```html
<script type="module" src="https://cdn.jsdelivr.net/gh/adm-glitch/web-components@v1.0.1/usage-gauge/usage-gauge.js"></script>
<usage-gauge weekly="41" session="62" pace="57" reset-minutes="110" monogram="M"></usage-gauge>
```

If you fork it, replace `adm-glitch` with your GitHub owner. To update, change the tag in the URL.

**Copying it in**: copy the component's `.js` file into your project and load it the same way with a local path.

## Releases

Releases are git tags (`v1.0.0`, `v1.1.0`, …) and cover the whole repo.

- Patch (`v1.0.1`): fixes, no visible change to the API.
- Minor (`v1.1.0`): new component or new optional attributes.
- Major (`v2.0.0`): renamed or removed attributes, or a change in what a value means.

## License

MIT
