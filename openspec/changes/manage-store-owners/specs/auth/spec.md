## ADDED Requirements

### Requirement: Role-Based Identity

The system SHALL distinguish between "SaaS Admin" and "Store Owner" based on their association with an Establishment.

#### Scenario: Identify SaaS Admin

- **WHEN** a user logs in
- **AND** the user has `establishmentId` as `null`
- **THEN** the system identifies them as a SaaS Admin with global privileges.

#### Scenario: Identify Store Owner

- **WHEN** a user logs in
- **AND** the user has a valid `establishmentId`
- **THEN** the system identifies them as a Store Owner restricted to that Establishment.
