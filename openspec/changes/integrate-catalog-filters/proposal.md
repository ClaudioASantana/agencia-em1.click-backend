# Integrate Catalog Filters

## Goal
Connect the frontend "Locations" and "Segments" dropdowns to the backend database via the Catalog API. This ensures users see dynamic, up-to-date filter options based on available establishments.

## Context
The backend `schema.prisma` defines `localidades` and `segmentos` tables, and the `CatalogService` exposes a `getFilters` method. The frontend `App.vue` and `api.ts` have logic to consume this, but we need to formally specify and verify this integration to ensure robustness and consistency.

## Design
No complex architectural changes. We are leveraging the existing `CatalogModule` and exposing a simple aggregation endpoint.
