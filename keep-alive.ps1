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

$connectTimeout = 20
$maxTime = 200
$interval = 600

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  SHDEP Microservices Keep-Alive Pinger  " -ForegroundColor Yellow
Write-Host "  Parallel warm-up enabled" -ForegroundColor Green
Write-Host "  Startup allowance: 200 seconds" -ForegroundColor Cyan
Write-Host "  Pinging every 10 minutes" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop" -ForegroundColor Gray
Write-Host "=========================================" -ForegroundColor Cyan

while ($true) {

    $time = Get-Date -Format "HH:mm:ss"

    Write-Host "`n[$time] Starting parallel health pings..." -ForegroundColor Magenta
    Write-Host "Waking all Render services simultaneously..." -ForegroundColor Yellow

    $jobs = @()

    # Start all health checks in parallel
    foreach ($url in $services) {

        $jobs += Start-Job -ArgumentList $url, $connectTimeout, $maxTime -ScriptBlock {

            param(
                $url,
                $connectTimeout,
                $maxTime
            )

            $code = curl.exe `
                -s `
                -o nul `
                -w "%{http_code}" `
                --connect-timeout $connectTimeout `
                -m $maxTime `
                $url

            [PSCustomObject]@{
                Url  = $url
                Code = $code
            }
        }
    }

    # Wait until all jobs finish
    $jobs | Wait-Job | Out-Null

    # Collect results
    $results = foreach ($job in $jobs) {
        Receive-Job $job
    }

    # Cleanup jobs
    $jobs | Remove-Job -Force

    Write-Host "`nHealth check results:" -ForegroundColor Cyan

    $successCount = 0
    $failedCount = 0

    foreach ($result in $results) {

        if ($result.Code -eq "200") {

            Write-Host "  [OK 200] $($result.Url)" -ForegroundColor Green
            $successCount++

        } else {

            Write-Host "  [WARN $($result.Code)] $($result.Url)" -ForegroundColor Yellow
            $failedCount++
        }
    }

    Write-Host "`n-----------------------------------------" -ForegroundColor DarkGray
    Write-Host "Successful: $successCount / $($services.Count)" -ForegroundColor Green
    Write-Host "Failed/Timeout: $failedCount / $($services.Count)" -ForegroundColor Yellow
    Write-Host "-----------------------------------------" -ForegroundColor DarkGray

    Write-Host "`nWaiting 10 minutes for next ping cycle..." -ForegroundColor Gray
    Write-Host "(Press Ctrl+C to stop)" -ForegroundColor Gray

    Start-Sleep -Seconds $interval
}
