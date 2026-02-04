# Tasks

- [ ] Backend: Add `discountPercentage` to `Offer` model <!-- id: 1 -->
  - Update `schema.prisma`.
  - Create migration? (Or just push schema since it's dev).
  - Update `OffersController`/Service to handle input.
- [ ] Frontend: Update `PromotionForm.vue` <!-- id: 2 -->
  - Add Toggle (Fixed vs Percentage).
  - Add Input for Percentage.
  - Implement auto-calculation logic: `Price = Original - (Original * (Percent / 100))`.
  - Ensure mutual exclusivity (clear fields or switch modes).
