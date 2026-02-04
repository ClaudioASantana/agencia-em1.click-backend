# Tasks: Admin Impersonation Feature

## Backend Implementation

- [x] Add `role` field to `User` model in Prisma schema.
- [x] Create and run migration to add `role`.
- [x] Update `seed.ts` to set `admin@vitrine.com` as `ADMIN`.
- [x] Implement `AuthController.impersonate` endpoint.
- [x] Implement `AuthService.generateImpersonationToken` logic.
- [x] Create `RolesGuard` to protect the impersonation endpoint. (Implemented via inline check in controller for now).

## Frontend Implementation

- [x] Update `authStore.ts` to include `impersonate` action.
- [x] Add "Acessar Perfil" button to `AdminEstablishmentsView.vue` table.
- [x] Make action icons always visible (remove hover-only effect).
- [x] Implement redirect logic after successful impersonation.
- [x] (Optional) Add visual indicator in header when impersonating.

## Verification

- [x] Test that only admins can hit the impersonate endpoint.
- [x] Verify that a new JWT is generated with the correct `establishmentId`.
- [x] Verify that the frontend redirects correctly to the Store Profile.
- [x] Test the case with no registered owner (admin acting as owner).
