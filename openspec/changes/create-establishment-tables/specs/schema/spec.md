# Spec: Establishment Schema

## ADDED Requirements

### Requirement: Establishment Model

The database must store Establishments with their details and relations.

#### Scenario: Metadata

Given a schema definition
Then it should have an `Establishment` model
And it should have `name`, `description`, `image`, `logo`, `phone`, `whatsapp`, `address`, `rating`
And it should have relations to `Location` and `Segment`

### Requirement: Offer Model

The database must store Offers (Encartes) related to Establishments.

#### Scenario: Metadata

Given a schema definition
Then it should have an `Offer` model
And it should have `title`, `description`, `price`, `image`
And it should belong to an `Establishment`
