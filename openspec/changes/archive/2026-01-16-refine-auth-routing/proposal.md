# Proposal: Refine Authentication Routing and Profile Logic

## Background

The application currently supports two primary profiles: **SaaS Admin** and **Store Owner** (Lojista). However, creating a new "Store Owner" user without an establishment linked currently results in the user being routed to the Admin Dashboard upon login. This behavior is confusing and suggests a fallback logic issue or a failure in persisting/retrieving the user's role.

## Objective

To ensure deterministic and correct routing for all users based on their explicit role (`ADMIN` or `STORE_OWNER`), regardless of their establishment association status.

## Proposed Changes

1.  **Backend:** Validate that the `role` field is correctly persisted during user creation and correctly returned in the JWT payload during login.
2.  **Frontend:** Update the `router/index.ts` (and strictly `auth.store.ts`) to prioritize the explicit `role` field over implicit checks (like `establishmentId`), ensuring "Store Owners" are always routed to the Store area, even if they haven't created a store yet.
3.  **Validation:** Verify role persistence and token payload structure.
