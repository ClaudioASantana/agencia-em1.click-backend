# Change: Manage Store Publications

## Why

Shopkeepers need a way to organize and display their products/promotions in the showcase (vitrine). Currently, there is a concept of promotions, but no "Publication" entity for grouping or versioning them. The user requires a system where a shopkeeper can create multiple publications, but only one can be set as "Default" (active) at a time, serving as the main view for the store.

## What Changes

- **Database**:
  - NEW `Publication` entity (id, name, status, startDate, endDate, isDefault, storeId).
  - Relationship: One Store -> Many Publications.
  - Relationship: One Publication -> Many Promotions (1-N).
  - **Migration**: Existing promotions will be moved to a new auto-generated "Standard Publication" for each store.
- **Backend**:
  - CRUD endpoints for Publications.
  - Logic to ensure only one Publication is `isDefault=true` per store.
  - Logic to fetch promotions based on the `isDefault` publication of the store.
- **Frontend**:
  - "Publications" module for Store Owners.
  - List view with columns: Publication Info, Status, Validity, Default Toggle.
  - Create/Edit view for a publication.
  - "Set as Default" action.

## Impact

- Affected specs: `store-management`, `promotions`.
- Affected code: `bureau-backend` (Prisma schema, Services), `bureau-frontend` (new View).
- **BREAKING**: Promotions endpoint will now require a Publication context or default to the active one.
