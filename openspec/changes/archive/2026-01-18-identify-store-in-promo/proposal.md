# Store Identity in Promotions View

## Goal

Make it obvious to the user which Store they are currently managing in the Promotions view.

## Context

When a user manages multiple stores (or even just one), the current UI hides the store name in a small dropdown or assumes context. Users report confusion ("I didn't know which store was loaded").

## Strategy

1.  **Frontend**: Introduce a "Store Context Banner" in `PromotionsView.vue`.
2.  **Logic**:
    - If `establishmentId` is selected, display the Banner.
    - Banner should show: Store Name and Icon/Logo.
    - If only 1 store exists, the Banner acts as the primary title/identity.
    - If multiple stores exist, the Banner reinforces the selection made in the dropdown.
