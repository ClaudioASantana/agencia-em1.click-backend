## ADDED Requirements

### Requirement: List All Establishments (Admin)

The system MUST provide a secured API endpoint for Admins to list all establishments, including those without associated users.

#### Scenario: Admin views all stores

Given I am logged in as Admin
When I request `GET /establishments/admin`
Then I receive a list of all establishments
And the response includes the associated users (if any) or indicates no owner.
