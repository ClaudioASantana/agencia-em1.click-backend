## 1. Backend Implementation

- [x] 1.1 Verify `UsersController` has `POST /` and `GET /` endpoints protected by `JwtAuthGuard`.
- [x] 1.2 Update `UsersService.create` to handle `establishmentId` linkage.
- [x] 1.3 Ensure `JwtStrategy` or `AuthService` correctly populates `user.establishmentId` in the token/request context to distinguish Admins (null) from Owners (not null).

## 2. Frontend Implementation

- [x] 2.1 Update `UserCreateView` (or Modal) to fetch and list available Establishments.
- [x] 2.2 Allow Admin to select an Establishment when creating a new user.
- [x] 2.3 Verify `UserListView` displays which Establishment a user belongs to.

## 3. Verification

- [x] 3.1 Test creating a Store Owner via the Admin Dashboard.
- [x] 3.2 Login as the new Store Owner and verify they are redirected to their dashboard.
- [x] 3.3 Verify Store Owner cannot access Admin-only routes (if strict RBAC is enforced, though UI hiding is a first step).
