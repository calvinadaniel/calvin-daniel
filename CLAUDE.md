## Code Conventions
- Mobile-first CSS — base styles for small screens, media queries scale up
- Off-canvas nav for mobile (already implemented — do not replace with inline toggle)
- BEM-style class naming for components: .block__element--modifier
- No inline styles unless absolutely required for JS-driven dynamic values
- All animations use CSS transitions or the Web Animations API — no GSAP or similar
- JS: use const/let, no var; arrow functions preferred; DOM queries cached in variables
- Dark/light mode driven by a [data-theme] attribute on <html> — do not change this mechanism
- Images: use WebP where possible; always include width/height attributes to prevent CLS

## Active Audit Changes (Priority Order)
Work through these in sequence. Mark each done when complete.

1. [x] Fix broken hero counter JavaScript — counters show 0 on load; animation not firing
2. [x] Fix hero PR display — currently shows "3: 00", should show "3:54:23"
3. [x] Replace Unsplash stock photos on /projects/ with real screenshots of each project
4. [x] Replace mailto: contact link with embedded contact form (see spec below)
5. [ ] Add testimonials section to /clients/ page (one quote per client, 5 total)
6. [x] Rewrite client descriptions to include outcomes, not just features
7. [x] Add Process section to index.html between Pricing and Contact
8. [x] Remove BigQuery from skills list on /projects/ page
9. [x] Link GitHub buttons to specific repos (not profile) or remove if repos are private
10. [x] Compress running section — it should not exceed 20% of homepage scroll depth

## Contact Form Spec
Replace the mailto: link with an embedded HTML form. Required fields:
- Name (text)
- Email (email)
- Project Type (select: Web Development / Data Dashboard / Custom / Other)
- Estimated Budget (select: Under $1K / $1K–$3K / $3K–$10K / Let's Talk)
- Timeline (select: ASAP / 1–2 months / 3+ months / Just Exploring)
- Project Description (textarea, 500 char max)
- Submit button: "Send Message"
Form action: use Formspree or Netlify Forms — do not use PHP

## Brand Rules
- Primary email: info@calvindaniel.com (NOT calvin@calantdigital.com)
- Logo files: /images/primary-logo.png (light mode) and /images/dark-mode-logo.png
- Do not introduce new typefaces — match existing font stack
- Do not add third-party JS libraries without asking first

## Do Not Touch
- Off-canvas nav structure and hamburger animation
- Dark/light mode toggle mechanism
- Existing CSS custom property (variable) names
- The particle canvas in the hero — if it exists, preserve it

## Testing Checklist Before Any Commit
- [ ] Test on mobile (375px viewport minimum)
- [ ] Test dark mode and light mode
- [ ] Validate all anchor links resolve correctly
- [ ] Check hero counters animate on load
- [ ] Confirm contact form submits without page reload
