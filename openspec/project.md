# Project Context

## Purpose
Backend API for "Agência Em1 Click" (Vitrine), handling user authentication, establishments, and local business management.

## Tech Stack
- **Language**: TypeScript (Node.js)
- **Framework**: NestJS (Modular, Dependency Injection)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT, Passport, BCrypt
- **Documentation**: Swagger (OpenAPI)

## Project Conventions

### Code Style
- **Linter**: ESLint with Prettier
- **Naming**: camelCase for variables/methods, PascalCase for classes, kebab-case for files.
- **Imports**: Clean imports, path aliases where configured.

### Architecture Patterns
- **Hexagonal Architecture (Ports and Adapters)**:
    - `domain/`: Core business logic and entities (Pure TS, no external deps).
    - `application/`: Use cases and interfaces (Orchestration).
    - `infrastructure/`: Framework implementations (NestJS Controllers, Prisma Repositories).
- **DDD Principles**: Rich domain models, Repositories as adapters.

### Testing Strategy
- Jest for Unit and E2E tests.

### Git Workflow
- Feature branches.

## Domain Context
- **User**: Authenticated entity accessing the system.
- **Establishment**: Business entities displayed in the showcase.

## Important Constraints
- Migration from Legacy Go backend.
- Need to support existing data or migrate it carefully.

## External Dependencies
- PostgreSQL Database.

