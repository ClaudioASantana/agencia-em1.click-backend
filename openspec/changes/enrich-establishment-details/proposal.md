# Proposal: Enrich Establishment Details

## Goal

Add `hours` (opening hours) and `specialties` (list of specialties) to the `Establishment` model to support the full detailed view in the frontend.

## Context

- The frontend `AgencyModal` expects `hours` and `specialties`.
- Current backend model lacks these fields, leading to empty or mock display.
- Database provider is SQL Server.

## Solution

1.  **Schema Update**:
    - Add `hours` (String?) to `Establishment`.
    - Add `specialties` (String?) to `Establishment`.
      - _Note_: Since Prisma + SQL Server doesn't support scalar arrays (`String[]`) easily, we will store duplicates as a JSON string or comma-separated string, or simply a text field. The seed script will serialize the array, and the API will need to handle deserialization or just pass it as is (if frontend handles string).
      - _Decision_: Store as `String` (JSON Stringified array for specialties). API Service will parse it before returning to frontend.
2.  **Seed Update**:
    - Update `seed.ts` to include sample data for these fields from the mock.
3.  **API Update**:
    - Update `EstablishmentService` to parse `specialties` from JSON string back to array if needed, or ensure frontend accepts it.
    - _Correction_: The frontend expects `specialties: string[]`. So the NestJS service must transform the DB string to an array.

## Trade-offs

- Using a string for `specialties` avoids creating a separate `Specialty` table for now, keeping it simple as requested.
