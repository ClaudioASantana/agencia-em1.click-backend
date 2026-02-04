# Featured Promotions Specs

## ADDED Requirements

### Requirement: Display Featured Promotions

The system MUST display a list of active, featured promotions within the Store Preview Modal.

#### Scenario: Store has featured promotions

Given I am viewing the Store Preview Modal
And the store has active promotions marked as "highlighted"
Then I see a section "Encartes em Destaque" below the contact info
And I see cards for each featured promotion showing image, title, and price

#### Scenario: Store has no featured promotions

Given I am viewing the Store Preview Modal
And the store has NO active promotions marked as "highlighted"
Then I do NOT see the "Encartes em Destaque" section
