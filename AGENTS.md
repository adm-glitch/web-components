# Notes for agents

This repo holds dependency-free Web Components, served to projects through jsDelivr from git tags.

## Structure

- One folder per component, named after its tag: `usage-gauge/`.
- Each folder has exactly: `<name>.js` (the component), `README.md` (full API: every attribute, property, CSS variable, default), `example.html` (works when opened straight from disk).
- The root `README.md` lists every component in its table.

## Rules for components

- Plain JavaScript ES module. No dependencies, no build step, no TypeScript.
- Register with `customElements.define`, guarded by `customElements.get` so loading twice is safe.
- Shadow DOM for markup and styles. Colours come from CSS custom properties (`--<prefix>-*`) with attribute overrides, so pages can theme them.
- Every attribute is also a camelCase property. Support `theme="dark|light"`, and follow `prefers-color-scheme` when it isn't set.
- Accessible by default: `role="img"` with a generated `aria-label` (overridable with `label`) for graphic components.
- Never put the literal text `</script>` in a component file: `example.html` inlines the file inside a `<script>` tag, and that text would end it early.
- `example.html` inlines a copy of the component so it works from disk. After changing a component, regenerate its example's inlined copy so the two stay identical.

## The fd-* family (Friday design system)

- Same rules as above, plus: the code shared by every `fd-*` component (tokens, base styles, icons) lives in `tools/fd-shared.js` and is pasted between the `fd-shared` markers of each component by `node tools/fd-sync.mjs`. Never edit inside the markers; edit `tools/fd-shared.js` or the tokens and re-run the sync (it also refreshes each `example.html` and `playground/standalone.html`).
- Tokens (`fd-tokens/tokens/*.json`) are copied from Friday's design system with `--from`; they are not edited here.
- Before a release: `node tools/fd-test.mjs` (browser tests, Playwright via `PLAYWRIGHT_CORE`) must pass.

## Using a component in a project

- Load it from `https://cdn.jsdelivr.net/gh/adm-glitch/web-components@<tag>/<name>/<name>.js`, pinned to a tag, or copy the `.js` file in.
- Don't edit a component inside a project. Change it here, release a new tag, then bump the tag in the project.
- Read the component's README for its API before using it.

## Releasing

1. Update the component, its README and its example.
2. Add the component to the root README table if it's new.
3. Commit, then tag following the versioning in the root README (`git tag v1.1.0 && git push --tags`).
4. jsDelivr serves the new tag right away. To refresh a moving reference like `@main`, purge it at `https://purge.jsdelivr.net/gh/adm-glitch/web-components@main/<path>`.

## Surfaces: no explainer text
<!-- no-explainer-text v1 -->
No surface made here (page, report, dashboard, card, deck, email, app screen) carries explainer text: no subtitle under a
title that explains or justifies it, no card footer, no tiny disclaimer or explainer, no "how this was made" line, no
tagline like "never guessed, always measured". A surface carries the title, the data, labels, units, dates and names, and
reads like a report or a dashboard presented to a client. Mauricio, 2026-11-10: "i don't ever want to see text like that in
anything ever ever ever ever never not in the subtitle not in the footer of the cards not as a short tiny disclaimer
explainer none of that All things I want need to look like a report I sent to my client a dashboard I present to my client"
