## Context

Users want to "package" promotions into a "Publication". A Store can have multiple Publications. One is marked as `isDefault`, which is the one displayed on the storefront.

## Decisions

- **Decision**: `Publication` is the parent of `Offer` (Promotion).
  - Schema: `Publication` <1---N> `Offer`.
    - `Offer` table gets `publicationId` (required).
  - _Rationale_: Confirmed by user requirement to group promotions.
- **Decision**: **Migration Strategy**
  - Create a "Default Publication" (e.g., name="Ofertas Padrão") for every existing Store.
  - Update all existing `Offer` records to point to their store's new Default Publication.
  - Make `publicationId` non-nullable after data migration.
- **Decision**: `isDefault` boolean flag.
  - Enforced by application logic (transactional update: set all others to false, set target to true).
- **Decision**: UI Columns map to:
  - **Status**: Computed (Active based on dates/enabled flag).
  - **Vigência**: `startDate` and `endDate`.
  - **Padrão**: `isDefault` toggle.

## Open Questions

- Can a promotion technically belong to multiple publications?
  - _Current assumption_: No, it's 1-N based on "create publication -> add promotions". Simplifies data ownership.
