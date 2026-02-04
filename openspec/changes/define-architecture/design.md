# Architectural Design: Multi-tenant Marketplace

## Context

The system consists of two distinct frontends consuming a single backend:

1.  **Vitrine Frontend** (`vitrine-frontend`): Consumer-facing marketplace. Read-heavy.
2.  **Bureau Frontend** (`bureau-frontend`): Vendor/Admin portal. Write-heavy.

The goal is to support multiple "Lojistas" (Establishments) managing their own content (Offers, Promotions) independently.

## Architecture Pattern: Multi-tenant Marketplace

We will adopt a **Logical Multi-tenancy** approach within a Modular Monolith.

### 1. Data Model (Tenancy)

- **Tenant Unit**: `Establishment` is the primary tenant unit.
- **User Association**: A `User` belongs to one (or potentially many) `Establishment`.
- **Data Scope**: All transactional data (`Offer`, `Promotion`, `Product`) must have an `establishmentId`.
  - _Rule_: A logged-in User can only create/edit data where `data.establishmentId == user.establishmentId`.

### 2. Frontend Separation

| Component   | Role              | Auth Strategy               | Key Features                                               |
| :---------- | :---------------- | :-------------------------- | :--------------------------------------------------------- |
| **Vitrine** | Consumer (Public) | Public / Optional User Auth | SEO, Performance, Search, Filtering.                       |
| **Bureau**  | Provider (Admin)  | **Strict JWT Auth**         | Dashboards, CRUD Forms, Image Uploads, Profile Management. |

### 3. Backend Strategy (`bureau-backend`)

The NestJS backend will serve as the Unified API Gateway.

#### Modules

- `AuthModule`: Handles Login/Register for Lojistas. Returns JWT with `establishmentId` claim.
- `EstablishmentModule`:
  - _Public_: `GET /establishments` (List), `GET /establishments/:slug` (Detail).
  - _Private_: `PATCH /establishments/me` (Update own profile), `GET /establishments/me/stats`.
- `OfferModule`:
  - _Public_: `GET /offers` (All active offers).
  - _Private_: `POST /offers`, `PATCH /offers/:id` (Manage own offers).

### 4. Trade-offs & Decisions

- **Single Database**: We will use a single database with `establishmentId` foreign keys.
  - _Pro_: Simpler migration, reporting, and cross-establishment search (Marketplace view).
  - _Con_: Requires careful query scoping to prevent data leaks (using Prisma middleware or Service-layer checks).
- **Shared Backend**:
  - _Pro_: Reuses business logic (e.g., "Is active?" checks) and infrastructure.
  - _Con_: Public traffic spikes could affect Admin performance (unlikely at this scale).

## Roadmap for Multi-tenancy

1.  **Auth & Roles**: Implement Login on Backend + Bureau Frontend.
2.  **Tenant Context**: Ensure every API request from Bureau carries the Tenant context.
3.  **CRUD**: Implement Offer/Establishment management in Bureau.
