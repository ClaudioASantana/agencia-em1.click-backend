# Preview Store Modal

## Goal

To implement a "Store Preview" modal in the Bureau Admin (`bureau-frontend`) that replicates the consumer-facing `AgencyModal` from `vitrine-frontend`. This ensures that store owners see exactly how their store appears to end users when they click "View Details".

## Context

Currently, the "View Details" action in "Manage My Stores" either redirects to a placeholder dashboard or opens the Edit form. The user explicitly requested to see the "card dos encartes" modal style found in the consumer app.

## Strategy

1.  **Port Component**: Copy and adapt `AgencyModal.vue` from `vitrine-frontend` to `bureau-frontend` as `StorePreviewModal.vue`.
2.  **Adapt Data**: Map the `Store` entity in Bureau to the `Agency` interface required by the modal (or adjust the modal to accept `Store`).
3.  **Integrate**: Update `ManageStoresView.vue` to open this new modal on "View Details" (Eye icon), while keeping "Edit" (Pencil icon) for the form.
