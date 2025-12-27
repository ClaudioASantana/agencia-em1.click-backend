# Migrate Frontend Mock Data to Backend

This proposal outlines the plan to migrate the rich mock data currently used in `vitrine-frontend` to the Postgres database in `agencia-em1.click-backend`. This will ensure the backend API serves the same "Encarta" and "Establishment" data seen in the UI.

## Problem
The backend database is currently empty or lacks the specific data set that has been curated in the frontend for the demo. We want to persist this data in the backend to enable full end-to-end functionality.

## Solution
We will create a database seed script (`src/shared/infrastructure/prisma/seed.ts`) that programmatically inserts the data using Prisma Client.

### Data Mapping Strategy
We will map the `Agency` interface from the frontend to the Prisma Schema models as follows:

1.  **Localities (`localidades`)**
    *   `Agency.location` -> `localidades.nome` (Upsert by name)

2.  **Segments (`segmentos`)**
    *   `Agency.segment` -> `segmentos.nome` (Upsert by name)

3.  **Establishments (`estabelecimentos`)**
    *   `Agency.name` -> `nome`
    *   `Agency.description` -> `descricao`
    *   `Agency.logo` -> `logo_url`
    *   `Agency.address` -> `endereco`
    *   `Agency.phone` -> `telefone`
    *   `Agency.whatsapp` -> `whatsapp`
    *   `Agency.rating` -> `avaliacao_media`
    *   `Agency.ratingCount` -> `total_avaliacoes`
    *   **Relationships**: Connect to the Upserted Locality and Segment.

4.  **Encartes (`encartes`)**
    *   Concept: The main "card" image in the frontend acts as the "Encarte".
    *   `Agency.name` -> `titulo` (Use establishment name as title for now)
    *   `Agency.image` -> `imagem_capa_url`
    *   **Relationships**: Connect to `localidade_id` and the `estabelecimento`.

5.  **Specialties (`especialidades`)**
    *   `Agency.specialties` (Array) -> Multiple `especialidades` records linked to the establishment.

6.  **Social Media (`redes_sociais`)**
    *   `Agency.social` (Object) -> Multiple `redes_sociais` records (Facebook, Instagram, Website) linked to the establishment.

## Technical Implementation
-   Create `src/shared/infrastructure/prisma/seed.ts`.
-   Use `prisma.$transaction` for integrity where possible.
-   Add a `seed` script to `package.json` to run it easily (`ts-node src/shared/infrastructure/prisma/seed.ts`).

## Verification
-   Run the seed script.
-   Use Prisma Studio or SQL queries to verify the tables are populated.
