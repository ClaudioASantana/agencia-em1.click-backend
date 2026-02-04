# Tasks

- [x] Backend: Update `AuthService.login` to strictly type the payload and ensure `role` is present. <!-- id: 1 -->
- [x] Backend: Verify `UsersService.create` correctly persists the `role`. <!-- id: 2 -->
- [x] Frontend: Refactor `router/index.ts` to strictly route based on `role` ('ADMIN' -> /admin, 'STORE_OWNER' -> /store) before falling back to legacy checks. <!-- id: 3 -->
- [x] Frontend: Ensure `StoreLayout` or `StoreProfileView` can handle a "Store Owner" with `null` establishment (e.g., prompt to create one). <!-- id: 4 -->
- [x] Backend: Check `prisma/schema.prisma` to ensure `role` default is working and migration is applied. <!-- id: 5 -->
