# Proposal: Create Offer Tables and Data

## Goal

Ensure the database has a robust structure for "Encartes de Ofertas" (Offers) and populate it with sample data linked to Establishments.

## Context

The user wants to store "Encartes" (flyers/offers) that are displayed on the home page or in the establishment modal.

- We already have an `Offer` model in `schema.prisma`.
- We already have `Establishment` populated.
- **Missing**: Meaningful data for `Offer` and potential schema refinements (e.g., validity dates).

## Solution

1.  **Refine Schema**:
    - Update `Offer` model to include `startDate`, `endDate`, and `active` status.
    - Ensure `Establishment` has a rich set of fields (already mostly done, but we will double check).
2.  **Seed Data**:
    - Update `seed.ts` to create `Offer` records for the seeded establishments.
    - Example: "Promoção de Inauguração", "Oferta da Semana".

## Trade-offs

- We will stick to the existing `Establishment` -> `Offer` relationship (One-to-Many).
- We will use random placeholder images for offers if specific ones aren't provided.
