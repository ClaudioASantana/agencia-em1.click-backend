# Proposal: Unify Vitrine Design with Premium Blue Theme

## Summary

Refactor the `vitrine-frontend` to adopt the "Professional Modernity" aesthetic established by the Premium Design (Modern Blue) system. This involves a complete redesign of the Home page hero, search/filters, and card elements to provide a more sophisticated and unified user experience.

## Why

The current store (Vitrine) design is functional but feels "standard" and inconsistent with the new Premium Blue theme used in the registration flow and admin areas. Elevating the Vitrine's aesthetics will increase perceived value for both store owners and consumers, creating a more "exclusive" marketplace feel.

## Scope

- **Layout (Navigation/Footer)**:
  - Update the logo area and sticky behavior with `backdrop-blur`.
  - Refine button styles (Primary Blue + Refined Outlines).
- **Home Hero**:
  - Replace the text-only header with a dedicated Hero Section.
  - Implement a "Hero Search" pattern where filters are integrated into a central hub.
- **Agency Grid**:
  - Extract and refine the Agency Card component.
  - Implement subtle info overlays (name/segment) with glassmorphism to show data before hover.
- **Category Section**:
  - Update styling to be "Card-based" with modern icons and hover transitions.

## Impact

- **vitrine-frontend**: Visual-only refactor of core components. High impact on first impression.
- **bureau-backend**: No impact (uses existing endpoints).
