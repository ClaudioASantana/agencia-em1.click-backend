# Proposal: Create Consumer User Profile

## Summary

Introduce a "Consumer" user profile to the platform to enable future consumer-facing features (favorites, reviews, etc.). Implement the initial registration flow in `vitrine-frontend` using the "Premium Design" system (Modern Blue).

## Why

Currently, the platform focuses on Store Owners. To build a marketplace/community, we need to allow end-consumers to register and log in. This foundational step creates the user entity and the interface for them to join.

## Scope

- **Backend**: Support `CONSUMER` role in `User` model and `AuthController`.
- **Frontend (Vitrine)**: Create a Registration Page at `/register` using Premium Design.

## Impact

- **bureau-backend**: Minor schema/logic extension (User role).
- **vitrine-frontend**: New public page.
