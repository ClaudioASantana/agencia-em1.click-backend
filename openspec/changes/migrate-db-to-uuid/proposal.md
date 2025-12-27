# Migrate Database IDs to UUID

## Summary
Migrate the database schema from using auto-incrementing Integers for Primary Keys to using UUIDs (Strings). This aligns with the new Hexagonal Architecture/DDD approach, decoupling entity creation from database persistence and improving security.

## Why
The legacy database uses `Int` IDs. This forces entities to be created without IDs or with temporary IDs before persistence, and exposes sequential IDs in URLs. The current codebase has mixed handling of String vs Int IDs, causing type mismatches.

## What Changes
1. Convert all Primary Key definitions in `schema.prisma` to `String` with `@default(uuid())`.
2. Update all Foreign Key relations to use `String`.
3. Provide a strategy to migrate existing data (or wipe and recreate if acceptable for development).
4. Update application code (`Repository`, `UseCases`) to handle UUIDs natively without conversion hacks.
