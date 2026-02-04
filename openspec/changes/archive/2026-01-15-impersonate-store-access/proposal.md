# Proposal: Admin Impersonation of Store Profiles

## Why

SaaS administrators need a way to quickly access and view store profiles as if they were the store owners. This is essential for support, debugging, and quality control. Currently, an admin has no direct way to "switch" to a store's perspective without manually logging in with that store's credentials.

## What Changes

Implement an "Impersonation" feature that allows an authenticated Admin to generate a temporary session for a specific Establishment.

### Key Features

1.  **Backend Endpoint**: A secure endpoint `POST /auth/impersonate/:establishmentId` accessible only by Admins.
2.  **Contextual Token Generation**:
    - If the store has a registered owner (User), generate a token for that user.
    - If the store has NO registered owner, generate a token with the admin's identity but bound to the target `establishmentId`.
3.  **Frontend Integration**: Add an "Acessar Perfil" (Access Profile) action in the `AdminEstablishmentsView` table.
4.  **Session Management**: The frontend will swap the current token with the impersonated token and redirect the admin to the appropriate store view.

## Scope

- `bureau-backend`: Authentication logic and impersonation endpoint.
- `bureau-frontend`: UI actions in the admin dashboard and token handling in `authStore`.

## Risks/Considerations

- **Security**: Ensure the impersonation endpoint is strictly guarded. Only users with Admin privileges can hit it.
- **Session State**: The admin should have a way to "Return to Admin View" or know they are in an impersonated state. (V2: Back-to-admin button).
- **Audit Log**: (V2) Log who impersonated whom.
