# Proposal: Refactor Agency Modal to Premium Glass

## Summary

Upgrade the `AgencyModal.vue` in `vitrine-frontend` to match the "Professional Modernity" aesthetic. This refactor focuses on enhancing the visual hierarchy, improving the transition between the hero and content sections, and modernizing all interactive elements (buttons, social links, and promotion cards) using the Modern Blue and Glassmorphism design tokens.

## Why

As the primary point of conversion where users see store details and offers, the Agency Modal must feel high-end. The current design, while functional, lacks the "wow" factor of the new Home page. A more refined modal will provide a cohesive experience and better showcase each store's unique brand.

## Scope

- **Hero & Logo**: Improve the "Floating Logo" transition and ensure clear contrast for store name/segment.
- **Action Bar**: Redesign Heart/Share buttons with refined glass styles.
- **Content Sections**:
  - Update "Specialties" to use more premium tag styles.
  - Revamp "Contact Info" with better iconography and alignment.
- **Promotions Grid**: Update the offer cards inside the modal to match the new `AgencyCard` image-first premium style.
- **Social Media**: Refine social link buttons to be less "bulky" and more integrated into the design.

## Impact

- **vitrine-frontend**: Visual refactor of `AgencyModal.vue`.
- **bureau-backend**: No impact.
