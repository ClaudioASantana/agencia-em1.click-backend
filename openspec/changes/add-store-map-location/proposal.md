# Change: Add Store Map Location

## Why

Currently, store locations are defined only by text fields (State, City, Address), which lacks precision and visual confirmation. Adding a Google Map allows store owners to pinpoint their exact location, enabling better navigation for end-users.

## What Changes

- **Database:** Add `latitude` and `longitude` fields to the `Establishment` table.
- **Backend:** Update establishment creation/update DTOs to accept coordinates.
- **Frontend (Bureau):** Add an interactive Google Map to the "Localização e Contato" tab in `StoreForm.vue` for picking location.
- **Configuration:** Add `VITE_GOOGLE_MAPS_API_KEY` to environment configuration.

## Impact

- **Affected specs:** `manage-location` (new), `store-profile`.
- **Affected code:** `schema.prisma`, `Establishment` entity, `StoreForm.vue`.
