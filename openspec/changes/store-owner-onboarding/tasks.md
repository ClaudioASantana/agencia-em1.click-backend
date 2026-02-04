# Store Owner Onboarding Tasks

## Prerequisites

- [ ] Validate User schema allows nullable `establishmentId`.
- [ ] Validate `GET /establishments/me` behavior for user without store.

## Backend Changes

- [ ] Ensure `POST /users` allows creation without `establishmentId`.
- [ ] Update `EstablishmentService.findCurrent` (or similar) to handle "User has no establishment" gracefully (return null or 404 with specific code).
- [ ] create `POST /establishments/me` or similar endpoint to allow a logged-in user to _create_ their store link if it doesn't exist.

## Frontend Changes

- [ ] Update `StoreLayout.vue` to handle `establishment` being null without console errors.
- [ ] Update `StoreProfileView.vue` to handle "Create Mode" (empty form) vs "Edit Mode".
- [ ] Add logic: If `GET /establishments/me` returns 404, show "Create Store" form.
- [x] Link "Save" button to `POST` (create) or `PATCH` (update) depending on state.

## Verification

- [ ] Test Flow: Admin creates User -> User Login -> User fills form -> Store Created.
