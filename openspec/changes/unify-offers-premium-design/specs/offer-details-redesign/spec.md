# Spec: Offers Redesign

## MODIFIED Requirements

#### Component: Immersive Offer Hero

- The `OfferDetailsView` MUST feature a full-aspect or expanded image section.
- Vital offer info (Title, Price, Discount) MUST be displayed on a semi-transparent (Glass) "Offer Hub" overlaying the heroic visual.

#### Component: Coupon Box (Glass Ticket)

- The discount coupon area MUST be visually distinct, resembling a digital "Ticket".
- Background MUST use `backdrop-blur-xl` with a thin primary-blue border.
- The coupon code MUST use a monospaced font for a "mechanical/verified" feel.

#### Component: Related Entities

- Seller info MUST be displayed using a unified sidebar box with consistent iconography.
- Related offers MUST use the new `EncarteCard.vue` component.

#### Component: EncarteCard Pattern

- The general offer card MUST focus on a clean square or 4:3 image aspect.
- Title and Price MUST be integrated into a bottom-aligned glass badge.
- Hover states MUST include a slight zoom and float effect.
