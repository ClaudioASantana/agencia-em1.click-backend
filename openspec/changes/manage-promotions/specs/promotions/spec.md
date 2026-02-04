# promotions

## ADDED Requirements

### Requirement: Create a new promotion

#### Scenario: Successfully creating a promotion

Given I am a store owner on the "Destaque e Promoções" page
When I fill in the form with valid data (Name="Promo Pizza")
And I toggle "Destaque" to on
And I click "Salvar Promoção"
Then the promotion is created

### Requirement: List promotions with status

#### Scenario: Viewing promotion statuses

Given I have 3 promotions
When I view the list
Then "Past" shows status "Inativo"
