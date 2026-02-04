# manage-publication-ui Specification

## Purpose
TBD - created by archiving change create-publication-page. Update Purpose after archive.
## Requirements
### Requirement: Publication Page Layout

The "Nova Publicação" page MUST match the design layout, providing a structured interface for campaign creation.

#### Scenario: View New Publication Layout

- Given the store owner navigates to create or edit a publication
- Then the page header displays "Configuração de Publicação e Ofertas"
- And the layout is divided into a main column (General Info, Offers) and a sidebar (Default Toggle, Summary, Actions).

### Requirement: General Information Configuration

Store owners MUST be able to configure the core attributes of a campaign such as name, duration, and priority.

#### Scenario: Configure General Info

- Given the "Informações Gerais" card
- When the user interacts with the form
- Then they can input "Nome da Publicação" (Text)
- And select a "Período de Atividade" (Start and End Date/Time)
- And select a "Prioridade" from a dropdown (Baixa, Média, Alta).

### Requirement: Offer Management

Store owners MUST be able to visually select and manage the offers included in the publication.

#### Scenario: Manage Selected Offers

- Given the "Destaques e Promoções Selecionadas" section
- It displays a search bar "Buscar promoções ou lojas..."
- And it lists currently selected offers with their Image, Title, Price, and Active status
- And it provides a "Remove" (Trash icon) button for each offer
- And it shows a large dashed area "Clique para adicionar mais promoções" to open the offer picker.

### Requirement: Sidebar Controls

The sidebar MUST provide high-level controls for campaign visibility and a summary of its impact.

#### Scenario: Toggle Default Publication

- Given the "Publicação Padrão" card in the sidebar
- When the user toggles the switch
- Then the publication marks itself as the default visible campaign when no others are active.

#### Scenario: View Campaign Summary

- Given the "Sumário da Campanha" card
- It displays "Total de Ofertas" referencing the count of selected offers
- It displays "Lojistas Envolvidos" (static/dynamic)
- It displays "Alcance Estimado" with a status (e.g., "Alta Visibilidade").

