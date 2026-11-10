# Email Signature (Titan): Design

**Date:** 2026-11-10  
**Owner:** Calvin Daniel  
**Status:** Approved

## Goal

A clean contact HTML signature for Titan Email (`info@calvindaniel.com`) that matches Calvin Daniel branding and pastes via **Edit as HTML**.

## Decisions

| Topic | Decision |
|---|---|
| Style | Clean contact (no sales CTA) |
| Layout | Logo left, orange rule, text right |
| Logo | Hosted `https://calvindaniel.com/images/primary-logo.png` |
| Included | Name, title, email, phone; website + LinkedIn as icons |
| Contact layout | Email and phone each on their own line |
| Icons | Hosted orange circle PNGs: `email-icon-globe.png`, `email-icon-linkedin.png` |
| Excluded | Book CTA, GitHub, Substack, headshot |
| Markup | Tables + inline CSS only (Titan-safe tags) |
| Colors | Navy `#001A4D`, muted `#5A6577`, orange `#FF5910` |

## Deliverable

`docs/email-signature/calvin-daniel-signature.html` — preview page plus copy-paste block for Titan.
