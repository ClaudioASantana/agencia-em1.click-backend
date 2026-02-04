# Proposal: Create Publication Page

## Goal

Implement a dedicated page for creating and editing publications ("Nova Publicação"), adhering strictly to the provided design visual. This page will be the entry point for store owners to configure campaigns, linking offers, setting priorities, and viewing a summary of the campaign's reach.

## Why

The current publication creation flow does not match the desired high-fidelity design. Store owners need a more intuitive, consolidated interface to manage campaign details and offers in one place to improve efficiency and reduce errors.

## Context

Store owners need a centralized interface to manage their marketing campaigns (Publications). Currently, the functionality might be disparate or not fully aligned with the new high-fidelity design which includes specific sections for General Info, Offer Selection (with search and visual grid), Default status toggle, and a Summary side-panel.

## Capabilities

- **Manage Publication UI**: The core visual layout and form handling interactions.
  - Input basic details (Title, Date Range, Priority).
  - Select multiple offers from a modal/list.
  - interactive "Add Offer" dashed area.
  - Side panel with "Default" toggle and "Summary" statistics.
  - Quick actions menu.

## Design

The design follows a 2-column layout (on large screens):

- **Left Column (Main)**:
  - "Informações Gerais" Card.
  - "Destaques e Promoções Selecionadas" Section (Search bar, List of offers with images/prices, Add button).
- **Right Column (Sidebar)**:
  - "Publicação Padrão" Toggle Card.
  - "Sumário da Campanha" Card.
  - "Ações Rápidas" List.

## Technical Approach

- Utilize Vue.js with the existing UI component library (Shadcn/Tailwind).
- Reuse existing `OfferPickerModal` if available or create one.
- Ensure responsive design for mobile compatibility.
