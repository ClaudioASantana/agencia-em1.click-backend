# Consolidate Admin Views

## Goal

Reduce redundancy in the Admin Interface by merging the "Lojistas" (Store Owners) and "Lojas" (Establishments) views into a single, unified "Establishments" dashboard.

## Context

Currently, there are two separate views:

1.  **Lojistas**: Focuses on `User` entities linked to establishments.
2.  **Lojas**: Focuses on `Establishment` entities.

This separation creates redundancy and usability issues, particularly for "Orphan Establishments" (stores without owners), which are invisible in the Lojistas view. The user suggested a "Button in Lojistas" to view store details, but this fails to address the orphan visibility problem.

## Proposal

We will consolidate everything into the **"Lojas" (Establishments)** view.

- **Remove**: The dedicated "Lojistas" menu item and view.
- **Enhance**: The "Lojas" view to include a "Responsável" (Owner) column with actionable management features.
- **New Feature**: A "Manage Owner" modal accessible from the "Lojas" list.
  - If an owner exists: View details, Unlink, Edit.
  - If no owner exists: Invite/Link a new owner.

This ensures all establishments are visible (including orphans) and centralizes management.
