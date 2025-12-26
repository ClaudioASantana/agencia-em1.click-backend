# Design: Auth & Swagger

## Swagger Setup
- **Library**: `@nestjs/swagger`.
- **Configuration**: In `src/main.ts`, setup `DocumentBuilder`.
- **Path**: Swagger UI available at `/api`.

## Auth Architecture

### Passwords
- **Library**: `bcrypt`.
- **Flow**:
  - `RegisterUseCase`: Hashes password before calling `UserRepository.save`.
  - `LoginUseCase`: Retrieves user, compares hash, generates token.

### JWT
- **Library**: `@nestjs/jwt`, `passport-jwt`.
- **Algorithm**: HS256 (matching legacy).
- **Expiration**: 72h (matching legacy).
- **Payload**: `{ user_id: string, email: string }`.

### Module Structure
`src/modules/auth`
- `domain/`: Interfaces.
- `application/`: `LoginUseCase`, `RegisterUseCase`.
- `infrastructure/`: `AuthController`, `JwtStrategy`, `BcryptService` (or util).

### Endpoints (Legacy Parity)
- `POST /auth/register`: RegisterRequest -> 201 Created.
- `POST /auth/login`: LoginRequest -> 200 OK { token }.

## Security
- Use `JWT_SECRET` from environment variables.
