# Proposal: Fetch Admin Store Owners

## Goal

Enable the SaaS Admin to view a list of Store Owners (Lojistas) populated with real data from the backend, including their associated Establishment details.

## Context

Currently, the Admin Dashboard has a "Lojistas" view. We need to ensure this view fetches data from the `GET /users` endpoint and correctly displays:

- User Name & Email
- Establishment Name (if linked)
- Status (Active/Inactive)
- Creation Date

## Capabilities

### Store Owners List

- **Fetch Data:** Frontend calls `GET /users`.
- **Display:** Table shows user and establishment details.
- **Filter:** (Optional/Future) Filter by name or status.

## Design

- **Backend:** Reuse existing `UsersController.findAll` which includes `establishment: { select: { name: true } }`.
- **Frontend:** Update `AdminStoreOwnersView.vue` to ensure robust error handling and matching of API fields (e.g., date formatting).

## Verification

- **Automated:**
  - `curl` test to verify `GET /users` returns establishment data.
- **Manual:**
  - Login as SaaS Admin.
  - Navigate to "/admin/lojistas".
  - Verify list is not empty (assuming seed data exists).
