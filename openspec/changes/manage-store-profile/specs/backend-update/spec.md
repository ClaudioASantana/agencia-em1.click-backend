# Backend Update Spec

## ADDED Requirements

### Requirement: Update Profile Functionality

The system MUST allow Store Owners to update their establishment details.

#### Scenario: Store Owner updates their profile

- **Given** an authenticated user with `establishmentId`.
- **When** they send a `PATCH` request to `/establishments/me` with valid data (e.g., new description, hours).
- **Then** the system updates the `Establishment` record.
- **And** returns the updated establishment details.

#### Scenario: Validation

- **Given** an update request.
- **When** the payload contains invalid data (e.g., invalid phone format - optional).
- **Then** return 400 Bad Request.

#### Scenario: Security

- **Given** a user without `establishmentId` (e.g., pure admin or invalid).
- **When** they try to access PATCH `/establishments/me`.
- **Then** return 403 Forbidden or 404 Not Found (since they have no establishment).
