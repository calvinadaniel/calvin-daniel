<#
.SYNOPSIS
  Deploy the committed site (HEAD) to calvindaniel.com on Hostinger.

.DESCRIPTION
  Packages the files tracked in git at HEAD (minus repo-only paths), uploads the zip to
  public_html and deploys it with the Hostinger CLI, then clears the server cache and checks
  that the live homepage matches the deployed index.html.

  Deploying REPLACES everything in public_html. Uncommitted changes are not deployed.
  Needs the Hostinger CLI (https://github.com/hostinger/api-cli) with an API token in
  ~/.hostinger.yaml (api_token: ...).

.EXAMPLE
  ./scripts/deploy-hostinger.ps1 -DryRun   # build the package and show what would ship
  ./scripts/deploy-hostinger.ps1           # deploy, after typing the domain to confirm
  ./scripts/deploy-hostinger.ps1 -Yes      # deploy without the confirmation prompt
#>
[CmdletBinding()]
param(
  [string]$Username = 'u983304174',
  [string]$Domain = 'calvindaniel.com',
  [switch]$DryRun,
  [switch]$Yes
)

$ErrorActionPreference = 'Stop'

# Tracked in the repo but never published
$Exclude = @('.github', '.gitignore', 'CLAUDE.md', 'docs', 'scripts')

$repo = (git rev-parse --show-toplevel).Trim()
Set-Location $repo

$cli = (Get-Command hostinger -ErrorAction SilentlyContinue).Source
if (-not $cli) {
  $cli = Join-Path $env:LOCALAPPDATA 'Programs\hostinger\hostinger.exe'
  if (-not (Test-Path $cli)) { throw 'Hostinger CLI not found. Install it from https://github.com/hostinger/api-cli/releases' }
}

function Invoke-Hostinger([string[]]$CliArgs) {
  # The CLI logs "Using config file" to stderr; Windows PowerShell treats redirected stderr as errors
  $ErrorActionPreference = 'Continue'
  $out = & $cli @CliArgs --format json 2>$null
  if ($LASTEXITCODE -ne 0) { throw "hostinger $($CliArgs -join ' ') failed (exit $LASTEXITCODE)" }
  if ($out) { ($out -join "`n") | ConvertFrom-Json }
}

function Get-Sha256([byte[]]$Bytes) {
  $sha = [Security.Cryptography.SHA256]::Create()
  try { [BitConverter]::ToString($sha.ComputeHash($Bytes)) } finally { $sha.Dispose() }
}

$dirty = git status --porcelain --untracked-files=no
if ($dirty) {
  Write-Warning 'These uncommitted changes will NOT be deployed (only HEAD is):'
  $dirty | ForEach-Object { Write-Host "  $_" }
}

$sha = (git rev-parse --short HEAD).Trim()
$subject = (git log -1 --format=%s).Trim()
$name = "_deploy-$sha.zip"
$zip = Join-Path $env:TEMP $name

$pathspec = @('.') + ($Exclude | ForEach-Object { ":(exclude)$_" })
git archive --format=zip -o $zip HEAD -- @pathspec
if ($LASTEXITCODE -ne 0) { throw 'git archive failed' }

Add-Type -AssemblyName System.IO.Compression.FileSystem
$archive = [IO.Compression.ZipFile]::OpenRead($zip)
try {
  $files = @($archive.Entries | Where-Object { $_.Name })
  $top = $files | ForEach-Object { $_.FullName.Split('/')[0] } | Sort-Object -Unique
  $indexEntry = $archive.GetEntry('index.html')
  if (-not $indexEntry) { throw 'index.html is missing from the package' }
  $stream = $indexEntry.Open()
  $buffer = New-Object IO.MemoryStream
  try { $stream.CopyTo($buffer) } finally { $stream.Dispose() }
  $expectedIndex = Get-Sha256 $buffer.ToArray()
} finally { $archive.Dispose() }

$sizeMb = [math]::Round((Get-Item $zip).Length / 1MB, 1)
Write-Host ''
Write-Host "Commit:    $sha  $subject"
Write-Host "Package:   $name  ($($files.Count) files, $sizeMb MB)"
Write-Host "Contents:  $($top -join ', ')"
Write-Host "Target:    https://$Domain  (account $Username)"
Write-Host ''

if ($DryRun) {
  Write-Host "Dry run: nothing uploaded. Package left at $zip"
  return
}

if (-not $Yes) {
  $answer = Read-Host "This REPLACES everything on $Domain. Type the domain to continue"
  if ($answer -ne $Domain) { Write-Host 'Cancelled.'; Remove-Item $zip; return }
}

Write-Host 'Uploading package...'
$up = Invoke-Hostinger @('hosting', 'files', 'generate-upload-url', '--username', $Username, '--domain', $Domain)
if ($up.data) { $up = $up.data }
if (-not $up.url) { throw 'generate-upload-url returned no upload URL' }

$target = "$($up.url.TrimEnd('/'))/$name`?override=true"
$size = (Get-Item $zip).Length
$auth = @('-H', "X-Auth: $($up.auth_key)", '-H', "X-Auth-Rest: $($up.rest_auth_key)", '-H', 'Tus-Resumable: 1.0.0')

$code = curl.exe -s -o NUL -w '%{http_code}' -X POST $target @auth -H "Upload-Length: $size" -H 'Upload-Offset: 0'
if ($code -ne '201') { throw "Creating the upload failed (HTTP $code)" }
$code = curl.exe -s -o NUL -w '%{http_code}' -X PATCH $target @auth -H 'Content-Type: application/offset+octet-stream' -H 'Upload-Offset: 0' --data-binary "@$zip"
if ($code -ne '204') { throw "Uploading the package failed (HTTP $code)" }

Write-Host 'Deploying...'
Invoke-Hostinger @('hosting', 'websites', 'deploy-static-site-archive', $Username, $Domain, '--archive-path', $name) | Out-Null

Write-Host 'Clearing cache...'
Invoke-Hostinger @('hosting', 'cache', 'clear-website', $Username, $Domain) | Out-Null

Remove-Item $zip

Write-Host 'Verifying live homepage...'
$live = Join-Path $env:TEMP "live-index-$sha.html"
$verified = $false
for ($i = 0; $i -lt 12 -and -not $verified; $i++) {
  if ($i) { Start-Sleep -Seconds 5 }
  curl.exe -s -o $live -H 'Cache-Control: no-cache' "https://$Domain/?deploy=$sha-$i"
  if ((Test-Path $live) -and (Get-Sha256 ([IO.File]::ReadAllBytes($live))) -eq $expectedIndex) { $verified = $true }
}
Remove-Item $live -ErrorAction SilentlyContinue

if ($verified) {
  Write-Host "Done: https://$Domain is serving commit $sha." -ForegroundColor Green
} else {
  Write-Warning "Deployed, but the live homepage does not match yet. Check https://$Domain in a minute (CDN or browser cache)."
}
