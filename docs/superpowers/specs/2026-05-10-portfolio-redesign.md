# Portfolio Redesign — Design Spec
**Date:** 2026-05-10  
**Status:** Approved  
**Stack:** React 18 + Vite + Tailwind CSS 3 (existing)

---

## 1. Goals

Update Calvin Daniel's portfolio site to:
- Add multi-page routing (Projects page, Clients page)
- Add a light/dark mode toggle with persistent preference
- Upgrade the Running section with a next-race highlight and goal banner
- Add a Pricing section (tiered packages) to the homepage
- Update navigation to link to all pages and include the theme toggle
- Use stock images as placeholders throughout; final images to be swapped later

---

## 2. Architecture

### Routing
Install `react-router-dom`. Three routes:

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `HomePage` | Existing single-page scroll, extended |
| `/projects` | `ProjectsPage` | Developer projects showcase |
| `/clients` | `ClientsPage` | Client website case studies |

`main.jsx` wraps the app in `<BrowserRouter>`. A `Layout` component wraps all routes and renders `Header`, `Footer`, and the scroll-progress bar. Each page is its own component under `src/pages/`.

### Theme System
- `ThemeContext` (React context) in `src/context/ThemeContext.jsx`
- State: `'dark'` | `'light'`, initialized from `localStorage.getItem('theme')` with `'dark'` as default
- On mount and on change: sets/removes class `dark` on `document.documentElement`
- Tailwind config: `darkMode: 'class'`
- All components receive `dark:` variant classes alongside existing classes

**Light mode palette:**
| Token | Dark value | Light value |
|-------|-----------|-------------|
| Page background | `#001A4D` | `#FAF8F5` |
| Section background | `#00245E` | `#F0EDE8` |
| Primary text | `#F5F7FA` | `#0D1B3E` |
| Muted text | `rgba(245,247,250,0.6)` | `rgba(13,27,62,0.6)` |
| Accent (orange) | `#FF5910` | `#FF5910` (unchanged) |
| Borders | `rgba(245,247,250,0.1)` | `rgba(13,27,62,0.12)` |

The particle canvas in `Hero.jsx` reads the current theme and swaps particle/line colors accordingly (dark: white/orange/blue; light: navy/orange/slate).

---

## 3. Navigation & Header

### Updated nav links
```
About | Developer | Analyst | Runner | Projects | Clients | [Let's Connect]
```

- `About`, `Developer`, `Analyst`, `Runner` remain anchor links (`#about`, `#web-dev`, `#analyst`, `#running`)
- `Projects` and `Clients` are React Router `<Link>` components to `/projects` and `/clients`
- When on `/projects` or `/clients`, clicking an anchor link navigates to `/?scrollTo=<id>` and scrolls after mount (or simply links to `/#about` — browser handles the scroll)

### Theme toggle button
- Location: Desktop — left of "Let's Connect" CTA; Mobile — top of off-canvas menu
- Icon: sun icon in dark mode, moon icon in light mode (SVG, inline)
- On click: toggles theme context, persists to `localStorage`

### Active state
- Current page's nav link gets an orange bottom border (`border-b-2 border-orange`) or an orange dot indicator
- Anchor-based links get active state via `IntersectionObserver` (existing scroll behavior) on the homepage only

---

## 4. Homepage — Running Section Upgrade

### New: Next Race Highlight card
Positioned at the **top** of the Running section, above the existing stat grid.

Contents:
- Label: "NEXT RACE" (monospace caps)
- Race name (e.g., "Chicago Marathon")
- Date + location
- Distance badge ("26.2 mi")
- Countdown: "X days away" — the number gets a subtle CSS pulse animation

Styling: left border `border-l-4 border-orange`, background `bg-navy-dark/40` (dark) / `bg-F0EDE8` (light), rounded corner, padding.

### New: Goal Banner
Positioned below the Personal Records grid, above the Abbott Majors tracker.

Contents: 2–3 goal pills, each showing:
- A target/flag icon
- Goal text (e.g., "Sub-4:00 Marathon", "Complete Chicago Major", "1,000 miles in 2025")

Styling: horizontal flex row (wraps on mobile), each pill is `border border-orange/40 text-orange bg-orange/8 px-4 py-2 rounded-full font-mono text-xs`.

### Visual upgrade
- "RUN" watermark text becomes larger and more visible (opacity bumped slightly, size increased)
- Desktop layout becomes two-column: stats/text on the left, a runner stock photo on the right (mirroring the About section's image treatment)
- Photo gets the same overlay + badge treatment as About

---

## 5. Homepage — Pricing Section (new)

### Position
Between the `Running` section and the `Contact` section in the homepage scroll order.

### Layout
Three cards in a CSS grid: 1 column (mobile) → 3 columns (≥1024px). Middle card (Pro) is visually elevated on desktop via `scale-[1.04]` and `z-10`.

### Cards

| Tier | Sample Price | Key features |
|------|-------------|--------------|
| **Starter** | Starting at $499 | Single landing page, mobile responsive, basic SEO, contact form |
| **Pro** *(Most Popular)* | Starting at $1,199 | Multi-page site, CMS integration (WordPress or Squarespace), performance optimization, 30-day post-launch support |
| **Custom** | Let's Talk | Full brand build, e-commerce or advanced functionality, ongoing retainer available |

- Pro card: `border-orange` border, "Most Popular" badge (orange pill, top-right of card), slight upward scale on desktop
- Starter + Custom cards: `border-offwhite/10` (dark) / `border-navy/10` (light)
- Each card has a feature list (checkmarks), price display, and a CTA button → `#contact`
- Footer note below grid: *"All pricing is project-specific — these are starting points. Get in touch for a tailored quote."*

---

## 6. Projects Page (`/projects`)

### Page header (slim banner)
- Title: "Projects" in display type (`clamp(3rem, 8vw, 6rem)`)
- Subtitle: "Personal builds, experiments, and tools"
- Breadcrumb: `← Home`
- Background: same navy-bg (dark) / FAF8F5 (light), no full-viewport height — ~220px tall

### Filter row
Pills above the grid: `All` | `Web Dev` | `Data / Analytics` | `Tool`  
Clicking a pill filters visible cards (React `useState` filter, no animation required).

### Project card grid
Responsive: 1 col (mobile) → 2 col (tablet ≥768px) → 3 col (desktop ≥1024px)

Each card:
- Preview image (stock placeholder, 16:9 aspect ratio)
- Project title (display font, `1.2rem`)
- Short description (1–2 sentences, body font, muted)
- Tech stack tags (monospace pill badges, `text-xs`)
- Two action buttons: "View Live" (external link icon) + "View Code" (GitHub icon)
- Hover: card lifts (`-translate-y-1 shadow-lg`), image scales (`scale-[1.03]`)

### Placeholder data
4–6 placeholder project cards (title: "Project Name", description: "Short description of what this project does.", tags: `React`, `Tailwind`, links: `#`).

---

## 7. Client Websites Page (`/clients`)

### Page header (slim banner)
- Title: "Client Work"
- Subtitle: "Real businesses. Real results."
- Breadcrumb: `← Home`

### Layout: alternating editorial rows
Desktop: two-column alternating (image left / text right → image right / text left)  
Tablet: image top / text bottom (stacked but image is ~40% height)  
Mobile: fully stacked, image first

Each client entry:
- Large preview image (stock placeholder, 3:2 ratio)
- Client name (display font)
- Industry tag pill (e.g., `Small Business`, `Restaurant`, `Fitness`)
- 2–3 sentence description of what was built and the result
- Platform/tech tags (e.g., `WordPress` `Hostinger` `Custom CSS`)
- "Visit Site" CTA button (external link, orange bordered)

### Placeholder data
3–4 placeholder entries.

---

## 8. Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| Mobile (`< 768px`) | Single column everywhere, off-canvas nav, stacked cards/rows |
| Tablet (`768px–1023px`) | 2-column grids, stacked client rows with image top, condensed type sizes |
| Desktop (`≥ 1024px`) | 3-column grids, alternating client rows, full nav visible, Pro card scaled |

---

## 9. Files to Create / Modify

### New files
```
src/context/ThemeContext.jsx
src/components/Layout.jsx
src/pages/HomePage.jsx
src/pages/ProjectsPage.jsx
src/pages/ClientsPage.jsx
src/components/Pricing.jsx
src/components/PageHeader.jsx
src/components/ProjectCard.jsx
src/components/ClientRow.jsx
```

### Modified files
```
src/main.jsx              — add BrowserRouter, ThemeProvider
src/App.jsx               — becomes router with Layout + routes
src/components/Header.jsx — add new nav links, theme toggle, dark: variants
src/components/Hero.jsx   — add dark: variants, theme-aware particle colors
src/components/About.jsx  — add dark: variants
src/components/WebDev.jsx — add dark: variants
src/components/Analyst.jsx — add dark: variants
src/components/Running.jsx — add dark: variants, Next Race card, Goal Banner, photo column
src/components/Contact.jsx — add dark: variants
src/components/Footer.jsx  — add dark: variants
src/components/Reveal.jsx  — add dark: variants (if any)
tailwind.config.js         — add darkMode: 'class', light mode color tokens
```

---

## 10. Out of Scope

- Real project/client data (placeholders only — to be swapped later)
- Contact form backend / email handling
- CMS or database integration
- Authentication
- Blog or editorial content
- Any analytics or tracking scripts
