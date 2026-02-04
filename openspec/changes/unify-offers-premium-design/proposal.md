# Proposal: Unify Offers Section with Premium Glass Theme

## Summary

Redesign the `OfferDetailsView.vue` and `EncarteCard.vue` to adopt the "Professional Modernity" aesthetic. This involves transforming the offer detail page into a visually rich and immersive experience, using specialized glassmorphism components for price and seller info, and standardizing the related offer cards to follow the premium image-first pattern.

## Why

The "Offers" are the most dynamic part of the Vitrine. Current designs look like a standard e-commerce product page. Elevating it to a "Premium Boutique" feel will increase the perceived value of the offers and the marketplace as a whole.

## Scope

- **Offer Detail Page (`OfferDetailsView.vue`)**:
  - **Immersive Hero**: Expand the offer image and overlay it with a glassmorphism "Offer Hub" containing price and title.
  - **Seller Identity**: Use the refined "Floating Box" pattern for store details.
  - **Coupon Design**: Redesign the "Copy Coupon" area to be more elegant (Glass + Subtle Glow).
  - **Related Grid**: Standardize the "Related Offers" grid to use the same logic as the Home grid.
- **Offer Card (`EncarteCard.vue`)**:
  - Complete redesign to use the **Image-First** pattern.
  - Glass info badge showing title and price on a semi-transparent base.
  - Smooth lift and scale transitions.

## Impact

- **vitrine-frontend**: High impact on the core conversion view.
- **bureau-backend**: No impact.
