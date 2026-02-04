# store-management

## ADDED Requirements

### View Store Dashboard

The user must be able to view a dashboard with statistics and details for a specific store they own.

#### Scenario: Navigating to Store Dashboard

- **GIVEN** I am on the "Manage My Stores" list
- **WHEN** I click the "View" (Eye) icon on a store card
- **THEN** I should be navigated to the Dashboard view for that specific store
- **AND** I should see statistics (visits, engagement) relevant to that store

### Edit Store Details

The user must be able to edit the details of an existing store.

#### Scenario: Opening Edit Modal

- **GIVEN** I am on the "Manage My Stores" list
- **WHEN** I click the "Edit" (Pencil) icon on a store card
- **THEN** a modal should open pre-filled with the store's current information
- **AND** I should be able to save changes
