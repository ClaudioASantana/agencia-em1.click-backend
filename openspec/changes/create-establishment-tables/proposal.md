# Proposal: Create Establishment Tables

## Goal

Create database tables for `Establishment` (Agencies) and `Offer` to store the catalog content.

## Context

The user wants to persist the establishment data appearing on the home page and in the modals. Currently, this data is mocked on the frontend. We need to mirror the `Agency` structure in the backend.

## Solution

1.  Update `schema.prisma` to include:
    - `Establishment`: The main entity.
      - Relations: `Location`, `Segment`.
    - `Offer`: Promos/Encartes associated with an establishment.
2.  Create a migration.
3.  Update the seed script to populate these tables with the data ported from `agencia-em1.click`.

## Trade-offs

- **Naming**: We will use `Establishment` instead of `Agency` to be more generic, as the user mentioned "Estabelecimento".
- **Fields**: We will use `String` for most fields. `specialties` and `social` will be stored as JSON strings if the database supports it, or simple strings for MVP. SQL Server supports JSON, but requires specific handling. For strict simplicity in this MVP, we might flatten or omit complex objects if not strictly needed, but `social` links are important. We will try to map them to nullable columns or a JSON string.
