# Бэкап osago без node_modules
$src = Split-Path $PSScriptRoot -Parent
$dest = Join-Path (Split-Path $src -Parent) "osago-backup.zip"
$temp = Join-Path $env:TEMP "osago-backup-temp"

if (Test-Path $temp) { Remove-Item $temp -Recurse -Force }
New-Item -ItemType Directory -Path $temp | Out-Null

Get-ChildItem $src -Force | Where-Object {
    $_.Name -notin @("node_modules")
} | ForEach-Object {
    Copy-Item $_.FullName -Destination (Join-Path $temp $_.Name) -Recurse -Force
}

if (Test-Path $dest) { Remove-Item $dest -Force }
Compress-Archive -Path "$temp\*" -DestinationPath $dest -CompressionLevel Optimal
Remove-Item $temp -Recurse -Force

Get-Item $dest | Format-List Name, Length, LastWriteTime
Write-Output "Backup saved: $dest"
