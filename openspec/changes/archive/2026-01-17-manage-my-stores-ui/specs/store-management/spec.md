## ADDED Requirements

### Requirement: Store Management Dashboard

The system SHALL provide a dashboard for store owners to manage multiple establishments.

#### Scenario: Viewing the store list

- **WHEN** I navigate to the "Gerenciar Minhas Unidades" page
- **THEN** I should see a list of my registered stores
- **AND** I should see an "Adicionar Nova Loja" button
- **AND** I should see a filter bar to search by Name, Location, and Status

#### Scenario: Filtering stores

- **WHEN** I select "Inativo" in the Status filter
- **AND** click "Filtrar"
- **THEN** I should only see stores with the "Inativo" status

#### Scenario: Adding a new store

- **WHEN** I click "Adicionar Nova Loja" or the "Adicionar Unidade" card
- **THEN** I should be redirected to the Store Creation flow

#### Scenario: Viewing store details

- **WHEN** I click the "View" (Eye) icon
- **THEN** I should be redirected to the Store Profile/Dashboard for that unit

#### Scenario: Deleting a store

- **WHEN** I click the "Delete" (Trash) icon
- **THEN** I should be asked for confirmation
- **AND** upon confirmation, the store should be removed from the list
