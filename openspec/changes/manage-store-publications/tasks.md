## 1. Database & Migration

- [ ] 1.1 Update `schema.prisma` with `Publication` model and `Offer` relation <!-- id: 1 -->
- [ ] 1.2 Create empty migration `npx prisma migrate dev --create-only` <!-- id: 2 -->
- [ ] 1.3 Write SQL script in migration file to create default publications for existing stores and link offers <!-- id: 3 -->
- [ ] 1.4 Apply migration <!-- id: 4 -->

## 2. Backend Implementation

- [ ] 2.1 Generate Publication resource (Module, Service, Controller) <!-- id: 5 -->
- [ ] 2.2 Implement `setAsDefault(id)` logic in Service (transaction) <!-- id: 6 -->
- [ ] 2.3 Update `OfferService` to filter by active publication on public endpoints <!-- id: 7 -->

## 3. Frontend Implementation

- [ ] 3.1 Create `PublicationsView.vue` (Table setup) <!-- id: 8 -->
- [ ] 3.2 Implement "Set Default" toggle logic with backend <!-- id: 9 -->
- [ ] 3.3 Create `PublicationForm.vue` (Create/Edit) <!-- id: 10 -->
- [ ] 3.4 Wire up "New Publication" flow <!-- id: 11 -->

## 4. Verification

- [ ] 4.1 Verify existing promotions are visible (migration check) <!-- id: 12 -->
- [ ] 4.2 Verify creating new publication works <!-- id: 13 -->
- [ ] 4.3 Verify switching default replaces the visible offers <!-- id: 14 -->
