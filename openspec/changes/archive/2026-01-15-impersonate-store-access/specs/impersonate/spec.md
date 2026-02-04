# Spec: impersonate

## Requirements

### Requirement: Impersonate Target Store

The system shall allow an authenticated SaaS Administrator to generate a session as a specific store's owner.

#### Scenario: Admin Switch to Store Owner

- **Given** I am logged in as a SaaS Administrator (`role: ADMIN`)
- **And** I am in the Store Management grid
- **When** I click "Acessar" on "Casa de Minas" store
- **And** the store has an owner "Lojista João"
- **Then** the system shall generate a JWT for "Lojista João"
- **And** I shall be redirected to the Store Profile as "Lojista João"

#### Scenario: Admin Switch to Store without Owner

- **Given** I am logged in as a SaaS Administrator
- **And** I am in the Store Management grid
- **When** I click "Acessar" on "New Store" which has no registered user
- **Then** the system shall generate a JWT for the Admin
- **And** the JWT shall contain `establishmentId` of "New Store"
- **And** I shall be redirected to the Store Profile as a representative of "New Store"

### Requirement: Restrict Impersonation Endpoint

The impersonation endpoint shall be restricted to users with administrative privileges.

#### Scenario: Unauthorized Impersonation Attempt

- **Given** I am logged in as a standard Store Owner
- **When** I attempt to POST to `/auth/impersonate/123`
- **Then** the system shall return a `403 Forbidden` error
