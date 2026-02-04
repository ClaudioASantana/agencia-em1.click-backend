# Store Profile UX Enhancement - Specification

## Overview

This specification defines UX/UI improvements to the store profile management interface, focusing on validation, user feedback, and modern interaction patterns.

---

## ADDED Requirements

### Requirement: Form Validation

The store profile form must validate required fields and prevent invalid data submission.

#### Scenario: Required Field Validation

**Given** a store owner is editing their profile  
**When** they attempt to save with an empty store name  
**Then** the form should display an error message "Nome da loja é obrigatório"  
**And** the name field should show a red border  
**And** the save request should not be sent to the backend

#### Scenario: Description Length Validation

**Given** a store owner is typing in the description field  
**When** they exceed 500 characters  
**Then** additional characters should not be accepted  
**And** the character counter should display in red

#### Scenario: Segment Selection Required

**Given** a store owner is creating/editing their profile  
**When** they attempt to save without selecting a segment  
**Then** the form should display an error "Selecione um segmento"  
**And** the segment dropdown should be highlighted

---

### Requirement: Dynamic Character Counter

The description field must display a live character count to provide real-time feedback.

#### Scenario: Character Count Display

**Given** a store owner is in the profile page  
**When** they view the description field  
**Then** a counter showing "0 / 500" should be visible

#### Scenario: Counter Updates on Typing

**Given** a store owner has typed 120 characters in the description  
**When** they type one more character  
**Then** the counter should update to "121 / 500"

#### Scenario: Counter Color Coding

**Given** a store owner is typing in the description  
**When** character count is below 400  
**Then** counter text should be gray  
**When** character count is 400-475 (80%-95%)  
**Then** counter text should be yellow  
**When** character count is 476+ (95%+)  
**Then** counter text should be red

---

### Requirement: Time Picker Components

Business hours must use structured time pickers instead of free-text input.

#### Scenario: Selecting Opening Hours

**Given** a store owner is setting hours for Monday  
**When** they click on the opening time field  
**Then** a time picker should appear with hour and minute selectors  
**And** times should be in 24-hour format (HH:mm)

#### Scenario: Time Format Validation

**Given** a store owner has selected a time via the picker  
**When** the time is saved to the form  
**Then** it should be formatted as "HH:mm" (e.g., "09:30")  
**And** invalid formats should not be possible

#### Scenario: Time Range Validation

**Given** a store owner sets closing time before opening time  
**When** they attempt to save  
**Then** an error should display "Horário de fechamento deve ser após abertura"

---

### Requirement: Individual Day Hour Configuration

Store owners must be able to set different hours for each day of the week.

#### Scenario: Setting Different Hours Per Day

**Given** a store owner is configuring hours  
**When** they set Monday as "09:00 - 18:00"  
**And** they set Tuesday as "10:00 - 20:00"  
**Then** both days should save with their respective hours independently

#### Scenario: Marking Day as Closed

**Given** a store owner is configuring hours  
**When** they select "Fechado" (Closed) for Sunday  
**Then** time pickers for Sunday should be disabled  
**And** backend should receive empty/null hours for Sunday

#### Scenario: Copy Hours to Multiple Days

**Given** a store owner has set hours for Monday  
**When** they click "Copiar para todos os dias úteis"  
**Then** Tuesday through Friday should adopt Monday's hours  
**And** Saturday and Sunday should remain unchanged

---

### Requirement: Unsaved Changes Detection

The interface must track form changes and provide appropriate feedback.

#### Scenario: Sticky Save Button Appears

**Given** a store owner loads their profile  
**When** they edit any field  
**Then** a save button should appear in a sticky header
**And** the button should remain visible as they scroll

#### Scenario: Navigation Warning on Unsaved Changes

**Given** a store owner has made changes to their profile  
**And** they have not saved  
**When** they attempt to navigate to another page  
**Then** a confirmation dialog should appear  
**With** message "Você tem alterações não salvas. Deseja sair sem salvar?"

#### Scenario: Save Button Hidden When No Changes

**Given** a store owner has just loaded their profile  
**And** no fields have been modified  
**Then** the sticky save button should not be visible  
**And** only the regular action buttons should show

---

### Requirement: Visual Field State Indicators

Form fields must provide clear visual feedback about their validation state.

#### Scenario: Valid Field Indication

**Given** a field has valid data  
**When** user focuses away from the field  
**Then** a green checkmark icon should appear  
**And** the field border should briefly flash green

#### Scenario: Invalid Field Indication

**Given** a required field is empty  
**When** user attempts to save or focuses away  
**Then** the field should show a red border  
**And** an error icon should appear  
**And** an error message should display below the field

#### Scenario: Neutral Field State

**Given** a field has not been interacted with  
**When** the page first loads  
**Then** no validation indicators should be shown  
**And** field should have default styling

---

## MODIFIED Requirements

_None - this is a new enhancement_

---

## REMOVED Requirements

_None - existing functionality preserved_
