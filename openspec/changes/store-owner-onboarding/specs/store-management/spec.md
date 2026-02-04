# Store Management Specs

## MODIFIED Requirements

### Requirement: User Entity

The system MUST allow users to exist without a direct link to an Establishment initially.

#### Scenario: Admin creates a user without a store

Given an admin user is authenticated
When the admin sends a POST request to "/users" with name "New Owner", email "owner@test.com" and no establishmentId
Then the system creates the user
And the user database record has a null establishmentId
And the response includes the created user data

### Requirement: Establishment Onboarding

The system MUST allow an authenticated user without an establishment to create/link one.

#### Scenario: Orphan user creates establishment profile

Given a user "owner@test.com" exists with no establishment linked
And the user is authenticated
When the user sends a POST request to "/establishments" (or specific endpoint) with valid store data (name, segment)
Then the system creates a new Establishment record
And the system updates the User record to link to this new Establishment
And subsequent calls to GET "/establishments/me" return the new establishment data
