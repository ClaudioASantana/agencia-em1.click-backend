# Proposal: Create Catalog Tables (Locations & Segments)

## Goal

Create database tables for `Location` and `Segment` and populate them with the initial data shown on the frontend.

## Context

The `vitrine-frontend` currently displays hardcoded locations and segments (categories). We need to persist these in the backend (`bureau-backend`) to allow management and dynamic filtering.

## Solution

1.  Update `schema.prisma` to include `Location` and `Segment` models.
2.  Create a migration to apply changes to the SQL Server database.
3.  Create a seed script (or use Prisma seed) to insert the initial values:
    - **Locations**: Belo Horizonte, São Paulo, Rio de Janeiro, Curitiba.
    - **Segments**: Roteiro Gastronômico, Guia Automotivo, Saúde e Bem Estar, Moda e Beleza, Casa Construção e Decoração, Serviços e Negócios.

## Trade-offs

- We are using simple string names for now. Future expansion might need slugs or relations to a parent "City" or "State" for locations, but we start simple.
