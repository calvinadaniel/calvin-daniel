# React → Plain HTML Conversion — Design Spec
**Date:** 2026-05-11
**Status:** Approved

---

## 1. Goal

Strip out React, Vite, and all build tooling. Replace with a pure HTML + vanilla JS + static CSS site. The visual design, dark/light mode, and all content remain identical.

---

## 2. CSS Strategy

Run Tailwind CLI one final time against all existing JSX source files to generate a complete static `css/styles.css`. After generation:
- Delete `src/`, `node_modules/`, `package.json`, `package-lock.json`, `vite.config.js`, `postcss.config.js`, `tailwind.config.js`
- No build tooling remains in the repo

The generated CSS preserves every existing utility class. No styles need to be rewritten.

---

## 3. File Structure

```
index.html                ← homepage (all sections inline)
projects/
  index.html              ← /projects/ page
clients/
  index.html              ← /clients/ page
css/
  styles.css              ← generated Tailwind output (static, never regenerated)
js/
  main.js                 ← shared: dark mode, scroll reveals, mobile menu
  home.js                 ← homepage only: particle canvas, count-up, typewriter
  projects.js             ← projects page only: filter logic
images/
  (all existing images)
public/
  404.html                ← GitHub Pages SPA redirect (kept)
.github/
  workflows/deploy.yml   ← GitHub Actions deploy (kept, updated for static site)
```

All other files (`.claude/`, `.gitignore`, `docs/`) remain unchanged.

---

## 4. Dark Mode

- Tailwind `darkMode: 'class'` behavior preserved — `dark` class on `<html>` activates `dark:` variants
- `js/main.js` on every page:
  - On load: reads `localStorage.getItem('theme')`, applies `dark` class if value is `'dark'` or if no value stored (dark is default)
  - Toggle button: flips `dark` class on `<html>`, writes new value to `localStorage`
- Theme toggle button appears in header (desktop) and mobile off-canvas menu (same as before)

---

## 5. JavaScript

### `js/main.js` (all pages)
- **Dark mode:** init on load + toggle handler
- **Mobile menu:** hamburger open/close, overlay click, Escape key, body scroll lock
- **Scroll reveals:** single `IntersectionObserver` on all `[data-reveal]` elements. Adds `revealed` class when element enters viewport. CSS handles the transition.

### `js/home.js` (homepage only)
- **Particle canvas:** direct port from Hero.jsx — same connected-dot network, same color sets for dark/light, re-initializes on theme toggle via a custom `themechange` event dispatched by `main.js`
- **Count-up:** `IntersectionObserver` on each `[data-countup]` element. Reads `data-target` (number) and `data-duration` (ms). Uses `requestAnimationFrame` with easing.
- **Typewriter:** `setInterval` appends characters to a `<span id="eyebrow-text">`, removes blinking cursor `<span>` when done. ~15 lines.
- **Hero headline animation:** JS adds `animated` class to `.hero-headline` after 180ms. CSS `@keyframes` handles slide-up on the whole line (not per-letter).

### `js/projects.js` (projects page only)
- Click handler on `[data-filter]` buttons: toggles active state, shows/hides `[data-category]` cards by comparing button's `data-filter` value to card's `data-category` value.

---

## 6. Scroll Reveal CSS

```css
[data-reveal] {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
[data-reveal].revealed {
  opacity: 1;
  transform: none;
}
```

Appended to `css/styles.css` after generation.

---

## 7. Pages

### `index.html`
Sections in order: `#hero`, `#about`, `#web-dev`, `#analyst`, `#running`, `#pricing`, `#contact`.
Loads: `css/styles.css`, `js/main.js`, `js/home.js`.

### `projects/index.html`
Slim page header with "← Home" breadcrumb, filter pills, 4 hardcoded project cards.
Anchor links to homepage use `../index.html#section`.
Loads: `../css/styles.css`, `../js/main.js`, `../js/projects.js`.

### `clients/index.html`
Slim page header with "← Home" breadcrumb, 3 alternating client rows with real screenshots.
Images use `../images/foo.png` relative paths.
Loads: `../css/styles.css`, `../js/main.js`.

---

## 8. GitHub Actions Deploy

Update `deploy.yml` to remove the `npm ci` and `npm run build` steps — the site is already built. The workflow simply uploads the repo root as the Pages artifact (excluding `node_modules`, `src/`, `docs/`, `.claude/`).

---

## 9. Image Paths

No more `import.meta.env.BASE_URL` needed. Paths are relative:
- From `index.html`: `images/foo.jpg`
- From `projects/index.html` and `clients/index.html`: `../images/foo.jpg`

GitHub Pages serves these correctly at `calvindaniel.github.io/calvin-daniel/`.

Wait — GitHub Pages deploys from the repo root, so the base is `/calvin-daniel/`. Relative paths like `../images/foo.jpg` from `projects/index.html` would resolve to `/images/foo.jpg` (outside the repo). 

**Correction:** Use root-relative paths from the deployed base: `/calvin-daniel/images/foo.jpg` — OR use the GitHub Pages `<base href>` tag on inner pages.

**Decision:** Add `<base href="/calvin-daniel/">` in the `<head>` of all three pages. Then all asset paths are written relative to that base: `images/foo.jpg`, `css/styles.css`, `js/main.js` — same on all pages, no `../` prefixes needed. The `<base>` tag handles the subdirectory for GitHub Pages, and local development can override with `<base href="/">` or by running a local server from the repo root.

---

## 10. Out of Scope

- Contact form backend
- CMS or database
- Any new features beyond the conversion
- Vitest tests (removed with the build tooling)
