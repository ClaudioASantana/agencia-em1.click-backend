# Spec: API Endpoints

## ADDED Requirements

### Requirement: Catalog API

The backend must expose endpoints for static catalog data.

#### Scenario: Get Locations

Given the backend is running
When a GET request is made to `/locations`
Then it should return a list of locations

#### Scenario: Get Segments

Given the backend is running
When a GET request is made to `/segments`
Then it should return a list of segments

### Requirement: Establishment API

The backend must expose endpoints for establishment data.

#### Scenario: Get Establishments

Given the backend is running
When a GET request is made to `/establishments`
Then it should return a list of establishments, including their active offers
