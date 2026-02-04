# ui Specification

## Purpose
TBD - created by archiving change identify-store-in-promo. Update Purpose after archive.
## Requirements
### Requirement: Store Identity Display

The system MUST clearly display the currently active Store Name and Identity in the Promotions Management view.

#### Scenario: Visual Confirmation of Active Store

Given I have selected a store (or have only one)
When I view the Promotions page
Then I see a banner or header explicitly stating the Store Name
And this banner is distinct from the page title "Destaque e Promoções"

