# Design

## Database

```prisma
model Offer {
  // ... existing
  discountPercentage Float? // Nullable. If present, indicates % mode.
}
```

## API

Payload can include `discountPercentage`.
Backend should ideally validate that `price` matches the calculation, OR backend simply trusts the `price` sent by frontend (simpler for now).
Ideally: Frontend sends `{ originalPrice: 100, discountPercentage: 20, price: 80 }`.

## UI Logic

**Toggle**: [ R$ ] [ % ]

**Mode R$ (Default)**

- Input: `originalPrice` (De)
- Input: `price` (Por) - Editable

**Mode %**

- Input: `originalPrice` (De)
- Input: `discountPercentage` (%) - Editable
- Input: `price` (Por) - Read-only / Calculated

**Mutually Exclusive**

- Switching from R$ to %: Clears/Resets `price` to be calculated.
- Switching from % to R$: Clears `discountPercentage`, makes `price` editable.
