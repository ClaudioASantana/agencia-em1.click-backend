# Design

## UI Components

**Store Context Banner**

- **Layout**: distinct card or section at the top of the view.
- **Content**:
  - **Icon/Logo**: Square or Circle avatar of the store.
  - **Name**: Large, bold text.
  - **Subtext**: "Gerenciando vitrine" string.
- **Style**:
  - Background: Light gray or subtle brand color tint.
  - Border: Small border to separate from filters.

## Data Flow

- `PromotionsView` already fetches `stores`.
- `stores` array likely contains `name`, `id` (and potentially `logo`?).
- **If `logo` is missing**: We might need to fetch it or just use a generic icon `Store` from lucide.

## Behavior

- **Single Store**: Dropdown is hidden (current logic?). Banner is ALWAYS visible.
- **Multiple Stores**: Dropdown is visible. Banner updates immediately when dropdown selection changes.
