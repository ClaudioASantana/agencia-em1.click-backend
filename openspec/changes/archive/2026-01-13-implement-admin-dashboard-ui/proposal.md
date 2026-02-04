# Change: Implement Admin Dashboard UI

## Why

The user provided a high-fidelity design for the SaaS Admin interface, specifically for managing Store Owners ("Lojistas"). The current generic list view does not meet the aesthetic or functional requirements (stats, advanced filters, branded layout) of the SaaS product.

## What Changes

- **Frontend**:
  - **New Layout:** `AdminLayout.vue` implementing the sidebar and header from the design.
  - **New View:** `AdminStoreOwnersView.vue` matching the "Gestão de Lojistas" screen.
  - **Components:** Integration of `shadcn-vue` components (Cards, Tables, Badges) to match the visual style.
  - **Routing:** Update `router/index.ts` to use `AdminLayout` for admin routes.
  - **Mock Data:** Temporarily mock the statistics (Cards) until backend aggregation endpoints are available.
- **Backend**:
  - No schema changes required immediately (using existing User/Establishment data).
  - Ensure `GET /users` supports necessary expansion (already done).

## Impact

- **Specs**: `ui-design`, `user-management`
- **Code**: `bureau-frontend/src/views/admin/*`, `bureau-frontend/src/layouts/*`
