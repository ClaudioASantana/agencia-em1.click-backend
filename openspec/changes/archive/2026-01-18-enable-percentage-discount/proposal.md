# Enable Percentage Discount

## Goal

Allow store owners to define promotions by a **Percentage Discount** (e.g., 20% OFF) instead of just fixed prices.

## Context

Currently, promotions are defined by "Original Price" and "Final Price" (Value). The user wants the option to define a discount by Percentage. These modes must be mutually exclusive.

## Strategy

1.  **Backend**:
    - Add `discountPercentage` (Float/String) to `Offer` model.
    - Keep `price` as the stored final price (calculated if percentage is used).
2.  **Frontend**:
    - Add "Discount Type" toggle in `PromotionForm.vue`.
    - Mode A (Value): User inputs "From" and "To" (current behavior).
    - Mode B (Percentage): User inputs "From" and "%". System calculates "To".
3.  **Behavior**:
    - If Percentage is saved, the "To" price is derived and stored for consistency, but the UI remembers the % input.
