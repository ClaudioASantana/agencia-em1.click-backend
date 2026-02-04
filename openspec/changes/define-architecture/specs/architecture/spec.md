# Spec: Multi-tenancy Architecture

## ADDED Requirements

### Requirement: Tenant Separation

The system must ensure that data created by one Lojista (Tenant) varies isolated from others for management purposes.

#### Scenario: Edit Permission

Given a Lojista logged into Bureau
When they attempt to edit an Offer
Then they can only succeed if the Offer belongs to their Establishment

### Requirement: Public vs Private Access

The system must expose data publicly for consumption but restrict management.

#### Scenario: Public Access

Given an anonymous user on Vitrine
Then they can READ Establishments and Offers
But they cannot CREATE or UPDATE them
