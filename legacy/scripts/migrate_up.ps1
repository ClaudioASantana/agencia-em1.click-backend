$ErrorActionPreference = "Stop"

function Parse-EnvFile {
    param($File)
    if (Test-Path $File) {
        Get-Content $File | ForEach-Object {
            if ($_ -match "^(?!#)(.+?)=(.*)$") {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()
                # Remove quotes if present
                $value = $value -replace '^"|"$', ''
                $value = $value -replace "^'|'$", ''
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
            }
        }
    }
}

Parse-EnvFile ".env"

$rawUrl = $env:DATABASE_URL
if ($null -eq $rawUrl) {
    Write-Host "DATABASE_URL not found in .env" -ForegroundColor Red
    exit 1
}
Write-Host "Debug: Raw URL starts with: $($rawUrl.Substring(0, [Math]::Min(15, $rawUrl.Length)))..."

# Fix URL Encoding for password
# Splitting logic: Scheme://User:Pass@Host
# Find last @ to separate Host
$lastAt = $rawUrl.LastIndexOf("@")
if ($lastAt -gt -1) {
    $schemeEnd = $rawUrl.IndexOf("://")
    if ($schemeEnd -gt -1) {
        $schemeFull = $rawUrl.Substring(0, $schemeEnd + 3) # e.g. postgres://
        $userInfo = $rawUrl.Substring($schemeEnd + 3, $lastAt - ($schemeEnd + 3))
        $hostInfo = $rawUrl.Substring($lastAt + 1)
        
        # Split User:Pass
        $firstColon = $userInfo.IndexOf(":")
        if ($firstColon -gt -1) {
            $user = $userInfo.Substring(0, $firstColon)
            $pass = $userInfo.Substring($firstColon + 1)
            
            # Encode Password if it contains special chars like #
            # We simply re-encode it to be safe, but EscapeDataString encodes everything.
            # If it is ALREADY encoded, validating is hard.
            # Assuming raw password in .env.
            
            # Use .NET encoding
            $encodedPass = [Uri]::EscapeDataString($pass)
            
            # Reassemble
            $dbUrl = "$schemeFull$user`:$encodedPass@$hostInfo"
        }
        else {
            $dbUrl = $rawUrl
        }
    }
    else {
        $dbUrl = $rawUrl
    }
}
else {
    $dbUrl = $rawUrl
}

# Replace localhost for Docker
$dbUrl = $dbUrl.Replace("localhost", "host.docker.internal")

Write-Host "Running migrations..."
# Write-Host "Database URL: $dbUrl" # Don't print full URL with password for security, or obfuscate

docker run --rm --dns 8.8.8.8 -v "${PWD}/db/migrations:/migrations" migrate/migrate -path=/migrations -database "$dbUrl" up
