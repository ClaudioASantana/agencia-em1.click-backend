# Authentication

## ADDED Requirements

### Requirement: Admin User Impersonation

The system SHALL allow administrators to impersonate any registered user to facilitate support and debugging.

#### Scenario: Admin impersonates a User

Given I am an authenticated Admin user
When I request `POST /auth/impersonate-user/:userId` with a valid User ID
Then I receive a success response containing an `access_token`
And the `access_token` payload contains the target user's ID
And the `access_token` payload contains `isImpersonation: true`

#### Scenario: Admin impersonates a non-existent User

Given I am an authenticated Admin user
When I request `POST /auth/impersonate-user/:userId` with a non-existent User ID
Then I receive a 404 Not Found error

#### Scenario: Non-Admin attempts impersonation

Given I am an authenticated user with `STORE_OWNER` role (or any non-admin role)
When I request `POST /auth/impersonate-user/:userId`
Then I receive a 403 Forbidden error or 401 Unauthorized
