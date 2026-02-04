# Impersonate User

## Background

Currently, the system supports impersonating an establishment (Store Owner context). The user has requested the ability to impersonate specific Users directly. This is useful for debugging user-specific issues, verifying permissions, or viewing the application exactly as a specific user sees it (including those without establishments or with different roles).

## Proposed Solution

- **Backend**: Implement a new endpoint `POST /auth/impersonate-user/:userId`.
  - This will generate a JWT token for the target user.
  - It must be restricted to `ADMIN` role only.
  - The token should carry an `isImpersonation` flag.
- **Frontend**: Add an "Impersonate" action button in the Admin Users List (`AdminUsersView`).

## Risks

- Security: Must ensure strictly only Admins can access this.
- Audit: Impersonation actions should ideally be logged (out of scope for now, but noted).
