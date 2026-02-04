# Tasks

- [ ] Update `PromotionsView` to include Store Selector <!-- id: 0 -->
  - [ ] Reuse `StoreFilterBar` or create `StoreSelector` component
- [ ] Implement state management for `selectedStoreId` in `PromotionsView` <!-- id: 1 -->
- [ ] Update `PromotionList` to filter by `storeId` <!-- id: 2 -->
- [ ] Update `PromotionForm` to include `storeId` in payload <!-- id: 3 -->
- [ ] Verify Backend Enforcement <!-- id: 4 -->
  - [ ] Ensure `Offer` creation fails without `storeId`
  - [ ] Ensure `GET /offers` respects `storeId` filter
