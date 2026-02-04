# Store UI Spec

## ADDED Requirements

### Requirement: Layout Requirements

The frontend MUST provide a dedicated layout for Store Owners.

#### Scenario: Store Owner logs in

- **Given** a user with role `Store Owner`.
- **When** they access the system.
- **Then** they see the `StoreLayout` with a sidebar specific to their needs.
- **And** the sidebar contains: "Dados da Loja", "Gerenciar Encartes", "Promoções", "Relatórios".

## ADDED Requirements

### Requirement: Profile View Requirements

The frontend MUST provide a view for Store Owners to manage their profile.

#### Scenario: Viewing Profile

- **Given** the user is on `/store/profile` (or equivalent).
- **Then** they see their establishment name, description, and stats.
- **And** they see a form pre-filled with their current data.

#### Scenario: Updating Profile

- **Given** the user makes changes to the form (e.g., changes description).
- **When** they click "Salvar Alterações".
- **Then** the changes are sent to the backend.
- **And** a success notification is shown.
