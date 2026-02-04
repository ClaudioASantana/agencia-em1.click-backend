# Manage Store Profile

## Goal

Enable store managers (Lojistas) to view and update their own establishment details via a dedicated dashboard screen.

## Context

Currently, the "Dashboard" for store owners is a read-only view. The user wants to allow store owners to edit their information (Name, Description, Logo, Hours, Contact Info) as shown in the provided design.
On the backend, the `EstablishmentController` is missing a method to update establishment details.

## Capabilities

### 1. Update Establishment Details (Backend)

- Expose `PATCH /establishments/me` endpoint.
- Validate input (DTOs).
- Update the `Establishment` record.

### 2. Store Profile UI (Frontend)

- **Store Layout:** Implement the sidebar specific to "Gestão da Loja" (Store Management).
- **Profile View:** Create the "Dados da Loja" form matching the design:
  - Stats Cards (Views, Active Offers, Rating).
  - Basic Info Form (Name, Segment, Description).
  - Contact/Location Form (Logo, WA, Insta, Address).
  - Hours Form (Mon-Sun).
- **Integration:** Connect to `GET /establishments/me` for initial data and `PATCH /establishments/me` for saving.

## Design

- **Frontend Logic:**
  - Create `StoreLayout.vue` to distinguish from `AdminLayout.vue`.
  - Sidebar links: "Dados da Loja", "Gerenciar Encartes", "Promoções", "Relatórios".
  - Redirect `/dashboard` to `/store/profile` (or keep `/dashboard` as landing but strictly distinct). Given the request "criar a tela... quando o usuario for o gestor", making the profile the main view or easily accessible is key. We'll use `/store/profile` as the "Dados da Loja" route.

## Verification

- **Backend:** `curl` or Postman test for `PATCH`.
- **Frontend:** Browser automation to log in as `owner@test.com`, navigate to profile, edit fields, save, reload, and verify persistence.
