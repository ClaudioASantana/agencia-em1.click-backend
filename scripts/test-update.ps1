
# 0. Get Token for Owner
$LoginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@vitrine.com","password":"123456"}'
$Token = $LoginResponse.access_token
echo "Token obtained."

# 1. Update Establishment
echo "Updating establishment..."
$UpdateBody = @{
    name = "Casa de Minas Updated"
    description = "New description via API"
    hours = "Seg-Sex: 09-18h"
} | ConvertTo-Json

try {
    $UpdateResponse = Invoke-RestMethod -Uri "http://localhost:3000/establishments/me" -Method Patch -ContentType "application/json" -Headers @{ Authorization = "Bearer $Token" } -Body $UpdateBody
    echo "Update Success!"
    echo $UpdateResponse
} catch {
    echo "Update Failed"
    echo $_.Exception.Response
}

# 2. Verify Update
echo "Verifying update..."
$GetResponse = Invoke-RestMethod -Uri "http://localhost:3000/establishments/me" -Method Get -Headers @{ Authorization = "Bearer $Token" }
if ($GetResponse.name -eq "Casa de Minas Updated") {
    echo "VERIFICATION PASSED: Name updated successfully."
} else {
    echo "VERIFICATION FAILED: Name mismatch."
}
