# Agency Landing Page

## ADDED Requirements

#### Scenario: Visitor arrives at the landing page

- **Given** I am a visitor (potential customer or store owner)
- **When** I navigate to `vitrine-agencia-em1.click`
- **Then** I should see a Hero section explaining "Vitrine Agency"
- **And** I should see a clear "Browse Stores" button pointing to `vitrine-frontend`
- **And** I should see a "Partner Login" button pointing to `bureau-frontend`

#### Scenario: Visitor reviews platform features

- **Given** I am on the landing page
- **When** I scroll down
- **Then** I should see a section describing how the platform helps users find offers
- **And** I should see a section describing how store owners can manage their catalog

#### Scenario: Visual Style

- **Given** the user request for "WordExpress" style
- **Then** the page should use a clean, professional layout with ample whitespace
- **And** utilize the "Premium Modern" color palette (Blue/Neutral) already established in the other apps
