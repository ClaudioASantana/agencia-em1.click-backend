# Product Details Page Design

## Visual Reference

Based on provided screenshot "Agencia em1.click".

### Layout Structure

- **Container**: Centered, max-width (e.g., `max-w-7xl`).
- **Header**: Standard Site Header.
- **Breadcrumbs**: `Home > Categoria > Loja > Nome do Produto`.
- **Grid Layout**: 2 Columns on Desktop (Main Content 66% | Sidebar 33%).
  - **Main Content**:
    - Hero Image (Rounded corners, aspect-ratio video or 4:3).
    - Title & Price block (Mobile only? Or shared?).
    - Description Block ("Descrição da Oferta").
    - Terms & Conditions Block (Gray background).
  - **Sidebar (Sticky)**:
    - Store Card ("Vendido por [Logo] [Nome]").
    - WhatsApp Action Button (Green).
    - "Go to Store" Action Button (Blue secondary).
    - Share Button.
    - Discount Coupon Card (Blue gradient).
- **Footer Section**:
  - "Outras ofertas desta loja" (Carousel or Grid).

## Architecture

### Backend

- **Slug Generation**: `slugify(title) + '-' + randomString`. consistency is key.
- **API Response**: Should include:
  - Offer Details (Title, Description, Prices, Images).
  - Establishment Details (Name, Slug, Logo, WhatsApp).
  - Related Offers (3-4 other active offers from same store).

### Frontend Routing

- Path: `/oferta/:slug`
- Props: `slug` passed to view.
- Loader: Fetch data on mount. Skeleton state required.
