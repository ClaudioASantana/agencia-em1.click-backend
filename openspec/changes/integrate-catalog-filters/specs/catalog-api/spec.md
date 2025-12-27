# Catalog API

## ADDED Requirements

### Requirement: Expose filters endpoint
The system SHALL expose a `GET /catalog/filters` endpoint that returns available locations and segments.

#### Scenario: Client requests filters
- **Given** the database contains `localidades` (e.g., "Mendes") and `segmentos` (e.g., "Gastronomia").
- **When** a `GET /catalog/filters` request is made.
- **Then** the response status is 200 OK.
- **And** the response body contains `locations: ["Mendes"]` and `segments: ["Gastronomia"]`.

### Requirement: Frontend dropdown population
The frontend SHALL populate "Localidades" and "Segmentos" dropdowns with data from the API.

#### Scenario: User visits the homepage
- **Given** the API returns a list of locations and segments.
- **When** the page loads.
- **Then** the "Localidades" dropdown contains the fetched locations.
- **And** the "Segmentos" dropdown contains the fetched segments.
