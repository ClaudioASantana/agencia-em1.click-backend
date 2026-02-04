# Tasks

- [ ] Create `StorePreviewModal.vue` in `bureau-frontend` <!-- id: 1 -->
  - Implementation should be based on `vitrine-frontend/src/components/AgencyModal.vue`.
  - Ensure all icons (`lucide-vue-next`) are available.
  - Adapt styles to match `bureau-frontend` (Tailwind is already present).
- [ ] Integrate `StorePreviewModal` into `ManageStoresView.vue` <!-- id: 2 -->
  - Add state for `isPreviewOpen`.
  - specific `selectedStoreForPreview` state.
  - Bind "View" (Eye) button to open this modal.
- [ ] Map Data Types <!-- id: 3 -->
  - Create a utility or specific adapter to transform `Establishment` (backend/admin type) to the format expected by the Preview Modal.
