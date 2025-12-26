# Proposal: Migrate Auth and Setup Swagger

## Goal
Migrate Authentication features (Login, Register) from the legacy Go application to NestJS, maintaining feature parity. Additionally, implement Swagger documentation for the API.

## Changes
- **Dependencies**: Install `jwt`, `passport`, `bcrypt`, and `swagger` related packages.
- **Auth Module**: Create `AuthModule` with strict Hexagonal Architecture.
  - **Domain**: Auth interfaces.
  - **Application**: Login/Register use cases.
  - **Infrastructure**: JWT Strategy, Bcrypt Hashing, Auth Controller.
- **Swagger**: Configure `DocumentBuilder` in `main.ts` and add decorators to Controllers/DTOs.

## Verification
- Test `/auth/register` creates a user with hashed password.
- Test `/auth/login` returns a valid JWT.
- Verify Swagger UI at `/api`.
