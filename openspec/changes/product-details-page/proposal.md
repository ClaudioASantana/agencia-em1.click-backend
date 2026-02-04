# Product Details Page

## Goal

Create a dedicated Product Details Page in the `vitrine-frontend` consumer application to display detailed information about an offer, optimized for SEO and sharing.

## Why

The current modal-based approach is good for quick viewing but suboptimal for:

- **Sharing**: Users cannot easily share deep links to specific offers.
- **SEO**: Search engines reference pages better than dynamic modals.
- **Content Density**: Detailed product descriptions, terms, and related items require more screen real estate than a modal efficiently provides.

## What Changes

### Backend

- **Schema**: Add `slug` field to `Offer` model (unique).
- **API**: Add `GET /offers/:slug` public endpoint to fetch offer details with related store info.

### Frontend (Vitrine)

- **Routing**: Add route `/oferta/:slug`.
- **UI**: Create `OfferDetailsView.vue` matching the reference design:
  - Breadcrumbs.
  - Large Hero Image.
  - Sticky Sidebar (Desktop) / Bottom Sheet (Mobile) for Price & Actions.
  - "Sold By" card with store details.
  - "Related Offers" carousel.
