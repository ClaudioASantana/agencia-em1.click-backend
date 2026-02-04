
# 0. Get Token for Admin
$LoginResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -ContentType "application/json" -Body '{"email":"admin@vitrine.com","password":"123456"}'
$Token = $LoginResponse.access_token
echo "Token obtained."

# 1. Get Users
echo "Fetching users..."
try {
    $UsersResponse = Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Get -Headers @{ Authorization = "Bearer $Token" }
    
    # Check if we have users and if establishment data is present
    if ($UsersResponse.Count -gt 0) {
        $UserWithEst = $UsersResponse | Where-Object { $_.establishmentId -ne $null } | Select-Object -First 1
        
        if ($UserWithEst) {
            echo "Found user with establishment:"
            echo "User Name: $($UserWithEst.name)"
            echo "Establishment Name: $($UserWithEst.establishment.name)"
            
            if ($UserWithEst.establishment.name) {
                echo "VERIFICATION PASSED: Establishment name is present."
            }
            else {
                echo "VERIFICATION FAILED: Establishment object exists but name is missing."
                echo $UserWithEst.establishment
            }
        }
        else {
            echo "No users with establishment found in the list (might need seeding or manual creation)."
            # List raw first user just to see structure
            $UsersResponse | Select-Object -First 1
        }
    }
    else {
        echo "No users returned."
    }

}
catch {
    echo "Error fetching users: $($_.Exception.Message)"
    exit 1
}
