# Store Management Specs

## ADDED Requirements

### Requirement: Store Preview

The system MUST allow the Store Owner to preview their store listing exactly as it appears to the Consumer.

#### Scenario: Owner clicks View Details

Given the owner is on the "Manage My Stores" list
When they click the "Eye" (View) icon on a store card
Then a modal opens displaying the Store's Cover, Logo, Rating, Hours, and Description in the "Vitrine" style
And the modal is distinct from the "Edit" form
