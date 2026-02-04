# Register with Store

## Goal

Streamline onboarding by creating both the User and their first Store in a single step.

## Context

Currently, registration only creates a user. The user then has to figure out how to create a store. The new requirement ("Path 1") matches SaaS best practices by combining these steps.

## Strategy

1.  **Frontend**: Add "Store Name" to `RegisterModal`. Rename "User Name" field for clarity.
2.  **Backend**: `POST /auth/register` payload will include `storeName`.
3.  **Backend Logic**: `UsersService` will creating the User AND the Establishment in a transaction (or nested write).
