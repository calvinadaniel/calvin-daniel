# Running Analysis Dashboard — Design Spec
**Date:** 2026-05-12
**Status:** Approved

---

## Overview

A static analytics dashboard showcasing Calvin Daniel's running progress since September 2024, with 3-year pace projections and Boston Marathon qualification trajectory. Lives at `/projects/running-analysis-app/` on the portfolio site. Data is pre-processed locally via a Python pipeline and baked into static JSON files — no backend required.

---

## File Structure

```
projects/running-analysis-app/
├── index.html              # Dashboard page
├── js/
│   └── dashboard.js        # Chart rendering + data loading
└── data/
    ├── activities.json     # Raw processed activity log
    ├── monthly.json        # Monthly aggregates (pace, HR, volume, effort)
    └── projections.json    # 3-year projection + BQ scenarios

scripts/                    # Repo root, not served
├── fetch_strava.py         # OAuth + Strava API pull
├── process.py              # Clean + aggregate data
├── project.py              # Regression + projection math
└── requirements.txt
```

**Refresh workflow:** Run all three scripts locally, commit the updated JSON files, push to GitHub Pages.

---

## Data Pipeline

### `fetch_strava.py`
- Authenticates via Strava OAuth (client_id + client_secret + refresh token stored in `.env`)
- Pulls all activities of type `Run` from September 2024 onward using the Strava v3 API
- Fields captured per activity: date, distance, moving_time, average_pace, average_heartrate, max_heartrate, suffer_score (relative effort)
- Writes raw cleaned output to `projects/running-analysis-app/data/activities.json`

### `process.py`
- Reads `activities.json`
- Converts pace to seconds/mile for all math; formats as `min:sec/mi` for display
- Aggregates by calendar month: avg pace, avg HR, total miles, total suffer score
- Calculates HR efficiency ratio per month: `avg_hr / avg_pace_sec` — a declining ratio signals improving aerobic fitness
- Computes rolling 4-week volume (total miles per week, smoothed)
- Writes to `monthly.json`

### `project.py`
- Reads `monthly.json`
- Fits linear regression on monthly avg pace (seconds/mile) over time
- Extrapolates 36 months forward in three scenarios (slope = monthly pace improvement in sec/mile; larger magnitude = faster improvement):
  - **Current trajectory** — regression slope as observed from data
  - **Consistent training** — slope magnitude ×1.25 (structured plan, no major gaps)
  - **Peak training** — slope magnitude ×1.50 (marathon-block commitment year-round)
- Applies a pace floor at ~390 sec/mi (6:30/mi ≈ 2:50 marathon) to prevent physically impossible projections
- BQ target: **7:03/mi** (423 sec/mi) — equivalent pace for a 3:05:00 marathon over 26.2 miles
- Athlete context: male, age 42, current PR 3:54:23, BQ standard 3:05:00 (males 40-44 age group)
- For each scenario, calculates projected BQ crossing date or flags "not reached within 3 years"
- Writes to `projections.json`

---

## Dashboard — Six Panels

Styled to match the existing portfolio aesthetic: navy / orange / offwhite color scheme. Chart.js via CDN (no build step).

### 1. Summary Bar
Four stat chips across the top:
- Total runs
- Total distance (miles)
- Total moving time
- Current monthly average pace

### 2. Pace Trend
- **Type:** Line chart
- **X-axis:** Month (Sep 2024 → present)
- **Series:** Monthly avg pace + regression trend line overlay
- **Purpose:** Primary signal of improvement over time

### 3. Heart Rate Efficiency
- **Type:** Scatter plot
- **X-axis:** Avg pace (min/mi), **Y-axis:** Avg HR (bpm)
- **Color:** Points colored by time period (early = light, recent = dark)
- **Purpose:** Shows aerobic adaptation — newer runs should appear faster at lower HR

### 4. Weekly Volume
- **Type:** Bar chart
- **X-axis:** Week, **Y-axis:** Miles
- **Purpose:** Training consistency and load context; explains pace trend fluctuations

### 5. Relative Effort Trend
- **Type:** Line chart with 4-week rolling average
- **X-axis:** Date, **Y-axis:** Strava suffer score
- **Purpose:** Paired with pace trend — same effort at faster pace = fitness gain

### 6. Boston Qualifier Projection (Hero Panel)
- **Type:** Line chart
- **X-axis:** Date (present → 3 years out)
- **Series:** Three scenario lines (current trajectory, consistent training, peak training)
- **Reference line:** Horizontal BQ target at 7:03/mi
- **Annotations:** Projected BQ crossing date per scenario (or "Not reached" label)
- **Purpose:** The payoff panel — makes the whole dashboard meaningful

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Data pipeline | Python 3, pandas, scipy, requests | Best-in-class for time-series regression and API calls |
| Auth secrets | python-dotenv + `.env` file | Keeps credentials out of the repo |
| Charts | Chart.js (CDN) | Lightweight, no build step, matches static site approach |
| Styling | Inline with existing `styles.css` patterns | Visual consistency with portfolio |
| Hosting | GitHub Pages (existing) | No changes needed |

---

## Constraints & Notes

- `.env` file added to `.gitignore` — Strava credentials never committed
- JSON data files ARE committed — they're the pre-baked output, safe to be public
- Boston qualifier standard used: 3:05:00 for males 40-44 (athlete is currently 42)
- Projection math is descriptive, not prescriptive — dashboard copy should frame scenarios as "what if" not guarantees
- No server, no build step, no dependencies beyond running the Python scripts locally before committing
