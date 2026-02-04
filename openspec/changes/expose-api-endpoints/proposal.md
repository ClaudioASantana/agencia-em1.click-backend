# Proposal: Expose API Endpoints

## Goal

Expose the backend data (Locations, Segments, Establishments, Offers) via REST API endpoints and connect the frontend to them, replacing the mock data.

## Context

- **Backend**: The database is populated, but there are no API controllers/services to access it.
- **Frontend**: Currently uses `src/data/mockData.ts`.

## Solution

1.  **Backend (NestJS)**:
    - Create `CatalogController` and `CatalogService` to serve Locations and Segments.
    - Create `EstablishmentController` and `EstablishmentService` to serve Establishments (with filtering) and Offers.
    - DTOs: Define response types matching the frontend interfaces.
2.  **Frontend (Vue)**:
    - Update `src/services/api.ts` to `fetch` from `http://localhost:3000`.
    - Handle CORS in NestJS.

## Trade-offs

- We will prioritize GET endpoints for now (Reading data).
- We will simply fetch all establishments and filter in the backend OR fetch all and filter in frontend?
  - For scalability, filtering should happen in the backend.
  - `GET /establishments?location=BH&segment=Gastronomia`.
