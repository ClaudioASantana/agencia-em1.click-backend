# Display Featured Promotions

## Goal

To display "Featured Promotions" (Encartes em Destaque) within the Store Preview Modal (`bureau-frontend`) and the Agency Modal (`vitrine-frontend`), ensuring users see the most relevant offers immediately.

## Context

The user requested that "destaques e promoções" appear in the modal, specifically those marked as "em destaque" (highlighted). This section should appear after Contact Info and before Social Media.

## Strategy

1.  **Frontend (Bureau)**: Update `StorePreviewModal.vue`.
    - Add a new section "Encartes em Destaque" between "Informações de Contato" and "Redes Sociais".
    - This section will display a grid of `Propos` (Offers) that have `highlight: true`.
    - Update `ManageStoresView.vue` to fetch and pass these promotions to the modal.

2.  **Frontend (Vitrine)**: Update `AgencyModal.vue` (Scope of this proposal includes the suggestion/design).
    - Apply the same layout change.
