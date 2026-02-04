# Tasks

- [ ] Update `StorePreviewModal.vue` to accept and display `promotions` prop <!-- id: 1 -->
  - Add `promotions` to interface.
  - Render grid of promotions (clean, card-like style) if `promotions.length > 0`.
  - Filter logic is likely done in the parent (fetching only featured?), or pass all and filter in modal? Parent fetching is better.
- [ ] Update `ManageStoresView.vue` to fetch promotions <!-- id: 2 -->
  - When clicking "View", also fetch (or filter from existing state if available) the "featured" offers for that store.
  - Pass to `StorePreviewModal`.
