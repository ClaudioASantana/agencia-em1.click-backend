# Combined Registration Spec

## MODIFIED Requirements

### Requirement: Store Owner Registration

The system MUST allow registration of a User and a Store simultaneously.

#### Scenario: Successful Combined Registration

Given I am on the registration modal
When I enter my Name, Store Name, Email, and Password
Then a User account is created
And a Store is created with the provided name
And the User is linked as the owner of the Store
