# Refactor Promotions UI

## Goal

Standardize the "Destaque e Promoções" (Promotions) management UI to match the "Minhas Unidades" (Manage Stores) pattern. This involves transitioning from a split-view layout to a Grid + Modal layout and ensuring specific fields are captured in the form.

## Why

The user requested that the Promotions interface follow the same UX/UI patterns developed for Store Units. This means:

1.  **Grid Layout**: Displaying items (promotions) as cards in a responsive grid.
2.  **Modal Form**: Editing and Creating items happens in a centralized Dialog (Modal) rather than a side form or separate page.
3.  **Filter Bar**: A dedicated bar for searching and filtering items.

Additionally, the proposal defines the specific data fields required for promotions as per the provided mockups/images.

## What Changes

- **Refactor `PromotionsView`**: Adopt Grid + Modal structure.
- **Create `PromotionCard`**: Visual component for the grid.
- **Create `PromotionFilterBar`**: Component for list management.
- **Update `PromotionForm`**: Ensure all fields (Original Price, Discount Price, Dates, Highlight, Image) are present and validated.
