# Proposal: Manage Orphan Establishments

## Goal

Provide the SaaS Admin with a view of ALL registered establishments, regardless of whether they have a linked user (owner), and indicate their linking status.

## Context

Currently, the "Lojistas" view only lists _Users_. Establishments created (e.g., via seeding or import) without an owner are invisible to the Admin. The Admin needs a way to see these stores to potentially invite owners or manage the catalog.

## Capabilities

### List All Establishments

- **Endpoint:** `GET /establishments/admin` (Protected).
- **Data:** Returns Establishment details + User info (if linked).
- **UI:** New "Lojas" menu item in Admin Dashboard. Column "Status do Dono" (Vinculado / Sem Responsável).

## Design

- **Backend:**
  - New endpoint in `EstablishmentController`: `findAllAdmin`.
  - Service method to include `users` relation.
- **Frontend:**
  - New view `AdminEstablishmentsView.vue`.
  - Reuse table design from "Lojistas".

## Verification

- **Automated:** `curl` test to verify endpoint requires auth and returns user count/details.
- **Manual:** verify "Sem Responsável" badge for a test orphan establishment.
