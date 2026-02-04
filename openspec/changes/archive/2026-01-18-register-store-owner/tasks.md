# Tasks

- [ ] Backend: Implement `POST /auth/register` <!-- id: 1 -->
  - Allow creating users with default role `STORE_OWNER`.
  - Ensure endpoint is public (no AuthGuard).
- [ ] Frontend: Create `RegisterModal.vue` <!-- id: 2 -->
  - Form: Name, Email, Password, Confirm Password.
  - Validation: Passwords must match.
- [ ] Frontend: Integrate Modal with Layout <!-- id: 3 -->
  - "Cadastrar Loja" button opens the modal.
  - Submit calls `POST /auth/register`.
