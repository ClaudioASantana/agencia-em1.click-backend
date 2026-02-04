# Routing Requirements

## ADDED Requirements

### Offer Lookup

#### Scenario: User navigates to a valid offer slug

- **Given** the user visits `/oferta/combo-familia-123`
- **When** the offer exists and is active
- **Then** the `OfferDetailsView` is rendered with offer data.

### Invalid Offer Handling

#### Scenario: User navigates to an invalid/expired offer

- **Given** the user visits `/oferta/invalid-slug`
- **When** the API returns 404
- **Then** the user is redirected to `Home` or shown a "Offer not found" state.
