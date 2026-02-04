# promotions Specification

## Purpose
TBD - created by archiving change display-featured-promotions. Update Purpose after archive.
## Requirements
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

### Requirement: Percentage Discount Input

The system MUST allow users to define a promotion via a percentage discount.

#### Scenario: Defining by Percentage

Given I am creating a promotion
And I select the "Percentage" discount mode
When I enter an Original Price of "100"
And a Discount Percentage of "20"
Then the Final Price is automatically calculated to "80"
And the promotion is saved with the 20% discount attribute

### Requirement: Mutual Exclusivity

The system MUST NOT allow simultaneous definition of Fixed Price and Percentage Discount inputs that conflict.

#### Scenario: Switching Modes

Given I have entered a Percentage Discount
When I switch to "Fixed Value" mode
Then the Percentage input is cleared or ignored
And I can explicitly set the Final Price

