# Promotion UI

## ADDED Requirements

### Manage Promotions UI Layout

#### Scenario: Viewing Promotions List

Given I am on the "Destaque e Promoções" page
Then I see a search bar and status filter at the top
And I see a grid of promotion cards
And I do _not_ see a side-panel form by default

#### Scenario: Creating a Promotion

Given I am on the "Destaque e Promoções" page
When I click "Nova Promoção"
Then a Modal (Dialog) opens with the promotion form
And the form contains fields for:

- Product Name
- Short Description
- Original Price
- Discount Price
- Start Date
- End Date
- Product Image (Square)
- Highlight Toggle (Destaque)

#### Scenario: Editing a Promotion

Given I see a promotion card in the grid
When I click the Edit button on the card
Then the Modal opens with that promotion's data pre-filled

#### Scenario: Visualizing Promotion Status

Given a promotion exists
Then the card displays a badge indicating its status:

- "Ativo" (Green) if currently active
- "Agendado" (Blue) if start date is in future
- "Expirado" (Red) if end date is in past
- "Inativo" (Gray) if explicitly deactivated

#### Scenario: Promoting to Homepage

Given I am creating or editing a promotion
When I enable the "Destaque na Página Inicial" toggle
Then the promotion is marked as a Highlight
And it will appear in the "Destaque" section
