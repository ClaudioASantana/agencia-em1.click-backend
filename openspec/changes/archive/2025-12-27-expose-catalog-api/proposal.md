# Expose Catalog API and Consume in Frontend

This proposal outlines the creation of a backend API to serve the "Vitrine" data (agencies, filters) and the update of the frontend application to consume this API, replacing the static mock data.

## Problem
The frontend currently relies on a static file (`src/data/agencies.ts`) for its content. Changes to the database are not reflected in the UI. We need to connect the frontend to the backend database via a REST API.

## Solution

### Backend (`agencia-em1.click-backend`)
We will create a new `CatalogModule` to encapsulate the public-facing directory logic.

#### API Endpoints
1.  **`GET /catalog/agencies`**
    *   Returns a list of agencies formatted to match the frontend `Agency` interface.
    *   Includes relationships: `localidade`, `segmento`, `redes_sociais`, `especialidades`.
    *   *Note*: We will map the database structure `stub -> establishment` back to the flattened `Agency` object for now to minimize frontend refactoring.

2.  **`GET /catalog/filters`**
    *   Returns available filter options.
    *   `locations`: List of unique locality names.
    *   `segments`: List of unique segment names.

### Frontend (`vitrine-frontend`)
We will refactor `App.vue` to fetch data dynamically.

1.  **Service Layer**: Create `src/services/api.ts` to handle `fetch` calls.
2.  **State Management**: Replace the static `agencies` import with a reactive `ref([])` populated on `onMounted`.
3.  **Filters**: Populate filter dropdowns (`optionsLocation`, `optionsSegment`) from the API response.

## Technical Implementation

### Backend
-   Generate `CatalogModule`, `CatalogController`, `CatalogService`.
-   Use `PrismaService` to query `estabelecimentos` including `encartes`.
-   Transform the Prisma result into the `Agency` JSON structure expected by the frontend.

### Frontend
-   Update `App.vue`:
    -   Remove `import { agencies } ...`
    -   Add `const agencies = ref<Agency[]>([])`
    -   Fetch data in `onMounted`.
    -   Handle loading states (optional but good).

## Verification
-   Start backend and frontend.
-   Verify the frontend grid loads the same 24 items, but now served from `localhost:3000`.
-   Verify filters are populated dynamically.
