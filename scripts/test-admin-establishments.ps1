
# 0. Get Token for Admin
$LoginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@vitrine.com","password":"123456"}'
$Token = $LoginResponse.access_token
echo "Token obtained."

# 1. Get All Establishments (Admin)
echo "Fetching all establishments (Admin)..."
try {
    $EstResponse = Invoke-RestMethod -Uri "http://localhost:3000/establishments/admin" -Method Get -Headers @{ Authorization = "Bearer $Token" }
    
    echo "Count: $($EstResponse.Count)"
    
    if ($EstResponse.Count -gt 0) {
        $FirstEst = $EstResponse | Select-Object -First 1
        echo "First Establishment: $($FirstEst.name)"
        
        if ($FirstEst.users) {
            echo "Users included: Yes"
            echo "Users Count: $($FirstEst.users.Count)"
            if ($FirstEst.users.Count -gt 0) {
                echo "First User: $($FirstEst.users[0].email)"
            }
        }
        else {
            echo "VERIFICATION FAILED: Users relation missing."
        }
    }
    else {
        echo "No establishments found."
    }

}
catch {
    echo "Error fetching establishments: $($_.Exception.Message)"
    exit 1
}
