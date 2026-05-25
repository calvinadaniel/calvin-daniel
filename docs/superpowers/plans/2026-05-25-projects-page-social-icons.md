# Projects Page Social Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add inline SVG brand icons to the GitHub and LinkedIn buttons and add a TikTok social callout row in the Profile Hero section of `projects/index.html`.

**Architecture:** Single-file HTML edit. All icons are inline SVGs (no library, no CDN) sourced from Simple Icons, consistent with the site's existing inline SVG approach. The GitHub and LinkedIn anchors get `inline-flex items-center gap-2` added and a 18×18px SVG prepended inside each. A new flex row below the buttons carries the TikTok callout.

**Tech Stack:** HTML, Tailwind CSS (compiled), inline SVG

---

## File Map

| Action | File |
|--------|------|
| Modify | `projects/index.html` — Profile Hero section only |

---

### Task 1: Add SVG icon to the GitHub button

**Files:**
- Modify: `projects/index.html` (Profile Hero — GitHub anchor)

The current GitHub anchor:
```html
<a href="https://github.com/calvinadaniel/" target="_blank" rel="noopener noreferrer" class="font-mono text-[0.7rem] tracking-[0.1em] uppercase px-5 py-[0.5rem] border border-orange text-orange rounded-sm hover:bg-orange hover:text-offwhite transition-all">GitHub ↗</a>
```

- [ ] **Step 1: Replace the GitHub anchor with the icon version**

Find the anchor above and replace it with:

```html
<a href="https://github.com/calvinadaniel/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase px-5 py-[0.5rem] border border-orange text-orange rounded-sm hover:bg-orange hover:text-offwhite transition-all">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
  GitHub
</a>
```

Key changes: added `inline-flex items-center gap-2`, inserted SVG before text, removed `↗`.

- [ ] **Step 2: Verify in browser**

Open `projects/index.html` in a browser. Confirm:
- GitHub button shows the Octocat icon to the left of "GitHub"
- Icon color inherits correctly (orange at rest, white on hover)
- Button shape and padding unchanged

---

### Task 2: Add SVG icon to the LinkedIn button

**Files:**
- Modify: `projects/index.html` (Profile Hero — LinkedIn anchor)

The current LinkedIn anchor:
```html
<a href="https://www.linkedin.com/in/calvin-daniel-6229054/" target="_blank" rel="noopener noreferrer" class="font-mono text-[0.7rem] tracking-[0.1em] uppercase px-5 py-[0.5rem] border border-navy-bg/30 dark:border-offwhite/30 text-navy-bg/70 dark:text-offwhite/70 rounded-sm hover:border-orange hover:text-orange transition-all">LinkedIn ↗</a>
```

- [ ] **Step 1: Replace the LinkedIn anchor with the icon version**

Find the anchor above and replace it with:

```html
<a href="https://www.linkedin.com/in/calvin-daniel-6229054/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase px-5 py-[0.5rem] border border-navy-bg/30 dark:border-offwhite/30 text-navy-bg/70 dark:text-offwhite/70 rounded-sm hover:border-orange hover:text-orange transition-all">
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  LinkedIn
</a>
```

Key changes: added `inline-flex items-center gap-2`, inserted SVG before text, removed `↗`.

- [ ] **Step 2: Verify in browser**

Open `projects/index.html`. Confirm:
- LinkedIn button shows the LinkedIn icon to the left of "LinkedIn"
- Icon color inherits (muted at rest, orange on hover)
- Toggle dark mode and confirm icon visible in both modes

---

### Task 3: Add the TikTok social callout row

**Files:**
- Modify: `projects/index.html` (Profile Hero — after the buttons `div`)

The current buttons container ends with:
```html
        </div>
      </div>
    </div>
  </section>
```

The `<div class="flex gap-4 flex-wrap">` closes before `</div>` (end of `data-reveal` div).

- [ ] **Step 1: Add the TikTok callout after the buttons flex div**

Find this exact closing sequence inside the Profile Hero `data-reveal` div:
```html
          <a href="https://www.linkedin.com/in/calvin-daniel-6229054/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 font-mono text-[0.7rem] tracking-[0.1em] uppercase px-5 py-[0.5rem] border border-navy-bg/30 dark:border-offwhite/30 text-navy-bg/70 dark:text-offwhite/70 rounded-sm hover:border-orange hover:text-orange transition-all">
```

After the closing `</div>` of `<div class="flex gap-4 flex-wrap">`, insert:

```html
        <div class="flex items-center gap-2 mt-3 font-mono text-[0.72rem]">
          <span class="text-navy-bg/50 dark:text-offwhite/50">Follow my running journey here:</span>
          <a href="https://www.tiktok.com/@calvindaniel06" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-navy-bg/70 dark:text-offwhite/70 hover:text-orange transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
            @calvindaniel06
          </a>
        </div>
```

- [ ] **Step 2: Verify in browser**

Open `projects/index.html`. Confirm:
- "Follow my running journey here:" appears below the two buttons in muted text
- TikTok icon and `@calvindaniel06` appear inline to the right
- Link turns orange on hover
- Clicking opens `https://www.tiktok.com/@calvindaniel06` in a new tab
- Toggle dark mode — verify muted text and link are legible in both modes
- On a narrow viewport (mobile), verify the callout wraps gracefully

---

### Task 4: Commit

**Files:**
- Modify: `projects/index.html`

- [ ] **Step 1: Commit the changes**

```bash
git add projects/index.html
git commit -m "feat: add brand icons to GitHub/LinkedIn buttons and TikTok social callout"
```
