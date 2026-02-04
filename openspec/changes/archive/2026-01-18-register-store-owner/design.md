# Design: Registration Implemetation

## Backend Endpoint

Expose `POST /auth/register` which accepts:

```json
{
  "name": "Foo Bar",
  "email": "foo@bar.com",
  "password": "strongpassword"
}
```

Internally helps `UsersService.create`.

## Frontend Modal

- **Title**: "Cadastrar Nova Loja" (or "Criar Conta de Parceiro").
- **Style**: Match existing Vitrine modals (Rounded, clean).
- **Feedback**:
  - Success: "Conta criada com sucesso! Faça login para continuar."
  - Error: Display API error message.
