# Proposal: Manage Promotions (Destaque e Promoções)

## Summary

Replace the "Gerenciar Encartes" capability with a comprehensive "Destaque e Promoções" (Highlights and Promotions) management feature. This includes a new UI for creating, editing, and listing promotions with support for scheduling, original vs. discounted prices, and homepage highlighting.

## Why

The current "Encartes" system is limited. The store owner needs a way to highlight specific products and manage timed promotions effectively. The user provided a UI reference ("Painel Lojista - Cadastro de Promoções com Agendamento") which introduces new data requirements and a more robust management workflow.

## Goals

1.  **Rename & Rebrand**: Change "Gerenciar Encartes" to "Destaque e Promoções" in the navigation and UI header.
2.  **Enhanced Data Model**: Update the data model (likely `Offer` or a new `Promotion` entity) to support:
    - Original Price vs. Discounted Price.
    - Scheduled Start and End dates (already present but needs strict enforcement).
    - "Destaque" (Highlight) toggle.
    - Short description.
3.  **New Management UI**: Implement the provided design with:
    - Split view: List of promotions on the left, Edit/Create form on the right.
    - Status indicators (Active, Scheduled, Inactive/Expired).
    - Image upload (Square format).
4.  **Homepage Integration**: Ensure "Destaque" items are prioritized on the storefront (future scope or part of this?). _Assumption: Only backend/management scope for now, storefront consumption is separate unless specified._

## What Changes

### promotions

Create and manage promotions and highlights (encartes).

## Risks

- **Data Migration**: Existing `Offer` records might need default values for new fields (e.g., `originalPrice` = null).
- **UI Complexity**: The split-pane design is denser than the previous simple list. Responsiveness needs care.

## Dependencies

- `bureau-backend`: Database schema updates (`Offer` model).
- `bureau-frontend`: New views and components.
