## ADDED Requirements

### Requirement: Manage Store Publications

Store owners SHALL be able to create and manage Publications. A Publication acts as a container for offers/promotions.

#### Scenario: Migration of Legacy Promotions

- **GIVEN** existing promotions in the database not linked to any publication
- **WHEN** the system updates with this feature
- **THEN** a "Standard Publication" is automatically created for each store
- **AND** all existing promotions are associated with this standard publication
- **AND** this publication is set as Default

#### Scenario: Single Default Publication

- **WHEN** a store owner toggles a publication as "Default"
- **THEN** it becomes the active default publication
- **AND** any other publication previously marked as default is unchecked/deactivated

#### Scenario: Displaying Publications

- **WHEN** the owner views the Publications list
- **THEN** they see columns for Name, Status (Active/Inactive), Validity, and Default Toggle
