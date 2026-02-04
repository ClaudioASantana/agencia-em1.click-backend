## ADDED Requirements

### Requirement: Store Recommended User Creation

SaaS Admins SHALL be able to create users and assign them to specific Establishments.

#### Scenario: Admin creates Store Owner

- **WHEN** an authenticated SaaS Admin submits a new user with an `establishmentId`
- **THEN** the system creates the user
- **AND** links them to the specified Establishment.

#### Scenario: Admin lists all users

- **WHEN** an authenticated SaaS Admin requests the user list
- **THEN** the system returns all users across all establishments.
