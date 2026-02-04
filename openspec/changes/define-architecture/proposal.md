# Proposal: Define System Architecture

## Goal

Formalize the architecture for the "Vitrine" (Marketplace) and "Bureau" (Admin) ecosystems, adopting a Multi-tenant model to separate responsibilities.

## Solution

Adhere to the **Multi-tenant Marketplace** pattern defined in `design.md`.

1.  **Bureau Frontend**: Designated as the "back-office" for Lojistas.
    - Needs Authentication flow.
    - Needs "My Establishment" management.
2.  **Bureau Backend**: Acts as the central brain.
    - Needs to distinguish between Public (Vitrine) and Private (Bureau) requests.
    - Needs to enforce ownership (User X cannot edit Establishment Y's offers).

## Next Steps

This proposal serves as the blueprint. The immediate implementation tasks will be:

1.  Implement **Authentication** (JWT) in Backend.
2.  Implement **Login Screen** in Bureau Frontend.
    - _Note_: The user has another project `stitch_tela_de_login` referenced in history, might want to reuse ideas?
3.  Protect "Write" endpoints in Backend.
