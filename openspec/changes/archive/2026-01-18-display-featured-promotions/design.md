# Design: Featured Promotions Grid

## Placement

The grid will be placed **below** the "Informações de Contato" section and **above** the "Redes Sociais" section, as requested ("depois da informação de contato antes da parte da rede social").

## Visual Style

- **Headline**: "Encartes em Destaque" (Font-bold, text-lg).
- **Grid**: 2 or 3 columns on desktop, 1 on mobile (`grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`).
- **Card**:
  - Image (AspectRatio square or 4:3).
  - Title (Truncated).
  - Price (Green/Bold).
  - Original Price (Strikethrough, gray).
  - "Destaque" badge (Optional, since the whole section is highlights).

## Data Source

- Backend: `GET /offers?establishmentId={id}` (already exists).
- Filter: Use the `highlight` field from the `Offer` model.
