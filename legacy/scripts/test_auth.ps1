$ErrorActionPreference = "Stop"

$baseUrl = "http://localhost:8080/api/v1/auth"
$email = "test_$(Get-Random)@example.com"
$password = "password123"

Write-Host "Testing Register..."
$registerBody = @{
    name     = "Test User"
    email    = "$email"
    password = "$password"
    active   = $true
} | ConvertTo-Json

try {
    $regResponse = Invoke-RestMethod -Uri "$baseUrl/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "Register Success: $($regResponse.email)" -ForegroundColor Green
}
catch {
    Write-Host "Register Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())" -ForegroundColor Red
    }
    exit 1
}

Write-Host "Testing Login..."
$loginBody = @{
    email    = "$email"
    password = "$password"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    if ($loginResponse.token) {
        Write-Host "Login Success. Token received." -ForegroundColor Green
        # Write-Host "Token: $($loginResponse.token)"
    }
    else {
        Write-Host "Login Failed: No token in response" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "Login Failed: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host "Response Body: $($reader.ReadToEnd())" -ForegroundColor Red
    }
    exit 1
}
