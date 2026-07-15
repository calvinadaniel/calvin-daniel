$ErrorActionPreference = "Stop"
$repoRoot = "G:\coding\Claude POC Projects\calvin-daniel"
$python   = "C:\Python310\python.exe"

Set-Location "$repoRoot\scripts"
& $python fetch_strava.py
& $python process.py
& $python project.py

Set-Location $repoRoot
git add "projects/running-analysis-app/data/activities.json" `
        "projects/running-analysis-app/data/monthly.json" `
        "projects/running-analysis-app/data/weekly.json" `
        "projects/running-analysis-app/data/projections.json"

$staged = git diff --cached --name-only
if ($staged) {
    git commit -m "chore: weekly Strava data refresh ($(Get-Date -Format yyyy-MM-dd))"
    git push
} else {
    Write-Output "No data changes, skipping commit."
}
