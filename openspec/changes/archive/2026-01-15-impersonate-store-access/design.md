# Design: Admin Impersonation System

## Overview

The impersonation system allows a SaaS Admin to assume the identity of an Establishment's owner (or proxy). This is achieved by generating a JWT that carries the `establishmentId` of the target store while retaining an audit trail or fallback logic for stores without users.

## Architectural Changes

### 1. User Model Enhancement (Backend)

To safely identify administrators, we will add a `role` field to the `User` model.

- `role`: Enum (`ADMIN`, `STORE_OWNER`)
- Default: `STORE_OWNER`

### 2. Impersonation Logic (Backend)

New endpoint: `POST /auth/impersonate/:id`

- **Security**: Guarded by `JwtAuthGuard` and a new `RolesGuard(Role.ADMIN)`.
- **Logic**:
  1. Verify the requester is an `ADMIN`.
  2. Find the target `Establishment`.
  3. Find the first active `User` associated with that establishment.
  4. If a user exists: Generate a token for that user.
  5. If no user exists: Generate a token using the Admin's details but with the target `establishmentId`.
- **Response**: Standard login response with `access_token`.

### 3. Action Grid (Frontend)

Modified: `AdminEstablishmentsView.vue`

- Add a new action button "Acessar" in the table row.
- Icon: `LogIn` or `ExternalLink`.
- Tooltip: "Acessar como Lojista".

### 4. Client-side Implementation (Frontend)

Modified: `authStore.ts`

- Add an `impersonate` action.
- Swap the current token for the new token.
- Redirect the user to `/store/profile`.

## User Flow

1. Admin logs into the Bureau.
2. Navigates to "Gerenciar Lojas".
3. Clicks "Acessar" on a specific store.
4. The system switches context.
5. The Admin is redirected to the Store Profile of that specific store.
