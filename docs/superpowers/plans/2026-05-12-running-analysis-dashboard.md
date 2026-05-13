# Running Analysis Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static analytics dashboard at `/projects/running-analysis-app/` that visualizes Calvin Daniel's Strava running data with 3-year Boston Marathon qualification projections.

**Architecture:** A Python pipeline (fetch → process → project) generates four static JSON files committed to the repo. A vanilla JS + Chart.js dashboard reads those files and renders 6 panels: summary bar, pace trend, HR efficiency scatter, weekly volume, relative effort, and BQ projection. No server needed — GitHub Pages serves everything.

**Tech Stack:** Python 3, requests, scipy, numpy, python-dotenv, python-dateutil, pytest · Chart.js 4 via CDN, vanilla JS

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `scripts/fetch_strava.py` | Create | OAuth token refresh + paginated Strava API fetch → activities.json |
| `scripts/process.py` | Create | Clean activities, aggregate monthly stats + weekly volume |
| `scripts/project.py` | Create | Linear regression + 3-year BQ projection scenarios |
| `scripts/requirements.txt` | Create | Python dependencies |
| `scripts/.env.example` | Create | Credential template |
| `scripts/tests/__init__.py` | Create | Makes tests/ a discoverable package |
| `scripts/tests/test_process.py` | Create | Unit tests for process.py utilities |
| `scripts/tests/test_project.py` | Create | Unit tests for project.py utilities |
| `projects/running-analysis-app/index.html` | Create | Dashboard HTML + Chart.js CDN |
| `projects/running-analysis-app/js/dashboard.js` | Create | Data loading + 6 Chart.js panel renders |
| `projects/running-analysis-app/data/activities.json` | Created by script | Per-activity output (committed) |
| `projects/running-analysis-app/data/monthly.json` | Created by script | Monthly aggregates (committed) |
| `projects/running-analysis-app/data/weekly.json` | Created by script | Weekly mileage (committed) |
| `projects/running-analysis-app/data/projections.json` | Created by script | Regression + scenarios (committed) |
| `styles.css` | Modify | Add dashboard panel layout CSS |
| `.gitignore` | Modify | Exclude scripts/.env |

---

### Task 1: Project Scaffold

**Files:**
- Create: `scripts/requirements.txt`
- Create: `scripts/.env.example`
- Create: `scripts/tests/__init__.py`
- Modify: `.gitignore`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p scripts/tests
mkdir -p projects/running-analysis-app/js
mkdir -p projects/running-analysis-app/data
```

- [ ] **Step 2: Create `scripts/requirements.txt`**

```
requests==2.31.0
python-dotenv==1.0.0
scipy==1.11.4
numpy==1.26.2
python-dateutil==2.8.2
pytest==7.4.3
```

- [ ] **Step 3: Install dependencies**

Run from repo root:
```bash
pip install -r scripts/requirements.txt
```

Expected: all packages install without errors.

- [ ] **Step 4: Create `scripts/.env.example`**

```
STRAVA_CLIENT_ID=your_client_id_here
STRAVA_CLIENT_SECRET=your_client_secret_here
STRAVA_REFRESH_TOKEN=your_refresh_token_here
```

- [ ] **Step 5: Create `scripts/tests/__init__.py`**

Empty file — makes tests/ a Python package so pytest can discover it.

- [ ] **Step 6: Append to `.gitignore`**

Add to the end of the existing `.gitignore`:
```
scripts/.env
scripts/__pycache__/
scripts/tests/__pycache__/
```

- [ ] **Step 7: Commit scaffold**

```bash
git add scripts/requirements.txt scripts/.env.example scripts/tests/__init__.py .gitignore
git commit -m "chore: scaffold running analysis project structure"
```

---

### Task 2: One-Time Strava OAuth Setup

**Files:** No code — manual credential setup. Produces `scripts/.env`.

- [ ] **Step 1: Register a Strava API app**

1. Go to https://www.strava.com/settings/api
2. App Name: `Running Dashboard`, Website: your portfolio URL, Callback Domain: `localhost`
3. Note your **Client ID** and **Client Secret**

- [ ] **Step 2: Get your authorization code**

Visit this URL in your browser (replace `YOUR_CLIENT_ID`):
```
https://www.strava.com/oauth/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost&response_type=code&scope=activity:read_all
```
Click Authorize. You'll be redirected to a URL like:
```
http://localhost/?state=&code=XXXXXXXXXXXXXXXX&scope=read,activity:read_all
```
Copy the `code` value.

- [ ] **Step 3: Exchange code for refresh token**

```bash
curl -X POST https://www.strava.com/oauth/token \
  -d client_id=YOUR_CLIENT_ID \
  -d client_secret=YOUR_CLIENT_SECRET \
  -d code=YOUR_AUTH_CODE \
  -d grant_type=authorization_code
```

Copy `"refresh_token"` from the response.

- [ ] **Step 4: Create `scripts/.env`**

```
STRAVA_CLIENT_ID=<actual client id>
STRAVA_CLIENT_SECRET=<actual client secret>
STRAVA_REFRESH_TOKEN=<actual refresh token>
```

**Do not commit this file — it is in .gitignore.**

---

### Task 3: `fetch_strava.py`

**Files:**
- Create: `scripts/fetch_strava.py`

- [ ] **Step 1: Create `scripts/fetch_strava.py`**

```python
import os
import json
import requests
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / '.env')

CLIENT_ID     = os.getenv('STRAVA_CLIENT_ID')
CLIENT_SECRET = os.getenv('STRAVA_CLIENT_SECRET')
REFRESH_TOKEN = os.getenv('STRAVA_REFRESH_TOKEN')

START_AFTER = int(datetime(2024, 9, 1).timestamp())
OUTPUT_PATH = (
    Path(__file__).parent.parent
    / 'projects' / 'running-analysis-app' / 'data' / 'activities.json'
)


def get_access_token():
    resp = requests.post('https://www.strava.com/oauth/token', data={
        'client_id':     CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'refresh_token': REFRESH_TOKEN,
        'grant_type':    'refresh_token',
    })
    resp.raise_for_status()
    return resp.json()['access_token']


def fetch_all_activities(token):
    activities, page = [], 1
    headers = {'Authorization': f'Bearer {token}'}
    while True:
        resp = requests.get(
            'https://www.strava.com/api/v3/athlete/activities',
            headers=headers,
            params={'per_page': 200, 'page': page, 'after': START_AFTER},
        )
        resp.raise_for_status()
        batch = resp.json()
        if not batch:
            break
        activities.extend(batch)
        page += 1
    return activities


def clean_activity(a):
    sport = a.get('sport_type') or a.get('type', '')
    if sport != 'Run':
        return None
    dist_m = a.get('distance', 0)
    if dist_m < 100:
        return None
    dist_mi = dist_m / 1609.344
    moving_sec = a['moving_time']
    pace = moving_sec / dist_mi if dist_mi > 0 else None
    return {
        'id':                a['id'],
        'date':              a['start_date_local'][:10],
        'distance_miles':    round(dist_mi, 2),
        'moving_time_sec':   moving_sec,
        'pace_sec_per_mile': round(pace, 1) if pace else None,
        'avg_hr':            a.get('average_heartrate'),
        'max_hr':            a.get('max_heartrate'),
        'suffer_score':      a.get('suffer_score'),
    }


def main():
    print('Refreshing access token...')
    token = get_access_token()
    print('Fetching activities...')
    raw = fetch_all_activities(token)
    cleaned = [c for a in raw if (c := clean_activity(a)) is not None]
    cleaned.sort(key=lambda x: x['date'])
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(cleaned, indent=2))
    print(f'Saved {len(cleaned)} runs → {OUTPUT_PATH}')


if __name__ == '__main__':
    main()
```

- [ ] **Step 2: Run the script**

```bash
python scripts/fetch_strava.py
```

Expected:
```
Refreshing access token...
Fetching activities...
Saved XX runs → .../projects/running-analysis-app/data/activities.json
```

Open `projects/running-analysis-app/data/activities.json` and confirm it's an array of objects with `date`, `pace_sec_per_mile`, `avg_hr`, etc.

- [ ] **Step 3: Commit**

```bash
git add scripts/fetch_strava.py projects/running-analysis-app/data/activities.json
git commit -m "feat: add Strava fetch script and initial activity data"
```

---

### Task 4: `process.py` — TDD

**Files:**
- Create: `scripts/tests/test_process.py`
- Create: `scripts/process.py`

- [ ] **Step 1: Write failing tests in `scripts/tests/test_process.py`**

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

from process import pace_to_display, aggregate_monthly, compute_weekly_volume


def test_pace_to_display_whole_minutes():
    assert pace_to_display(480) == '8:00'


def test_pace_to_display_with_seconds():
    assert pace_to_display(535) == '8:55'


def test_pace_to_display_single_digit_seconds():
    assert pace_to_display(481) == '8:01'


def _acts(*rows):
    return [
        {'date': d, 'pace_sec_per_mile': p, 'avg_hr': h,
         'distance_miles': mi, 'suffer_score': s}
        for d, p, h, mi, s in rows
    ]


def test_aggregate_monthly_groups_correctly():
    acts = _acts(
        ('2024-09-10', 540.0, 150, 5.0, 40),
        ('2024-09-17', 530.0, 148, 6.0, 45),
        ('2024-10-05', 520.0, 145, 7.0, 50),
    )
    result = aggregate_monthly(acts)
    assert len(result) == 2
    assert result[0]['month'] == '2024-09'
    assert result[0]['avg_pace_sec'] == 535.0
    assert result[0]['total_miles'] == 11.0
    assert result[0]['run_count'] == 2
    assert result[1]['month'] == '2024-10'


def test_aggregate_monthly_skips_null_pace():
    acts = _acts(
        ('2024-09-10', None, 150, 5.0, 40),
        ('2024-09-17', 530.0, 148, 6.0, 45),
    )
    result = aggregate_monthly(acts)
    assert result[0]['avg_pace_sec'] == 530.0
    assert result[0]['run_count'] == 2


def test_aggregate_monthly_hr_efficiency():
    acts = _acts(('2024-09-10', 500.0, 150.0, 5.0, 40))
    result = aggregate_monthly(acts)
    assert result[0]['hr_efficiency'] == round(150.0 / 500.0, 4)


def test_aggregate_monthly_null_suffer_handled():
    acts = [{'date': '2024-09-10', 'pace_sec_per_mile': 530.0,
             'avg_hr': 148, 'distance_miles': 5.0, 'suffer_score': None}]
    result = aggregate_monthly(acts)
    assert result[0]['total_suffer'] == 0


def test_compute_weekly_volume_groups_by_week():
    acts = [
        {'date': '2024-09-02', 'distance_miles': 5.0},
        {'date': '2024-09-03', 'distance_miles': 3.0},
        {'date': '2024-09-09', 'distance_miles': 6.0},
    ]
    result = compute_weekly_volume(acts)
    assert len(result) == 2
    assert result[0]['miles'] == 8.0
    assert result[1]['miles'] == 6.0
```

- [ ] **Step 2: Run tests — verify they all fail**

```bash
cd scripts && python -m pytest tests/test_process.py -v
```

Expected: `ModuleNotFoundError: No module named 'process'`

- [ ] **Step 3: Create `scripts/process.py`**

```python
import json
from collections import defaultdict
from datetime import datetime, timedelta
from pathlib import Path

ROOT         = Path(__file__).parent.parent
INPUT_PATH   = ROOT / 'projects' / 'running-analysis-app' / 'data' / 'activities.json'
MONTHLY_PATH = ROOT / 'projects' / 'running-analysis-app' / 'data' / 'monthly.json'
WEEKLY_PATH  = ROOT / 'projects' / 'running-analysis-app' / 'data' / 'weekly.json'


def pace_to_display(seconds):
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f'{m}:{s:02d}'


def aggregate_monthly(activities):
    buckets = defaultdict(lambda: {'paces': [], 'hrs': [], 'miles': 0.0, 'suffer': 0, 'count': 0})
    for a in activities:
        b = buckets[a['date'][:7]]
        if a.get('pace_sec_per_mile'):
            b['paces'].append(a['pace_sec_per_mile'])
        if a.get('avg_hr'):
            b['hrs'].append(a['avg_hr'])
        b['miles']  += a.get('distance_miles', 0)
        b['suffer'] += a.get('suffer_score') or 0
        b['count']  += 1

    result = []
    for month in sorted(buckets):
        b = buckets[month]
        avg_pace = sum(b['paces']) / len(b['paces']) if b['paces'] else None
        avg_hr   = sum(b['hrs'])   / len(b['hrs'])   if b['hrs']   else None
        hr_eff   = avg_hr / avg_pace if avg_hr and avg_pace else None
        result.append({
            'month':            month,
            'avg_pace_sec':     round(avg_pace, 1) if avg_pace else None,
            'avg_pace_display': pace_to_display(avg_pace) if avg_pace else None,
            'avg_hr':           round(avg_hr, 1) if avg_hr else None,
            'total_miles':      round(b['miles'], 1),
            'total_suffer':     b['suffer'],
            'hr_efficiency':    round(hr_eff, 4) if hr_eff else None,
            'run_count':        b['count'],
        })
    return result


def compute_weekly_volume(activities):
    weeks = defaultdict(float)
    for a in activities:
        dt = datetime.strptime(a['date'], '%Y-%m-%d')
        monday = dt - timedelta(days=dt.weekday())
        key = monday.strftime('%Y-%m-%d')
        weeks[key] += a.get('distance_miles', 0)
    return [{'week_start': k, 'miles': round(v, 1)} for k, v in sorted(weeks.items())]


def main():
    activities = json.loads(INPUT_PATH.read_text())
    monthly    = aggregate_monthly(activities)
    weekly     = compute_weekly_volume(activities)
    MONTHLY_PATH.write_text(json.dumps(monthly, indent=2))
    WEEKLY_PATH.write_text(json.dumps(weekly, indent=2))
    print(f'Monthly: {len(monthly)} months → {MONTHLY_PATH}')
    print(f'Weekly:  {len(weekly)} weeks  → {WEEKLY_PATH}')


if __name__ == '__main__':
    main()
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
cd scripts && python -m pytest tests/test_process.py -v
```

Expected: all green.

- [ ] **Step 5: Run the script**

```bash
python scripts/process.py
```

Expected:
```
Monthly: XX months → .../monthly.json
Weekly:  XX weeks  → .../weekly.json
```

- [ ] **Step 6: Commit**

```bash
git add scripts/process.py scripts/tests/test_process.py \
        projects/running-analysis-app/data/monthly.json \
        projects/running-analysis-app/data/weekly.json
git commit -m "feat: add data processing script with monthly and weekly aggregation"
```

---

### Task 5: `project.py` — TDD

**Files:**
- Create: `scripts/tests/test_project.py`
- Create: `scripts/project.py`

- [ ] **Step 1: Write failing tests in `scripts/tests/test_project.py`**

```python
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import pytest
from project import (
    fit_regression, project_scenario, find_bq_crossing,
    generate_month_labels, pace_to_display,
    BQ_TARGET_SEC, PACE_FLOOR_SEC,
)


def _monthly(paces):
    months = ['2024-09', '2024-10', '2024-11', '2024-12', '2025-01', '2025-02']
    return [{'month': months[i], 'avg_pace_sec': p} for i, p in enumerate(paces)]


def test_pace_to_display():
    assert pace_to_display(423) == '7:03'
    assert pace_to_display(390) == '6:30'
    assert pace_to_display(535) == '8:55'


def test_fit_regression_negative_slope_for_improving_runner():
    slope, _, _ = fit_regression(_monthly([540, 535, 530, 525, 520, 515]))
    assert slope < 0


def test_fit_regression_slope_magnitude():
    slope, _, _ = fit_regression(_monthly([540, 535, 530, 525, 520, 515]))
    assert abs(slope - (-5)) < 1.0


def test_fit_regression_requires_three_months():
    with pytest.raises(ValueError, match='at least 3 months'):
        fit_regression(_monthly([540, 535])[:2])


def test_fit_regression_flat_slope_clamped_to_negative():
    # flat runner — slope should still be negative (minimal improvement assumption)
    slope, _, _ = fit_regression(_monthly([540, 540, 540, 540, 540, 540]))
    assert slope < 0


def test_project_scenario_length():
    assert len(project_scenario(500, -3, num_months=36)) == 36


def test_project_scenario_improves_over_time():
    paces = project_scenario(500, -3, num_months=5)
    assert paces[0] < 500
    assert paces[-1] < paces[0]


def test_project_scenario_respects_floor():
    paces = project_scenario(400, -5, num_months=36)
    assert all(p >= PACE_FLOOR_SEC for p in paces)


def test_find_bq_crossing_found():
    # paces[3]=421 is first value at or below BQ_TARGET_SEC (423)
    paces = [430, 427, 424, 421]
    crossing = find_bq_crossing(paces, '2025-01')
    assert crossing == '2025-05'  # index 3 → start + 4 months


def test_find_bq_crossing_not_found():
    assert find_bq_crossing([500, 498, 496], '2025-01') is None


def test_generate_month_labels_sequence():
    assert generate_month_labels('2025-01', num_months=3) == ['2025-02', '2025-03', '2025-04']


def test_bq_target_constant():
    assert BQ_TARGET_SEC == 423


def test_pace_floor_constant():
    assert PACE_FLOOR_SEC == 390
```

- [ ] **Step 2: Run tests — verify they all fail**

```bash
cd scripts && python -m pytest tests/test_project.py -v
```

Expected: `ModuleNotFoundError: No module named 'project'`

- [ ] **Step 3: Create `scripts/project.py`**

```python
import json
from datetime import datetime
from pathlib import Path

from dateutil.relativedelta import relativedelta
from scipy import stats

ROOT         = Path(__file__).parent.parent
MONTHLY_PATH = ROOT / 'projects' / 'running-analysis-app' / 'data' / 'monthly.json'
OUTPUT_PATH  = ROOT / 'projects' / 'running-analysis-app' / 'data' / 'projections.json'

BQ_TARGET_SEC  = 423   # 7:03/mi ≈ 3:05:00 marathon pace
PACE_FLOOR_SEC = 390   # 6:30/mi — realistic improvement ceiling

SCENARIOS = {
    'current':    (1.00, 'Current Trajectory'),
    'consistent': (1.25, 'Consistent Training'),
    'peak':       (1.50, 'Peak Training'),
}


def pace_to_display(seconds):
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f'{m}:{s:02d}'


def fit_regression(monthly):
    valid = [(i, m['avg_pace_sec']) for i, m in enumerate(monthly) if m.get('avg_pace_sec')]
    if len(valid) < 3:
        raise ValueError('Need at least 3 months of pace data for regression')
    xs, ys = zip(*valid)
    slope, intercept, r_value, _, _ = stats.linregress(xs, ys)
    if slope >= 0:
        slope = -0.5  # guarantee meaningful projection even for flat runners
    return float(slope), float(intercept), float(r_value)


def project_scenario(last_pace, slope, num_months=36):
    return [max(last_pace + slope * i, float(PACE_FLOOR_SEC)) for i in range(1, num_months + 1)]


def find_bq_crossing(paces, start_month_str):
    start = datetime.strptime(start_month_str, '%Y-%m')
    for i, pace in enumerate(paces):
        if pace <= BQ_TARGET_SEC:
            return (start + relativedelta(months=i + 1)).strftime('%Y-%m')
    return None


def generate_month_labels(start_month_str, num_months=36):
    start = datetime.strptime(start_month_str, '%Y-%m')
    return [(start + relativedelta(months=i + 1)).strftime('%Y-%m') for i in range(num_months)]


def build_historical_trend(monthly, slope, intercept):
    valid = [(i, m['month']) for i, m in enumerate(monthly) if m.get('avg_pace_sec')]
    return {
        'dates':     [month for _, month in valid],
        'paces_sec': [round(intercept + slope * i, 1) for i, _ in valid],
    }


def main():
    monthly = json.loads(MONTHLY_PATH.read_text())
    slope, intercept, r_value = fit_regression(monthly)

    last = next(m for m in reversed(monthly) if m.get('avg_pace_sec'))
    last_pace    = last['avg_pace_sec']
    last_month   = last['month']
    month_labels = generate_month_labels(last_month)

    scenarios = []
    for key, (multiplier, label) in SCENARIOS.items():
        adj_slope = slope * multiplier
        paces     = project_scenario(last_pace, adj_slope)
        crossing  = find_bq_crossing(paces, last_month)
        scenarios.append({
            'name':                label,
            'key':                 key,
            'slope_sec_per_month': round(adj_slope, 3),
            'paces_sec':           [round(p, 1) for p in paces],
            'paces_display':       [pace_to_display(p) for p in paces],
            'dates':               month_labels,
            'bq_crossing_date':    crossing,
            'bq_crossing_label':   (
                datetime.strptime(crossing, '%Y-%m').strftime('%b %Y')
                if crossing else 'Not reached in 3 years'
            ),
        })

    output = {
        'generated_at':         datetime.now().strftime('%Y-%m-%d'),
        'bq_target_sec':        BQ_TARGET_SEC,
        'bq_target_display':    pace_to_display(BQ_TARGET_SEC),
        'current_pr_display':   '3:54:23',
        'regression_r_squared': round(r_value ** 2, 3),
        'slope_sec_per_month':  round(slope, 3),
        'last_month':           last_month,
        'last_pace_sec':        round(last_pace, 1),
        'last_pace_display':    pace_to_display(last_pace),
        'month_labels':         month_labels,
        'historical_trend':     build_historical_trend(monthly, slope, intercept),
        'scenarios':            scenarios,
    }

    OUTPUT_PATH.write_text(json.dumps(output, indent=2))
    print(f'Projections → {OUTPUT_PATH}')
    for s in scenarios:
        print(f"  {s['name']:25s}  BQ: {s['bq_crossing_label']}")


if __name__ == '__main__':
    main()
```

- [ ] **Step 4: Run tests — verify they all pass**

```bash
cd scripts && python -m pytest tests/test_project.py -v
```

Expected: all green.

- [ ] **Step 5: Run the script**

```bash
python scripts/project.py
```

Expected:
```
Projections → .../projections.json
  Current Trajectory        BQ: Not reached in 3 years
  Consistent Training       BQ: <month year>
  Peak Training             BQ: <month year>
```

- [ ] **Step 6: Commit**

```bash
git add scripts/project.py scripts/tests/test_project.py \
        projects/running-analysis-app/data/projections.json
git commit -m "feat: add projection script with 3-scenario BQ trajectory"
```

---

### Task 6: Dashboard HTML

**Files:**
- Create: `projects/running-analysis-app/index.html`

- [ ] **Step 1: Create `projects/running-analysis-app/index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Running Analysis — Calvin Daniel</title>
  <script>(function(){if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}());</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../../styles.css" />
  <link rel="icon" type="image/png" href="../../images/favicon.png" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
</head>
<body class="font-body bg-warm-bg dark:bg-navy-bg text-navy-bg dark:text-offwhite overflow-x-hidden">

  <!-- Nav -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-warm-bg/90 dark:bg-navy-bg/90 backdrop-blur border-b border-navy-bg/10 dark:border-offwhite/10 px-6 py-4 flex items-center justify-between">
    <a href="../../index.html">
      <img src="../../images/primary-logo.png"  alt="Calvin Daniel" class="logo-light h-10 w-auto" />
      <img src="../../images/dark-mode-logo.png" alt="Calvin Daniel" class="logo-dark  h-10 w-auto" />
    </a>
    <nav class="hidden md:flex gap-8">
      <a href="../../index.html#about"  class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">About</a>
      <a href="../../projects/"         class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Projects</a>
      <a href="../../clients/"          class="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-navy-bg/50 dark:text-offwhite/60 hover:text-navy-bg dark:hover:text-offwhite transition-colors">Clients</a>
    </nav>
    <button id="theme-toggle" aria-label="Switch to dark mode" class="text-navy-bg/50 dark:text-offwhite/60 hover:text-orange dark:hover:text-orange transition-colors p-1">
      <svg class="block dark:hidden w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
      <svg class="hidden dark:block w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
    </button>
  </header>

  <!-- Hero -->
  <section class="pt-32 pb-12 px-6 max-w-6xl mx-auto">
    <a href="../../projects/" class="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-navy-bg/40 dark:text-offwhite/40 hover:text-orange transition-colors">← Back to Projects</a>
    <h1 class="font-display text-5xl md:text-7xl text-navy-bg dark:text-offwhite mt-4">Running Analysis</h1>
    <p class="font-mono text-sm text-navy-bg/50 dark:text-offwhite/50 mt-2 tracking-wide">Sep 2024 – Present &nbsp;·&nbsp; Boston Marathon Trajectory</p>
  </section>

  <!-- Summary Bar -->
  <section class="px-6 max-w-6xl mx-auto mb-12">
    <div class="summary-bar">
      <div class="stat-chip">
        <span id="stat-runs"  class="stat-value">—</span>
        <span class="stat-label">Total Runs</span>
      </div>
      <div class="stat-chip">
        <span id="stat-miles" class="stat-value">—</span>
        <span class="stat-label">Total Miles</span>
      </div>
      <div class="stat-chip">
        <span id="stat-time"  class="stat-value">—</span>
        <span class="stat-label">Total Hours</span>
      </div>
      <div class="stat-chip">
        <span id="stat-pace"  class="stat-value">—</span>
        <span class="stat-label">Current Avg Pace</span>
      </div>
    </div>
  </section>

  <!-- Dashboard Grid -->
  <div class="px-6 max-w-6xl mx-auto pb-24 dashboard-grid">

    <div class="panel panel--wide">
      <h2 class="panel-title">Pace Trend</h2>
      <p class="panel-subtitle">Monthly average pace with regression trend line</p>
      <div class="chart-wrap"><canvas id="chart-pace"></canvas></div>
    </div>

    <div class="panel">
      <h2 class="panel-title">Heart Rate Efficiency</h2>
      <p class="panel-subtitle">Pace vs. HR — newer runs should appear lower-right</p>
      <div class="chart-wrap"><canvas id="chart-hr"></canvas></div>
    </div>

    <div class="panel">
      <h2 class="panel-title">Weekly Volume</h2>
      <p class="panel-subtitle">Total miles per week</p>
      <div class="chart-wrap"><canvas id="chart-volume"></canvas></div>
    </div>

    <div class="panel panel--wide">
      <h2 class="panel-title">Relative Effort</h2>
      <p class="panel-subtitle">Strava suffer score per month with 4-month rolling average</p>
      <div class="chart-wrap"><canvas id="chart-effort"></canvas></div>
    </div>

    <div class="panel panel--wide panel--hero">
      <h2 class="panel-title">Boston Qualifier Projection</h2>
      <p class="panel-subtitle">Current PR: 3:54:23 &nbsp;·&nbsp; BQ target: 3:05:00 (Males 40–44) &nbsp;·&nbsp; Target pace: 7:03/mi</p>
      <div class="chart-wrap chart-wrap--tall"><canvas id="chart-bq"></canvas></div>
    </div>

  </div>

  <script src="../../js/main.js"></script>
  <script src="js/dashboard.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open in browser and verify structure**

Open via a local server (file:// won't work with fetch):
```bash
npx serve .
```
Visit `http://localhost:3000/projects/running-analysis-app/`

Confirm: nav renders, hero heading shows, 5 panel boxes are visible (charts empty), theme toggle works.

- [ ] **Step 3: Commit**

```bash
git add projects/running-analysis-app/index.html
git commit -m "feat: add running analysis dashboard HTML skeleton"
```

---

### Task 7: Dashboard CSS

**Files:**
- Modify: `styles.css`

- [ ] **Step 1: Append dashboard CSS to `styles.css`**

Add to the end of `styles.css`:

```css
/* ── Running Analysis Dashboard ─────────────────────────────── */
.summary-bar {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 640px) {
  .summary-bar { grid-template-columns: repeat(4, 1fr); }
}

.stat-chip {
  background: white;
  border: 1px solid rgba(13, 27, 62, 0.08);
  border-radius: 0.75rem;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.dark .stat-chip {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.1);
}

.stat-value {
  font-family: 'Space Mono', monospace;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0D1B3E;
  line-height: 1;
}
.dark .stat-value { color: #F5F0E8; }

.stat-label {
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(13, 27, 62, 0.45);
}
.dark .stat-label { color: rgba(245, 240, 232, 0.45); }

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}
@media (min-width: 768px) {
  .dashboard-grid { grid-template-columns: repeat(2, 1fr); }
}

.panel {
  background: white;
  border: 1px solid rgba(13, 27, 62, 0.08);
  border-radius: 1rem;
  padding: 1.5rem;
}
.dark .panel {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.08);
}

.panel--wide  { grid-column: 1 / -1; }

.panel--hero {
  border-color: rgba(255, 89, 16, 0.35);
  border-width: 2px;
}

.panel-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  color: #0D1B3E;
  margin-bottom: 0.125rem;
}
.dark .panel-title { color: #F5F0E8; }

.panel-subtitle {
  font-family: 'Space Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(13, 27, 62, 0.4);
  margin-bottom: 1rem;
}
.dark .panel-subtitle { color: rgba(245, 240, 232, 0.4); }

.chart-wrap      { position: relative; height: 250px; }
.chart-wrap--tall { height: 320px; }
```

- [ ] **Step 2: Verify panels render with correct styling**

Reload `http://localhost:3000/projects/running-analysis-app/` and confirm: stat chips have card styling, panels have rounded borders, hero panel has orange border, both light and dark mode look correct.

- [ ] **Step 3: Commit**

```bash
git add styles.css
git commit -m "feat: add running dashboard panel and chart layout CSS"
```

---

### Task 8: `dashboard.js` — Chart Rendering

**Files:**
- Create: `projects/running-analysis-app/js/dashboard.js`

- [ ] **Step 1: Create `projects/running-analysis-app/js/dashboard.js`**

```javascript
(async function () {
  /* ── Colour tokens ───────────────────────────────────── */
  const NAVY   = '#0D1B3E';
  const ORANGE = '#FF5910';
  const BLUE   = '#2D4B94';
  const GREEN  = '#2A9D5C';

  const isDark    = () => document.documentElement.classList.contains('dark');
  const gridColor = () => isDark() ? 'rgba(245,240,232,0.08)' : 'rgba(13,27,62,0.08)';
  const tickColor = () => isDark() ? 'rgba(245,240,232,0.5)'  : 'rgba(13,27,62,0.5)';
  const lblColor  = () => isDark() ? '#F5F0E8' : NAVY;

  function fmtPace(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.round(sec % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function baseScales() {
    const tick = { color: tickColor(), font: { family: 'Space Mono', size: 10 } };
    const grid = { color: gridColor() };
    return { x: { grid, ticks: tick }, y: { grid, ticks: tick } };
  }

  function baseLegend() {
    return { labels: { color: lblColor(), font: { family: 'Space Mono', size: 10 } } };
  }

  /* ── Load all data ───────────────────────────────────── */
  const [activities, monthly, weekly, projections] = await Promise.all([
    fetch('./data/activities.json').then(r => r.json()),
    fetch('./data/monthly.json').then(r => r.json()),
    fetch('./data/weekly.json').then(r => r.json()),
    fetch('./data/projections.json').then(r => r.json()),
  ]);

  /* ── Summary bar ─────────────────────────────────────── */
  const totalMiles = activities.reduce((s, a) => s + a.distance_miles, 0);
  const totalSec   = activities.reduce((s, a) => s + a.moving_time_sec, 0);
  const lastMonth  = monthly[monthly.length - 1];

  document.getElementById('stat-runs').textContent  = activities.length.toLocaleString();
  document.getElementById('stat-miles').textContent = Math.round(totalMiles).toLocaleString();
  document.getElementById('stat-time').textContent  = `${Math.floor(totalSec / 3600).toLocaleString()}h`;
  document.getElementById('stat-pace').textContent  = lastMonth?.avg_pace_display ?? '—';

  /* ── Chart 1: Pace Trend ─────────────────────────────── */
  const trendMap = Object.fromEntries(
    projections.historical_trend.dates.map((d, i) => [d, projections.historical_trend.paces_sec[i]])
  );

  new Chart(document.getElementById('chart-pace'), {
    type: 'line',
    data: {
      labels: monthly.map(m => m.month),
      datasets: [
        {
          label: 'Avg Pace',
          data: monthly.map(m => m.avg_pace_sec),
          borderColor: ORANGE,
          backgroundColor: 'rgba(255,89,16,0.08)',
          tension: 0.3,
          spanGaps: true,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: 'Trend',
          data: monthly.map(m => trendMap[m.month] ?? null),
          borderColor: BLUE,
          borderDash: [6, 4],
          pointRadius: 0,
          tension: 0,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        ...baseScales(),
        y: {
          ...baseScales().y,
          reverse: true,
          ticks: { ...baseScales().y.ticks, callback: v => fmtPace(v) },
        },
      },
      plugins: {
        legend: baseLegend(),
        tooltip: { callbacks: { label: ctx => `${ctx.dataset.label}: ${fmtPace(ctx.parsed.y)}/mi` } },
      },
    },
  });

  /* ── Chart 2: HR Efficiency (Scatter) ────────────────── */
  const midIdx  = Math.floor(monthly.length / 2);
  const cutoff  = monthly[midIdx]?.month ?? '2025-06';
  const early   = monthly.filter(m => m.month <  cutoff && m.avg_hr && m.avg_pace_sec);
  const recent  = monthly.filter(m => m.month >= cutoff && m.avg_hr && m.avg_pace_sec);

  new Chart(document.getElementById('chart-hr'), {
    type: 'scatter',
    data: {
      datasets: [
        {
          label: `Early (before ${cutoff})`,
          data: early.map(m => ({ x: m.avg_pace_sec, y: m.avg_hr })),
          backgroundColor: 'rgba(13,27,62,0.5)',
          pointRadius: 7,
        },
        {
          label: `Recent (${cutoff}+)`,
          data: recent.map(m => ({ x: m.avg_pace_sec, y: m.avg_hr })),
          backgroundColor: ORANGE,
          pointRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        ...baseScales(),
        x: {
          ...baseScales().x,
          title: { display: true, text: 'Avg Pace (sec/mi)', color: tickColor(), font: { family: 'Space Mono', size: 9 } },
          ticks: { ...baseScales().x.ticks, callback: v => fmtPace(v) },
        },
        y: {
          ...baseScales().y,
          title: { display: true, text: 'Avg HR (bpm)', color: tickColor(), font: { family: 'Space Mono', size: 9 } },
        },
      },
      plugins: {
        legend: baseLegend(),
        tooltip: { callbacks: { label: ctx => `Pace: ${fmtPace(ctx.parsed.x)}/mi  HR: ${ctx.parsed.y} bpm` } },
      },
    },
  });

  /* ── Chart 3: Weekly Volume (Bar) ────────────────────── */
  new Chart(document.getElementById('chart-volume'), {
    type: 'bar',
    data: {
      labels: weekly.map(w => w.week_start),
      datasets: [{
        label: 'Miles',
        data: weekly.map(w => w.miles),
        backgroundColor: 'rgba(45,75,148,0.65)',
        borderColor: BLUE,
        borderWidth: 1,
        borderRadius: 3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        ...baseScales(),
        y: { ...baseScales().y, beginAtZero: true },
        x: { ...baseScales().x, ticks: { ...baseScales().x.ticks, maxTicksLimit: 8 } },
      },
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => `${ctx.parsed.y} miles` } },
      },
    },
  });

  /* ── Chart 4: Relative Effort ────────────────────────── */
  const rolling = monthly.map((_, i) => {
    const window = monthly.slice(Math.max(0, i - 3), i + 1).filter(m => m.total_suffer > 0);
    return window.length ? Math.round(window.reduce((s, m) => s + m.total_suffer, 0) / window.length) : null;
  });

  new Chart(document.getElementById('chart-effort'), {
    type: 'line',
    data: {
      labels: monthly.map(m => m.month),
      datasets: [
        {
          label: 'Monthly Effort',
          data: monthly.map(m => m.total_suffer || null),
          borderColor: 'rgba(13,27,62,0.25)',
          backgroundColor: 'transparent',
          pointRadius: 3,
          tension: 0.2,
          spanGaps: true,
        },
        {
          label: '4-Month Avg',
          data: rolling,
          borderColor: ORANGE,
          pointRadius: 0,
          tension: 0.4,
          borderWidth: 2.5,
          spanGaps: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { ...baseScales(), y: { ...baseScales().y, beginAtZero: true } },
      plugins: { legend: baseLegend() },
    },
  });

  /* ── Chart 5: BQ Projection ─────────────────────────── */
  const histDates = projections.historical_trend.dates;
  const histPaces = projections.historical_trend.paces_sec;
  const projDates = projections.scenarios[0].dates;
  const allDates  = [...histDates, ...projDates];

  const scenarioColors = { current: NAVY, consistent: BLUE, peak: GREEN };

  const scenarioDatasets = projections.scenarios.map(s => ({
    label: `${s.name} (BQ: ${s.bq_crossing_label})`,
    data: [...histDates.map(() => null), ...s.paces_sec],
    borderColor: scenarioColors[s.key],
    backgroundColor: 'transparent',
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.2,
    spanGaps: false,
  }));

  new Chart(document.getElementById('chart-bq'), {
    type: 'line',
    data: {
      labels: allDates,
      datasets: [
        {
          label: 'Actual Pace',
          data: [...histPaces, ...projDates.map(() => null)],
          borderColor: ORANGE,
          pointRadius: 3,
          tension: 0.3,
          borderWidth: 2,
          spanGaps: true,
        },
        {
          label: `BQ Target (${projections.bq_target_display}/mi)`,
          data: allDates.map(() => projections.bq_target_sec),
          borderColor: 'rgba(255,89,16,0.45)',
          borderDash: [10, 6],
          pointRadius: 0,
          borderWidth: 1.5,
          tension: 0,
        },
        ...scenarioDatasets,
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        ...baseScales(),
        y: {
          ...baseScales().y,
          reverse: true,
          ticks: { ...baseScales().y.ticks, callback: v => fmtPace(v) },
        },
        x: { ...baseScales().x, ticks: { ...baseScales().x.ticks, maxTicksLimit: 10 } },
      },
      plugins: {
        legend: baseLegend(),
        tooltip: {
          callbacks: { label: ctx => `${ctx.dataset.label.split(' (')[0]}: ${fmtPace(ctx.parsed.y)}/mi` },
        },
      },
    },
  });
})();
```

- [ ] **Step 2: Verify all charts render with real data**

Reload `http://localhost:3000/projects/running-analysis-app/`

Confirm:
- Summary bar shows real numbers
- Pace trend: orange line + blue dashed trend, Y-axis shows min:sec format
- HR scatter: two color clusters (dark = early, orange = recent)
- Volume: blue bars per week
- Effort: faint monthly bars + bold orange rolling avg
- BQ projection: orange historical line, dashed BQ target, 3 scenario lines in navy/blue/green

Check both light and dark mode.

- [ ] **Step 3: Commit**

```bash
git add projects/running-analysis-app/js/dashboard.js
git commit -m "feat: add Chart.js dashboard with all 6 panels"
```

---

### Task 9: End-to-End Verification + Push

- [ ] **Step 1: Run full pipeline from scratch**

```bash
python scripts/fetch_strava.py
python scripts/process.py
python scripts/project.py
```

Confirm all four JSON files regenerate without errors.

- [ ] **Step 2: Run all tests**

```bash
cd scripts && python -m pytest tests/ -v
```

Expected: all green, no failures.

- [ ] **Step 3: Final browser check**

```bash
npx serve .
```

Visit `http://localhost:3000/projects/running-analysis-app/` — verify all 6 panels, both themes, and that the back-link navigates correctly to `/projects/`.

- [ ] **Step 4: Commit any final JSON updates and push**

```bash
git add projects/running-analysis-app/data/
git commit -m "chore: update generated JSON with latest Strava data"
git push
```

GitHub Pages will serve the complete dashboard at `/projects/running-analysis-app/`.
