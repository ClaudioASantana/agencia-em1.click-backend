# Spec: Offer Schema

## MODIFIED Requirements

### Requirement: Offer Model

The `Offer` model must support validity periods and status.

#### Scenario: Validity Dates

Given an Offer
Then it should have `startDate` and `endDate`

#### Scenario: Active Status

Given an Offer
Then it should have an `active` boolean flag

## ADDED Requirements

### Requirement: Initial Offer Data

The database must contain sample offers.

#### Scenario: Seed Offers

Given the database is seeded
Then each Establishment should have at least one Offer
