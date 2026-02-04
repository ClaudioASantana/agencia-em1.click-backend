# routing Specification

## Purpose
TBD - created by archiving change refine-auth-routing. Update Purpose after archive.
## Requirements
### Requirement: Role-Based Routing

The system SHALL route users to their respective areas based strictly on their assigned `role`.

#### Scenario: Store Owner Login

Given I am a user with role `STORE_OWNER`
And I have no associated establishment (establishmentId is null)
When I log in
Then I am redirected to `/store` (Store Area)
And I am NOT redirected to `/admin`

#### Scenario: SaaS Admin Login

Given I am a user with role `ADMIN`
When I log in
Then I am redirected to `/admin` (Admin Area)

### Requirement: Legacy Fallback Routing

The system SHALL support legacy users without an explicit `role` by inferring privileges from `establishmentId`.

#### Scenario: Legacy Admin Login

Given I am a user with `role` as null
And I have `establishmentId` as null
When I log in
Then I am redirected to `/admin` (inferred Admin)

#### Scenario: Legacy Store Owner Login

Given I am a user with `role` as null
And I have a valid `establishmentId`
When I log in
Then I am redirected to `/store` (inferred Store Owner)

