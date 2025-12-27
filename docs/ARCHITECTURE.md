# Guia de Arquitetura do Projeto

Este documento explica as decisões arquiteturais adotadas no projeto `agencia-em1.click-backend`, contextualizando para desenvolvedores vindos de outros ecossistemas (como .NET/C#).

## Estrutura: Modular Monolith (Monólito Modular)

Diferente de arquiteturas que separam camadas tecnicamente em projetos distintos na raiz (ex: `Solution.Domain`, `Solution.Infra`), o **NestJS** favorece o uso de **Módulos**.

Adotamos a estrutura de **"Vertical Slices" (Fatias Verticais)** organizada por **Funcionalidades (Features)**.

### Estrutura de Pastas

```text
src/
├── modules/
│   ├── users/                 <-- Módulo (Contexto Delimitado)
│   │   ├── domain/            <-- Camada de Domínio (Entidades, Interfaces de Repo)
│   │   ├── application/       <-- Camada de Aplicação (Use Cases)
│   │   ├── infrastructure/    <-- Camada de Infraestrutura (Controllers, Prisma)
│   │   └── users.module.ts    <-- Definição do Módulo NestJS
│   ├── auth/
│   └── ...
├── infrastructure/            <-- Infraestrutura Global (Config, PrismaService, Filters)
└── main.ts
```

### Por que esta estrutura?

1.  **Modularidade Real**: O NestJS encapsula contextos através de `Modules`. Agrupar por feature (`users`, `auth`) facilita a manutenção e futura extração para microsserviços, se necessário. Se fosse separado por camadas horizontais, separar o domínio de "usuário" do resto seria muito mais difícil.
2.  **Injeção de Dependência**: O sistema de DI do NestJS funciona importando módulos. É natural importar `UsersModule` dentro de `AuthModule`.
3.  **Screaming Architecture**: Ao olhar para a pasta `modules`, você vê **O QUE** o sistema faz (Usuários, Autenticação, Vendas), e não apenas componentes técnicos (Controllers, Services).

### Comparativo (.NET vs NestJS)

| Conceito | .NET (Tradicional N-Layer) | NestJS (Modular DDD) |
| :--- | :--- | :--- |
| **Separação Física** | Projetos separados (`.csproj`) | Pastas de Módulo (`users/`, `auth/`) |
| **Domínio** | `Projet.Domain` (DLL pura) | `modules/feature/domain` (TS puro) |
| **Infraestrutura** | `Projet.Infra.Data` | `modules/feature/infrastructure` |
| **API/Presentation**| `Projet.Api` (Controllers) | `modules/feature/infrastructure/*.controller.ts` |

### Princípios Aplicados

-   **DDD (Domain-Driven Design)**: O núcleo de cada módulo é o `domain/`, que não depende de nada externo (nem do NestJS, nem do Prisma).
-   **Hexagonal / Ports and Adapters**: A camada `infrastructure` atua como adaptadores para as portas definidas no `domain` (ex: `PrismaUserRepository` implementa `UserRepository`).
-   **Clean Code & SOLID**: Cada classe tem responsabilidade única e as dependências apontam para dentro (para o domínio).
