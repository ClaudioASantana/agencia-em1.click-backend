<!-- id: product-details-page -->

# Product Details Page Tasks

## Backend (Bureau)

- [ ] Add `slug` field to `Offer` model in `schema.prisma` <!-- id: backend-slug -->
- [ ] Run migration `prisma db push` and `generate` <!-- id: backend-migrate -->
- [ ] Implement `slug` generation logic in `OffersService.create` <!-- id: backend-logic -->
- [ ] Create `GET /offers/:slug` endpoint in `OffersController` (Public) <!-- id: backend-api -->

## Frontend (Vitrine)

- [ ] Create `OfferDetailsView.vue` component <!-- id: frontend-view -->
- [ ] Configure Router for `/oferta/:slug` <!-- id: frontend-route -->
- [ ] Implement API fetch by slug in `api.ts` <!-- id: frontend-api -->
- [ ] Implement UI Layout (Hero, Sidebar, Info) based on reference <!-- id: frontend-ui -->
- [ ] Add "Related Offers" section (Reuse AgencyModal grid?) <!-- id: frontend-related -->
