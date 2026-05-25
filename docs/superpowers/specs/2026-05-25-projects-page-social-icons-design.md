# Projects Page Social Icons — Design Spec
**Date:** 2026-05-25  
**Status:** Approved

## Overview

Add brand icons to the GitHub and LinkedIn buttons in the Profile Hero section of `projects/index.html`, and add a TikTok social link styled as a personal callout below the professional links.

No icon library is installed. All icons are inline SVGs sourced from Simple Icons, consistent with the existing inline SVG approach used throughout the site's navigation.

## Target File

`projects/index.html` — Profile Hero section only (the `<div class="flex gap-4 flex-wrap">` containing the GitHub and LinkedIn buttons).

## Changes

### 1. GitHub Button
- **Before:** `GitHub ↗` (text only)
- **After:** GitHub brand SVG icon (18×18px) inline before the label text "GitHub"
- **Style:** No change — retains orange bordered button (`border-orange text-orange hover:bg-orange hover:text-offwhite`)
- **Icon source:** Simple Icons GitHub path

### 2. LinkedIn Button
- **Before:** `LinkedIn ↗` (text only)
- **After:** LinkedIn brand SVG icon (18×18px) inline before the label text "LinkedIn"
- **Style:** No change — retains neutral bordered button
- **Icon source:** Simple Icons LinkedIn path

### 3. TikTok Link (new)
- **Placement:** New element directly below the `flex gap-4 flex-wrap` button row, outside it
- **Layout:** `"Follow my running journey here:"` as muted plain text, followed by the TikTok icon + `@calvindaniel06` as a clickable link
- **URL:** `https://www.tiktok.com/@calvindaniel06`
- **Style:** Muted text (`text-navy-bg/50 dark:text-offwhite/50`) for the label; link uses `text-navy-bg/70 dark:text-offwhite/70 hover:text-orange transition-colors` with inline TikTok SVG icon (16×16px)
- **Icon source:** Simple Icons TikTok path
- **Target:** `_blank` with `rel="noopener noreferrer"`

## Icon Sizing & Alignment

All icons use `inline-block align-middle` (or flex row with `items-center`) to vertically center with adjacent text. GitHub and LinkedIn icons: 18×18px. TikTok icon: 16×16px (matches surrounding body text size).

## What Is NOT Changed

- Button styles, colors, hover states
- Any other page or section
- Nav, footer, skills, experience, or projects grid
- No new CSS files or JS files required
