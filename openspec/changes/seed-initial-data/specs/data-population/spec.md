# Spec: Data Population

## ADDED Requirements

### Requirement: Initial Data Seeding

The system SHALL be seeded with standard locations and segments as defined in the proposal.

#### Scenario: Database Seeding

- **Given** the database is empty or has schema only
- **When** the `seed_initial_data` migration is applied
- **Then** the `localidades` table should contain: "Itaguaí", "Seropédica", "Palmas", "UFRRJ"
- **And** the `segmentos` table should contain: "Roteiro Gastronômico", "Guia Automotivo", "Saúde e Bem Estar", "Moda e Beleza", "Casa Construção e Decoração", "Serviços e Negócios"
