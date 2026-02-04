# Proposal: Scope Promotions to Store

## Goal

Enforce that all promotion management operations are scoped to a specific store. The user must select a store before being able to view, create, or edit promotions.

## Context

Currently, the promotions view might display all promotions or not explicitly require a store context. The user wants to ensure strictly store-centric promotion management.

## Changes

1.  **UI/UX**:
    - Add a "Select Store" step or dropdown in the Promotions view.
    - Disable/Hidden promotion actions until a store is selected.
    - Filter the promotion list by the selected store.
2.  **Frontend Logic**:
    - Pass the selected `storeId` to the backend when creating/fetching promotions.
    - Bind new promotions to the selected store.
3.  **Backend**:
    - Ensure `Offer` entity creation requires `storeId`.
    - Ensure `GET` endpoints filter by `storeId`.
