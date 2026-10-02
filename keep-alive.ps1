# Run this script while you are working locally to keep Render services awake.
# Press Ctrl + C anytime to stop.

$services = @(
    "https://shdep-gateway.onrender.com/actuator/health",
    "https://shdep-authentication.onrender.com/actuator/health",
    "https://shdep-users.onrender.com/actuator/health",
    "https://shdep-catalog.onrender.com/actuator/health",
    "https://shdep-order.onrender.com/actuator/health",
    "https://shdep-payment.onrender.com/actuator/health",
    "https://shdep-dashboard.onrender.com/actuator/health"
)

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  SHDEP Microservices Keep-Alive Pinger  " -ForegroundColor Yellow
Write-Host "  Pinging every 10 minutes (Ctrl+C to stop)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

while ($true) {
    $time = Get-Date -Format "HH:mm:ss"
    Write-Host "`n[$time] Pinging services..." -ForegroundColor Magenta

    foreach ($url in $services) {
        $code = curl.exe -s -o nul -w "%{http_code}" --connect-timeout 20 -m 90 $url
        if ($code -eq "200") {
            Write-Host "  [OK 200] $url" -ForegroundColor Green
        } else {
            Write-Host "  [WARN $code] $url" -ForegroundColor Yellow
        }
    }

    Write-Host "`nWaiting 10 minutes for next ping cycle... (Press Ctrl+C to stop)" -ForegroundColor Gray
    Start-Sleep -Seconds 600
}
