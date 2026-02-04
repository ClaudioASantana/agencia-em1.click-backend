# Change: Manage Store Owners

## Why

To enable a multi-tenant SaaS model, the system requires a hierarchy where a "SaaS Admin" can create and manage "Store Owners" (Tenants). Store Owners, in turn, manage their specific establishments. Currently, there is an Admin user, but the workflow for creating Store Owners and linking them to establishments is not fully defined or exposed in the UI.

## What Changes

- **Backend**:
  - Enforce role separation: Users with `establishmentId: null` are SaaS Admins; Users with `establishmentId: <id>` are Store Owners.
  - Expose/Secure `GET /users` and `POST /users` to allow SaaS Admins to manage all users.
  - Validations to ensure Store Owners must be linked to an Establishment.
- **Frontend**:
  - Implement "Store Owner" management in the Admin Dashboard.
  - Add a User Creation flow that includes associating a user with an existing Establishment.

## Impact

- **Specs**: `auth`, `user-management`
- **Code**: `UsersController`, `UsersService`, `AuthGuard`, Frontend `UserListView` and `UserCreateView`.
