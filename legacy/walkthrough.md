# User Authentication and Swagger Walkthrough

I have implemented User Authentication (Register/Login) with JWT and integrated Swagger documentation.

## 1. Database Migrations
**Windows Users:**
Use the provided PowerShell script which handles environment variable loading and password encoding fixes:
```powershell
.\scripts\migrate_up.ps1
```

*Note: Ensure your `.env` file has `DATABASE_URL` in URI format (e.g. `postgres://user:pass@host:port/db`). If your password has special characters, the script attempts to fix them, but it is best to percent-encode them in the `.env` file.*

## 2. API Documentation
Swagger docs have been generated.
Start the server:
```bash
go run cmd/api/main.go
```
Visit: [http://localhost:8081/swagger/index.html](http://localhost:8081/swagger/index.html)

### Automated Verification (Windows)
I have created a PowerShell script to verify the authentication flow:
```powershell
.\scripts\test_auth.ps1
```
Successful output:
```text
Testing Register...
Register Success: test_...@example.com
Testing Login...
Login Success. Token received.
```

## Changes Summary
- **Database**: 
    - Added `users` table migration.
    - Created `scripts/migrate_up.ps1` for easy migration execution on Windows/Docker.
- **Repository**: Created `UserRepository` with manual SQL execution.
- **Service**: Implemented `AuthService` with `bcrypt` password hashing and `jwt` token generation.
- **Handler**: Added `AuthHandler` with Swagger annotations.
- **Main**: Wired everything together and added Swagger endpoint.
