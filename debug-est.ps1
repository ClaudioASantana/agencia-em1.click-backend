$loginUrl = "http://localhost:3000/auth/login"
$estUrl = "http://localhost:3000/establishments/admin"
$user = "admin@vitrine.com"
$pass = "123456"

# 1. Login
$loginBody = @{
    email    = $user
    password = $pass
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri $loginUrl -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "Login Successful. Token received."
}
catch {
    Write-Error "Login Failed: $_"
    exit 1
}

# 2. Fetch Establishments
$headers = @{
    Authorization = "Bearer $token"
}

try {
    $response = Invoke-WebRequest -Uri $estUrl -Method Get -Headers $headers
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host "Content Length: $($response.Content.Length)"
    Write-Host "Content: $($response.Content)"
}
catch {
    Write-Error "Fetch Failed: $_"
    if ($_.Exception.Response) {
        Write-Host "Status: $($_.Exception.Response.StatusCode)"
    }
}
