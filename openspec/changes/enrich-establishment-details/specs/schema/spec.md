# Spec: Enriched Establishment Details

## MODIFIED Requirements

### Requirement: Establishment Model

The `Establishment` model must include operational details.

#### Scenario: Opening Hours

Given an Establishment
Then it should have an optional `hours` field

#### Scenario: Specialties

Given an Establishment
Then it should have an optional `specialties` field (stored as string, exposed as array)
