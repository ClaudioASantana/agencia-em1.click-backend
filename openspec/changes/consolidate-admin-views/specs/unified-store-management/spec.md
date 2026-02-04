# Spec: Unified Store Management

## ADDED Requirements

### Requirement: List and Manage Owners

The system MUST allow Admins to view and manage store owners directly from the establishments list.

#### Scenario: View Establishment Owner

Given I am an Admin on the Establishment List
When I look at the "Responsável" column
Then I should see the name and status of the linked owner
And I should see a "Manage Owner" button
And if no owner is linked, I should see "Sem Responsável" and a "Add Owner" button

### Requirement: Create Owner for Orphan

The system MUST allow Admins to create and link a new owner to an orphan establishment.

#### Scenario: Create Owner for Orphan Store

Given I am an Admin viewing an Orphan Establishment
When I click "Add Owner"
Then a modal opens asking for Name, Email, and Password
When I submit the form
Then a new User is created and linked to this Establishment
And the list updates to show the new Owner

### Requirement: Unlink Owner

The system MUST allow Admins to unlink an existing owner from an establishment.

#### Scenario: Unlink Owner

Given I am an Admin viewing a linked Establishment
When I click "Manage Owner"
And I click "Unlink User"
Then the user is dissociated from the establishment
And the establishment becomes an Orphan
And the User remains in the system (but unlinked)

## REMOVED Requirements

### Requirement: Remove Lojistas Menu

The system MUST remove the "Lojistas" menu item as it is redundant.

#### Scenario: Remove Lojistas Menu

Given I am an Admin
Then I should NOT see the "Lojistas" menu item
And I should access all owner management via "Lojas"
