# Change: Initialize Vitrine Backend

## Why

The client requested a transition from the existing Go implementation to a Node.js-based solution (`vitrine-backend`) using NestJS. This aligns with the client's technology stack preference and allows for leveraging a wider ecosystem of Node.js tools.

## What Changes

- **Archive**: Existing Go code (`cmd`, `internal`, `db/migrations`) will be moved to `legacy/`.
- **Scaffold**: A new NestJS application will be initialized.
- **Architecture**: The new app will follow Hexagonal Architecture (Ports and Adapters), DDD principles, and Clean Code practices.
- **ORM**: **Prisma** will be configured as the Data Access Layer (Adapter) for its performance and type safety.
- **Testing**: Jest will be set up for Unit and Integration tests.

## Impact

- Affected specs: `backend-architecture`
- Affected code: Entire repository structure.
