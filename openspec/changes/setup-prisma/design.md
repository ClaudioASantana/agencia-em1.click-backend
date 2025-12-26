# Design: Prisma Integration

## Architecture Location
Prisma-related code will reside in `src/infrastructure/database/prisma`.

## Components

### PrismaService
Extends `PrismaClient` and implements `OnModuleInit` to handle connection lifecycle.
Located at: `src/infrastructure/database/prisma/prisma.service.ts`.

### PrismaUserRepository
Implements the domain `UserRepository` interface.
Maps between Prisma generated types and Domain Entities.
Located at: `src/modules/users/infrastructure/repositories/prisma-user.repository.ts`.

### Dependency Injection
`PrismaModule` will export `PrismaService`.
`UsersModule` will import `PrismaModule` and provide `PrismaUserRepository` as the implementation for `UserRepository` token.

## Best Practices
- **Env Vars**: Use `DATABASE_URL` from `.env`.
- **Mapping**: Explicit mappers between Prisma Models and Domain Entities to avoid leaking infrastructure types into the domain.
