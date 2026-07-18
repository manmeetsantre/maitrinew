# MindMatters - Stop All Services Script for Windows

Write-Host "Stopping all MindMatters services..." -ForegroundColor Yellow

$ports = @(8080, 4000, 5173, 5002, 5000)

foreach ($port in $ports) {
    $processes = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    foreach ($pid in $processes) {
        if ($pid) {
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
            Write-Host "Stopped process on port $port (PID: $pid)" -ForegroundColor Green
        }
    }
}

# Kill Node.js and Python processes related to the project
Get-Process | Where-Object {
    ($_.ProcessName -eq "node" -or $_.ProcessName -eq "python") -and
    ($_.Path -like "*MindMatters*" -or $_.CommandLine -like "*mindmatters*")
} | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "All services stopped." -ForegroundColor Green

