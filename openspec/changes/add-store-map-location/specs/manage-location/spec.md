# Capability: Manage Location

## ADDED Requirements

### Requirement: Set Store Location

The system SHALL allow store owners to set their store's location using an interactive map, saving coordinates (latitude/longitude) alongside the address.

#### Scenario: Store owner sets location on map

- **GIVEN** the store owner is on the "Edit Store" modal
- **AND** the "Localização e Contato" tab is active
- **WHEN** they view the location section
- **THEN** they should see an interactive map centered on their numeric coordinates or default location
- **AND** they can drag the pin to adjust the precise location
- **AND** the new `latitude` and `longitude` are saved with the store profile

#### Scenario: Store owner enters address

- **GIVEN** the store owner types an address in the "Endereço" field
- **WHEN** they finish typing (blur)
- **THEN** the map should attempt to center on the approximated location

## MODIFIED Requirements

None.

## DATA Model Changes

- **Establishment**:
  - `latitude`: Float? (Nullable)
  - `longitude`: Float? (Nullable)
