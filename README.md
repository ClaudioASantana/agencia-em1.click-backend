# Agencia Em1.Click Backend

This project is built using NestJS and follows **Hexagonal Architecture (Ports and Adapters)**, **Domain-Driven Design (DDD)**, and **SOLID** principles.

## Architecture Overview

The codebase is organized to strictly separate business logic from infrastructure concerns.

### Directory Structure

- **src/domain**: Contains the core business logic, Entities, Value Objects, and Repository Interfaces (Ports). This layer is independent of any framework or external library.
- **src/application**: Contains the application logic (Use Cases). It orchestrates the flow of data to and from the domain entities. It depends only on the Domain layer.
- **src/infrastructure**: Contains the implementation of interfaces (Adapters), such as Repositories, external APIs, and Framework-specific code (Controllers, NestJS Modules).
- **src/modules**: We verify the "Screaming Architecture" by organizing code by features (e.g., `users`).

### Principles Applied

- **Hexagonal Architecture**: The application core (Domain + Application) is surrounded by interfaces (Ports). Infrastructure components (Adapters) implement these interfaces.
- **DDD**: Focus on the core domain logic. Entities encapsulate behavior and state.
- **SOLID**:
  - **SRP**: Each class has a single responsibility (e.g., Use Case only executes logic, Repository only handles persistence).
  - **DIP**: High-level modules (Application) do not depend on low-level modules (Infrastructure). Both depend on abstractions (Interfaces in Domain).

## Getting Started

### Installation

```bash
npm install
```

### Running the app

```bash
# development
npm run start

# watch mode
npm run start:dev

# production mode
npm run start:prod
```

### Test

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
```
