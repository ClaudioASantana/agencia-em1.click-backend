## ADDED Requirements

### Requirement: List Store Owners

The system MUST provide an API endpoint to list all users who are store owners, including their establishment details.

#### Scenario: Admin views store owners list

Given a SaaS Admin is logged in
When they request the list of users
Then the system returns a list of users
And each user object containing an `establishmentId` not null includes an `establishment` object with the `name`.
