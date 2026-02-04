# Tasks: Add Store Map Location

## 1. Backend Implementation

- [ ] Add `latitude` and `longitude` fields to `Establishment` model in `schema.prisma`. <!-- id: 1 -->
- [ ] Create and run database migration. <!-- id: 2 -->
- [ ] Update `CreateEstablishmentDto` and `UpdateEstablishmentDto` in NestJS to include validatable lat/lng fields. <!-- id: 3 -->
- [ ] Verify API accepts and returns coordinates via existing endpoints. <!-- id: 4 -->

## 2. Frontend Implementation

- [ ] Install `vue3-google-map` package in `bureau-frontend`. <!-- id: 5 -->
- [ ] Create `StoreMapPicker.vue` component that handles map display and pin dragging. <!-- id: 6 -->
- [ ] Integrate `StoreMapPicker` into `StoreForm.vue` inside the "Localização e Contato" tab. <!-- id: 7 -->
- [ ] Bind map coordinates to `form.latitude` and `form.longitude`. <!-- id: 8 -->

## 3. Configuration

- [ ] Add `VITE_GOOGLE_MAPS_API_KEY` to `.env`. <!-- id: 9 -->
- [ ] Update `walkthrough.md` with setup instructions for the API Key. <!-- id: 10 -->
