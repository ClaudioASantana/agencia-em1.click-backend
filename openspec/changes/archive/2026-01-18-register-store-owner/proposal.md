# Register Store Owner

## Goal

Allow new store owners to clear their own accounts directly from the consumer frontend ("vitrine-frontend").

## Context

Currently, user creation is restricted to authenticated admins via the `POST /users` endpoint. The user wants a public registration flow triggered by the "Cadastrar Loja" button in the Vitrine app.

## Strategy

1.  **Backend**: Expose a public registration endpoint.
    - Best location: `AuthController` (`POST /auth/register`).
    - Logic: Reuse `UsersService.create()`.
2.  **Frontend (Vitrine)**:
    - Create `RegisterModal.vue` (Name, Email, Password, Confirm Password).
    - Connect "Cadastrar Loja" button to open this modal.
    - On success, notify user and close modal (or redirect to login).
