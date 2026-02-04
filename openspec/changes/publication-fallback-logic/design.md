# Architecture & Design

## Fallback Logic

```mermaid
flowchart TD
    A[Consumer Requests Store Vitrine] --> B{Has ACTIVE Campaign?}
    B -- Yes --> C{Is Date Valid?}
    C -- Yes --> D[Return ACTIVE Publication]
    C -- No --> E{Has PADRAO Publication?}
    B -- No --> E
    E -- Yes --> F[Return PADRAO Publication]
    E -- No --> G[Return Empty State]
```

## Database Schema (Prisma)

### Current

```prisma
model Publication {
  active    Boolean @default(false)
  isDefault Boolean @default(false)
  status    String  @default("draft") // Used loosely
}
```

### Proposed

```prisma
model Publication {
  // active boolean removed (implied by status)
  // isDefault boolean removed (implied by status)
  status String @default("DRAFT") // DRAFT, ACTIVE, PADRAO, ARCHIVED
}
```

## Migration Strategy

1. **DRAFT**: Keep as `DRAFT`.
2. **ACTIVE**: If `active=true` AND `isDefault=false` -> `ACTIVE`.
3. **PADRAO**: If `isDefault=true` -> `PADRAO` (regardless of `active` flag? Or maybe only if `active=true`? User needs to decide. Safest: If it was default, it becomes the new PADRAO).
