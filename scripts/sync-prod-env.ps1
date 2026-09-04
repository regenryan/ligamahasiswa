# Syncs secrets from .env.production into Vercel Production environment vars.
# Usage:
#   1) Copy .env.production.example -> .env.production and fill in real values.
#   2) Run:  powershell -ExecutionPolicy Bypass -File scripts/sync-prod-env.ps1
# Example files are gitignored; never commit real credentials.

param(
  [string]$EnvFile = ".env.production"
)

if (-not (Test-Path -LiteralPath $EnvFile)) {
  Write-Error "Missing $EnvFile. Copy .env.production.example first."
  exit 1
}

$pairs = Get-Content -LiteralPath $EnvFile |
  Where-Object { $_ -match "^\s*[A-Z0-9_]+\s*=" } |
  ForEach-Object {
    $idx = $_.IndexOf("=")
    [pscustomobject]@{
      Name  = $_.Substring(0, $idx).Trim()
      Value = $_.Substring($idx + 1).Trim()
    }
  }

foreach ($pair in $pairs) {
  Write-Host "Setting $($pair.Name) on Production..."
  # Remove first so re-runs are idempotent (avoid duplicate-name error).
  vercel env rm $pair.Name production -y 2>$null | Out-Null
  $pair.Value | vercel env add $pair.Name production
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "Failed to set $($pair.Name)"
  }
}

Write-Host "Done. Verify with: vercel env ls production"