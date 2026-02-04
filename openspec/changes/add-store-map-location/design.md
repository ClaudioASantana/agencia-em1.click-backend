# Design: Google Maps Integration

## Architecture

### Backend (Bureau)

- **Database:** Add `latitude` (Float) and `longitude` (Float) columns to the `Establishment` table.
- **API:** Update `CreateEstablishmentDto` and `UpdateEstablishmentDto` to accept these optional fields.

### Frontend (Bureau)

- **Component:** deeply integrate `vue3-google-map` or a lightweight wrapper around the Google Maps JS API into `StoreForm.vue`.
- **Interaction:**
  - On address change (text input): optional auto-geocode to move the pin.
  - On map drag/click: update `latitude`/`longitude` in the form state.
- **Dependencies:** Install `vue3-google-map` (or similar).

## Constraints

- **API Key:** The API key must be exposed via `VITE_GOOGLE_MAPS_API_KEY` (frontend).
- **Cost:** Google Maps API is paid. We should optimize usage (e.g., load map only when tab is active).

## Data Flow

1. User enters address -> Geocode Request -> Map centers -> Lat/Lng updated.
2. User drags pin -> Lat/Lng updated -> Reverse Geocode (optional/nice to have) -> Address updated.

For this proposal, we will stick to:
**Manual Pin + Address Input**: Syncing perfectly is hard. We will allow independent control but initialize the map query from the text address if available.
