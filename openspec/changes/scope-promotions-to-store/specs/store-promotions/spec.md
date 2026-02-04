# store-promotions

## ADDED Requirements

### Requirement: Store Context for Promotions

#### Scenario: User must select a store to manage promotions

Given I am on the Promotions page
When I have not selected a store
Then the "New Promotion" button is disabled
And the promotion list is empty or shows a prompt to select a store

#### Scenario: Promotions are filtered by store

Given I have selected a store "Store A"
When I view the promotions list
Then I only see promotions belonging to "Store A"
And I do not see promotions from "Store B"

#### Scenario: Creating a promotion links it to the selected store

Given I have selected a store "Store A"
When I create a new promotion
Then the promotion is automatically associated with "Store A"
