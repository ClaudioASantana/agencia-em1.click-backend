# Spec: Catalog Schema

## ADDED Requirements

### Requirement: Schema Definition

The database must store Locations and Segments.

#### Scenario: Location Model

Given a schema definition
Then it should have a `Location` model
And it should have `id` (Int or String), `name` (String)

#### Scenario: Segment Model

Given a schema definition
Then it should have a `Segment` model
And it should have `id` (Int or String), `name` (String)

### Requirement: Initial Data

The database must contain the initial list of locations and segments.

#### Scenario: Seed Locations

Given the database is seeded
Then the `Location` table should contain "Belo Horizonte"

#### Scenario: Seed Segments

Given the database is seeded
Then the `Segment` table should contain "Roteiro Gastronômico"
