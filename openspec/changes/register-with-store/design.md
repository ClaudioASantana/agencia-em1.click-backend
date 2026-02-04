# Design

## API Payload

```json
{
  "name": "Claudio Santana",
  "email": "claudio@example.com",
  "password": "secure",
  "storeName": "Lojinha do Claudio" // New field
}
```

## Backend Logic

Prisma supports nested writes.

```typescript
prisma.user.create({
  data: {
    ...userData,
    establishments: {
      create: {
        name: storeName,
        segmentId: 1, // Default segment? Or make optional? will use 1 for now or find valid dummy.
      },
    },
  },
});
```

_Note_: `segmentId` is required in schema. I need to ensure I set a default or fetch one. For now I'll use ID 1 as a fallback or make the service fetch the first available segment.

## Frontend

- Modal Title: "Cadastrar Loja"
- Inputs:
  1. Nome da Loja
  2. Seu Nome
  3. Email
  4. Senha / Confirmar
